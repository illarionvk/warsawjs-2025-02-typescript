#!/bin/bash

set -Eeuo pipefail

echo 'Prettifying files'

root=${1:-$(pwd)}

fdfind -t file --print0 \
  -e graphql -e gql -e scss \
  . "${root}" \
  | parallel --halt='soon,fail=20%' -0 --xargs --max-args=20 --jobs='100%' 'prettier --write --loglevel=warn {}'

biome format --write "${root}"
