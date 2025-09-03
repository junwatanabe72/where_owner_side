# Mapbox Map Setup Instructions

## 環境変数の設定

1. `.env`ファイルをプロジェクトルートに作成
2. Mapboxアクセストークンを設定:
   ```
   REACT_APP_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
   ```

## Mapboxアクセストークンの取得

1. [Mapbox](https://www.mapbox.com/)にアクセス
2. アカウントを作成またはログイン
3. ダッシュボードからアクセストークンを取得
4. 上記の環境変数に設定

## 開発サーバーの起動

```bash
npm start
```

ポート3000が使用中の場合:
```bash
PORT=3001 npm start
```

## 機能確認

- マップが表示されることを確認
- マーカーをクリックして物件情報ポップアップが表示されることを確認
- 3Dボタンで地図の傾斜が変更されることを確認
- レイヤートグルボタンが機能することを確認

## トラブルシューティング

### マップが表示されない場合
- 環境変数が正しく設定されているか確認
- Mapboxアクセストークンが有効か確認
- ブラウザのコンソールでエラーを確認

### TypeScriptエラーが出る場合
- `npm install --save-dev @types/mapbox-gl --legacy-peer-deps`を実行
- `src/types/index.d.ts`が存在することを確認