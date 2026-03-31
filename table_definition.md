# テーブル定義 — 営業日報システム

## テーブル一覧

| テーブル名 | 説明 |
|------------|------|
| users | ユーザーマスタ（営業担当者・上長） |
| customers | 顧客マスタ |
| daily_reports | 日報 |
| visit_records | 訪問記録 |
| comments | コメント |

---

## カラム定義

### users（ユーザーマスタ）

| カラム名 | 型 | 必須 | 備考 |
|----------|----|------|------|
| id | int | ○ | PK、自動採番 |
| name | string | ○ | 氏名 |
| email | string | ○ | メールアドレス、ユニーク |
| password_hash | string | ○ | ハッシュ化されたパスワード |
| role | enum | ○ | salesperson / manager |
| created_at | timestamp | ○ | 作成日時 |
| updated_at | timestamp | ○ | 更新日時 |

### customers（顧客マスタ）

| カラム名 | 型 | 必須 | 備考 |
|----------|----|------|------|
| id | int | ○ | PK、自動採番 |
| company_name | string | ○ | 会社名 |
| contact_name | string | ○ | 担当者名 |
| phone | string | - | 電話番号 |
| address | string | - | 住所 |
| created_at | timestamp | ○ | 作成日時 |
| updated_at | timestamp | ○ | 更新日時 |

### daily_reports（日報）

| カラム名 | 型 | 必須 | 備考 |
|----------|----|------|------|
| id | int | ○ | PK、自動採番 |
| user_id | int | ○ | FK → users.id |
| report_date | date | ○ | 報告日、user_id との組み合わせでユニーク |
| problem | text | - | 課題・相談 |
| plan | text | - | 明日やること |
| created_at | timestamp | ○ | 作成日時 |
| updated_at | timestamp | ○ | 更新日時 |

### visit_records（訪問記録）

| カラム名 | 型 | 必須 | 備考 |
|----------|----|------|------|
| id | int | ○ | PK、自動採番 |
| daily_report_id | int | ○ | FK → daily_reports.id |
| customer_id | int | ○ | FK → customers.id |
| content | text | ○ | 訪問内容 |
| visited_at | time | ○ | 訪問時刻 |
| created_at | timestamp | ○ | 作成日時 |
| updated_at | timestamp | ○ | 更新日時 |

### comments（コメント）

| カラム名 | 型 | 必須 | 備考 |
|----------|----|------|------|
| id | int | ○ | PK、自動採番 |
| daily_report_id | int | ○ | FK → daily_reports.id |
| user_id | int | ○ | FK → users.id（上長） |
| content | text | ○ | コメント内容 |
| created_at | timestamp | ○ | 作成日時 |
| updated_at | timestamp | ○ | 更新日時 |
