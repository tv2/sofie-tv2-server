# Build phase
FROM node:20-alpine as BUILD_PHASE
WORKDIR /opt/sofie-tv2-server
COPY . .
RUN yarn install --check-cache --immutable
RUN yarn build
RUN yarn workspaces focus --production

# Configuration phase
FROM node:20-alpine
WORKDIR /opt/sofie-tv2-server
COPY --from=BUILD_PHASE /opt/sofie-tv2-server/dist/ ./
COPY --from=BUILD_PHASE /opt/sofie-tv2-server/node_modules/ ./node_modules/

CMD node .
