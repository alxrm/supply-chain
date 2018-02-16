use api::SupplyChainApi;
use controller::AuditedEntityInfo;
use controller::BaseController;
use exonum::api::{Api, ApiError};
use exonum::crypto::{HexValue, PublicKey};
use exonum::encoding::serialize::json::reexport as serde_json;
use exonum::node::TransactionSend;
use hyper::header::AccessControlAllowOrigin;
use iron::middleware::Handler;
use iron::prelude::*;
use owner::Owner;
use router::Router;
use self::serde_json::to_value;

pub struct OwnerHandler<T, C>
    where T: TransactionSend + Clone,
          C: BaseController<PublicKey, AuditedEntityInfo<Owner>, ApiError> {
    pub api: SupplyChainApi<T>,
    pub controller: C,
}

impl<T, C> OwnerHandler<T, C>
    where T: 'static + TransactionSend + Clone,
          C: 'static + BaseController<PublicKey, AuditedEntityInfo<Owner>, ApiError> {
    pub fn new(api: SupplyChainApi<T>, controller: C) -> Self {
        OwnerHandler {
            api,
            controller,
        }
    }
}

impl<T, C> Handler for OwnerHandler<T, C>
    where T: 'static + TransactionSend + Clone,
          C: 'static + BaseController<PublicKey, AuditedEntityInfo<Owner>, ApiError> {
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
}