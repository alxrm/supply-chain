use router::Router;
use iron::prelude::*;
use iron::middleware::Handler;
use hyper::header::AccessControlAllowOrigin;
use bodyparser;

use exonum::api::{Api, ApiError};
use exonum::node::TransactionSend;
use exonum::crypto::{HexValue, PublicKey};
use exonum::storage::ProofListIndex;
use exonum::blockchain::Schema;
use exonum::encoding::serialize::json::reexport as serde_json;

use self::serde_json::to_value;
use super::api::{SupplyChainApi, TxResponse};
use super::transactions::BaseTransaction;


#[derive(Clone)]
pub struct ApiHandler<T: TransactionSend + Clone> {
    pub api: SupplyChainApi<T>,
}

impl<T> ApiHandler<T> where T: 'static + TransactionSend + Clone {
    pub fn new(api: SupplyChainApi<T>) -> Self {
        ApiHandler {
            api
        }
    }

    pub fn handle_owner(&self, req: &mut Request) -> IronResult<Response> {
        let path = req.url.path();
        let owner_key = path.last().unwrap();
        let public_key = PublicKey::from_hex(owner_key).map_err(ApiError::FromHex)?;
        let api = &self.api;
        let origin = match api.owner(&public_key) {
            Ok(own) => api.ok_response(&to_value(own).unwrap()),
            Err(e) => {
                error!("Error in handle_owner: {}", e);
                api.not_found_response(&to_value("Owner not found").unwrap())
            }
        };

        let mut res = origin.unwrap();
        res.headers.set(AccessControlAllowOrigin::Any);

        Ok(res)
    }

    pub fn handle_product(&self, req: &mut Request) -> IronResult<Response> {
        let path = req.url.path();
        let product_uid = path.last().unwrap().to_string();
        let api = &self.api;
        let origin = match api.product(&product_uid) {
            Ok(product) => api.ok_response(&to_value(product).unwrap()),
            Err(e) => {
                error!("Error in handle_product: {}", e);
                api.not_found_response(&to_value("Product not found").unwrap())
            }
        };

        let mut res = origin.unwrap();
        res.headers.set(AccessControlAllowOrigin::Any);

        Ok(res)
    }

    pub fn handle_group(&self, req: &mut Request) -> IronResult<Response> {
        let path = req.url.path();
        let group_id = path.last().unwrap().to_string();
        let api = &self.api;
        let origin = match api.group(&group_id) {
            Ok(products) => api.ok_response(&to_value(products).unwrap()),
            Err(_) => {
                api.not_found_response(&to_value("Group not found").unwrap())
            }
        };

        let mut res = origin.unwrap();
        res.headers.set(AccessControlAllowOrigin::Any);

        Ok(res)
    }

    pub fn handle_products_by_owner(&self, req: &mut Request) -> IronResult<Response> {
        let owner_key = req.extensions.get::<Router>().unwrap().find("pubKey");
        let api = &self.api;
        let public_key = match owner_key {
            Some(key) => PublicKey::from_hex(key).map_err(ApiError::FromHex)?,
            None => {
                return Err(ApiError::IncorrectRequest(
                    "Incorrect request: no public key provided".into()
                ))?;
            }
        };

        let origin = match api.products_by_owner(&public_key) {
            Ok(products) => api.ok_response(&to_value(products).unwrap()),
            Err(e) => {
                error!("Error in handle_products_by_owner: {}", e);
                api.not_found_response(&to_value("Owner not found").unwrap())
            }
        };

        let mut res = origin.unwrap();
        res.headers.set(AccessControlAllowOrigin::Any);

        Ok(res)
    }

    pub fn handle_post_transaction(&self, req: &mut Request) -> IronResult<Response> {
        let api = &self.api;
        let origin = match req.get::<bodyparser::Struct<BaseTransaction>>() {
            Ok(Some(transaction)) => {
                let tx_hash = api.post_transaction(transaction)?;
                let json = TxResponse { tx_hash };
                api.ok_response(&to_value(&json).unwrap())
            }
            Ok(None) => Err(ApiError::IncorrectRequest("Empty request body".into()))?,
            Err(e) => Err(ApiError::IncorrectRequest(Box::new(e)))?,
        };

        let mut res = origin.unwrap();
        res.headers.set(AccessControlAllowOrigin::Any);

        Ok(res)
    }
}