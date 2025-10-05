#!/bin/bash

# Exit on first error
set -e

# ========= CONFIG =========
APP_NAME="webaste"
BUILD_ENV=${1:-green}       # pass "staging" or "dev" if needed
IMAGE_TAG=${2:-latest}
DOCKER_USERNAME="dastewasmiu"   # 👈 change this
FULL_IMAGE_NAME="$DOCKER_USERNAME/$APP_NAME:$IMAGE_TAG"
# ==========================

echo "🚀 Building Angular app with configuration: $BUILD_ENV ..."
ng build -c $BUILD_ENV


echo "🐳 Building Docker image: $FULL_IMAGE_NAME ..."
docker build -t $FULL_IMAGE_NAME .

echo "🔑 Logging in to Docker registry..."
docker login

echo "📤 Pushing image to Docker Hub: $FULL_IMAGE_NAME ..."
docker push $FULL_IMAGE_NAME

echo "✅ Done!"
echo "👉 Image pushed: $FULL_IMAGE_NAME"
