use exonum::encoding::Field;
use exonum::crypto::{PublicKey, Hash};

use super::owner::Owner;

encoding_struct! {
    struct Product {
        const SIZE = 97;

        field owner_key:              &PublicKey  [00 => 32]
        field name:                   &str        [32 => 40]
        field uid:                    &str        [40 => 48]
        field group_id:               &str        [48 => 56]
        field transferring:           bool        [56 => 57]
        field history_len:            u64         [57 => 65]
        field history_hash:           &Hash       [65 => 97]
    }
}

impl Product {
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

    pub fn set_transferring(&mut self, value: bool) -> bool {
        if value == self.transferring() {
            return false;
        }

        Field::write(&value, &mut self.raw, 56, 57);
        true
    }

    pub fn grow_length_set_history_hash(&mut self, hash: &Hash) {
        Field::write(&hash, &mut self.raw, 65, 97);
        Field::write(&(self.history_len() + 1), &mut self.raw, 57, 65);
    }
}