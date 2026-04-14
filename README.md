114-2_WebAPP_Team14
===

我們是 Web 程式設計與應用 → 第14組。  
題目是「樂高旋風忍者危機百科」。  
成員有：

- 顏伯亨
- Austin Yan (顏伯亨)
- 呂羿樺
- Ian Mackenzie (呂羿樺)  

(嗯... 對... 你沒看錯... 就我們兩個而已。😂)  

Installation：  
---

```bash
# Clone this repo.
git clone https://github.com/AustinYanSebasmannAlderhaz/114-2_WebAPP_Team14.git

cd 114-2_WebAPP_Team14

# Build a virtual environment (optional) 
python -m venv venv # windows
python3 -m venv venv # mac

# Activate the virtual environment (optional) 
venv\Scripts\activate # windows
source venv/bin/activate # mac & linux

# Enter the NINJAMaster folder (Django backend)
cd NINJAMaster

# Install dependencies
pip install -r requirements.txt
pip3 install -r requirements.txt # mac

# Apply model.py
python manage.py makemigrations 
python3 manage.py makemigrations # mac

# Write to database
python manage.py migrate 
python3 manage.py migrate # mac

# Run server
python manage.py runserver 
python3 manage.py runserver # mac
```

Project Progress Update：  
---

⚠️⚠️ 注意 **看這裡** ⚠️⚠️

- 2026/04/14: Elements 頁面正式接上元素資料庫與歷任持有者資料。

> 新增 `ElementSource`、`ElementPower`、`ElementHolderHistory` 三張資料表，Elements 頁面的 popup 內容已改為由 Django / SQLite 動態讀取，會顯示元素描述、現任持有者與歷任持有者，查不到資料時會顯示「無資料」。

- 2026/04/14: Elements popup 可直接查看角色詳細資訊。

> 在元素 popup 的「歷年持有者」清單中，若該筆資料有對應的角色資料庫紀錄，點擊名字即可開啟角色詳細 modal；若只有文字資料、沒有角色主檔，則維持不可點擊狀態。

- 2026/04/14: Backend / Django 相容性修正完成。

> 修正 Elements 相關 API 與模型載入問題，並處理 Django 6 的 `CheckConstraint` 寫法相容性，避免 `runserver` 因 model constraint 參數錯誤而直接噴掉。

- 2026/04/13: Feedback 頁面、Feedback DB 與頁尾聯絡區完成。

> 新增聯絡 / 回饋頁面、`Feedback` 模型與對應資料表，前端表單資料可送進 Django 後端並寫入 SQLite，管理者也能從 Django Admin 查看收到的回饋內容。

- 2026/04/13: 首頁底部導覽與 Elements 頁面互動重新設計。

> 重新設計 bottom navigation / contact 區塊，並在 Elements 頁面加入來源龍徽章輪播、Source 詳細描述面板、點擊放大旋轉與點擊外部自動收合的互動流程。

- 2026/04/08: 角色人氣投票系統上線。

> 新增 `POST /characters/<id>/vote/` API，後端加入 `CharacterVote` 模型（同一 session 同一角色限投一次），前端按鈕投票後鎖定顯示「已投票」。

- 2026/04/08: 搜尋系統 UX 大幅強化。

> 1. 跨頁搜尋結果面板（取代自動跳轉），顯示各頁命中數 + 片段摘要 + 可點擊前往。
> 2. 本頁搜尋「上一筆 / 下一筆」導覽條，當前命中以紅底高亮。
> 3. 跨頁搜尋改為 `Promise.allSettled()` 平行請求，速度提升。
> 4. 即時搜尋（debounce 320ms），邊打字邊高亮，不跳頁。
> 5. 關鍵字歷史與建議（`localStorage` 記錄最近 10 筆）。

- 2026/04/05: 全域搜尋系統上線。

> 使用 GET 參數 `?q=關鍵字` 搜尋當前頁面內容，自動 Highlight 匹配文字並捲動到第一個結果，且會展開時間線隱藏條目、角色彈窗自動開啟、元素面板自動切換。新增 `css/search.css` 與 `action/search.js`。

- 2026/04/05: 時間線頁面內容完善。

> 補齊時間線全部歷史事件文字內容。

功能說明：

| 頁面 | 搜尋範圍 | 隱藏內容處理 |
| :-- | :-- | :--: |
| 首頁 | 所有文字 | 無 |
| 時間線 | `.tl-entry` 內文 | 強制 `.show` 展開 |
| 世界觀 | `.world-entry` 內文 | 無 |
| 元素 | `.source-panel` 內文 | 自動切換 panel |
| 角色 | `.character-profile` 內文 | 自動開啟 modal |

---

- 2026/03/31: Elements 頁面設計與資料庫連線。
- 2026/03/31: Database 建立與前端連接設定。
- 2026/03/30: 建立 Django 專案，並完成基本設定。 ```Admin的帳號密碼我放Line。```

---

- 2026/03/24: 專案結構重整，所有頁面的版面配置和動作分離。  
- 2026/03/24: 修正所有 HTML 檔案路徑，分頁已獨立到 ```src``` 資料夾。
- 2026/03/24: 新建 ```css``` 和 ```action``` 資料夾，所有分頁的 CSS 和 JS 皆已獨立。
- 2026/03/24: 所有檔案均已註解。

Project Rules:  
---

**老哥記得要先 ```git pull``` 再開始動工喔!!! (不然會出大事😱😱😱)**  

> - 要編輯 **HTML** 的話，進[src資料夾](https://github.com/AustinYanSebasmannAlderhaz/114-2_WebAPP_Team14/tree/main/src)修改 ```{各自的}.html```，不要修改[index.html](https://github.com/AustinYanSebasmannAlderhaz/114-2_WebAPP_Team14/blob/main/index.html)。  
> - 要改 **CSS** 的話，進[css資料夾](https://github.com/AustinYanSebasmannAlderhaz/114-2_WebAPP_Team14/tree/main/css)修改 ```{各自的}.css```，不要修改[style.css](https://github.com/AustinYanSebasmannAlderhaz/114-2_WebAPP_Team14/blob/main/style.css)。  
> - **JS** 也一樣，進[action資料夾](https://github.com/AustinYanSebasmannAlderhaz/114-2_WebAPP_Team14/tree/main/action)修改 ```{各自的}.js```，不要修改[script.js](https://github.com/AustinYanSebasmannAlderhaz/114-2_WebAPP_Team14/blob/main/script.js)。
> - [common.css](https://github.com/AustinYanSebasmannAlderhaz/114-2_WebAPP_Team14/blob/main/css/common.css)是所有分頁繼承[style.css](https://github.com/AustinYanSebasmannAlderhaz/114-2_WebAPP_Team14/blob/main/style.css)的通用架構。
> - [search.css](https://github.com/AustinYanSebasmannAlderhaz/114-2_WebAPP_Team14/blob/main/css/search.css) 和 [search.js](https://github.com/AustinYanSebasmannAlderhaz/114-2_WebAPP_Team14/blob/main/action/search.js) 是全域搜尋系統，所有頁面皆引用。
