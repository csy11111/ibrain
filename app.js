const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// 中介軟體，用來解析 JSON
app.use(express.json());

// 連接到 SQLite 資料庫
const db = new sqlite3.Database('cs1db.db', (err) => {
    if (err) {
        console.error('資料庫連接失敗:', err.message);
    } else {
        console.log('成功連接到資料庫');
    }
});

// 設置根路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 測試 API 路由
app.get('/api/test', (req, res) => {
    res.send('API 工作正常！');
});




// 取得資料表 "ibrain" 的所有資料
app.get('/api/ibrain', (req, res) => {
    const query = 'SELECT * FROM ibrain';
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

// 倒序ibrain
app.get('/api/getibrain', (req, res) => {
    const sql = 'SELECT * FROM ibrain ORDER BY id DESC'; // 按照 id 由大到小排序
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows); // 回傳資料
    });
});

// 未完成ibrain
app.get('/api/ibrain/unfinished', (req, res) => {
    db.all(`SELECT * FROM ibrain WHERE finish = ?`, [0], (err, rows) => {
        if (err) {
            console.error('查詢失敗:', err.message);
            return res.status(500).json({ error: '查詢失敗' });
        }
        res.json(rows); // 回傳符合條件的所有資料
    });
});

// 新增 iBrain 資料的 API
app.post('/api/addibrain', (req, res) => {
    const { class: className, chapter, finish, finishdate, time} = req.body; // 提供預設值

    const sql = `INSERT INTO ibrain (class, chapter, finish, finishdate, time) VALUES (?, ?, ?, ?, ?)`;
    const params = [className, chapter, finish, finishdate, time];

    db.run(sql, params, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID, message: '新增資料成功' });
    });
});


// 更新 finishdate 和將 finish 設定為 1
app.put('/api/updateFinish/:id', (req, res) => {
    const id = req.params.id;
    const { finishdate } = req.body; // 只接收 finishdate，finish 固定設為 1

    // 確保請求的資料有效
    if (!finishdate) {
        return res.status(400).json({ error: '請提供 finishdate 的值' });
    }

    const sql = `UPDATE ibrain SET finishdate = ?, finish = 1 WHERE id = ?`;
    const params = [finishdate, id];

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: '更新成功', changes: this.changes });
    });
});


// 404 中介軟體應放在所有路由之後
app.use((req, res) => {
    res.status(404).send('Sorry, that route does not exist!');
});

// // 在伺服器上啟動 API
// app.listen(port, () => {
//     console.log(`伺服器正在運行於 http://localhost:${port}`);
// });

const PORT = process.env.PORT || 3000; // 使用環境變數 PORT，若未設定則使用 3000
app.listen(PORT, () => {
    console.log(`伺服器正在運行於 http://localhost:${PORT}`);
});