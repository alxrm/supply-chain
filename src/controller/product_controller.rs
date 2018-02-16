use exonum::api::ApiError;
use exonum::blockchain::{self, Blockchain};
use exonum::helpers::Height;
use controller::BaseController;
use controller::history::{AuditedEntityInfo, collect_history};
use product::Product;
use schema::SupplyChainSchema;

pub struct ProductController {
    pub blockchain: Blockchain
}

impl ProductController {
    pub fn new(blockchain: Blockchain) -> Self {
        ProductController {
            blockchain
        }
    }
}

impl BaseController<String, AuditedEntityInfo<Product>, ApiError> for ProductController {
    fn process(&self, product_uid: Box<String>) -> Result<AuditedEntityInfo<Product>, ApiError> {
        println!("/products/{}", product_uid);

        let view = self.blockchain.snapshot();
        let general_schema = blockchain::Schema::new(&view);

        let mut view = self.blockchain.fork();
        let mut schema = SupplyChainSchema::new(&mut view);

        let max_height = Height(general_schema.block_hashes_by_height().len()).previous();
        let block_proof = general_schema.block_and_precommits(max_height).unwrap();

        let product = match schema.product(product_uid.as_ref()) {
            Some(it) => it,
            None => {
                return Err(ApiError::NotFound);
            }
        };

        let history_raw = schema.product_history(product_uid.as_ref());
        let product_history = collect_history(history_raw, &general_schema);

        let res = AuditedEntityInfo {
            block_info: block_proof,
            data: product,
            history: product_history,
        };

        Ok(res)
    }
}