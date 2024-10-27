const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('cs1db.db'); // 替換為您的資料庫檔案名稱

// 更新章節資料的函式
function updateChapters() {
    let startId = 61; // 開始的 ID
    let chapterCounter = 1; // 章節計數器
    let totalChapters = 26; // 總章節數

    // 開始事務
    db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        // 執行更新操作
        for (let i = 0; i < totalChapters * 2; i++) {
            let chapterValue = Math.floor(i / 2) + 1; // 計算章節
            let part = (i % 2) + 1; // 取得是第幾部分（1或2）
            let chapterString = `${chapterValue}-${part}`; // 組合章節字串

            // 更新資料
            db.run("UPDATE ibrain SET chapter = ? WHERE id = ?", [chapterString, startId + i], function(err) {
                if (err) {
                    console.error("更新錯誤:", err.message);
                } else {
                    console.log(`已更新 ID ${startId + i} 的 chapter 為 ${chapterString}`);
                }
            });
        }

        // 提交事務
        db.run("COMMIT", (err) => {
            if (err) {
                console.error("提交錯誤:", err.message);
            } else {
                console.log("所有資料已成功更新");
            }
        });
    });
}

// 執行函式
updateChapters();

// 關閉資料庫
db.close((err) => {
    if (err) {
        console.error("關閉資料庫錯誤:", err.message);
    } else {
        console.log("資料庫已關閉");
    }
});