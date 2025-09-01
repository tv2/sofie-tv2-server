# Build phase
FROM node:22.6-alpine as BUILD_PHASE
WORKDIR /opt/alba-tv2-server
COPY . .
RUN apk add --no-cache build-base harfbuzz-dev
RUN yarn install --check-cache --immutable
RUN yarn build
RUN yarn workspaces focus --production

# Configuration phase
FROM node:22.6-alpine
WORKDIR /opt/alba-tv2-server
COPY --from=BUILD_PHASE /opt/alba-tv2-server/package.json ./
COPY --from=BUILD_PHASE /opt/alba-tv2-server/dist/ ./
COPY --from=BUILD_PHASE /opt/alba-tv2-server/node_modules/ ./node_modules/
RUN ln -s data-access/migrations/mongo/mongo-migrations

EXPOSE 3010

CMD node .
