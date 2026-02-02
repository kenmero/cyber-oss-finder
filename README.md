# 🔍 CYBER OSS FINDER

**サイバーパンク風のOSSライブラリ検索ツール**

商用利用可能なOSSライブラリを効率的に検索・評価するための次世代Webアプリケーション。ライセンス情報を自動分析し、ビジネスでの利用可否を即座に判定します。

![CYBER OSS FINDER](https://via.placeholder.com/1200x600/0a0a0a/00f3ff?text=CYBER+OSS+FINDER)

## ✨ 主な機能

### 🎯 高度な検索機能
- **日本語対応検索**: 専門用語を自動翻訳してGitHub APIで検索
- **カスタム辞書**: よく使う用語を登録して検索精度を向上
- **結果件数調整**: 5/10/20/50件から選択可能

### 📊 ライセンス自動分析
- **商用利用判定**: MIT、Apache 2.0などの許可ライセンスを自動識別
- **コピーレフト検出**: GPL、AGPLなどの要注意ライセンスを警告
- **非商用ライセンス**: 商用利用不可のライセンスを明示

### 🎨 サイバーパンクUI
- **ネオングロー効果**: ホバー時の発光エフェクト
- **ダークテーマ**: 目に優しい黒基調のデザイン
- **レスポンシブ**: デスクトップ・タブレット対応

### 📋 2つの表示モード
- **テーブルビュー**: 詳細情報を一覧表示
- **グリッドビュー**: カード形式で視覚的に表示

## 🚀 セットアップ

### 必要要件
- Node.js 18.x以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/kenmero/cyber-oss-finder.git
cd cyber-oss-finder

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで `http://localhost:3000` を開いてください。

### ビルド

```bash
# プロダクションビルド
npm run build

# ビルドしたアプリを起動
npm start
```

## 📖 使い方

1. **検索**: 検索バーに日本語または英語でキーワードを入力
2. **スキャン**: 「SCAN」ボタンをクリック
3. **結果確認**: ライセンス情報と統計データを確認
4. **辞書登録**: 頻繁に使う用語は「DICTIONARY」から登録

### ライセンス判定の見方

| アイコン | 意味 | 説明 |
|---------|------|------|
| 🟢 GRANTED | 商用利用可 | MIT、Apache 2.0など |
| 🔵 AUDIT REQ | 要確認 | GPL、AGPLなどコピーレフト |
| 🔴 RESTRICTED | 利用不可 | 非商用ライセンス |

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 14
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS 4
- **状態管理**: TanStack Query (React Query)
- **アニメーション**: Framer Motion
- **API**: GitHub REST API (Octokit)

## 📁 プロジェクト構成

```
cyber-oss-finder/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # ルートレイアウト
│   │   └── page.tsx      # メインページ
│   ├── components/       # Reactコンポーネント
│   │   ├── SearchScanner.tsx
│   │   ├── OssTable.tsx
│   │   ├── OssGrid.tsx
│   │   ├── DictionaryManager.tsx
│   │   └── ui/           # 再利用可能なUIコンポーネント
│   └── lib/              # ユーティリティ
│       └── github.ts     # GitHub API連携
├── public/               # 静的ファイル
└── package.json
```

## 🎨 カスタマイズ

### カラーテーマの変更

`tailwind.config.ts` でネオンカラーをカスタマイズできます：

```typescript
colors: {
  neon: {
    cyan: "#00f3ff",      // メインカラー
    magenta: "#ff00ff",   // アクセントカラー
    purple: "#bc13fe",
    green: "#0aff0a"
  }
}
```

### 検索フィルターの調整

`src/lib/github.ts` の検索クエリを変更：

```typescript
const q = `${translatedQuery} stars:>10 forks:>5`;
// スター数やフォーク数の閾値を調整可能
```

## 🤝 コントリビューション

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📝 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 🙏 謝辞

- [GitHub API](https://docs.github.com/en/rest) - リポジトリデータの提供
- [Lucide Icons](https://lucide.dev/) - アイコンセット
- [Tailwind CSS](https://tailwindcss.com/) - スタイリングフレームワーク

---

**Made with ⚡ by kenmero**
