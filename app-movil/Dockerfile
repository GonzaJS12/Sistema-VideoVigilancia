FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache git bash

COPY package.json package-lock.json* ./
RUN npm ci || npm install

COPY . .

EXPOSE 8081

ENV EXPO_NO_TELEMETRY=1 \
    CI=0

CMD ["npx", "expo", "start", "--host", "lan", "--port", "8081"]
