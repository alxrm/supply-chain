mod schema;

pub const SUPPLYCHAIN_SERVICE_ID: u16 = 128;

#[derive(Default, Debug)]
pub struct SupplyChainService {}

impl SupplyChainService {
    /// Creates `SupplyChainService`.
    pub fn new() -> Self {
        SupplyChainService {}
    }
}

impl Service for SupplyChainService {
    fn service_name(&self) -> &'static str {
        "supplychain"
    }

    fn service_id(&self) -> u16 {
        SUPPLYCHAIN_SERVICE_ID
    }

    fn state_hash(&self, view: &Snapshot) -> Vec<Hash> {
        let schema = CurrencySchema::new(view);
        schema.state_hash()
    }

    fn tx_from_raw(&self, raw: RawTransaction) -> Result<Box<Transaction>, StreamStructError> {
        CurrencyTx::from_raw(raw).map(|tx| Box::new(tx) as Box<Transaction>)
    }

    fn public_api_handler(&self, ctx: &ApiContext) -> Option<Box<Handler>> {
        let mut router = Router::new();
        use api;
        use exonum::api::Api;
        let api = api::CryptocurrencyApi {
            channel: ctx.node_channel().clone(),
            blockchain: ctx.blockchain().clone(),
        };
        api.wire(&mut router);
        Some(Box::new(router))
    }
}

impl ServiceFactory for SupplyChainService {
    fn make_service(_: &Context) -> Box<Service> {
        Box::new(SupplyChainService::new())
    }
}