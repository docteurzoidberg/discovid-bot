FROM node:16-alpine3.12
RUN apk add dumb-init

ARG DISCORD_GUILD_ID
ARG DISCORD_CLIENT_ID
ARG BOT_TOKEN

ENV DISCORD_GUILD_ID $DISCORD_GUILD_ID
ENV DISCORD_CLIENT_ID $DISCORD_CLIENT_ID
ENV BOT_TOKEN $BOT_TOKEN

ENV NODE_ENV production
ENV LANG C.UTF-8
ENV EDITOR nano
ENV DATA_PATH /data

RUN mkdir -p /data
RUN chown -R node:node /data
# Create app directory
WORKDIR /discovid

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY yarn.lock ./

RUN yarn install --production

# Bundle app source
COPY --chown=node:node . .

USER node

RUN node register

CMD ["dumb-init", "node", "index"]

