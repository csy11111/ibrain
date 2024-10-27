const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('cs1db.db'); // 替換為您的資料庫檔案名稱

// 更新 class 欄位
db.serialize(() => {
    for(let i=61;i<=113;i++){

        db.run(`UPDATE ibrain SET finish = ? WHERE id = ?`, [1, i], function(err) {
        if (err) {
            console.error('更新失敗:', err.message);
        } else {
            console.log(`成功更新 ${this.changes} 筆資料`);
        }
    });
    }
    
});

// 關閉資料庫連接
db.close();