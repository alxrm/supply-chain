use exonum::crypto::Hash;

encoding_struct! {
    struct TxMetaRecord {
        const SIZE = 33;

        field tx_hash:                &Hash  [00 => 32]
        field execution_status:       bool   [32 => 33]
        field execution_time:         i64    [33 => 41]
    }
}
