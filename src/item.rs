use exonum::encoding::Field;
use exonum::crypto::PublicKey;

use super::owner::Owner;

encoding_struct! {
    struct Item {
        const SIZE = 56;

        field owner_key:              &PublicKey  [00 => 32]
        field name:                   &str        [32 => 40]
        field uid:                    &str        [40 => 48]
        field group_id:               &str        [48 => 56]
//        field history_len:            u64         [56 => 64]
//        field history_hash:           &Hash       [64 => 96]
    }
}


impl Item {
    pub fn change_owner(&mut self, next_owner: &Owner) -> bool {
        if next_owner.pub_key() == self.owner_key() {
            return false;
        }

        Field::write(&(next_owner.pub_key()), &mut self.raw, 0, 32);
        true
    }

    pub fn attach_to_group(&mut self, group_id: &str) -> bool {
        if group_id == self.group_id() {
            return false;
        }

        Field::write(&group_id, &mut self.raw, 48, 56);
        true
    }
    //
    //    pub fn grow_length_set_history_hash(&mut self, hash: &Hash) {
    //        Field::write(&hash, &mut self.raw, 64, 96);
    //        Field::write(&(self.history_len() + 1), &mut self.raw, 56, 64);
    //    }
}