use iron::Handler;
use router::Router;

use exonum::messages::{RawTransaction, FromRaw};
use exonum::blockchain::{Service, Transaction, ApiContext};
use exonum::encoding::Error as StreamStructError;
use exonum::helpers::fabric::{ServiceFactory, Context};
use exonum::api::Api;

use super::transactions::BaseTransaction;
use super::api::SupplyChainApi;

pub const SUPPLY_CHAIN_SERVICE_ID: u16 = 1337;

#[derive(Default, Debug)]
pub struct SupplyChainService {}

impl SupplyChainService {
    pub fn new() -> Self {
        SupplyChainService {}
    }
}

impl Service for SupplyChainService {
    fn service_name(&self) -> &'static str {
        "supply-chain"
    }

    fn service_id(&self) -> u16 {
        SUPPLY_CHAIN_SERVICE_ID
    }

    fn tx_from_raw(&self, raw: RawTransaction) -> Result<Box<Transaction>, StreamStructError> {
        BaseTransaction::from_raw(raw).map(|tx| Box::new(tx) as Box<Transaction>)
    }

    fn public_api_handler(&self, ctx: &ApiContext) -> Option<Box<Handler>> {
        let mut router = Router::new();
        let api = SupplyChainApi {
            channel: ctx.node_channel().clone(),
            blockchain: ctx.blockchain().clone(),
        };
        api.wire(&mut router);

        Some(Box::new(router))
    }
}

impl ServiceFactory for SupplyChainService {
    fn make_service(&mut self, _: &Context) -> Box<Service> {
        Box::new(SupplyChainService::new())
    }
}