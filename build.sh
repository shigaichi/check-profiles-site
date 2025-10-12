#!/bin/bash
set -eu

DOCKER_PASS="${DOCKER_PASS}"
DOCKER_ID="${DOCKER_ID}"
BUILD_TAG="${BUILD_TAG}"

IMAGE_NAME="${DOCKER_ID}/check-profiles-site:${BUILD_TAG}"

echo "${DOCKER_PASS}" | docker login -u "${DOCKER_ID}" --password-stdin

docker buildx inspect check-profile-builder >/dev/null 2>&1 || docker buildx create --name check-profile-builder --use

docker buildx build -t "${IMAGE_NAME}" --output type=registry,force-compression=true,compression=zstd --cache-to=type=local,dest=docker_cache .

docker buildx prune -af --max-used-space 1gb
