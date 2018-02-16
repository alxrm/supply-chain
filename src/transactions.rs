use exonum::crypto::{PublicKey, Hash};
use exonum::blockchain::Transaction;
use exonum::messages::{RawMessage, FromRaw, Message};
use exonum::storage::Fork;
use exonum::encoding::Error as StreamStructError;

use super::schema::SupplyChainSchema;
use super::service::SUPPLY_CHAIN_SERVICE_ID;
use super::product::Product;
use super::owner::Owner;
use super::tx_metarecord::TxMetaRecord;

pub const TX_CREATE_OWNER_ID: u16 = 128;
pub const TX_ADD_PRODUCT_ID: u16 = 129;
pub const TX_ATTACH_TO_GROUP_ID: u16 = 130;
pub const TX_SEND_GROUP_ID: u16 = 131;
pub const TX_RECEIVE_GROUP_ID: u16 = 132;

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
    struct TxAddProduct {
        const TYPE = SUPPLY_CHAIN_SERVICE_ID;
        const ID = TX_ADD_PRODUCT_ID;
        const SIZE = 56;

        field owner:       &PublicKey      [00 => 32]
        field product_uid:    &str            [32 => 40]
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
        field product_uid:   &str       [32 => 40]
        field group:      &str       [40 => 48]
        field seed:       u64        [48 => 56]
    }
}

message! {
    struct TxSendGroup {
        const TYPE = SUPPLY_CHAIN_SERVICE_ID;
        const ID = TX_SEND_GROUP_ID;
        const SIZE = 48;

        field prev_owner:      &PublicKey  [00 => 32]
        field group:           &str        [32 => 40]
        field seed:            u64         [40 => 48]
    }
}

message! {
    struct TxReceiveGroup {
        const TYPE = SUPPLY_CHAIN_SERVICE_ID;
        const ID = TX_RECEIVE_GROUP_ID;
        const SIZE = 48;

        field next_owner:      &PublicKey  [00 => 32]
        field group:           &str        [32 => 40]
        field seed:            u64         [40 => 48]
    }
}

/// Transaction types.
#[serde(untagged)]
#[derive(PartialEq, Debug, Clone, Serialize, Deserialize)]
pub enum BaseTransaction {
    CreateOwner(TxCreateOwner),

    AddProduct(TxAddProduct),

    AttachToGroup(TxAttachToGroup),

    SendGroup(TxSendGroup),

    ReceiveGroup(TxReceiveGroup),
}

impl BaseTransaction {
    /// Returns public key from the transaction.
    pub fn pub_key(&self) -> &PublicKey {
        match *self {
            BaseTransaction::CreateOwner(ref msg) => msg.pub_key(),
            BaseTransaction::AddProduct(ref msg) => msg.owner(),
            BaseTransaction::AttachToGroup(ref msg) => msg.owner(),
            BaseTransaction::SendGroup(ref msg) => msg.prev_owner(),
            BaseTransaction::ReceiveGroup(ref msg) => msg.next_owner(),
        }
    }
}

impl Message for BaseTransaction {
    fn raw(&self) -> &RawMessage {
        match *self {
            BaseTransaction::CreateOwner(ref msg) => msg.raw(),
            BaseTransaction::AddProduct(ref msg) => msg.raw(),
            BaseTransaction::AttachToGroup(ref msg) => msg.raw(),
            BaseTransaction::SendGroup(ref msg) => msg.raw(),
            BaseTransaction::ReceiveGroup(ref msg) => msg.raw(),
        }
    }
}

impl FromRaw for BaseTransaction {
    fn from_raw(raw: RawMessage) -> Result<Self, StreamStructError> {
        match raw.message_type() {
            TX_CREATE_OWNER_ID => Ok(BaseTransaction::CreateOwner(TxCreateOwner::from_raw(raw)?)),
            TX_ADD_PRODUCT_ID => Ok(BaseTransaction::AddProduct(TxAddProduct::from_raw(raw)?)),
            TX_ATTACH_TO_GROUP_ID => Ok(BaseTransaction::AttachToGroup(TxAttachToGroup::from_raw(raw)?)),
            TX_SEND_GROUP_ID => Ok(BaseTransaction::SendGroup(TxSendGroup::from_raw(raw)?)),
            TX_RECEIVE_GROUP_ID => Ok(BaseTransaction::ReceiveGroup(TxReceiveGroup::from_raw(raw)?)),
            _ => Err(StreamStructError::IncorrectMessageType {
                message_type: raw.message_type(),
            }),
        }
    }
}

impl From<TxCreateOwner> for BaseTransaction {
    fn from(tx: TxCreateOwner) -> BaseTransaction {
        BaseTransaction::CreateOwner(tx)
    }
}

impl From<TxAddProduct> for BaseTransaction {
    fn from(tx: TxAddProduct) -> BaseTransaction {
        BaseTransaction::AddProduct(tx)
    }
}

impl From<TxAttachToGroup> for BaseTransaction {
    fn from(tx: TxAttachToGroup) -> BaseTransaction {
        BaseTransaction::AttachToGroup(tx)
    }
}

impl From<TxSendGroup> for BaseTransaction {
    fn from(tx: TxSendGroup) -> BaseTransaction {
        BaseTransaction::SendGroup(tx)
    }
}

impl From<TxReceiveGroup> for BaseTransaction {
    fn from(tx: TxReceiveGroup) -> BaseTransaction {
        BaseTransaction::ReceiveGroup(tx)
    }
}

impl From<RawMessage> for BaseTransaction {
    fn from(raw: RawMessage) -> Self {
        BaseTransaction::from_raw(raw).unwrap()
    }
}

impl Transaction for BaseTransaction {
    fn verify(&self) -> bool {
        let is_valid_signature = self.verify_signature(self.pub_key());
        let is_valid_content = match *self {
            BaseTransaction::CreateOwner(ref msg) => msg.verify(),
            BaseTransaction::AddProduct(ref msg) => msg.verify(),
            BaseTransaction::AttachToGroup(ref msg) => msg.verify(),
            BaseTransaction::SendGroup(ref msg) => msg.verify(),
            BaseTransaction::ReceiveGroup(ref msg) => msg.verify(),
        };

        is_valid_signature && is_valid_content
    }

    fn execute(&self, view: &mut Fork) {
        let tx_hash = Message::hash(self);
        match *self {
            BaseTransaction::CreateOwner(ref msg) => msg.execute(view, tx_hash),
            BaseTransaction::AddProduct(ref msg) => msg.execute(view, tx_hash),
            BaseTransaction::AttachToGroup(ref msg) => msg.execute(view, tx_hash),
            BaseTransaction::SendGroup(ref msg) => msg.execute(view, tx_hash),
            BaseTransaction::ReceiveGroup(ref msg) => msg.execute(view, tx_hash),
        }
    }
}

impl TxCreateOwner {
    fn verify(&self) -> bool {
        self.name() != ""
    }

    fn execute(&self, fork: &mut Fork, tx_hash: Hash) {
        let mut schema = SupplyChainSchema::new(fork);
        let key = self.pub_key();
        let found_owner = schema.owner(key);

        let status = found_owner.is_none();
        let meta = TxMetaRecord::new(&tx_hash, status);

        let owner = {
            let mut history = schema.owner_history(self.pub_key());
            history.push(meta);

            match found_owner {
                Some(mut own) => {
                    own.grow_length_set_history_hash(&history.root_hash());
                    own
                }
                None => {
                    Owner::new(
                        self.pub_key(),
                        self.name(),
                        1, // history_len
                        &history.root_hash(),
                    )
                }
            }
        };

        schema.owners_mut().put(key, owner)
    }
}

impl TxAddProduct {
    fn verify(&self) -> bool {
        let is_valid_name = self.name() != "";
        let is_valid_uid = self.product_uid() != "";

        is_valid_name && is_valid_uid
    }

    fn execute(&self, fork: &mut Fork, tx_hash: Hash) {
        let mut schema = SupplyChainSchema::new(fork);
        let product_uid = self.product_uid().to_string();

        let mut owner = match schema.owner(self.owner()) {
            Some(own) => own,
            None => {
                return;
            }
        };

        let found_product = schema.product(&product_uid);
        let status = found_product.is_none();
        let transaction_meta = TxMetaRecord::new(&tx_hash, status);

        let result_product = {
            let mut product_history = schema.product_history(&product_uid);
            product_history.push(transaction_meta.clone());

            match found_product {
                Some(mut it) => {
                    it.grow_length_set_history_hash(&product_history.root_hash());
                    it
                }
                None => Product::new(
                    self.owner(),
                    self.name(),
                    self.product_uid(),
                    "",
                    false,
                    1,
                    &product_history.root_hash()
                )
            }
        };

        schema.append_owner_history(&mut owner, &transaction_meta);
        schema.owners_mut().put(self.owner(), owner);
        schema.products_mut().put(&product_uid, result_product)
    }
}

impl TxAttachToGroup {
    fn verify(&self) -> bool {
        let is_valid_uid = self.product_uid() != "";
        let is_valid_group = self.group() != "";

        is_valid_uid && is_valid_group
    }

    fn execute(&self, fork: &mut Fork, tx_hash: Hash) {
        let mut schema = SupplyChainSchema::new(fork);
        let product_uid = String::from(self.product_uid());

        let mut owner = match schema.owner(self.owner()) {
            Some(own) => own,
            None => {
                return;
            }
        };

        let mut product = match schema.product(&product_uid) {
            Some(it) => it,
            None => {
                return;
            }
        };

        let prev_group_id = String::from(product.group_id());
        let next_group_id = String::from(self.group());

        if prev_group_id != "" {
            schema.group_mut(&prev_group_id).remove(&product_uid);
        }

        let status = product.attach_to_group(next_group_id.as_str());
        let transaction_meta = TxMetaRecord::new(&tx_hash, status);

        schema.append_owner_history(&mut owner, &transaction_meta);
        schema.owners_mut().put(self.owner(), owner);

        schema.append_product_history(&mut product, &transaction_meta);
        schema.group_mut(&next_group_id).put(&product_uid, product.clone());
        schema.products_mut().put(&product_uid, product);
    }
}

impl TxSendGroup {
    fn verify(&self) -> bool {
        self.group() != ""
    }

    fn execute(&self, fork: &mut Fork, tx_hash: Hash) {
        let mut schema = SupplyChainSchema::new(fork);
        let group_id = self.group().to_string();
        let success_record = TxMetaRecord::new(&tx_hash, true);

        let mut prev_owner = match schema.owner(self.prev_owner()) {
            Some(own) => own,
            None => {
                return;
            }
        };

        let mut products_grouped = {
            let group = schema.group(&group_id);
            let products = group.values().collect::<Vec<Product>>();

            products
        };

        for product in &mut products_grouped {
            let status = product.set_transferring(true);
            let meta = TxMetaRecord::new(&tx_hash, status);

            schema.append_product_history(product, &meta);
        }

        schema.update_group(&products_grouped, &group_id);
        schema.update_products(&products_grouped);

        schema.append_owner_history(&mut prev_owner, &success_record);
        schema.owners_mut().put(self.prev_owner(), prev_owner);
    }
}

impl TxReceiveGroup {
    fn verify(&self) -> bool {
        self.group() != ""
    }

    fn execute(&self, fork: &mut Fork, tx_hash: Hash) {
        let mut schema = SupplyChainSchema::new(fork);
        let group_id = self.group().to_string();
        let success_record = TxMetaRecord::new(&tx_hash, true);

        let mut next_owner = match schema.owner(self.next_owner()) {
            Some(own) => own,
            None => {
                return;
            }
        };

        let mut products_grouped = {
            let group = schema.group(&group_id);
            let products = group.values().collect::<Vec<Product>>();

            products
        };

        for product in &mut products_grouped {
            let finished_transfer = product.set_transferring(false);
            let changed_owner = product.change_owner(&next_owner);
            let status = finished_transfer && changed_owner;
            let meta = TxMetaRecord::new(&tx_hash, status);

            schema.append_product_history(product, &meta);
        }

        schema.update_group(&products_grouped, &group_id);
        schema.update_products(&products_grouped);

        schema.append_owner_history(&mut next_owner, &success_record);
        schema.owners_mut().put(self.next_owner(), next_owner);
    }
}