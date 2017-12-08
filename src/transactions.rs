use exonum::crypto::PublicKey;
use exonum::blockchain::Transaction;

use exonum::messages::{RawMessage, FromRaw, Message};
use exonum::storage::Fork;
use exonum::encoding::Error as StreamStructError;

use super::schema::SupplyChainSchema;
use super::service::SUPPLY_CHAIN_SERVICE_ID;
use super::item::Item;
use super::owner::Owner;

pub const TX_CREATE_OWNER_ID: u16 = 128;
pub const TX_ADD_ITEM_ID: u16 = 129;
pub const TX_ATTACH_TO_GROUP_ID: u16 = 130;
pub const TX_CHANGE_GROUP_OWNER_ID: u16 = 131;

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

/// Transaction types.
#[serde(untagged)]
#[derive(PartialEq, Debug, Clone, Serialize, Deserialize)]
pub enum BaseTransaction {
    CreateOwner(TxCreateOwner),

    AddItem(TxAddItem),

    AttachToGroup(TxAttachToGroup),

    ChangeGroupOwner(TxChangeGroupOwner),
}

impl BaseTransaction {
    /// Returns public key from the transaction.
    pub fn pub_key(&self) -> &PublicKey {
        match *self {
            BaseTransaction::CreateOwner(ref msg) => msg.pub_key(),
            BaseTransaction::AddItem(ref msg) => msg.owner(),
            BaseTransaction::AttachToGroup(ref msg) => msg.owner(),
            BaseTransaction::ChangeGroupOwner(ref msg) => msg.next_owner(),
        }
    }
}

impl Message for BaseTransaction {
    fn raw(&self) -> &RawMessage {
        match *self {
            BaseTransaction::CreateOwner(ref msg) => msg.raw(),
            BaseTransaction::AddItem(ref msg) => msg.raw(),
            BaseTransaction::AttachToGroup(ref msg) => msg.raw(),
            BaseTransaction::ChangeGroupOwner(ref msg) => msg.raw(),
        }
    }
}

impl FromRaw for BaseTransaction {
    fn from_raw(raw: RawMessage) -> Result<Self, StreamStructError> {
        match raw.message_type() {
            TX_CREATE_OWNER_ID => Ok(BaseTransaction::CreateOwner(TxCreateOwner::from_raw(raw)?)),
            TX_ADD_ITEM_ID => Ok(BaseTransaction::AddItem(TxAddItem::from_raw(raw)?)),
            TX_ATTACH_TO_GROUP_ID => Ok(BaseTransaction::AttachToGroup(TxAttachToGroup::from_raw(raw)?)),
            TX_CHANGE_GROUP_OWNER_ID => Ok(BaseTransaction::ChangeGroupOwner(TxChangeGroupOwner::from_raw(raw)?)),
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

impl From<TxAddItem> for BaseTransaction {
    fn from(tx: TxAddItem) -> BaseTransaction {
        BaseTransaction::AddItem(tx)
    }
}

impl From<TxAttachToGroup> for BaseTransaction {
    fn from(tx: TxAttachToGroup) -> BaseTransaction {
        BaseTransaction::AttachToGroup(tx)
    }
}

impl From<TxChangeGroupOwner> for BaseTransaction {
    fn from(tx: TxChangeGroupOwner) -> BaseTransaction {
        BaseTransaction::ChangeGroupOwner(tx)
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
            BaseTransaction::AddItem(ref msg) => msg.verify(),
            BaseTransaction::AttachToGroup(ref msg) => msg.verify(),
            BaseTransaction::ChangeGroupOwner(ref msg) => msg.verify(),
        };

        is_valid_signature && is_valid_content
    }

    fn execute(&self, view: &mut Fork) {
        match *self {
            BaseTransaction::CreateOwner(ref msg) => msg.execute(view),
            BaseTransaction::AddItem(ref msg) => msg.execute(view),
            BaseTransaction::AttachToGroup(ref msg) => msg.execute(view),
            BaseTransaction::ChangeGroupOwner(ref msg) => msg.execute(view),
        }
    }
}

impl TxCreateOwner {
    fn verify(&self) -> bool {
        self.name() != ""
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

impl TxAddItem {
    fn verify(&self) -> bool {
        let is_valid_name = self.name() != "";
        let is_valid_uid = self.item_uid() != "";

        is_valid_name && is_valid_uid
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

impl TxAttachToGroup {
    fn verify(&self) -> bool {
        let is_valid_uid = self.item_uid() != "";
        let is_valid_group = self.group() != "";

        is_valid_uid && is_valid_group
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

impl TxChangeGroupOwner {
    fn verify(&self) -> bool {
        self.group() != ""
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