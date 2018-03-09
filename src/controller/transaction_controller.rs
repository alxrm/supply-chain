use api::TxResponse;
use controller::BaseController;
use exonum::api::ApiError;
use exonum::blockchain::Blockchain;
use exonum::messages::Message;
use exonum::node::TransactionSend;
use exonum::storage::Snapshot;
use schema::SupplyChainSchema;
use transactions::{BaseTransaction, TxAddProduct};
use transactions::BaseTransaction::AddProduct;

pub struct TransactionController<T: TransactionSend + Clone> {
    pub channel: T,
    pub blockchain: Blockchain,
}

impl<T> TransactionController<T> where T: TransactionSend + Clone {
    pub fn new(channel: T, blockchain: Blockchain) -> Self {
        TransactionController {
            channel,
            blockchain,
        }
    }
}

impl<T> BaseController<BaseTransaction, TxResponse, ApiError> for TransactionController<T>
    where T: TransactionSend + Clone {
    fn process(&self, tx: Box<BaseTransaction>) -> Result<TxResponse, ApiError> {
        println!("/transaction");

        if let &AddProduct(ref tx_exact) = tx.as_ref() {
            if product_exists(&tx_exact, self.blockchain.snapshot()) {
                return Err(ApiError::IncorrectRequest("Product already exists".into()));
            }
        }

        let tx_hash = tx.hash();
        match self.channel.send(tx) {
            Ok(_) => Ok(TxResponse { tx_hash }),
            Err(e) => Err(ApiError::from(e)),
        }
    }
}

fn product_exists(transaction: &TxAddProduct, snapshot: Box<Snapshot>) -> bool {
    let schema = SupplyChainSchema::new(snapshot.as_ref());
    let product_uid = transaction.product_uid().to_string();

    let found_product = schema.product(&product_uid);
    !found_product.is_none()
}