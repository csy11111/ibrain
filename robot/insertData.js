const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('cs1db.db'); // 替換為你的資料庫名稱

// 插入資料的函數
function insertData(className, chapter1, chapter2) {
    const sql = `INSERT INTO ibrain (class, chapter, finish, finishdate, time) VALUES (?, ?, ?, ?, ?)`;
    
    // 插入第一個章節
    db.run(sql, [className, chapter1, 0, null, 1.5], function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`已插入資料: ${className}, 章節: ${chapter1}, ID: ${this.lastID}`);
    });

    // 插入第二個章節
    db.run(sql, [className, chapter2, 0, null, 1.5], function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`已插入資料: ${className}, 章節: ${chapter2}, ID: ${this.lastID}`);
    });
}

// 自動插入指定的章節
for (let i = 1; i <= 32; i++) {
    const chapter1 = `${i}-1`;
    const chapter2 = `${i}-2`;
    insertData('資結', chapter1, chapter2);
}

// 關閉資料庫
db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('資料庫已關閉。');
});