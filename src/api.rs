use serde::Serialize;
use router::Router;
use iron::prelude::*;
use bodyparser;

use std::collections::HashMap;

use exonum::api::{Api, ApiError};
use exonum::node::TransactionSend;
use exonum::messages::Message;
use exonum::crypto::{HexValue, PublicKey, Hash};
use exonum::storage::{Fork, Snapshot, MapIndex, ListProof, ProofListIndex};
use exonum::blockchain::{self, Blockchain, BlockProof, Schema};
use exonum::encoding::serialize::json::reexport as serde_json;
use exonum::helpers::Height;

use self::serde_json::to_value;

use super::transactions::BaseTransaction;
use super::owner::Owner;
use super::item::Item;
use super::schema::SupplyChainSchema;
use super::tx_metarecord::TxMetaRecord;

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

#[derive(Debug, Serialize)]
pub struct ListProofTemplate<V: Serialize> {
    proof: ListProof<TxMetaRecord>,
    values: Vec<V>,
}

#[derive(Debug, Serialize)]
pub struct AuditedEntityInfo<V: Serialize> {
    block_info: BlockProof,
    data: V,
    history: ListProofTemplate<BaseTransaction>,
}

#[derive(Serialize, Deserialize)]
struct TxResponse {
    tx_hash: Hash,
}

impl<T> SupplyChainApi<T> where T: TransactionSend + Clone {
    fn owner(&self, pub_key: &PublicKey) -> Result<AuditedEntityInfo<Owner>, ApiError> {
        let view = self.blockchain.snapshot();
        let general_schema = blockchain::Schema::new(&view);

        let mut view = self.blockchain.fork();
        let mut schema = SupplyChainSchema::new(&mut view);

        let max_height = Height(general_schema.block_hashes_by_height().len()).previous();
        let block_proof = general_schema.block_and_precommits(max_height).unwrap();

        let owner = match schema.owner(pub_key) {
            Some(own) => own,
            None => {
                return Err(ApiError::NotFound);
            }
        };

        let history_raw = schema.owner_history(pub_key);
        let owner_history = self.collect_history(history_raw, &general_schema);

        let res = AuditedEntityInfo {
            block_info: block_proof,
            data: owner,
            history: owner_history
        };

        Ok(res)
    }

    fn item(&self, item_uid: &String) -> Result<AuditedEntityInfo<Item>, ApiError> {
        let view = self.blockchain.snapshot();
        let general_schema = blockchain::Schema::new(&view);

        let mut view = self.blockchain.fork();
        let mut schema = SupplyChainSchema::new(&mut view);

        let max_height = Height(general_schema.block_hashes_by_height().len()).previous();
        let block_proof = general_schema.block_and_precommits(max_height).unwrap();

        let item = match schema.item(item_uid) {
            Some(it) => it,
            None => {
                return Err(ApiError::NotFound);
            }
        };

        let history_raw = schema.item_history(item_uid);
        let item_history = self.collect_history(history_raw, &general_schema);

        let res = AuditedEntityInfo {
            block_info: block_proof,
            data: item,
            history: item_history
        };

        Ok(res)
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

    fn items_by_owner(&self, pub_key: &PublicKey) -> Result<HashMap<String, Item>, ApiError> {
        let mut view = self.blockchain.fork();
        let mut schema = SupplyChainSchema::new(&mut view);
        let all_items: MapIndex<&mut Fork, String, Item> = schema.items_mut();
        let mut res = HashMap::with_capacity(all_items.values().count());

        all_items.iter()
            .filter(|pair| {
                let item = &pair.1;

                item.owner_key() == pub_key
            })
            .for_each(|pair| {
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

    fn collect_history(
        &self,
        history: ProofListIndex<&mut Fork, TxMetaRecord>,
        general_schema: &Schema<&Box<Snapshot>>
    ) -> ListProofTemplate<BaseTransaction> {
        let history_len = history.len();
        let tx_records: Vec<TxMetaRecord> = history.into_iter().collect();
        let transactions_table = general_schema.transactions();

        let mut txs: Vec<BaseTransaction> = Vec::with_capacity(tx_records.len());

        for record in tx_records {
            let raw_message = transactions_table.get(record.tx_hash()).unwrap();
            txs.push(BaseTransaction::from(raw_message));
        }

        let to_transaction_hashes: ListProof<TxMetaRecord> =
            history.get_range_proof(0, history_len);

        let path_to_transactions = ListProofTemplate {
            proof: to_transaction_hashes,
            values: txs,
        };

        path_to_transactions
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
            Err(e) => {
                error!("Error in handle_owner: {}", e);
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

    fn handle_items_by_owner(&self, req: &mut Request) -> IronResult<Response> {
        let owner_key = req.extensions.get::<Router>().unwrap().find("pubKey");
        let api = &self.api;
        let public_key = match owner_key {
            Some(key) => PublicKey::from_hex(key).map_err(ApiError::FromHex)?,
            None => {
                return Err(ApiError::IncorrectRequest(
                    "Incorrect request: no public key provided".into()
                ))?
            }
        };

        match api.items_by_owner(&public_key) {
            Ok(items) => api.ok_response(&to_value(items).unwrap()),
            Err(e) => {
                error!("Error in handle_items_by_owner: {}", e);
                api.not_found_response(&to_value("Owner not found").unwrap())
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
        let items_by_owner_route = move |req: &mut Request| handler_clone.handle_items_by_owner(req);

        let handler_clone = handler.clone();
        let group_route = move |req: &mut Request| handler_clone.handle_group(req);

        let handler_clone = handler.clone();
        let owner_route = move |req: &mut Request| handler_clone.handle_owner(req);

        router.post(&"/v1/transaction", transaction_route, "transaction");
        router.get(&"/v1/items/:uid", item_route, "item");
        router.get(&"/v1/groups/:groupId", group_route, "group");
        router.get(&"/v1/owners/:pubKey/items", items_by_owner_route, "items_by_owner");
        router.get(&"/v1/owners/:pubKey", owner_route, "owner");

        println!("Wired API methods");
    }
}