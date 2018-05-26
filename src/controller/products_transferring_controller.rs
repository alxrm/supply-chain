use exonum::api::ApiError;
use exonum::blockchain::Blockchain;
use exonum::storage::{Fork, MapIndex};
use std::collections::{HashMap};
use controller::BaseController;
use product::Product;
use schema::SupplyChainSchema;

pub struct ProductsTransferringController {
    pub blockchain: Blockchain
}

impl ProductsTransferringController {
    pub fn new(blockchain: Blockchain) -> Self {
        ProductsTransferringController {
            blockchain
        }
    }
}

impl BaseController<(), HashMap<String, Product>, ApiError> for ProductsTransferringController {
    fn process(&self, _: Box<()>) -> Result<HashMap<String, Product>, ApiError> {
        println!("/products/transferring");

        let mut view = self.blockchain.fork();
        let mut schema = SupplyChainSchema::new(&mut view);
        let all_products: MapIndex<&mut Fork, String, Product> = schema.products_mut();
        let mut res = HashMap::with_capacity(all_products.values().count());

        all_products.iter()
            .filter(|pair| {
                let product = &pair.1;

                product.transferring()
            })
            .for_each(|pair| {
                res.insert(pair.0, pair.1);
            });

        Ok(res)
    }
}