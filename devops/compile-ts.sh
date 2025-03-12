#!/bin/bash

set -Eeuo pipefail

project_root=$(dirname $(dirname $(realpath $0)))

echo 'Compiling Typescript files with swc'

cd "${project_root}"

swc --quiet --copy-files --include-dotfiles \
  --config-file ./main.swcrc \
  --strip-leading-paths \
  --out-dir dist src

./devops/predevops.sh

echo 'Typescript files compiled'
