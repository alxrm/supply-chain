use exonum::encoding::Field;
use exonum::crypto::{PublicKey, Hash};

encoding_struct! {
    struct Owner {
        const SIZE = 80;

        field pub_key:            &PublicKey  [00 => 32]
        field name:               &str        [32 => 40]
        field history_len:        u64         [40 => 48]
        field history_hash:       &Hash       [48 => 80]
    }
}

impl Owner {

}