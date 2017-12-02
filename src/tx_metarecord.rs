use exonum::crypto::Hash;

encoding_struct! {
/// Represents transaction. If `execution_status` equals to `true`, then the transaction
/// was successful.
    struct TxMetaRecord {
        const SIZE = 33;

        field tx_hash:                &Hash  [00 => 32]
        field execution_status:       bool   [32 => 33]
    }
}
