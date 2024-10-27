// 等待 DOM 內容加載完畢
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('upload-form'); // 獲取表單
    const tableBody = document.getElementById('ibrain-table-body'); // 獲取表格的 tbody
    const completeButton = document.getElementById('complete-button'); // 獲取完成編輯按鈕

    // 獲取 IBrain 資料並顯示在表格中
    function fetchAndDisplayIbrainData() {
        fetch('/api/getibrain')
            .then(response => {
                if (!response.ok) {
                    throw new Error('網路錯誤');
                }
                return response.json();
            })
            .then(data => {
                // 清空表格
                tableBody.innerHTML = '';

                // 將資料按 ID 降序排列
                data.sort((a, b) => b.id - a.id);

                // 填充表格
                data.forEach(row => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${row.id}</td>
                        <td>${row.class}</td>
                        <td>${row.chapter}</td>
                        <td>${row.finish}</td>
                        <td>${row.finishdate !== null ? row.finishdate : '未完成'}</td>
                        <td>${row.time}</td>
                    `;
                    tableBody.appendChild(tr);
                });
            })
            .catch(error => console.error('獲取資料失敗:', error));
    }

    // 初始加載 IBrain 資料
    fetchAndDisplayIbrainData();

    // 表單提交事件
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // 防止表單的默認提交行為

        // 獲取表單資料
        const formData = {
            class: document.getElementById('class').value, // 獲取課程名稱
            chapter: document.getElementById('chapter').value, // 獲取章節
            finish: 0, // 預設為 0
            finishdate: null, // 預設為 null
            time: 1.5 // 預設為 1.5
        };

        // 發送請求到新增 API
        fetch('/api/addibrain', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('網路錯誤');
            }
            return response.json();
        })
        .then(data => {
            console.log('新增成功:', data);
            form.reset(); // 清空表單
            completeButton.style.display = 'block'; // 顯示完成編輯按鈕
            // 重新獲取 IBrain 資料以更新表格
            fetchAndDisplayIbrainData();
        })
        .catch(error => console.error('新增資料失敗:', error));
    });

    // 完成編輯按鈕的事件監聽器
    completeButton.addEventListener('click', () => {
        window.location.href = 'ibrain.html'; // 跳轉回 ibrain.html
    });
});