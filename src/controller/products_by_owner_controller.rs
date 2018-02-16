use exonum::api::ApiError;
use exonum::blockchain::Blockchain;
use exonum::crypto::PublicKey;
use exonum::storage::{Fork, MapIndex};
use std::collections::HashMap;
use controller::BaseController;
use product::Product;
use schema::SupplyChainSchema;

pub struct ProductsByOwnerController {
    pub blockchain: Blockchain
}

impl ProductsByOwnerController {
    pub fn new(blockchain: Blockchain) -> Self {
        ProductsByOwnerController {
            blockchain
        }
    }
}

impl BaseController<PublicKey, HashMap<String, Product>, ApiError> for ProductsByOwnerController {
    fn process(&self, pub_key: Box<PublicKey>) -> Result<HashMap<String, Product>, ApiError> {
        println!("/owner/{}/products", pub_key.as_ref().to_string());

        let mut view = self.blockchain.fork();
        let mut schema = SupplyChainSchema::new(&mut view);
        let all_products: MapIndex<&mut Fork, String, Product> = schema.products_mut();
        let mut res = HashMap::with_capacity(all_products.values().count());

        all_products.iter()
            .filter(|pair| {
                let product = &pair.1;

                product.owner_key() == pub_key.as_ref()
            })
            .for_each(|pair| {
                res.insert(pair.0, pair.1);
            });

        Ok(res)
    }
}