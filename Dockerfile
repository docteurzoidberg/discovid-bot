FROM node:16-alpine3.12
RUN apk add dumb-init

ENV NODE_ENV production
ENV LANG C.UTF-8
ENV EDITOR nano

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
CMD ["dumb-init", "node", "index"]

