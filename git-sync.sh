#!/usr/bin/env bash

git checkout bitbucket;
git merge master --allow-unrelated-histories;
git push exonum-blockchain bitbucket;