use api::SupplyChainApi;
use controller::BaseController;
use exonum::api::{Api, ApiError};
use exonum::encoding::serialize::json::reexport as serde_json;
use exonum::node::TransactionSend;
use hyper::header::AccessControlAllowOrigin;
use iron::middleware::Handler;
use iron::prelude::*;
use product::Product;
use self::serde_json::to_value;
use std::collections::HashMap;


pub struct ProductsTransferringHandler<T, C>
    where T: TransactionSend + Clone,
          C: BaseController<(), HashMap<String, Product>, ApiError> {
    pub api: SupplyChainApi<T>,
    pub controller: C,
}

impl<T, C> ProductsTransferringHandler<T, C>
    where T: 'static + TransactionSend + Clone,
          C: 'static + BaseController<(), HashMap<String, Product>, ApiError> {
    pub fn new(api: SupplyChainApi<T>, controller: C) -> Self {
        ProductsTransferringHandler {
            api,
            controller,
        }
    }
}

impl<T, C> Handler for ProductsTransferringHandler<T, C>
    where T: 'static + TransactionSend + Clone,
          C: 'static + BaseController<(), HashMap<String, Product>, ApiError> {
    fn handle(&self, _: &mut Request) -> IronResult<Response> {
        let api = &self.api;

        let origin = match self.controller.process(Box::new(())) {
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