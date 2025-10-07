# syntax=docker/dockerfile:1.7

FROM node:20.19.2-bookworm-slim AS builder
WORKDIR /app

# npm キャッシュは専用領域に（最終イメージには残らない）
RUN --mount=type=cache,target=/root/.npm true

# ソースは bind mount で持ち込む（COPY しない）
# out を tmpfs に作って、結果だけ残す
RUN --mount=type=bind,source=.,target=/src,ro \
    --mount=type=cache,target=/root/.npm \
    --mount=type=cache,target=/src/node_modules \
    --mount=type=tmpfs,target=/src/.next \
    --mount=type=tmpfs,target=/out \
    bash -lc '\
      cd /src && \
      npm ci --prefer-offline --no-audit --progress=false && \
      npm run build && \
      # "next export" の出力先を /out に直で出す（/src/out を作らない）
      npm run export -- -o /out'

FROM debian:12.11-slim AS compressor
RUN apt-get update && apt-get install -y zopfli findutils \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /compressed
# ここでは builder の /out だけを受け取る（ソースの巨大レイヤーは存在しない）
COPY --from=builder /out .

# 圧縮と元ファイル削除を同一レイヤーで実行して、二重保存を防ぐ
RUN bash -lc '\
  find . -type f \( -name "*.js" -o -name "*.css" -o -name "*.json" -o -name "*.svg" \) -print0 \
    | xargs -0 -n1 -P"$(nproc)" zopfli --i15 && \
  find . -name "*.gz" -print0 \
    | while IFS= read -r -d "" gz; do rm -f "${gz%.gz}"; done'

FROM nginx:1.29.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=compressor /compressed /usr/share/nginx/html
