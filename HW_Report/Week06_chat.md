與AI對話
===

顏伯亨
---

我：

> 投一票的按鈕可以按超級多次這樣感覺失去投票的公平性

CODEX 回應：

> 你這個顧慮很合理，我會把投票改成「同一個瀏覽器 session 對同一角色只能投一次」：後端新增投票紀錄表 + 唯一約束，前端按過後就鎖住按鈕。現在開始改後端模型與 API。
>
> 後端已改成同一 session 同一角色只記一票。下一步我會把 characters.html 與前端 JS 接上「已投票鎖定」狀態，避免 UI 還能一直按。
>
>我已完成單一 session 單角色只投一次的核心機制，現在做最後語法檢查並整理你需要執行的 migration 指令。
> **最終訊息**
>
> 已完成的修正

> 1. 後端加「投票紀錄」模型 + 唯一約束
- 新模型 CharacterVote，欄位：character, session_key, created_at
- 唯一限制：(character, session_key) 只能一筆
- 檔案：models.py
- Migration：0005_charactervote.py
> 2. 投票 API 改為防重複
- POST /characters/<id>/vote/ 用 get_or_create(...)
- 已投過則不再加票，只回傳 already_voted: true
- 檔案：views.py
> 3. 角色頁載入時帶出「我是否已投票」
- 進頁面就根據當前 session 查詢已投票角色
- 模板輸出 data-has-voted
- 檔案：views.py, characters.html
> 4. 前端按鈕鎖定
- 若該角色已投票，彈窗按鈕顯示「已投票」且禁用
- 成功投票後立即鎖按鈕、更新票數
- 檔案：characters.js
> 5. 後台可檢視投票紀錄
- Admin 註冊 CharacterVote
- 檔案：admin.py

呂羿樺
---

我：



Claude 回應：  


