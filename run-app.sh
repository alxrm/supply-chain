#!/usr/bin/env bash

pkill -9 supply-chain;
supply-chain run -c config/node_config.toml -d db