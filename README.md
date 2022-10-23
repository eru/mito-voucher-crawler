# mito-voucher-crawler

[みとちゃんのプレミアム商品券対象店舗のマイマップ](https://www.google.com/maps/d/edit?mid=1pEteLoA3m0iknUxZS9azuEeBwyQU8Nnm&usp=sharing)の各レイヤーとして取り込むためのデータを生成するスクリプトです。

スクレイピングを利用しているため、自己判断の元利用してください。

## Setup

```
# Install dependencies
pnpm install

# Configure
cp .envrc{.sample,}
$EDITOR .envrc
direnv allow
```

## Run

```
pnpm run start
```

## Original data

[水戸市プレミアム付商品券取扱店 | 水戸商工会議所](https://mito.inetcci.or.jp/voucher/index.php)
