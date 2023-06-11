FROM node:18.16.0-buster-slim

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install