use exonum::crypto::{PublicKey, Hash};
use exonum::blockchain::Transaction;
use exonum::messages::{RawMessage, FromRaw, Message};
use exonum::storage::Fork;
use exonum::encoding::Error as StreamStructError;

use super::schema::SupplyChainSchema;
use super::service::SUPPLY_CHAIN_SERVICE_ID;
use super::item::Item;
use super::owner::Owner;
use super::tx_metarecord::TxMetaRecord;

pub const TX_CREATE_OWNER_ID: u16 = 128;
pub const TX_ADD_ITEM_ID: u16 = 129;
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

    AddItem(TxAddItem),

    AttachToGroup(TxAttachToGroup),

    SendGroup(TxSendGroup),

    ReceiveGroup(TxReceiveGroup),
}

impl BaseTransaction {
    /// Returns public key from the transaction.
    pub fn pub_key(&self) -> &PublicKey {
        match *self {
            BaseTransaction::CreateOwner(ref msg) => msg.pub_key(),
            BaseTransaction::AddItem(ref msg) => msg.owner(),
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
            BaseTransaction::AddItem(ref msg) => msg.raw(),
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
            TX_ADD_ITEM_ID => Ok(BaseTransaction::AddItem(TxAddItem::from_raw(raw)?)),
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
            BaseTransaction::AddItem(ref msg) => msg.verify(),
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
            BaseTransaction::AddItem(ref msg) => msg.execute(view, tx_hash),
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

impl TxAddItem {
    fn verify(&self) -> bool {
        let is_valid_name = self.name() != "";
        let is_valid_uid = self.item_uid() != "";

        is_valid_name && is_valid_uid
    }

    fn execute(&self, fork: &mut Fork, tx_hash: Hash) {
        let mut schema = SupplyChainSchema::new(fork);
        let item_uid = self.item_uid().to_string();

        let mut owner = match schema.owner(self.owner()) {
            Some(own) => own,
            None => {
                return;
            }
        };

        let found_item = schema.item(&item_uid);
        let status = found_item.is_none();
        let transaction_meta = TxMetaRecord::new(&tx_hash, status);

        let result_item = {
            let mut item_history = schema.item_history(&item_uid);
            item_history.push(transaction_meta.clone());

            match found_item {
                Some(mut it) => {
                    it.grow_length_set_history_hash(&item_history.root_hash());
                    it
                }
                None => Item::new(
                    self.owner(),
                    self.name(),
                    self.item_uid(),
                    "",
                    1,
                    &item_history.root_hash()
                )
            }
        };

        schema.append_owner_history(&mut owner, &transaction_meta);
        schema.owners_mut().put(self.owner(), owner);
        schema.items_mut().put(&item_uid, result_item)
    }
}

impl TxAttachToGroup {
    fn verify(&self) -> bool {
        let is_valid_uid = self.item_uid() != "";
        let is_valid_group = self.group() != "";

        is_valid_uid && is_valid_group
    }

    fn execute(&self, fork: &mut Fork, tx_hash: Hash) {
        let mut schema = SupplyChainSchema::new(fork);
        let item_uid = String::from(self.item_uid());

        let mut owner = match schema.owner(self.owner()) {
            Some(own) => own,
            None => {
                return;
            }
        };

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

        let status = item.attach_to_group(next_group_id.as_str());
        let transaction_meta = TxMetaRecord::new(&tx_hash, status);

        schema.append_owner_history(&mut owner, &transaction_meta);
        schema.owners_mut().put(self.owner(), owner);

        schema.append_item_history(&mut item, &transaction_meta);
        schema.group_mut(&next_group_id).put(&item_uid, item.clone());
        schema.items_mut().put(&item_uid, item);
    }
}

//impl TxChangeGroupOwner {
//    fn verify(&self) -> bool {
//        self.group() != ""
//    }
//
//    fn execute(&self, fork: &mut Fork, tx_hash: Hash) {
//        let mut schema = SupplyChainSchema::new(fork);
//        let group_id = self.group().to_string();
//        let success_record = TxMetaRecord::new(&tx_hash, true);
//
//        let mut next_owner = match schema.owner(self.next_owner()) {
//            Some(own) => own,
//            None => {
//                return;
//            }
//        };
//
//        let mut group_items = {
//            let group = schema.group(&group_id);
//            let items = group.values().collect::<Vec<Item>>();
//
//            items
//        };
//
//        for item in &mut group_items {
//            let status = item.change_owner(&next_owner);
//            let meta = TxMetaRecord::new(&tx_hash, status);
//
//            schema.append_item_history(item, &meta);
//        }
//
//        schema.update_group(&group_items, &group_id);
//        schema.update_items(&group_items);
//
//        schema.append_owner_history(&mut next_owner, &success_record);
//        schema.owners_mut().put(self.next_owner(), next_owner);
//    }
//}

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



        let mut items_grouped = {
            let group = schema.group(&group_id);
            let items = group.values().collect::<Vec<Item>>();

            items
        };

        for item in &mut items_grouped {
            schema.append_item_history(item, &success_record);
        }

        schema.update_group(&items_grouped, &group_id);
        schema.update_items(&items_grouped);

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

        let mut items_grouped = {
            let group = schema.group(&group_id);
            let items = group.values().collect::<Vec<Item>>();

            items
        };

        for item in &mut items_grouped {
            let status = item.change_owner(&next_owner);
            let meta = TxMetaRecord::new(&tx_hash, status);

            schema.append_item_history(item, &meta);
        }

        schema.update_group(&items_grouped, &group_id);
        schema.update_items(&items_grouped);

        schema.append_owner_history(&mut next_owner, &success_record);
        schema.owners_mut().put(self.next_owner(), next_owner);
    }
}