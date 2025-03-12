#!/bin/bash

set -Eeuo pipefail

echo 'Compiling Typescript files with swc'

swc --quiet --copy-files --include-dotfiles \
  --config-file devops/tests.swcrc \
  --delete-dir-on-start \
  --strip-leading-paths \
  --out-dir test-out src

./devops/predevops.sh
