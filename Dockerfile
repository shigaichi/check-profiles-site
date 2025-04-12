FROM node:20.19.2-bookworm-slim AS builder

WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY next.config.js ./
COPY next-i18next.config.js ./
RUN npm install
COPY . .
RUN npm run build && npm run export

FROM debian:12.11-slim AS compressor

ARG NUM_PROCS
ENV NUM_PROCS=${NUM_PROCS:-$(nproc)}

RUN apt-get update && apt-get install -y zopfli findutils \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /compressed
COPY --from=builder /app/out .

RUN find . -type f \( -name '*.js' -o -name '*.css' -o -name '*.json' -o -name '*.svg' \) \
    -print0 | xargs -0 -n1 -P"${NUM_PROCS}" zopfli --i15

RUN find . -name '*.gz' | while read gzfile; do \
  origfile="${gzfile%.gz}"; \
  [ -f "$origfile" ] && rm "$origfile"; \
done

FROM nginx:1.27.5-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=compressor /compressed /usr/share/nginx/html
