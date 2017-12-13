use std::fmt;

use exonum::crypto::{PublicKey, Hash};
use exonum::storage::{Snapshot, Fork, ProofMapIndex, MapIndex};

use super::item::Item;
use super::owner::Owner;

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

    pub fn group_mut(&mut self, group_id: &String) -> MapIndex<&mut Fork, String, Item> {
        MapIndex::new(group_id, self.view)
    }

    pub fn item(&mut self, item_uid: &String) -> Option<Item> {
        self.items_mut().get(item_uid)
    }
}