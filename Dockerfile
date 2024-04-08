# syntax=docker/dockerfile:1.4

FROM node:lts-buster-slim AS development

# Create app directory
WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json
# COPY package-lock.json /usr/src/app/package-lock.json

RUN npm install --loglevel verbose

COPY --chown=node:node . .

EXPOSE 3001

CMD [ "node", "server.js" ]