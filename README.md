# lots_management

## 認証・ユーザー管理の前提

本アプリのログイン/権限管理では Supabase Auth と `user_profiles` テーブルを利用します。

```sql
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'user')) default 'user'
);
```

- `admin` ユーザーのみ `/admin/users` にアクセス可能です。
- それ以外のログイン済みユーザーは通常機能（在庫/入出庫/マスタ）を利用できます。
