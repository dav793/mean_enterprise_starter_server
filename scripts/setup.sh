#!/usr/bin/env bash
cd "$(dirname "$0")"    # use script's location as working directory

#
# execute first-time setup procedures
#
# example:
#   /> ./setup.sh
#

# create config file from template
cp ../config/config.template.json ../config/config.json

# setup initial DB state
./setupDb.sh -h localhost -d mean-enterprise-starter -u root -p example
