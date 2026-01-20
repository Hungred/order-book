# Order Book Demo（訂單簿範例）

一個使用 **Vue 3 + Pinia + Element Plus + Vite** 建立的即時訂單簿模擬系統。
本專案展示了即時買賣盤資料處理、撮合邏輯、以及前端效能與架構設計方式。

> **注意**：此專案使用模擬資料，並未串接真實交易所 API。

---

## 📂 專案結構 (Project Structure)

```text
order-book/
├─ src/                    ≤ 主要程式碼（Vue + Pinia + Components）
│   ├─ components/         ≤ UI 元件
│   │   ├─ OrderInput.vue
│   │   ├─ OrderStatus.vue
│   │   ├─ OrderTable.vue
│   │   ├─ SideMenu.vue
│   │   └─ TradeHistory.vue
│   │
│   ├─ composables/        ≤ 可重用邏輯（useOrderBook、useFakeSocket）
│   │   ├─ useFakeSocket.js
│   │   └─ useOrderBook.js
│   │
│   ├─ stores/             ≤ Pinia 全域狀態管理
│   │   └─ orderBook.js
│   │
│   ├─ utils/              ≤ 工具函式 / helper / 搓合邏輯
│   │   ├─ matchOrders.js 搓合邏輯
│   │   └─ tools.js 數字tool
│   │
│   ├─ views/              ≤ 頁面
│   │   ├─ Dashborad.vue
│   │   ├─ Login.vue
│   │   ├─ OrderBookMock.vue
│   │   └─ OrderBookReal.vue
│   │
│   ├─ App.vue             ≤ 根元件
│   ├─ main.js             ≤ 入口初始化（掛載 Vue、Pinia）
│   └─ router.js           ≤ 路由設定
│
├─ .gitignore
├─ package.json
├─ vite.config.js          ≤ Vite 專案建置設定
├─ README.md               ≤ 專案說明
└─ ...

```

---

## 🔍 功能特色

- 模擬訂單深度資料（假 WebSocket）
- 買盤（bids）與賣盤（asks）分欄顯示
- 使用者可手動輸入買/賣訂單
- 簡易撮合引擎：當買價 >= 賣價 時自動成交
- 使用 Pinia 做即時更新與狀態集中管理
- 以 Element Plus 及 Tailwind 打造清晰的 UI 排版
- 模組化架構：撮合邏輯、模擬數據、元件皆分離管理

---

## 📁 安裝與使用

- 1️⃣ 下載專案

git clone https://github.com/Hungred/order-book.git
cd order-book

- 2️⃣ 安裝依賴

npm install

- 3️⃣ 啟動開發伺服器

npm run dev

- 瀏覽器開啟 http://localhost:5173/

- 4️⃣ 建置生產版本

npm run build

- 5️⃣ 預覽打包後版本

npm run preview

---

## 🔍 未來改善方向

- **串接真實交易所 API（Binance / Bybit / OKX）**

  - 使用 WebSocket depth stream 與 ticker stream
  - 支援多幣種切換（BTC/ETH/BCH…）

- **訂單聚合（Order Aggregation）**

  - 自動合併同價格委託（Price Level）
  - 支援 Depth Level：5 / 10 / 20

- **更完整的撮合引擎（Matching Engine）**

  - 改良撮合邏輯
  - 支援高頻撮合壓力測試（Stress Test）
  - 支援部分成交（Partial Fill）

- **新增市價單（Market Order）**

  - 支援 IOC / FOK / GTC 等訂單類型

- **更多視覺化體驗**

  - 深度圖（Depth Chart）
  - 成交歷史逐筆（Trade History）
  - 成交量與趨勢圖（Volume / Trend）
