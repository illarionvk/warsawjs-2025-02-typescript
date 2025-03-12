#!/bin/bash

set -Eeuo pipefail

./devops/symlink-node-modules.sh
./devops/symlink-fish-config.sh

cp -fv ${WORKDIR}/devops/dotfiles/.gitconfig ~/.gitconfig
ln -fsv ${WORKDIR}/devops/starship.toml ~/.config

echo 'Installing npm packages'
pnpm install --quiet

exec "$@"
