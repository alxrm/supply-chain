use exonum::api::{Api, ApiError};
use exonum::encoding::serialize::json::reexport as serde_json;
use exonum::node::TransactionSend;
use hyper::header::AccessControlAllowOrigin;
use iron::middleware::Handler;
use iron::prelude::*;
use self::serde_json::to_value;
use api::SupplyChainApi;
use controller::AuditedEntityInfo;
use controller::BaseController;
use product::Product;


pub struct ProductHandler<T, C>
    where T: TransactionSend + Clone,
          C: BaseController<String, AuditedEntityInfo<Product>, ApiError> {
    pub api: SupplyChainApi<T>,
    pub controller: C,
}

impl<T, C> ProductHandler<T, C>
    where T: 'static + TransactionSend + Clone,
          C: 'static + BaseController<String, AuditedEntityInfo<Product>, ApiError> {
    pub fn new(api: SupplyChainApi<T>, controller: C) -> Self {
        ProductHandler {
            api,
            controller
        }
    }
}

impl<T, C> Handler for ProductHandler<T, C>
    where T: 'static + TransactionSend + Clone,
          C: 'static + BaseController<String, AuditedEntityInfo<Product>, ApiError> {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let path = req.url.path();
        let product_uid = path.last().unwrap().to_string();
        let api = &self.api;
        let origin = match self.controller.process(Box::new(product_uid)) {
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
}