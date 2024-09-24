from node:18

RUN apt -y update && \
    apt -y install rpm

RUN mkdir /build

WORKDIR /build

COPY . .

RUN npm run all:install

RUN npm rebuild --ignore-scripts=false --foreground-scripts --verbose sharp

RUN npx nx run open-lens:build:app --x64 --arm64
