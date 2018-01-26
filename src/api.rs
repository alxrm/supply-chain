use serde::Serialize;
use router::Router;
use iron::prelude::*;
use iron::middleware::Handler;
use std::collections::HashMap;

use exonum::api::{Api, ApiError};
use exonum::node::TransactionSend;
use exonum::messages::Message;
use exonum::crypto::{PublicKey, Hash};
use exonum::storage::{Fork, Snapshot, MapIndex, ListProof, ProofListIndex};
use exonum::blockchain::{self, Blockchain, BlockProof, Schema};
use exonum::helpers::Height;

use super::transactions::BaseTransaction;
use super::owner::Owner;
use super::product::Product;
use super::schema::SupplyChainSchema;
use super::tx_metarecord::TxMetaRecord;
use super::api_handler::ApiHandler;
use super::controller::{Controller, ApiHolder};

#[derive(Clone)]
pub struct SupplyChainApi<T: TransactionSend + Clone> {
    /// Exonum blockchain.
    pub blockchain: Blockchain,
    /// Channel for transactions.
    pub channel: T,
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
pub struct TxResponse {
    pub tx_hash: Hash,
}

struct ProductController;

impl Controller<String, AuditedEntityInfo<Product>, ApiError> for ProductController {
    fn process(&self, params: &String) -> Result<AuditedEntityInfo<Product>, ApiError> {
        unimplemented!()
    }
}

impl<T> SupplyChainApi<T> where T: TransactionSend + Clone {
    pub fn owner(&self, pub_key: &PublicKey) -> Result<AuditedEntityInfo<Owner>, ApiError> {
        println!("/owners/{}", pub_key.to_string());

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
            history: owner_history,
        };

        Ok(res)
    }

    pub fn product(&self, product_uid: &String) -> Result<AuditedEntityInfo<Product>, ApiError> {
        println!("/products/{}", product_uid);

        let view = self.blockchain.snapshot();
        let general_schema = blockchain::Schema::new(&view);

        let mut view = self.blockchain.fork();
        let mut schema = SupplyChainSchema::new(&mut view);

        let max_height = Height(general_schema.block_hashes_by_height().len()).previous();
        let block_proof = general_schema.block_and_precommits(max_height).unwrap();

        let product = match schema.product(product_uid) {
            Some(it) => it,
            None => {
                return Err(ApiError::NotFound);
            }
        };

        let history_raw = schema.product_history(product_uid);
        let product_history = self.collect_history(history_raw, &general_schema);

        let res = AuditedEntityInfo {
            block_info: block_proof,
            data: product,
            history: product_history,
        };

        Ok(res)
    }

    pub fn group(&self, group_id: &String) -> Result<HashMap<String, Product>, ApiError> {
        println!("/groups/{}", group_id);

        let mut view = self.blockchain.fork();
        let mut schema = SupplyChainSchema::new(&mut view);
        let group_products: MapIndex<&mut Fork, String, Product> = schema.group_mut(group_id);
        let mut res = HashMap::with_capacity(group_products.values().count());

        group_products.iter().for_each(|pair| {
            res.insert(pair.0, pair.1);
        });

        Ok(res)
    }

    pub fn products_by_owner(&self, pub_key: &PublicKey) -> Result<HashMap<String, Product>, ApiError> {
        println!("/owner/{}/products", pub_key.to_string());

        let mut view = self.blockchain.fork();
        let mut schema = SupplyChainSchema::new(&mut view);
        let all_products: MapIndex<&mut Fork, String, Product> = schema.products_mut();
        let mut res = HashMap::with_capacity(all_products.values().count());

        all_products.iter()
            .filter(|pair| {
                let product = &pair.1;

                product.owner_key() == pub_key
            })
            .for_each(|pair| {
                res.insert(pair.0, pair.1);
            });

        Ok(res)
    }

    pub fn post_transaction(&self, tx: BaseTransaction) -> Result<Hash, ApiError> {
        println!("/transaction");

        let tx_hash = tx.hash();
        match self.channel.send(Box::new(tx)) {
            Ok(_) => Ok(tx_hash),
            Err(e) => Err(ApiError::from(e)),
        }
    }

    fn collect_history(
        &self,
        history: ProofListIndex<&mut Fork, TxMetaRecord>,
        general_schema: &Schema<&Box<Snapshot>>,
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

impl<T> Api for SupplyChainApi<T> where T: 'static + TransactionSend + Clone {
    fn wire(&self, router: &mut Router) {
        let self_ = self.clone();
        let handler = ApiHandler::new(self_);

        let handler_clone = handler.clone();
        let transaction_route = move |req: &mut Request| handler_clone.handle_post_transaction(req);

        let handler_clone = handler.clone();
        let product_route = move |req: &mut Request| handler_clone.handle_product(req);

        let handler_clone = handler.clone();
        let products_by_owner_route = move |req: &mut Request| handler_clone.handle_products_by_owner(req);

        let handler_clone = handler.clone();
        let group_route = move |req: &mut Request| handler_clone.handle_group(req);

        let handler_clone = handler.clone();
        let owner_route = move |req: &mut Request| handler_clone.handle_owner(req);

        let hc = handler.clone();

        router.post(&"/v1/transaction", transaction_route, "transaction");
        router.get(&"/v1/products/:uid", product_route, "product");
        router.get(&"/v1/groups/:groupId", group_route, "group");
        router.get(&"/v1/owners/:pubKey/products", products_by_owner_route, "products_by_owner");
        router.get(&"/v1/owners/:pubKey", owner_route, "owner");
        router.get(&"/v1/test", hc, "test");

        println!("Wired API methods");
    }
}