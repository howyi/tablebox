# 起動方法
## 必須
- [volta](https://docs.volta.sh/guide/getting-started)
- [docker](https://www.docker.com/get-started/)

## 事前準備
```bash
npm install
```

## 起動
```bash
npm run dev
```
ページは
- http://localhost:3000
- https://localhost:3001  
にホスティングされます。  
認証サービスはリダイレクトにSSLが必須であることが多いため、基本的にはhttpsのURLで確認するのをおすすめします。 

`localhost:3326` にMySQLがホスティングされます。  
ユーザは `root/root` です

# 手順
## テーブル定義の更新方法
- [./app/_db/schema.ts](./app/_db/schema.ts)を編集  
※書き方は以下を参照  
https://orm.drizzle.team/docs/sql-schema-declaration/
- `npm run db:push` でスキーマ変更をenvで指定しているDBへ反映


# 資料
- フレームワーク\ https://nextjs.org/docs
- 認証周り https://next-auth.js.org/getting-started/introduction
- ORM https://orm.drizzle.team/docs/overview/
