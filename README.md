# Use Node.js build Web_Crawler catch up web data.

### Getting Started & Clone Project
> you can create a new project based on tutorial by doing the following:

```bash
$ git clone https://github.com/PeterPanTW/Node.js_WebCrawler_RequestAndCheerio.git
$ cd Node.js_WebCrawler_RequestAndCheerio
```

### Installation
When that's done, install the project dependencies.You can use npm or yarn(recommended) for dependency management。

```bash
$ npm install
```

### Running the Project

After completing the [installation](#installation) step, you're ready to start the project!

| script | Description           |
| ------ | --------------------- |
| start  | running node index.js |


### User Story :smile: :
* User can see earthquake NEWS of Taiwan :taiwan:

### Video Walkthrough :movie_camera: :movie_camera:
![Alt Text](https://github.com/PeterPanTW/Node.js_WebCrawler_RequestAndCheerio/blob/master/DEMO_Node.js_WebCrawler_RequestAndCheerio.gif)


### Philosophy (The Rule)：
+ 爬蟲可以應用在很多地方，知道要爬什麼(GOAL)之後，就要寫 NodeJS 並應用 npm install 兩個模組(Modules)，分別是「request」和「cheerio」，request 可以想成用 ajax 作為撈取網頁資料的請求方式可以在後端載入一個網頁並把整個網頁的 HTML 抓取下來，而 cheerio 就是這個網頁裡面的 jQuery 一樣可以做標籤的擷取 ( 用法一樣，因為它的核心就是 jQuery )


## 實作
首先建立一個 `index.js` 檔分別引入 request 與 cheerio 還有 fs，fs 是 NodeJS 的讀檔模組，包含讀取、刪除、寫入等動作。

<img src="/img/01_安裝request&cheerio.jpg">

引入函式庫後就來建立一個 function() 名稱取名為 `earthquake`，
首先使用 request 來做一個請，第一個參數為網址(url)，第二個參數為請求方法(method)這邊使用 GET 請求方式，
後面接著一個 callback 函式他會回傳一個 body 內容為 HTML 格式。

成功取得 body 接下來就要利用 `cheerio` 來爬取資料了，首先我們要知道我們要爬取哪一個標籤內容，
打開瀏覽器 > 右鍵 > 檢查，可以發先我們要的資料被一個 Table 包起來此 Table 的類別名稱為(BoxTable)然而裡面每一列的資料又被 tr 包起來，所以我們 query 的路徑為 `$(".BoxTable tr")`，成功取得每一列的資料後利用陣列走訪方式讀取每一列資訊，然而每一列有多個欄位所以再用 `.find('td')` 找到每個欄位內容，才能依序的解析個個欄位內容，最後就把結果利用 ES6 的 `Object.assign()` 產生一筆物件把所有結果塞進去並推入 result 陣列中。

<img src="/img/02_開啟要抓取資料的網頁並選取Table.jpg">

整個陣列走訪完成後使用 `fs.writeFileSync()` 把陣列(result)寫入 result.json 檔案中，最後我們設定每半小時呼叫此函式固定爬蟲撈取資料 `setInterval(earthquake, 30 * 60 * 1000)`。

```js
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

const earthquake = function () {
  request({
    url: "http://www.cwb.gov.tw/V7/modules/MOD_EC_Home.htm", // 中央氣象局網頁
    method: "GET"
  }, function (error, response, body) { // callback ()
    if (error || !body) {
      return;
    }
    const $ = cheerio.load(body); // 載入 body
    const result = []; // 建立一個儲存結果的容器(陣列)
    const table_tr = $(".BoxTable tr") // 爬最外層的 Table(class=BoxTable) 中的 tr

    for (let i = 1; i < table_tr.length; i++) { // 走訪 tr
      const table_td = table_tr.eq(i).find('td'); // 擷取每個欄位(td)
      const time = table_td.eq(1).text(); // time (台灣時間)
      const latitude = table_td.eq(2).text(); // latitude (緯度)
      const longitude = table_td.eq(3).text(); // longitude (經度)
      const amgnitude = table_td.eq(4).text(); // magnitude (規模)
      const depth = table_td.eq(5).text(); // depth (深度)
      const location = table_td.eq(6).text(); // location (位置)
      const url = table_td.eq(7).text(); // url (網址)

      /*
        建立物件並(push)存入結果
      */
      result.push(Object.assign({
        time,
        latitude,
        longitude,
        amgnitude,
        depth,
        location,
        url
      }));
    }

    console.log(result); // 在終端機(console)列出結果
    fs.writeFileSync("result.json", JSON.stringify(result)); // 寫入 result.json 檔案
  });
};

earthquake();
setInterval(earthquake, 30 * 60 * 1000); // 每半小時爬一次資料
```

<img src="/img/03_確認可抓取到資料.jpg">
<img src="/img/04_確認可抓取到資料.jpg">
<img src="/img/05_確認result＿JSON資料.jpg">

## 參考資料：
> 要抓取資料的網址：https://www.cwb.gov.tw/V7/modules/MOD_EC_Home.htm　中央氣象局網頁

> JSON.stringify() 的使用：http://www.jollen.org/blog/2014/07/nodejs-json-stringify.html

> JS ! 和 !! 說明(1)：http://hsuehcoding.blogspot.com/2014/03/jsjavascript.html

> JS ! 和 !! 說明(2)：https://note.pcwu.net/2017/02/10/js-double-exclamation/

> const變數命名(1)：https://www.youtube.com/watch?v=X7EJBCo8Rik

> const變數命名(2)：https://medium.com/@totoroLiu/javascript-var-let-const-差異-e3d930521230

> 資料爬蟲實戰－使用 node.js：http://blog.infographics.tw/2015/03/crawl-data-with-nodejs/

