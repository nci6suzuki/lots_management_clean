# lots_management

## 認証・ユーザー管理

Supabase Auth + `public.user_profiles` で認証/権限管理します。

### 1. マイグレーションを実行
以下のSQLを実行してください。

- `supabase/migrations/202602070001_auth_user_profiles.sql`

このマイグレーションで次を作成します。

- `public.user_profiles` テーブル（`role: admin | user`）
- `updated_at` 更新トリガー
- `auth.users` 作成時に `user_profiles` を自動生成するトリガー
- 既存 `auth.users` のバックフィル
- `user_profiles` のRLSポリシー

### 2. 最初の管理者を1名設定
初回のみ、SQLエディタで管理者にしたいユーザーへ `admin` を付与してください。

```sql
update public.user_profiles
set role = 'admin'
where id = 'YOUR_AUTH_USER_UUID';
```

> `YOUR_AUTH_USER_UUID` は Supabase の `auth.users.id` を指定します。

### 3. アプリ動作
- 未ログイン状態で `/login` 以外へアクセスするとログイン画面へリダイレクトされます。
- `admin` のみ `/admin/users` にアクセスできます。
- `user` は通常の在庫管理機能を利用できます。


### 4. `/admin/users` に入れないとき
- ログイン済みでも `user_profiles.role` が `user` のままだと管理画面は使えません。
- 現在ログイン中ユーザーのID（UUID）を使って、SQL Editorで以下を実行してください。

```sql
update public.user_profiles
set role = 'admin'
where id = 'YOUR_AUTH_USER_UUID';
```

確認SQL:

```sql
select u.id, u.email, p.role
from auth.users u
left join public.user_profiles p on p.id = u.id
order by u.created_at desc;
```