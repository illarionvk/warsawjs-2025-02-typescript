#### MAIN
FROM ruby:3.1.6-bookworm AS main

ENV NODE_ENV=development \
    SHELL=/bin/bash \
    TMP_DIR=/mnt/tmp \
    WORKDIR=/app

RUN echo "Installing node" \
  && NODE_VERSION='22.13.0' \
  && ARCH= && dpkgArch="$(dpkg --print-architecture)" \
  && case "${dpkgArch##*-}" in \
    amd64) ARCH='x64';; \
    arm64) ARCH='arm64';; \
    *) echo "unsupported architecture"; exit 1 ;; \
  esac \
  # use pre-existing gpg directory, see https://github.com/nodejs/docker-node/pull/1895#issuecomment-1550389150
  && export GNUPGHOME="$(mktemp -d)" \
  # gpg keys listed at https://github.com/nodejs/node#release-keys
  && set -ex \
  && for key in \
    C0D6248439F1D5604AAFFB4021D900FFDB233756 \
    DD792F5973C6DE52C432CBDAC77ABFA00DDBF2B7 \
    CC68F5A3106FF448322E48ED27F5E38D5B0A215F \
    8FCCA13FEF1D0C2E91008E09770F7A9A5AE15600 \
    890C08DB8579162FEE0DF9DB8BEAB4DFCF555EF4 \
    C82FA3AE1CBEDC6BE46B9360C43CEC45C17AB93C \
    108F52B48DB57BB0CC439B2997B01419BD92F80A \
    A363A499291CBBC940DD62E41F10027AF002F8B0 \
  ; do \
      gpg --batch --keyserver hkps://keys.openpgp.org --recv-keys "$key" || \
      gpg --batch --keyserver keyserver.ubuntu.com --recv-keys "$key" ; \
  done \
  && curl -fsSLO --compressed "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-$ARCH.tar.xz" \
  && curl -fsSLO --compressed "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \
  && gpg --batch --decrypt --output SHASUMS256.txt SHASUMS256.txt.asc \
  && gpgconf --kill all \
  && rm -rf "$GNUPGHOME" \
  && grep " node-v$NODE_VERSION-linux-$ARCH.tar.xz\$" SHASUMS256.txt | sha256sum -c - \
  && tar -xJf "node-v$NODE_VERSION-linux-$ARCH.tar.xz" -C /usr/local --strip-components=1 --no-same-owner \
  && rm "node-v$NODE_VERSION-linux-$ARCH.tar.xz" SHASUMS256.txt.asc SHASUMS256.txt \
  && ln -s /usr/local/bin/node /usr/local/bin/nodejs \
  # smoke tests
  && node --version \
  && npm --version \
  && echo 'Done'

RUN echo 'Installing build dependencies' \
    && set -ex \
    && FISH_VERSION='3.7.1-1' \
    && (echo 'deb http://download.opensuse.org/repositories/shells:/fish:/release:/3/Debian_12/ /' \
        | tee /etc/apt/sources.list.d/shells:fish:release:3.list) \
    && (curl -fsSL https://download.opensuse.org/repositories/shells:fish:release:3/Debian_12/Release.key \
        | gpg --dearmor \
        | tee /etc/apt/trusted.gpg.d/shells_fish_release_3.gpg > /dev/null) \
    && apt-get update \
    && apt-get --assume-yes --no-install-recommends install \
        fd-find \
        fish="${FISH_VERSION}" \
        parallel \
        tini \
    && echo 'Cleaning up' \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /var/cache/apt \
    && echo 'DONE'

ENV PATH="${WORKDIR}/bin:${WORKDIR}/node_modules/.bin:${PATH}"

WORKDIR ${WORKDIR}

ENV npm_config_cache="${TMP_DIR}/npm-cache" \
    npm_config_store_dir="${TMP_DIR}/pnpm-store"

RUN echo "Installing pnpm" \
    && PNPM_VERSION='10.5.2' \
    && npm install -g "pnpm@${PNPM_VERSION}"

RUN echo "Installing development tools" \
    && echo "===================" \
    && echo "Installing babashka" \
    && BABASHKA_VERSION='1.3.190' \
    && ARCH= && dpkgArch="$(dpkg --print-architecture)" \
    && case "${dpkgArch##*-}" in \
      amd64) ARCH='amd64';; \
      arm64) ARCH='aarch64';; \
      *) echo "unsupported architecture -- ${dpkgArch##*-}"; exit 1 ;; \
    esac \
    && set -ex \
    && cd $TMP_DIR \
    && curl -fsSL --compressed --output bb.tar.gz \
      "https://github.com/babashka/babashka/releases/download/v${BABASHKA_VERSION}/babashka-${BABASHKA_VERSION}-linux-${ARCH}-static.tar.gz" \
    && curl -fsSL --output bb.tar.gz.sha256 \
      "https://github.com/babashka/babashka/releases/download/v${BABASHKA_VERSION}/babashka-${BABASHKA_VERSION}-linux-${ARCH}-static.tar.gz.sha256" \
    && echo "$(cat bb.tar.gz.sha256) bb.tar.gz" | sha256sum --check --status \
    && tar -xf ./bb.tar.gz \
    && cp -fv bb /usr/local/bin \
    && chmod +x /usr/local/bin/bb \
    && echo "Cleaning up" \
    && rm -rf ./bb* \
    && echo '==============================' \
    && echo 'Installing Starship prompt' \
    && STARSHIP_VERSION='1.22.1' \
    && ARCH= && dpkgArch="$(dpkg --print-architecture)" \
    && case "${dpkgArch##*-}" in \
      amd64) ARCH='x86_64';; \
      arm64) ARCH='aarch64';; \
      *) echo "unsupported architecture -- ${dpkgArch##*-}"; exit 1 ;; \
    esac \
    && set -ex \
    && cd $TMP_DIR \
    && curl -fsSL --compressed --output starship.tar.gz \
      "https://github.com/starship/starship/releases/download/v${STARSHIP_VERSION}/starship-${ARCH}-unknown-linux-musl.tar.gz" \
    && curl -fsSL --output starship.tar.gz.sha256 \
      "https://github.com/starship/starship/releases/download/v${STARSHIP_VERSION}/starship-${ARCH}-unknown-linux-musl.tar.gz.sha256" \
    && echo "$(cat starship.tar.gz.sha256) starship.tar.gz" | sha256sum --check --status \
    && tar -xf ./starship.tar.gz \
    && cp -fv starship /usr/local/bin \
    && chmod +x /usr/local/bin/starship \
    && echo "Cleaning up" \
    && rm -rf ./starship* \
    && echo "Smoke test" \
    && starship --version \
    && echo 'DONE'

ARG GROUP_ID=1000
ARG USER_ID=1000

RUN echo 'Creating "node" user' \
    && groupadd --gid $GROUP_ID node \
    && useradd --uid $USER_ID --gid node --shell /bin/bash --create-home node \
    && echo '==============================' \
    && echo 'Configuring folder permissions' \
    && if [ ! -d "$TMP_DIR" ] ; then mkdir "$TMP_DIR" ; fi \
    && chown -R node:node ${TMP_DIR} ${WORKDIR} \
    && mkdir /home/node/.cache \
    && chown -R node:node /home/node/.cache \
    && mkdir /home/node/.config \
    && chown -R node:node /home/node/.config \
    && echo 'DONE'

#### DEVELOPMENT
FROM main AS development

USER node

RUN echo 'Customizing shell prompt' \
    && printf '\nexport PS1="[DOCKER]:\u@\h:\w\\$ "\n' >> ~/.bashrc \
    && echo 'Done'

ENTRYPOINT ["tini", "-sg", "--"]
