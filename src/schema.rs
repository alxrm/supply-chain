use std::fmt;

use exonum::crypto::{PublicKey, Hash};
use exonum::storage::{Snapshot, Fork, ProofMapIndex, ProofListIndex, MapIndex};

use super::item::Item;
use super::owner::Owner;
use super::tx_metarecord::TxMetaRecord;

pub const OWNERS_TABLE: &str = "owners";
pub const ITEMS_TABLE: &str = "items";
pub const ITEMS_BY_OWNER_TABLE: &str = "items_by_owner";
pub const OWNER_HISTORY_TABLE: &str = "owner_history";
pub const ITEM_HISTORY_TABLE: &str = "item_history";

/// Database schema for the supply chain.
pub struct SupplyChainSchema<T> {
    view: T,
}

impl<T> AsMut<T> for SupplyChainSchema<T> {
    fn as_mut(&mut self) -> &mut T {
        &mut self.view
    }
}

impl<T> fmt::Debug for SupplyChainSchema<T> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "SupplyChainSchema {{}}")
    }
}

/// read access schema
impl<T> SupplyChainSchema<T> where T: AsRef<Snapshot> {
    pub fn new(view: T) -> Self {
        SupplyChainSchema { view }
    }

    pub fn owners(&self) -> ProofMapIndex<&T, PublicKey, Owner> {
        ProofMapIndex::new(OWNERS_TABLE, &self.view)
    }

    pub fn items(&self) -> MapIndex<&T, String, Item> {
        MapIndex::new(ITEMS_TABLE, &self.view)
    }

    pub fn group(&self, group_id: &String) -> MapIndex<&T, String, Item> {
        MapIndex::new(group_id, &self.view)
    }

    pub fn state_hash(&self) -> Vec<Hash> {
        vec![self.owners().root_hash()]
    }
}

/// read-write access schema
impl<'a> SupplyChainSchema<&'a mut Fork> {
    pub fn owners_mut(&mut self) -> ProofMapIndex<&mut Fork, PublicKey, Owner> {
        ProofMapIndex::new(OWNERS_TABLE, self.view)
    }

    pub fn owner(&mut self, owner_key: &PublicKey) -> Option<Owner> {
        self.owners_mut().get(owner_key)
    }

    pub fn items_mut(&mut self) -> MapIndex<&mut Fork, String, Item> {
        MapIndex::new(ITEMS_TABLE, self.view)
    }

    pub fn owner_items_mut(&mut self, owner_key: &PublicKey) -> MapIndex<&mut Fork, String, Item> {
        MapIndex::new(OWNER_ITEMS_TABLE, self.view)
    }

    pub fn group_mut(&mut self, group_id: &String) -> MapIndex<&mut Fork, String, Item> {
        MapIndex::new(group_id, self.view)
    }

    pub fn item(&mut self, item_uid: &String) -> Option<Item> {
        self.items_mut().get(item_uid)
    }

    pub fn update_group(&mut self, items: &Vec<Item>, group_id: &String) {
        let mut group = self.group_mut(group_id);

        items.iter().for_each(|it| {
            group.put(&it.uid().to_string(), it.clone());
        });
    }

    pub fn update_items(&mut self, items: &Vec<Item>) {
        let mut items_map = self.items_mut();

        items.iter().for_each(|it| {
            items_map.put(&it.uid().to_string(), it.clone())
        });
    }

    pub fn item_history(&mut self, item_uid: &String)
                        -> ProofListIndex<&mut Fork, TxMetaRecord> {
        ProofListIndex::new(item_uid, self.view)
    }

    pub fn owner_history(&mut self, owner_key: &PublicKey)
                         -> ProofListIndex<&mut Fork, TxMetaRecord> {
        ProofListIndex::new(&owner_key.to_string(), self.view)
    }

    pub fn append_owner_history(&mut self, owner: &mut Owner, meta: &TxMetaRecord) {
        let mut history = self.owner_history(owner.pub_key());
        history.push(meta.clone());
        owner.grow_length_set_history_hash(&history.root_hash());
    }

    pub fn append_item_history(&mut self, item: &mut Item, meta: &TxMetaRecord) {
        let item_uid = item.uid().to_string();
        let mut history = self.item_history(&item_uid);
        history.push(meta.clone());
        item.grow_length_set_history_hash(&history.root_hash());
    }
}