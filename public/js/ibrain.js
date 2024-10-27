// 等待 DOM 內容加載完畢
document.addEventListener('DOMContentLoaded', () => {
    // 倒數計時器
    const countdownElement = document.getElementById('countdown');
    const targetDate = new Date('2025-02-01T00:00:00').getTime();

    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        // 計算天、時、分、秒
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // 顯示結果
        countdownElement.innerHTML = `${days} 天 ${hours} 小時 ${minutes} 分 ${seconds} 秒`;

        // 如果倒數結束
        if (distance < 0) {
            clearInterval(countdownInterval);
            countdownElement.innerHTML = "倒數結束！";
        }
    }, 1000);

    // 獲取 IBrain 資料
    fetch('/api/ibrain/unfinished')
        .then(response => {
            if (!response.ok) {
                throw new Error('網路錯誤');
            }
            return response.json();
        })
        .then(data => {
            const dataTableBody = document.getElementById('data-table-body');
            const summaryTableBody = document.getElementById('summary-table-body');

            // 清空表格
            dataTableBody.innerHTML = '';
            summaryTableBody.innerHTML = '';

            // 用來計算每個 class 的總時間
            const classTimeSummary = {};

            // 填充資料表
            data.forEach(row => {
                // 添加到資料表
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row.class}</td>
                    <td>${row.chapter}</td>
                    <td><input type="date" class="finish-date" data-id="${row.id}" /></td>
                    <td><button class="submit-button" data-id="${row.id}">送出</button></td>
                `;
                dataTableBody.appendChild(tr);

                // 計算每個 class 的時間總計
                if (!classTimeSummary[row.class]) {
                    classTimeSummary[row.class] = 0; // 初始化
                }
                classTimeSummary[row.class] += row.time; // 累加時間
            });

            // 填充時間總計表
            let totalDuration = 0;
            for (const className in classTimeSummary) {
                const totalTime = classTimeSummary[className];
                totalDuration += totalTime;

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${className}</td>
                    <td>${totalTime}</td>
                `;
                summaryTableBody.appendChild(tr);
            }

            // 添加總時長
            const totalRow = document.createElement('tr');
            totalRow.innerHTML = `
                <td><strong>總時長</strong></td>
                <td><strong>${totalDuration}</strong></td>
            `;
            summaryTableBody.appendChild(totalRow);

            // 監聽送出按鈕點擊事件
            const buttons = document.querySelectorAll('.submit-button');
            buttons.forEach(button => {
                button.addEventListener('click', (event) => {
                    const id = event.target.getAttribute('data-id');
                    const finishDate = document.querySelector(`input[data-id="${id}"]`).value;

                    // 發送更新請求
                    fetch(`/api/updateFinish/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            finishdate: finishDate,
                            finish: 1
                        })
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('網路錯誤');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('更新成功:', data);
                        // 可選：重新獲取資料以更新顯示
                        location.reload(); // 重新載入頁面以顯示更新
                    })
                    .catch(error => console.error('更新資料失敗:', error));
                });
            });
        })
        .catch(error => console.error('獲取資料失敗:', error));
});