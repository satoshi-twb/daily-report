PROJECT_ID   := daily-report-491906
REGION       := asia-northeast1
SERVICE_NAME := daily-report
REGISTRY     := asia-northeast1-docker.pkg.dev
IMAGE        := $(REGISTRY)/$(PROJECT_ID)/$(SERVICE_NAME)/$(SERVICE_NAME)
TAG          := $(shell git rev-parse --short HEAD)

.PHONY: lint test build push deploy all

## lint: ESLint + Prettier チェック
lint:
	npm run lint

## test: テスト実行
test:
	npm run test

## build: Dockerイメージをビルド
build:
	docker build -t $(IMAGE):$(TAG) -t $(IMAGE):latest .

## push: Artifact Registry へプッシュ
push:
	gcloud auth configure-docker $(REGISTRY) --quiet
	docker push $(IMAGE):$(TAG)
	docker push $(IMAGE):latest

## deploy: Cloud Run へデプロイ
deploy:
	gcloud run deploy $(SERVICE_NAME) \
		--image $(IMAGE):$(TAG) \
		--region $(REGION) \
		--project $(PROJECT_ID) \
		--platform managed \
		--allow-unauthenticated

## all: lint → test → build → push → deploy
all: lint test build push deploy

## help: コマンド一覧を表示
help:
	@grep -E '^## ' Makefile | sed 's/## //'
