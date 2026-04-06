PROJECT_ID      := daily-report-491906
REGION          := asia-northeast1
SERVICE_NAME    := daily-report
REGISTRY        := asia-northeast1-docker.pkg.dev
CLOUDSQL_INSTANCE := daily-report-db
IMAGE           := $(REGISTRY)/$(PROJECT_ID)/$(SERVICE_NAME)/$(SERVICE_NAME)
TAG             := $(shell git rev-parse --short HEAD)

.PHONY: lint test build push deploy migrate seed proxy all help

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
		--image=$(IMAGE):$(TAG) \
		--region=$(REGION) \
		--project=$(PROJECT_ID) \
		--platform=managed \
		--allow-unauthenticated \
		--add-cloudsql-instances=$(PROJECT_ID):$(REGION):$(CLOUDSQL_INSTANCE) \
		--set-secrets=DATABASE_URL=daily-report-database-url:latest,NEXTAUTH_SECRET=daily-report-nextauth-secret:latest \
		--memory=512Mi \
		--cpu=1 \
		--min-instances=0 \
		--max-instances=10

## proxy: Cloud SQL Auth Proxy を起動（ローカル開発用）
## 事前に cloud-sql-proxy のインストールが必要:
##   https://cloud.google.com/sql/docs/postgres/connect-instance-auth-proxy
proxy:
	cloud-sql-proxy $(PROJECT_ID):$(REGION):$(CLOUDSQL_INSTANCE) --port=5432

## migrate: Cloud SQL に対してマイグレーションを実行（proxy 起動中に実行）
migrate:
	npx prisma migrate deploy --config prisma/config.ts

## seed: Cloud SQL にシードデータを投入（proxy 起動中に実行）
seed:
	npx prisma db seed --config prisma/config.ts

## all: lint → test → build → push → deploy
all: lint test build push deploy

## help: コマンド一覧を表示
help:
	@grep -E '^## ' Makefile | sed 's/## //'
