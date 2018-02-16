use exonum::api::ApiError;
use exonum::blockchain::{self, Blockchain};
use exonum::crypto::PublicKey;
use exonum::helpers::Height;
use controller::BaseController;
use controller::history::{AuditedEntityInfo, collect_history};
use owner::Owner;
use schema::SupplyChainSchema;

pub struct OwnerController {
    pub blockchain: Blockchain
}

impl OwnerController {
    pub fn new(blockchain: Blockchain) -> Self {
        OwnerController {
            blockchain
        }
    }
}

impl BaseController<PublicKey, AuditedEntityInfo<Owner>, ApiError> for OwnerController {
    fn process(&self, pub_key: Box<PublicKey>) -> Result<AuditedEntityInfo<Owner>, ApiError> {
        println!("/owners/{}", pub_key.as_ref().to_string());

        let view = self.blockchain.snapshot();
        let general_schema = blockchain::Schema::new(&view);

        let mut view = self.blockchain.fork();
        let mut schema = SupplyChainSchema::new(&mut view);

        let max_height = Height(general_schema.block_hashes_by_height().len()).previous();
        let block_proof = general_schema.block_and_precommits(max_height).unwrap();

        let owner = match schema.owner(pub_key.as_ref()) {
            Some(own) => own,
            None => {
                return Err(ApiError::NotFound);
            }
        };

        let history_raw = schema.owner_history(pub_key.as_ref());
        let owner_history = collect_history(history_raw, &general_schema);

        let res = AuditedEntityInfo {
            block_info: block_proof,
            data: owner,
            history: owner_history,
        };

        Ok(res)
    }
}