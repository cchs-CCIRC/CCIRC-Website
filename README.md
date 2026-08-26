# CCIRC Website — 整合版

本版本整合了兩個先前的網站版本（CCIRC-Website-V4_5 與 claude1），依據需求取兩者之長：

- **視覺風格**：全新設計，融合深藍灰簡約風與科技感（漸層標題、終端機打字動畫、網格背景光暈）。
- **品牌定位**：不分屆的「精誠資訊讀書會 CCIRC」整體品牌。
- **頁面架構**（7 頁 + 404）：首頁、關於、學習路線、教材庫、傳承、加入。
- **學習路線**：採用較完整的 4 階段學習地圖（含各階段 APCS 目標級分）。
- **關於頁**：整合指導單位（精誠高中）、指導老師（邱慧玲老師）與歷屆（1st / 2nd / 3rd）發展沿革。
- **教材庫**：採資料驅動搜尋＋預覽視窗（點卡片可先在站內預覽 HackMD 筆記），並新增「第二屆」篩選（目前顯示暫無公開資料）。
- **加入我們**：使用真實的 Discord 邀請連結與官方 IG 連結。

網站為純靜態網站，不含任何伺服器端功能或資料庫。

## V4 UI 升級

本版本在不更換既有品牌色系的前提下，重新強化整體 UI / UX：

- 現代化固定導覽列：滾動後玻璃感更明顯、目前頁面狀態更清楚。
- 新增跨頁 Announcement Bar，參考現代 React / Tailwind announcement 元件的資訊層級。
- 首頁 Hero 強化：更明確的品牌訊息、微動態、C++ / APCS 標籤與更立體的 Terminal。
- 卡片全面升級：更細緻的邊框、光暈、hover 位移與滑鼠位置光效。
- 新增 scroll progress、back-to-top、IntersectionObserver reveal。
- 尊重 `prefers-reduced-motion`，降低動態對可及性的影響。
- 教材庫搜尋工具列、篩選 Chip、卡片與預覽 Modal 的視覺層級全面提升。
- 行動版導覽與內容網格重新調整。
- 「資說資話 / Stories」頁面維持移除狀態，未重新加入。

## 部署

- 純靜態網站，可直接部署於 GitHub Pages、Cloudflare Pages 或任何靜態主機，無需額外設定伺服器端功能。
- 若使用 Cloudflare Pages，將本目錄作為 Pages 專案的輸出目錄即可；`wrangler.toml` 僅供辨識專案名稱之用，非必要。
- 正式網域確定後，記得更新 `sitemap.xml` 與 `robots.txt` 中的網址，以及 `index.html` 內 JSON-LD 中的 `logo` 網址。

## 尚待你確認/補齊的項目

- 教材庫「第二屆」目前僅顯示「暫無公開講義」提示；若你之後提供第二屆的 HackMD 連結，可加入 `js/resources-data.js` 中（`cohort` 填 `"2nd"`）。
- Instagram 第三方 iframe 的線上載入結果與正式網域 DNS 必須在實際部署環境驗證；本地檔案檢查無法代替這些外部服務測試。
