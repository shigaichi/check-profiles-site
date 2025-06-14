#!/bin/bash
set -eu

DOCKER_PASS="${DOCKER_PASS}"
DOCKER_ID="${DOCKER_ID}"
BUILD_TAG="${BUILD_TAG}"

IMAGE_NAME="${DOCKER_ID}/check-profiles-site:${BUILD_TAG}"

docker build --build-arg NUM_PROCS=1 -t "${IMAGE_NAME}" .

echo "${DOCKER_PASS}" | docker login -u "${DOCKER_ID}" --password-stdin

docker push "${IMAGE_NAME}"

docker image rm "${IMAGE_NAME}"
docker system prune -f
