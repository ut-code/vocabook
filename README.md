# 駒場祭までにユーザー数1000人!

## コマンドについて

```bash
npm run dev # 開発モードでプロジェクトを実行（これで動作等を確認する）
```
基本的に、localhost:3000 が開くはず
```bash
npm ci # ciとはclean installの略, package-lock.jsonの内容を基にパッケージ（再利用可能なプログラムのまとまりのこと）をインストール
```
（なお、インストール内容について、もし手動編集をする場合、package.jsonの方を編集し、package-lock.jsonは編集しないこと）
```bash
cp .env.example .env # .env.exampleの内容をコピーして自分用の.envを作成する
```
（`.env`ファイルは秘密情報を含みうるため`.gitignore`でGit管理から除外されている。`.env.example`はGit管理されているのでcloneすれば手元にあるはずだが、無ければ手動で作成すること）
```bash
npx prisma migrate dev # マイグレーション履歴（prisma/migrations）を基に、自分のローカル環境にDB（prisma/dev.db）を作成・更新する
```
（`prisma/dev.db`はSQLiteのDB実体ファイルで、複数人が同じファイルをGit管理すると変更が衝突して壊れるため`.gitignore`で除外されている。そのため各自が上記コマンドでローカルに作成する。他の人がスキーマ（`prisma/schema.prisma`）を変更してマイグレーションファイルを追加した場合、`git pull`した後に再度このコマンドを実行して自分のDBにも変更を反映すること）
```bash
git clone git@github.com:アカウント名/リポジトリ名.git # リモートリポジトリの内容を、自身のローカルリポジトリにクローンする
```
```bash
git pull origin main
# 自分のリポジトリにリモートリポジトリのmainブランチの変更（他の人が施したものなど）を取り込む
# git fetch（最新情報の取得）とgit merge（手元のデータへの統合）の2つの処理を同時に実行している
```
```bash
git branch # 現在いるブランチを確認 
```
```bash
git switch ブランチ名 # ブランチを切り替える
```
```bash
git switch -c ブランチ名 # ブランチを新たに作成する
```
```bash
rm -rf リポジトリ名
# リポジトリを強制削除する
# どうしてもうまくいかなかったときは、一旦ローカルリポジトリを削除して再びクローンしてもよい（多分正攻法ではない）
```
## プロジェクト構成の大枠
- layout.tsx
  - 共通するレイアウトのレンダリングを担っている
  - {children}の中に各コンポーネントのレンダリングが集約されているイメージ
  - サブディレクトリ内部にあるレイアウトは、外部のレイアウトを継承する
- page.tsx
  - 各URLにおけるページ本体の中身をレンダリングする
  - 複数箇所あって戸惑うかもしれないが、それぞれの場所に応じてどのページをレンダリングしているのかが異なっている
- page.mdx
  - マークダウン記法の中にreactの記法を埋め込むことができるファイル
  - page.tsxのようにページ本体の中身をレンダリングすることができる（理由は「Next.js, App Routerルーティング規則, 2. 特殊ファイル（予約名）」を参照すればわかる）
- globals.css
  - プロジェクト全体のCSSを定めている
- componentsディレクトリ
  - 画面の見た目（UI）を扱う共通コンポーネントを配置
- libディレクトリ
  - 内部の計算や外部接続などの仕組み（ロジック）を扱う共通処理関数を配置
- learnディレクトリ
  - 学習教材の部分
- my-notebooksディレクトリ
  - My単語帳を担うディレクトリ
- generatedディレクトリ
  - prismaによって自動生成されたディレクトリ
- prismaディレクトリ
  - Node.jsおよびTypeScript向けORMツールであるprismaを管理するディレクトリ
    - ORM（オブジェクト関係マッピング）: SQLを書かずにデータを操作する技術
## Next.jsについて
Next.jsとは、reactベースのWebアプリケーションフレームワークで、主に以下の2つの特徴がある。
- App Router： ディレクトリを使って画面の切り替えを行い、アプリを設計する機能
- Server Side Rendering（SSR）: サーバー側でHTMLを作ってから表示する機能

### App Routerルーティング規則
App Routerのルーティングは、次の2つの軸で成り立っている。

- **フォルダ** … 階層がそのまま URL のパスになる
- **ファイル名** … 予約された名前ごとに役割が決まる（`page`, `layout` など）

(`app/`の外にあるフォルダ（`components/` など）はURLとは一切関係しない。)

```
プロジェクト/
├── app/                 ← URLを生む
│   ├── layout.tsx
│   ├── page.tsx
│   ├── my-notebooks/
│   |   └── page.tsx
│   └── learn/
│       └── [language]/
│           └── page.tsx
├── components/          ← URLと無関係
├── languages.ts
└── content.ts
```

#### 1. フォルダ = URL、ファイル名 = 役割

フォルダの階層がそのままURLになる。ただし中に`page`ファイルが必要

| フォルダ構造 | 対応するURL |
|---|---|
| `app/page.tsx` | `/` |
| `app/learn/page.tsx` | `/learn` |
| `app/learn/[language]/page.tsx` | `/learn/english` など |
| `app/learn/[language]/[section]/page.tsx` | `/learn/english/grammar` など |

#### 2. 特殊ファイル（予約名）
ファイル名によってApp Routerにおける役割が変わる
拡張子`.tsx`/`.jsx`/`.js`（`page`は`.mdx`も可）は選べる
| ファイル名 | 役割 |
|---|---|
| `page` | そのルートの UI 本体。**これがないとアクセス不可** |
| `layout` | その階層以下で共有される枠。上位から入れ子に継承される |
| `loading` | ロード中の UI（内部でReact Suspense利用） |
| `error` | エラー時の UI（Error Boundary） |
| `not-found` | 404 の UI |
| `route` | API エンドポイント。`page`とは同じ階層に共存できない |
| `template` | 再マウントされる点以外は`layout`に近い |
それ以外のファイル（.tsなど）は「非公開ファイル（Colocation）」になり、そのフォルダ専用のコンポーネントやデータ処理関数を配置するのが一般的

##### layoutについて

- 各階層の`layout`は**任意**。`page`だけでもページは動く。
- ただし **`app/layout.tsx`（ルートレイアウト）だけは必須**。`<html>`と`<body>`を含み、アプリ全体の土台になる。
- レイアウトは上位階層から **自動的に継承**される。ある階層に`layout`が無くても、上位のレイアウトに包まれて表示される。

#### 3. 動的ルート（角括弧の記法）

URL の一部が可変になる部分は角括弧
| 記法 | 名称 | マッチ例 | params の中身 |
|---|---|---|---|
| `[folder]` | 動的セグメント | `/learn/english` | `{ language: "english" }` |
| `[...folder]` | catch-all | `/shop/a/b` | `{ slug: ["a", "b"] }`（配列） |
| `[[...folder]]` | optional catch-all | `/shop` も含む | セグメント無しにもマッチ |

#### 4. page.tsxのコンポーネントが受け取る引数

`page.tsx`のデフォルトエクスポート関数は Next.js から**`params`と`searchParams`を自動的に受け取る。

| 引数 | 中身 | 例 |
|---|---|---|
| `params` | 動的セグメント `[...]` | `/learn/english` → `{ language: "english" }` |
| `searchParams` | クエリ文字列 `?...` | `?level=beginner` → `{ level: "beginner" }` |

### サーバーサイドレンダリング
- 原則、ルーティング規則に含まれるものはデフォルトでSSRが適用される
- 'use client'は、「クライアントコンポーネント」を宣言するディレクティブであり、ファイルの一番上にこれを記述すると、useStateやuseEffectなどのReactフックが使えるようになる（この場合でもSSR自体は適用されるので、誤解しないよう注意）

