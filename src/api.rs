use controller::{
    GroupController,
    OwnerController,
    ProductController,
    ProductsByOwnerController,
    TransactionController,
};
use exonum::api::Api;
use exonum::blockchain::Blockchain;
use exonum::crypto::Hash;
use exonum::node::TransactionSend;
use handler::{
    GroupHandler,
    OwnerHandler,
    ProductHandler,
    ProductsByOwnerHandler,
    TransactionHandler,
};
use router::Router;

#[derive(Clone)]
pub struct SupplyChainApi<T: TransactionSend + Clone> {
    /// Exonum blockchain.
    pub blockchain: Blockchain,
    /// Channel for transactions.
    pub channel: T,
}

#[derive(Serialize, Deserialize)]
pub struct TxResponse {
    pub tx_hash: Hash,
}

impl<T> Api for SupplyChainApi<T> where T: 'static + TransactionSend + Clone {
    fn wire(&self, router: &mut Router) {
        let product_handler = ProductHandler::new(
            self.clone(), ProductController::new(self.clone().blockchain),
        );

        let owner_handler = OwnerHandler::new(
            self.clone(), OwnerController::new(self.clone().blockchain),
        );

        let group_handler = GroupHandler::new(
            self.clone(), GroupController::new(self.clone().blockchain),
        );

        let products_by_owner_handler = ProductsByOwnerHandler::new(
            self.clone(), ProductsByOwnerController::new(self.clone().blockchain),
        );

        let transaction_handler = TransactionHandler::new(
            self.clone(), TransactionController::new(self.clone().channel, self.clone().blockchain),
        );

        router.post(&"/v1/transaction", transaction_handler, "transaction");
        router.get(&"/v1/products/:uid", product_handler, "product");
        router.get(&"/v1/groups/:groupId", group_handler, "group");
        router.get(&"/v1/owners/:pubKey/products", products_by_owner_handler, "products_by_owner");
        router.get(&"/v1/owners/:pubKey", owner_handler, "owner");

        println!("Wired API methods");
    }
}