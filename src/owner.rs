use exonum::crypto::PublicKey;

encoding_struct! {
    struct Owner {
        const SIZE = 40;

        field pub_key:            &PublicKey  [00 => 32]
        field name:               &str        [32 => 40]
//        field history_len:        u64         [40 => 48]
//        field history_hash:       &Hash       [48 => 80]
    }
}

//impl Owner {
//    pub fn grow_length_set_history_hash(&mut self, hash: &Hash) {
//        Field::write(&hash, &mut self.raw, 48, 80);
//        Field::write(&(self.history_len() + 1), &mut self.raw, 40, 48);
//    }
//}