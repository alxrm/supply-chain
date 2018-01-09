#!/usr/bin/env bash

IFS= read -r -p "Enter commit message: " message

git commit . -m "$message";
git checkout bitbucket;
git merge master --allow-unrelated-histories;
git push exonum-blockchain bitbucket;
git checkout master;
git push origin master;