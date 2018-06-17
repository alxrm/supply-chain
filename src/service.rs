use exonum::api::Api;
use exonum::blockchain::{ApiContext, Service, Transaction};
use exonum::crypto::Hash;
use exonum::encoding::Error as StreamStructError;
use exonum::helpers::fabric::{Context, ServiceFactory};
use exonum::messages::{FromRaw, RawTransaction};
use exonum::storage::Snapshot;
use iron::Handler;
use router::Router;
use super::api::SupplyChainApi;
use super::schema::SupplyChainSchema;
use super::transactions::BaseTransaction;

pub const SUPPLY_CHAIN_SERVICE_ID: u16 = 1337;

#[derive(Default, Debug)]
pub struct SupplyChainService {}

impl SupplyChainService {
    pub fn new() -> Self {
        SupplyChainService {}
    }
}

impl Service for SupplyChainService {
    fn service_id(&self) -> u16 {
        SUPPLY_CHAIN_SERVICE_ID
    }

    fn service_name(&self) -> &'static str {
        "supply-chain"
    }

    fn state_hash(&self, view: &Snapshot) -> Vec<Hash> {
        let schema = SupplyChainSchema::new(view);
        schema.state_hash()
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