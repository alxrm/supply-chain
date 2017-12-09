extern crate exonum;
extern crate exonum_configuration;
extern crate supply_chain;
//
//#[macro_use]
//extern crate log;

use std::path::Path;

use exonum::helpers;
use exonum::helpers::fabric::NodeBuilder;
use exonum::node::{Node, NodeConfig, NodeApiConfig};
use exonum::storage::{RocksDB, RocksDBOptions};
use exonum_configuration::ConfigurationService;
use exonum::blockchain::{Blockchain, Service, GenesisConfig, ValidatorKeys};

use supply_chain::service::SupplyChainService;

fn main() {
    exonum::crypto::init();
    helpers::init_logger().unwrap();

    //    let node = NodeBuilder::new()
    //        .with_service(Box::new(ConfigurationService::new()))
    //        .with_service(Box::new(SupplyChainService::new()));
    //    node.run();

    let mut db_options = RocksDBOptions::default();
    db_options.create_if_missing(true);

    let db = RocksDB::open(Path::new("./db"), db_options).unwrap();

    let services: Vec<Box<Service>> = vec![Box::new(SupplyChainService::new())];
    let blockchain = Blockchain::new(Box::new(db), services);

    let (consensus_public_key, consensus_secret_key) = exonum::crypto::gen_keypair();
    let (service_public_key, service_secret_key) = exonum::crypto::gen_keypair();

    let validator_keys = ValidatorKeys {
        consensus_key: consensus_public_key,
        service_key: service_public_key,
    };

    let genesis = GenesisConfig::new(vec![validator_keys].into_iter());

    let api_address = "0.0.0.0:8000".parse().unwrap();
    let api_cfg = NodeApiConfig {
        public_api_address: Some(api_address),
        ..Default::default()
    };

    let peer_address = "0.0.0.0:2000".parse().unwrap();

    let node_cfg = NodeConfig {
        listen_address: peer_address,
        peers: vec![],
        service_public_key,
        service_secret_key,
        consensus_public_key,
        consensus_secret_key,
        genesis,
        external_address: None,
        network: Default::default(),
        whitelist: Default::default(),
        api: api_cfg,
        mempool: Default::default(),
        services_configs: Default::default(),
    };

    println!("Starting a single node...");
    let node = Node::new(blockchain, node_cfg);

    println!("Blockchain is ready for transactions!");
    node.run().unwrap();
}
