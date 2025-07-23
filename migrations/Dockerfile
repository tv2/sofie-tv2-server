FROM node:22.6-alpine
WORKDIR /app
COPY . .

RUN corepack enable
RUN yarn --immutable
RUN yarn cache clean --all
CMD ["yarn", "migrate"]
