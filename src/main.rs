extern crate exonum;
extern crate exonum_configuration;
extern crate supply_chain;

use exonum::helpers;
use exonum::helpers::fabric::NodeBuilder;
use exonum_configuration::ConfigurationService;
use supply_chain::service::SupplyChainService;

fn main() {
    exonum::crypto::init();
    helpers::init_logger().unwrap();

    let node = NodeBuilder::new()
        .with_service(Box::new(ConfigurationService::new()))
        .with_service(Box::new(SupplyChainService::new()));
    node.run();
}
