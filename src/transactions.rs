use exonum::encoding::Field;
use exonum::crypto::PublicKey;
use exonum::blockchain::Transaction;

use exonum::messages::{RawMessage, RawTransaction, FromRaw, Message};
use exonum::storage::{Snapshot, Fork};

use super::schema::SupplyChainSchema;
use super::SUPPLY_CHAIN_SERVICE_ID;
use super::item::Item;
use super::owner::Owner;

pub const TX_ADD_ITEM_ID: u16 = 128;
pub const TX_ATTACH_TO_GROUP_ID: u16 = 129;
pub const TX_CHANGE_GROUP_OWNER_ID: u16 = 130;
pub const TX_CREATE_OWNER_ID: u16 = 131;

message! {
    struct TxCreateOwner {
        const TYPE = SUPPLY_CHAIN_SERVICE_ID;
        const ID = TX_CREATE_OWNER_ID;
        const SIZE = 48;

        field pub_key:     &PublicKey    [00 => 32]
        field name:        &str          [32 => 40]
        field seed:        u64           [40 => 48]
    }
}

message! {
    struct TxAddItem {
        const TYPE = SUPPLY_CHAIN_SERVICE_ID;
        const ID = TX_ADD_ITEM_ID;
        const SIZE = 56;

        field owner:       &PublicKey      [00 => 32]
        field item_uid:    &str            [32 => 40]
        field name:        &str            [40 => 48]
        field seed:        u64             [48 => 56]
    }
}

message! {
    struct TxAttachToGroup {
        const TYPE = SUPPLY_CHAIN_SERVICE_ID;
        const ID = TX_ATTACH_TO_GROUP_ID;
        const SIZE = 56;

        field owner:      &PublicKey [00 => 32]
        field item_uid:   &str       [32 => 40]
        field group:      &str       [40 => 48]
        field seed:       u64        [48 => 56]
    }
}

message! {
    struct TxChangeGroupOwner {
        const TYPE = SUPPLY_CHAIN_SERVICE_ID;
        const ID = TX_CHANGE_GROUP_OWNER_ID;
        const SIZE = 48;

        field next_owner:      &PublicKey  [00 => 32]
        field group:           &str        [32 => 40]
        field seed:            u64         [40 => 48]
    }
}

impl Transaction for TxCreateOwner {
    fn verify(&self) -> bool {
        let is_valid_name = self.name() != "";
        let is_valid_signature = self.verify_signature(self.pub_key());

        is_valid_signature && is_valid_name
    }

    fn execute(&self, fork: &mut Fork) {
        let mut schema = SupplyChainSchema::new(fork);
        let key = self.pub_key();

        let owner = match schema.owner(key) {
            Some(own) => own,
            None => Owner::new(
                key,
                self.name()
            )
        };

        schema.owners_mut().put(key, owner)
    }
}

impl Transaction for TxAddItem {
    fn verify(&self) -> bool {
        let is_valid_name = self.name() != "";
        let is_valid_uid = self.item_uid() != "";
        let is_valid_signature = self.verify_signature(self.owner());

        is_valid_signature && is_valid_name && is_valid_uid
    }

    fn execute(&self, fork: &mut Fork) {
        let mut schema = SupplyChainSchema::new(fork);
        let item_uid = String::from(self.item_uid());

        if schema.owner(self.owner()).is_none() {
            return;
        };

        let item = match schema.item(&item_uid) {
            Some(it) => it,
            None => Item::new(
                self.owner(),
                self.name(),
                self.item_uid(),
                ""
            )
        };

        schema.items_mut().put(&item_uid, item)
    }
}

impl Transaction for TxAttachToGroup {
    fn verify(&self) -> bool {
        let is_valid_uid = self.item_uid() != "";
        let is_valid_group = self.group() != "";
        let is_valid_signature = self.verify_signature(self.owner());

        is_valid_uid && is_valid_group && is_valid_signature
    }

    fn execute(&self, fork: &mut Fork) {
        let mut schema = SupplyChainSchema::new(fork);
        let item_uid = String::from(self.item_uid());

        let mut item = match schema.item(&item_uid) {
            Some(it) => it,
            None => {
                return;
            }
        };

        let prev_group_id = String::from(item.group_id());
        let next_group_id = String::from(self.group());

        if prev_group_id != "" {
            schema.group_mut(&prev_group_id).remove(&item_uid);
        }

        item.attach_to_group(next_group_id.as_str());
        schema.group_mut(&next_group_id).put(&item_uid, item.clone());
        schema.items_mut().put(&item_uid, item);
    }
}

impl Transaction for TxChangeGroupOwner {
    fn verify(&self) -> bool {
        let is_valid_group = self.group() != "";
        let is_valid_signature = self.verify_signature(self.next_owner());

        is_valid_group && is_valid_signature
    }

    fn execute(&self, fork: &mut Fork) {
        let mut schema = SupplyChainSchema::new(fork);
        let group_id = String::from(self.group());

        let next_owner = match schema.owner(self.next_owner()) {
            Some(own) => own,
            None => {
                return;
            }
        };

        let updated_group = {
            let mut group = schema.group_mut(&group_id);
            let items = group.values()
                .map(|mut it| {
                    it.change_owner(&next_owner);
                    it
                })
                .collect::<Vec<Item>>();

            for item in &items {
                group.put(&String::from(item.uid()), item.clone());
            }

            items
        };

        let mut all = schema.items_mut();

        for item in &updated_group {
            all.put(&String::from(item.uid()), item.clone());
        }
    }
}