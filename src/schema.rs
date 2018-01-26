use std::fmt;

use exonum::crypto::{PublicKey, Hash};
use exonum::storage::{Snapshot, Fork, ProofMapIndex, ProofListIndex, MapIndex};

use super::product::Product;
use super::owner::Owner;
use super::tx_metarecord::TxMetaRecord;

pub const OWNERS_TABLE: &str = "owners";
pub const PRODUCTS_TABLE: &str = "products";
pub const PRODUCTS_BY_OWNER_TABLE: &str = "products_by_owner";
pub const OWNER_HISTORY_TABLE: &str = "owner_history";
pub const PRODUCT_HISTORY_TABLE: &str = "product_history";

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

    pub fn products(&self) -> MapIndex<&T, String, Product> {
        MapIndex::new(PRODUCTS_TABLE, &self.view)
    }

    pub fn group(&self, group_id: &String) -> MapIndex<&T, String, Product> {
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

    pub fn products_mut(&mut self) -> MapIndex<&mut Fork, String, Product> {
        MapIndex::new(PRODUCTS_TABLE, self.view)
    }

    pub fn group_mut(&mut self, group_id: &String) -> MapIndex<&mut Fork, String, Product> {
        MapIndex::new(group_id, self.view)
    }

    pub fn product(&mut self, product_uid: &String) -> Option<Product> {
        self.products_mut().get(product_uid)
    }

    pub fn update_group(&mut self, products: &Vec<Product>, group_id: &String) {
        let mut group = self.group_mut(group_id);

        products.iter().for_each(|it| {
            group.put(&it.uid().to_string(), it.clone());
        });
    }

    pub fn update_products(&mut self, products: &Vec<Product>) {
        let mut products_map = self.products_mut();

        products.iter().for_each(|it| {
            products_map.put(&it.uid().to_string(), it.clone())
        });
    }

    pub fn product_history(&mut self, product_uid: &String)
                        -> ProofListIndex<&mut Fork, TxMetaRecord> {
        ProofListIndex::new(product_uid, self.view)
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

    pub fn append_product_history(&mut self, product: &mut Product, meta: &TxMetaRecord) {
        let product_uid = product.uid().to_string();
        let mut history = self.product_history(&product_uid);
        history.push(meta.clone());
        product.grow_length_set_history_hash(&history.root_hash());
    }
}