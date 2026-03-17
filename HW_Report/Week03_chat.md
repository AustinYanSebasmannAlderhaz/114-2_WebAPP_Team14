# 顏伯亨

我：
```
請幫我在"C:\AustinInTheHouse\NINWEB\index.html"中Hero Section加入背景圖片"C:\AustinInTheHouse\NINWEB\img\all-the-ninjago-season-posters.jpg"，這圖片的寬度很長，我想要加入自動橫向移動循環的動畫
```

CODEX回應：
```
我會先檢查 index.html 和 style.css 裡目前 Hero Section 的結構，然後直接幫你加上這張長圖背景與可無限循環的橫向移動動畫。接著我會調整成在不同螢幕下都能正常顯示。

我已讀到 index.html 的 Hero 區塊，下一步我會讀 style.css 並直接加上背景層與 @keyframes，讓長圖自動橫向循環。

我準備直接只改 CSS，不動你現有 HTML 結構；會用 .hero::before 做可循環的背景層，再加半透明遮罩確保文字可讀。先抓一下圖片實際寬度，讓動畫一輪精準對齊、避免跳動。

我現在會修改 style.css 的 Hero 區塊：加入背景圖層、遮罩層與 @keyframes，並把動畫一輪設定成圖片寬度（3007px）來做平滑循環。

CSS 已改好，我再快速確認 index.html 的 Hero 結構是否正常，避免動畫層被錯誤標籤影響。

已完成，Hero Section 已加上你指定圖片並做「自動橫向循環移動」動畫。

修改檔案：

style.css:51
.hero 改為可放背景動畫層（position: relative; overflow: hidden;）
新增 .hero::before 載入 img/all-the-ninjago-season-posters.jpg 並做 repeat-x 橫向循環
新增 .hero::after 深色遮罩，確保標題文字可讀
新增 @keyframes hero-pan，背景由 0 移到 -3007px，45 秒線性無限循環
補充：
我沒有改 index.html 結構，直接用 CSS 套用到現有 .hero。
你這張檔案內容實際是 WebP（但副檔名是 .jpg）；若有瀏覽器或伺服器顯示問題，建議改成 .webp 並同步更新路徑。
```


# 呂羿樺