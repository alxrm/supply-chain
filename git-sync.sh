#!/usr/bin/env bash

git commit . -m $1;
git checkout bitbucket;
git merge master --allow-unrelated-histories;
git push exonum-blockchain bitbucket;
git checkout master;
git push origin/master;