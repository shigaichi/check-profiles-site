FROM node:20.19.2-bookworm-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm run export && rm -rf data/

FROM debian:12.12-slim AS compressor

RUN apt-get update && apt-get install -y zopfli findutils \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /compressed
COPY --from=builder /app/out .

RUN bash -c 'find . -type f \( -name "*.js" -o -name "*.css" -o -name "*.svg" \) -print0 \
  | xargs -0 -n1 -P"$(nproc)" zopfli --i15 && \
  find . -name "*.gz" -print0 \
  | while IFS= read -r -d "" gzfile; do \
      origfile="${gzfile%.gz}"; \
      [ -f "$origfile" ] && rm -f "$origfile"; \
    done'

FROM nginx:1.29.2-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=compressor /compressed /usr/share/nginx/html
