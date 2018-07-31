/*
   引入 request 與 cheerio 還有 fs，fs 是 NodeJS 的讀檔模組，包含讀取、刪除、寫入等動作。

   要抓取資料的網址：https://www.cwb.gov.tw/V7/modules/MOD_EC_Home.htm　中央氣象局網頁

   JSON.stringify() 的使用這裡僅提供教學說明 http://www.jollen.org/blog/2014/07/nodejs-json-stringify.html
*/


const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

/*
  首先使用 request 做一個請求，第一個參數為網址 (url)。
  第二個參數為請求方法(method) 這邊使用 GET 請求方式。
  後面接著一個 callback 函式他會回傳一個 body 內容為 HTML 格式。
*/


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
