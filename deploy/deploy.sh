#!/usr/bin/env bash
# Build the site and publish it to S3, then invalidate the CloudFront cache.
#
# Required:
#   CLOUDFRONT_DISTRIBUTION_ID  ID of the CloudFront distribution serving the site
#
# Optional:
#   S3_BUCKET     Bucket that serves the site (default: oliver.snell.me)
#   AWS_PROFILE   AWS CLI profile to use (default: the CLI's default profile)
#
# Example:
#   CLOUDFRONT_DISTRIBUTION_ID=E123ABC456 AWS_PROFILE=site npm run deploy

set -euo pipefail

cd "$(dirname "$0")/.."

S3_BUCKET="${S3_BUCKET:-oliver.snell.me}"

if [[ -z "${CLOUDFRONT_DISTRIBUTION_ID:-}" ]]; then
  echo "error: CLOUDFRONT_DISTRIBUTION_ID is not set" >&2
  exit 1
fi

echo "==> Building site"
npx hexo clean
npx hexo generate

# No --delete: the bucket also holds files this repo doesn't build
# (resume PDFs, projects/league-ladder/), so the sync only adds and updates.
echo "==> Syncing public/ to s3://${S3_BUCKET}"
aws s3 sync public/ "s3://${S3_BUCKET}" --profile "${AWS_PROFILE:-default}"

echo "==> Invalidating CloudFront distribution ${CLOUDFRONT_DISTRIBUTION_ID}"
aws cloudfront create-invalidation \
  --distribution-id "${CLOUDFRONT_DISTRIBUTION_ID}" \
  --paths "/*" \
  --query 'Invalidation.{Id:Id,Status:Status}' \
  --output table

echo "==> Deployed"
