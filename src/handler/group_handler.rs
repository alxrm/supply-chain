use exonum::api::{Api, ApiError};
use exonum::encoding::serialize::json::reexport as serde_json;
use exonum::node::TransactionSend;
use hyper::header::AccessControlAllowOrigin;
use iron::middleware::Handler;
use iron::prelude::*;
use self::serde_json::to_value;
use std::collections::HashMap;
use api::SupplyChainApi;
use controller::BaseController;
use product::Product;


pub struct GroupHandler<T, C>
    where T: TransactionSend + Clone,
          C: BaseController<String, HashMap<String, Product>, ApiError> {
    pub api: SupplyChainApi<T>,
    pub controller: C,
}

impl<T, C> GroupHandler<T, C>
    where T: 'static + TransactionSend + Clone,
          C: 'static + BaseController<String, HashMap<String, Product>, ApiError> {
    pub fn new(api: SupplyChainApi<T>, controller: C) -> Self {
        GroupHandler {
            api,
            controller,
        }
    }
}

impl<T, C> Handler for GroupHandler<T, C>
    where T: 'static + TransactionSend + Clone,
          C: 'static + BaseController<String, HashMap<String, Product>, ApiError> {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let path = req.url.path();
        let group_id = path.last().unwrap().to_string();
        let api = &self.api;
        let origin = match self.controller.process(Box::new(group_id)) {
            Ok(products) => api.ok_response(&to_value(products).unwrap()),
            Err(_) => {
                api.not_found_response(&to_value("Group not found").unwrap())
            }
        };

        let mut res = origin.unwrap();
        res.headers.set(AccessControlAllowOrigin::Any);

        Ok(res)
    }
}