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
>
- 新模型 CharacterVote，欄位：character, session_key, created_at
- 唯一限制：(character, session_key) 只能一筆
- 檔案：models.py
- Migration：0005_charactervote.py
>
> 1. 投票 API 改為防重複
>
- POST /characters/<id>/vote/ 用 get_or_create(...)
- 已投過則不再加票，只回傳 already_voted: true
- 檔案：views.py
>
> 1. 角色頁載入時帶出「我是否已投票」
>
- 進頁面就根據當前 session 查詢已投票角色
- 模板輸出 data-has-voted
- 檔案：views.py, characters.html
>
> 1. 前端按鈕鎖定
>
- 若該角色已投票，彈窗按鈕顯示「已投票」且禁用
- 成功投票後立即鎖按鈕、更新票數
- 檔案：characters.js
>
> 1. 後台可檢視投票紀錄
>
- Admin 註冊 CharacterVote
- 檔案：admin.py

呂羿樺
---

我：

> 我想在我架設的網站加入站內搜尋 (使用者可以在全域的搜尋框輸入想要查詢的關鍵字，網站會自動導覽到相關度最高的地方) 的功能我該怎麼做?
> 我使用的後端是 Django。

Claude 回應：  

> 在 Django 中實現站內搜尋，根據你的需求規模（從簡單的關鍵字比對到複雜的全文本檢索），通常有三種主要實作方式。
> 如果你希望達成「自動導覽到相關度最高的地方」，這涉及到**搜尋（Search）**與**排序/權重（Ranking/Weighting）**的邏輯。

## 1. 入門級：使用 Django Q 物件 (適用於小型網站/SQLite)

如果你的資料量不大，且不需要複雜的相關度演算法，可以使用 Django 內建的 `Q` 物件進行多欄位模糊搜尋。

### 邏輯範例

```python
from django.db.models import Q
from django.shortcuts import redirect, render
from .models import Article

def search_view(request):
    query = request.GET.get('q')
    if query:
        # 在標題與內容中搜尋關鍵字
        results = Article.objects.filter(
            Q(title__icontains=query) | Q(content__icontains=query)
        ).distinct()

        # 如果有結果，且你想「自動導覽」到第一筆（相關度最高）
        if results.exists():
            top_result = results.first() 
            return redirect(top_result.get_absolute_url())
    
    return render(request, 'search_results.html', {'results': results})
```

---

## 2. 進階級：PostgreSQL 全文本檢索 (推薦方案)

如果你使用的是 **PostgreSQL**，Django 提供了一套強大的內建工具，支援**詞幹提取（Stemming）**、**權重排序（Ranking）**以及**多國語言支援**，這最能符合你「自動導覽到相關度最高」的要求。

### 實作步驟

1. **修改 `settings.py`**：確保 `django.contrib.postgres` 在 `INSTALLED_APPS` 中。
2. **撰寫搜尋邏輯**：使用 `SearchVector` (搜尋範圍) 和 `SearchRank` (相關度評分)。

```python
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from .models import Article

def global_search(request):
    query_text = request.GET.get('q')
    if query_text:
        vector = SearchVector('title', weight='A') + SearchVector('content', weight='B')
        query = SearchQuery(query_text)
        
        # 根據相關度評分並排序
        results = Article.objects.annotate(
            rank=SearchRank(vector, query)
        ).filter(rank__gte=0.1).order_by('-rank')

        if results.exists():
            # 導向權重最高（rank 最大）的頁面
            return redirect(results.first().get_absolute_url())

    return render(request, 'search_results.html', {'results': results})
```

- **優點**：不需額外安裝搜尋伺服器，性能優異，支援權重設定（例如標題比內文重要）。

---

## 3. 專業級：專用搜尋引擎 (Elasticsearch / Meilisearch)

如果你的網站是像電商或大型論壇（資料量達萬等級以上），建議使用專門的搜尋引擎。

- **Django Haystack**：一個抽象層，可以讓你輕鬆切換 Elasticsearch, Solr 等後端。
- **Meilisearch**：目前非常流行，對中文支援友善且速度極快，提供「即打即找」（Search-as-you-type）的體驗。

---

## 4. 前端搜尋框實作建議

為了讓使用者在「全域」都能搜尋，建議將搜尋框放在 `base.html` 中：

```html
<form action="{% url 'search_view' %}" method="get">
    <input type="text" name="q" placeholder="搜尋全站內容..." required>
    <button type="submit">搜尋</button>
</form>
```

### 關於「自動導覽」的貼心建議

「直接跳轉」雖然快速，但有時會讓使用者感到困惑（因為他們可能想看其他的搜尋結果）。
