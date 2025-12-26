#!/bin/bash
set -eu

: "${AWS_ACCESS_KEY_ID:?AWS_ACCESS_KEY_ID is required}"
: "${AWS_SECRET_ACCESS_KEY:?AWS_SECRET_ACCESS_KEY is required}"
: "${S3_ENDPOINT:?S3_ENDPOINT is required}"
: "${S3_BUCKET:?S3_BUCKET is required}"
: "${S3_FILE:?S3_FILE is required}"

aws --quiet --endpoint-url "${S3_ENDPOINT}" s3 cp "s3://${S3_BUCKET}/${S3_FILE}" ./

rm -rf data/
tar xf "${S3_FILE}"
