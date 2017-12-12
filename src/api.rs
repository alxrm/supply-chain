use router::Router;
use iron::prelude::*;
use bodyparser;

use std::collections::HashMap;

use exonum::api::{Api, ApiError};
use exonum::node::TransactionSend;
use exonum::messages::Message;
use exonum::crypto::{HexValue, PublicKey, Hash};
use exonum::storage::{Fork, MapIndex};
use exonum::blockchain::Blockchain;
use exonum::encoding::serialize::json::reexport as serde_json;

use self::serde_json::to_value;

use super::transactions::BaseTransaction;
use super::owner::Owner;
use super::item::Item;
use super::schema::SupplyChainSchema;

#[derive(Clone)]
pub struct SupplyChainApi<T: TransactionSend + Clone> {
    /// Exonum blockchain.
    pub blockchain: Blockchain,
    /// Channel for transactions.
    pub channel: T,
}

#[derive(Clone)]
struct ApiHandler<T: TransactionSend + Clone> {
    pub api: SupplyChainApi<T>,
}

#[derive(Serialize, Deserialize)]
struct TxResponse {
    tx_hash: Hash,
}

impl<T> SupplyChainApi<T> where T: TransactionSend + Clone {
    fn owner(&self, pub_key: &PublicKey) -> Result<Owner, ApiError> {
        let mut view = self.blockchain.fork();
        let mut schema = SupplyChainSchema::new(&mut view);

        match schema.owner(pub_key) {
            Some(own) => Ok(own),
            None => Err(ApiError::NotFound)
        }
    }

    fn item(&self, item_uid: &String) -> Result<Item, ApiError> {
        let mut view = self.blockchain.fork();
        let mut schema = SupplyChainSchema::new(&mut view);

        match schema.item(item_uid) {
            Some(it) => Ok(it),
            None => Err(ApiError::NotFound)
        }
    }

    fn group(&self, group_id: &String) -> Result<HashMap<String, Item>, ApiError> {
        let mut view = self.blockchain.fork();
        let mut schema = SupplyChainSchema::new(&mut view);
        let group_items: MapIndex<&mut Fork, String, Item> = schema.group_mut(group_id);
        let mut res = HashMap::with_capacity(group_items.values().count());

        group_items.iter().for_each(|pair| {
            res.insert(pair.0, pair.1);
        });

        Ok(res)
    }

    fn post_transaction(&self, tx: BaseTransaction) -> Result<Hash, ApiError> {
        let tx_hash = tx.hash();
        match self.channel.send(Box::new(tx)) {
            Ok(_) => Ok(tx_hash),
            Err(e) => Err(ApiError::from(e)),
        }
    }
}

impl<T> ApiHandler<T> where T: 'static + TransactionSend + Clone {
    fn new(api: SupplyChainApi<T>) -> Self {
        ApiHandler {
            api
        }
    }

    fn handle_owner(&self, req: &mut Request) -> IronResult<Response> {
        let path = req.url.path();
        let owner_key = path.last().unwrap();
        let public_key = PublicKey::from_hex(owner_key).map_err(ApiError::FromHex)?;
        let api = &self.api;

        match api.owner(&public_key) {
            Ok(own) => api.ok_response(&to_value(own).unwrap()),
            Err(_) => {
                api.not_found_response(&to_value("Owner not found").unwrap())
            }
        }
    }

    fn handle_item(&self, req: &mut Request) -> IronResult<Response> {
        let path = req.url.path();
        let item_uid = path.last().unwrap().to_string();
        let api = &self.api;

        match api.item(&item_uid) {
            Ok(item) => api.ok_response(&to_value(item).unwrap()),
            Err(e) => {
                error!("Error in handle_item: {}", e);
                api.not_found_response(&to_value("Item not found").unwrap())
            }
        }
    }

    fn handle_group(&self, req: &mut Request) -> IronResult<Response> {
        let path = req.url.path();
        let group_id = path.last().unwrap().to_string();
        let api = &self.api;

        match api.group(&group_id) {
            Ok(items) => api.ok_response(&to_value(items).unwrap()),
            Err(_) => {
                api.not_found_response(&to_value("Group not found").unwrap())
            }
        }
    }

    fn handle_post_transaction(&self, req: &mut Request) -> IronResult<Response> {
        let api = &self.api;

        match req.get::<bodyparser::Struct<BaseTransaction>>() {
            Ok(Some(transaction)) => {
                let tx_hash = api.post_transaction(transaction)?;
                let json = TxResponse { tx_hash };
                api.ok_response(&to_value(&json).unwrap())
            }
            Ok(None) => Err(ApiError::IncorrectRequest("Empty request body".into()))?,
            Err(e) => Err(ApiError::IncorrectRequest(Box::new(e)))?,
        }
    }
}

impl<T> Api for SupplyChainApi<T> where T: 'static + TransactionSend + Clone {
    fn wire(&self, router: &mut Router) {
        let self_ = self.clone();
        let handler = ApiHandler::new(self_);

        let handler_clone = handler.clone();
        let transaction_route = move |req: &mut Request| handler_clone.handle_post_transaction(req);

        let handler_clone = handler.clone();
        let item_route = move |req: &mut Request| handler_clone.handle_item(req);

        let handler_clone = handler.clone();
        let group_route = move |req: &mut Request| handler_clone.handle_group(req);

        let handler_clone = handler.clone();
        let owner_route = move |req: &mut Request| handler_clone.handle_owner(req);

        router.post(&"/v1/transaction", transaction_route, "transaction");
        router.get(&"/v1/item/:uid", item_route, "item");
        router.get(&"/v1/group/:groupId", group_route, "group");
        router.get(&"/v1/owner/:pubKey", owner_route, "owner");

        info!("Wired API methods");
    }
}