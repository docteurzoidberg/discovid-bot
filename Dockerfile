FROM node:16-alpine3.12

# REQUIS POUR LA COMMANDE 'node register' au build
ARG DISCORD_GUILD_ID
ARG DISCORD_CLIENT_ID
ARG BOT_TOKEN

ENV NODE_ENV production
ENV LANG C.UTF-8
ENV EDITOR nano

RUN apk add dumb-init


# APP dir
WORKDIR /discovid

# NODE_MODULES
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install --production

# APP
COPY --chown=node:node . .

 # RUN AS
USER node

# REQUIS: les variables d'environnement DISCORD_GUILD_ID, DISCORD_CLIENT_ID et BOT_TOKEN au build fournis en ARGS!
ENV DISCORD_GUILD_ID $DISCORD_GUILD_ID
ENV DISCORD_CLIENT_ID $DISCORD_CLIENT_ID
ENV BOT_TOKEN $BOT_TOKEN

# REGISTER bot commands
RUN node register

# RUN
CMD ["dumb-init", "node", "index"]

