#!/bin/env bash

# This fetches the data used in the nix build since it does not have access to the internet

source .env

curl \
    --header "Content-Type:application/json" \
    --header "Authorization:Token $PRETIX_TOKEN" \
    --header "Accept:application/json" \
    -X GET \
    https://pretix.eu/api/v1/organizers/nixcon/events/2023/items/ \
    -o data/tickets.json

curl \
    --header "Content-Type:application/json" \
    --header "Accept:application/json" \
    -X GET \
    https://talks.nixcon.org/api/events/nixcon-2022/talks/ \
    -o data/schedule.json
    