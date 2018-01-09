#!/usr/bin/env bash

if [ -z "$1" ]; then
    echo 'Usage: ./git-sync-commit.sh <Commit message text here>';
    exit 1;
fi

git commit . -m "$1";
git checkout bitbucket;
git merge master --allow-unrelated-histories;
git push exonum-blockchain bitbucket;
git checkout master;
git push origin master;