use api::{SupplyChainApi, TxResponse};
use bodyparser;
use controller::BaseController;
use exonum::api::{Api, ApiError};
use exonum::encoding::serialize::json::reexport as serde_json;
use exonum::node::TransactionSend;
use hyper::header::AccessControlAllowOrigin;
use iron::middleware::Handler;
use iron::prelude::*;
use self::serde_json::to_value;
use transactions::BaseTransaction;


pub struct TransactionHandler<T, C>
    where T: TransactionSend + Clone,
          C: BaseController<BaseTransaction, TxResponse, ApiError> {
    pub api: SupplyChainApi<T>,
    pub controller: C,
}

impl<T, C> TransactionHandler<T, C>
    where T: 'static + TransactionSend + Clone,
          C: 'static + BaseController<BaseTransaction, TxResponse, ApiError> {
    pub fn new(api: SupplyChainApi<T>, controller: C) -> Self {
        TransactionHandler {
            api,
            controller,
        }
    }
}

impl<T, C> Handler for TransactionHandler<T, C>
    where T: 'static + TransactionSend + Clone,
          C: 'static + BaseController<BaseTransaction, TxResponse, ApiError> {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let api = &self.api;
        let origin = match req.get::<bodyparser::Struct<BaseTransaction>>() {
            Ok(Some(transaction)) => {
                let tx_response = self.controller.process(Box::new(transaction))?;
                api.ok_response(&to_value(tx_response).unwrap())
            }
            Ok(None) => Err(ApiError::IncorrectRequest("Empty request body".into()))?,
            Err(e) => Err(ApiError::IncorrectRequest(Box::new(e)))?,
        };

        let mut res = origin.unwrap();
        res.headers.set(AccessControlAllowOrigin::Any);

        Ok(res)
    }
}