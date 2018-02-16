use api::SupplyChainApi;
use controller::BaseController;
use exonum::api::{Api, ApiError};
use exonum::crypto::{HexValue, PublicKey};
use exonum::encoding::serialize::json::reexport as serde_json;
use exonum::node::TransactionSend;
use hyper::header::AccessControlAllowOrigin;
use iron::middleware::Handler;
use iron::prelude::*;
use product::Product;
use router::Router;
use self::serde_json::to_value;
use std::collections::HashMap;


pub struct ProductsByOwnerHandler<T, C>
    where T: TransactionSend + Clone,
          C: BaseController<PublicKey, HashMap<String, Product>, ApiError> {
    pub api: SupplyChainApi<T>,
    pub controller: C,
}

impl<T, C> ProductsByOwnerHandler<T, C>
    where T: 'static + TransactionSend + Clone,
          C: 'static + BaseController<PublicKey, HashMap<String, Product>, ApiError> {
    pub fn new(api: SupplyChainApi<T>, controller: C) -> Self {
        ProductsByOwnerHandler {
            api,
            controller,
        }
    }
}

impl<T, C> Handler for ProductsByOwnerHandler<T, C>
    where T: 'static + TransactionSend + Clone,
          C: 'static + BaseController<PublicKey, HashMap<String, Product>, ApiError> {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
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

        let origin = match self.controller.process(Box::new(public_key)) {
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
}