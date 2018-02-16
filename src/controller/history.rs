use exonum::blockchain::{BlockProof, Schema};
use exonum::storage::{Fork, ListProof, ProofListIndex, Snapshot};
use serde::Serialize;
use transactions::BaseTransaction;
use tx_metarecord::TxMetaRecord;

#[derive(Debug, Serialize)]
pub struct AuditedEntityInfo<V: Serialize> {
    pub block_info: BlockProof,
    pub data: V,
    pub history: ListProofTemplate<BaseTransaction>,
}

#[derive(Debug, Serialize)]
pub struct ListProofTemplate<V: Serialize> {
    pub proof: ListProof<TxMetaRecord>,
    pub values: Vec<V>,
}

pub fn collect_history(
    history: ProofListIndex<&mut Fork, TxMetaRecord>,
    general_schema: &Schema<&Box<Snapshot>>,
) -> ListProofTemplate<BaseTransaction> {
    let history_len = history.len();
    let tx_records: Vec<TxMetaRecord> = history.into_iter().collect();
    let transactions_table = general_schema.transactions();

    let mut txs: Vec<BaseTransaction> = Vec::with_capacity(tx_records.len());

    for record in tx_records {
        let raw_message = transactions_table.get(record.tx_hash()).unwrap();
        txs.push(BaseTransaction::from(raw_message));
    }

    let to_transaction_hashes: ListProof<TxMetaRecord> =
        history.get_range_proof(0, history_len);

    let path_to_transactions = ListProofTemplate {
        proof: to_transaction_hashes,
        values: txs,
    };

    path_to_transactions
}