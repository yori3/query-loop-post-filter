# Query Loop Post Filter

クエリーループブロックに投稿タイトルで絞り込む機能を追加するWordPressプラグイン
(AIを利用して制作しました)

## ファイル構成

```
query-loop-post-filter/
├── query-loop-post-filter.php  # メインプラグインファイル
├── package.json                # npm設定
├── README.md
├── src/
│   ├── index.js               # エントリーポイント
│   └── index.scss             # スタイル
└── build/                     # ビルド後のファイル(自動生成)
    ├── index.js
    ├── index.asset.php
    └── index.css
```

## インストール手順

### 1. プラグインフォルダを作成

```bash
cd wp-content/plugins/
mkdir query-loop-post-filter
cd query-loop-post-filter
```

### 2. ファイルを配置

- `query-loop-post-filter.php`
- `package.json`
- `src/index.js`
- `src/index.scss`

### 3. 依存関係をインストール

```bash
npm install
```

### 4. ビルド

```bash
npm run build
```

または、開発中は以下でウォッチモード:

```bash
npm start
```

### 5. プラグインを有効化

WordPress管理画面 → プラグイン → 「Query Loop Post Filter」を有効化

## 使い方

1. ブロックエディタでクエリーループブロックを追加・選択
2. 右サイドバーの「設定」タブを開く
3. 「投稿タイトルで絞り込む」パネルを開く
4. 投稿タイトル入力欄にタイトルを入力
5. サジェストから投稿を選択
6. 選択した投稿がタグとして入力欄内に表示される
7. 複数の投稿を選択可能
8. タグの×ボタンで削除可能

## 機能

- 投稿タイトルのオートコンプリート
- タグUI形式での表示
- 複数投稿の選択
- 選択した順序でクエリが実行される
- 既存の絞り込み機能(著者、キーワード、タクソノミーなど)と併用可能
- 独立したパネルとして表示され、簡単にアクセス可能

## 技術詳細

- `FormTokenField`コンポーネントを使用してタグUIを実装
- `query.include`属性に投稿IDの配列を保存
- `query_loop_block_query_vars`フィルターで`post__in`パラメータに変換
- WordPress REST APIで投稿一覧を取得