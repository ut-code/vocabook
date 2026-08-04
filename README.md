## コマンドについて

```bash
npm run dev # 開発モードでプロジェクトを実行（これで動作等を確認する）
```
基本的に、localhost:3000が開くはず
```bash
npm ci # ciとはclean installの略, package-lock.jsonの内容を基にパッケージ（再利用可能なプログラムのまとまりのこと）をインストール
```
（なお、インストール内容について、もし手動編集をする場合、package.jsonの方を編集し、package-lock.jsonは編集しないこと）

## プロジェクト構成の大枠
- layout.tsx
  - 共通するレイアウトのレンダリングを担っている
  - {children}の中に各コンポーネントのレンダリングが集約されているイメージ
  - サブディレクトリ内部にあ
- page.tsx
  - 各URLにおけるページ本体の中身をレンダリングする
  - 複数箇所あって戸惑うかもしれないが、それぞれの場所に応じてどのページをレンダリングしているのかが異なっている
- page.mdx
  - マークダウン記法の中にreactの記法を埋め込むことができるファイル
  - page.tsxのようにページ本体の中身をレンダリングすることができる（理由は「Next.js App Router ルーティング規則, 2. 特殊ファイル（予約名）」を参照すればわかる）
- globals.css
  - プロジェクト全体のCSSを定めている
- componentsディレクトリ
  - ヘッダーやフッターなど、使いまわしがききやすい部品を管理するためのディレクトリ
- learnディレクトリ
  - 学習教材の部分
- my-notebooks
  - My単語帳を担うディレクトリ

## Next.js App Router ルーティング規則

App Router のルーティングは、次の2つの軸で成り立っている。

- **フォルダ** … 階層がそのまま URL のパスになる
- **ファイル名** … 予約された名前ごとに役割が決まる（`page`, `layout` など）

(`app/` の外にあるフォルダ（`components/` など）は URL とは一切関係しない。)

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

### 1. フォルダ = URL、ファイル名 = 役割

フォルダの階層がそのまま URL になる。ただし中に `page` ファイルが必要

| フォルダ構造 | 対応するURL |
|---|---|
| `app/page.tsx` | `/` |
| `app/learn/page.tsx` | `/learn` |
| `app/learn/[language]/page.tsx` | `/learn/english` など |
| `app/learn/[language]/[section]/page.tsx` | `/learn/english/grammar` など |

### 2. 特殊ファイル（予約名）
ファイル名によってApp Routerにおける役割が変わる
拡張子 `.tsx` / `.jsx` / `.js`（`page` は `.mdx` も可）は選べる
| ファイル名 | 役割 |
|---|---|
| `page` | そのルートの UI 本体。**これがないとアクセス不可** |
| `layout` | その階層以下で共有される枠。上位から入れ子に継承される |
| `loading` | ロード中の UI（内部で React Suspense を利用） |
| `error` | エラー時の UI（Error Boundary） |
| `not-found` | 404 の UI |
| `route` | API エンドポイント。`page` とは同じ階層に共存できない |
| `template` | 再マウントされる点以外は `layout` に近い |

#### layout について

- 各階層の `layout` は **任意**。`page` だけでもページは動く。
- ただし **`app/layout.tsx`（ルートレイアウト）だけは必須**。`<html>` と `<body>` を含み、アプリ全体の土台になる。
- レイアウトは上位階層から **自動的に継承**される。ある階層に `layout` が無くても、上位のレイアウトに包まれて表示される。

### 3. 動的ルート（角括弧の記法）

URL の一部が可変になる部分は角括弧
| 記法 | 名称 | マッチ例 | params の中身 |
|---|---|---|---|
| `[folder]` | 動的セグメント | `/learn/english` | `{ language: "english" }` |
| `[...folder]` | catch-all | `/shop/a/b` | `{ slug: ["a", "b"] }`（配列） |
| `[[...folder]]` | optional catch-all | `/shop` も含む | セグメント無しにもマッチ |

### 4. page.tsx のコンポーネントが受け取る引数

`page.tsx` のデフォルトエクスポート関数は Next.js から**`params` と `searchParams` を自動的に受け取る。

| 引数 | 中身 | 例 |
|---|---|---|
| `params` | 動的セグメント `[...]` | `/learn/english` → `{ language: "english" }` |
| `searchParams` | クエリ文字列 `?...` | `?level=beginner` → `{ level: "beginner" }` |



