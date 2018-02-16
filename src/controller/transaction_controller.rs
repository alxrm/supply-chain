use exonum::api::ApiError;
use exonum::messages::Message;
use exonum::node::TransactionSend;
use api::TxResponse;
use controller::BaseController;
use transactions::BaseTransaction;

pub struct TransactionController<T: TransactionSend + Clone> {
    pub channel: T
}

impl<T> TransactionController<T> where T: TransactionSend + Clone {
    pub fn new(channel: T) -> Self {
        TransactionController {
            channel
        }
    }
}

impl<T> BaseController<BaseTransaction, TxResponse, ApiError> for TransactionController<T>
    where T: TransactionSend + Clone {
    fn process(&self, tx: Box<BaseTransaction>) -> Result<TxResponse, ApiError> {
        println!("/transaction");

        let tx_hash = tx.hash();
        match self.channel.send(tx) {
            Ok(_) => Ok(TxResponse { tx_hash }),
            Err(e) => Err(ApiError::from(e)),
        }
    }
}