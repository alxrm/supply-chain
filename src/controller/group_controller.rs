use exonum::api::ApiError;
use exonum::blockchain::Blockchain;
use std::collections::HashMap;
use controller::BaseController;
use product::Product;
use schema::SupplyChainSchema;

pub struct GroupController {
    pub blockchain: Blockchain
}

impl GroupController {
    pub fn new(blockchain: Blockchain) -> Self {
        GroupController {
            blockchain
        }
    }
}

impl BaseController<String, HashMap<String, Product>, ApiError> for GroupController {
    fn process(&self, group_id: Box<String>) -> Result<HashMap<String, Product>, ApiError> {
        println!("/groups/{}", group_id);

        let mut view = self.blockchain.fork();
        let mut schema = SupplyChainSchema::new(&mut view);
        let group_products = schema.group_mut(group_id.as_ref());
        let mut res = HashMap::with_capacity(group_products.values().count());

        group_products.iter().for_each(|pair| {
            res.insert(pair.0, pair.1);
        });

        Ok(res)
    }
}