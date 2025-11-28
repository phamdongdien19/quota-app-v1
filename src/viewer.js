import '../style.css'

// State
const urlParams = new URLSearchParams(window.location.search);
const config = {
  projectName: urlParams.get('name') || localStorage.getItem('projectName') || 'Dự án chưa đặt tên',
  surveyId: urlParams.get('id') || localStorage.getItem('surveyId') || '',
  apiKey: localStorage.getItem('apiKey') || '',
  apiSecret: localStorage.getItem('apiSecret') || ''
};

// DOM Elements
const app = {
  projectTitle: document.getElementById('projectTitle'),
  statusContainer: document.getElementById('statusContainer'),
  tableContainer: document.getElementById('tableContainer'),
  lastUpdated: document.getElementById('lastUpdated'),
};

// Helpers
const getTimestamp = () => new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

const renderError = (message, details = '') => {
  app.statusContainer.innerHTML = `
    <div class="status-message error">
      <strong>Lỗi:</strong> ${message}<br>
      ${details ? `<small>${details}</small>` : ''}
    </div>`;
  app.lastUpdated.textContent = `Cập nhật lần cuối: ${getTimestamp()} (Lỗi)`;
};

const renderSuccess = (message) => {
  app.statusContainer.innerHTML = `
    <div class="status-message success">
      ${message}
    </div>`;
  app.lastUpdated.textContent = `Cập nhật lần cuối: ${getTimestamp()}`;
};

const renderSetupRequired = () => {
  app.projectTitle.textContent = "Chưa cấu hình";
  app.tableContainer.innerHTML = `
    <div style="text-align: center; padding: 3rem;">
      <p style="color: var(--text-secondary); margin-bottom: 1rem;">Hệ thống chưa được cấu hình.</p>
      <a href="/admin.html" class="btn-primary" style="text-decoration: none; display: inline-block;">Đi tới trang Cấu hình</a>
    </div>
  `;
  app.lastUpdated.textContent = "";
};

// Main Logic
const fetchAndRenderData = async () => {
  if (!config.surveyId || !config.apiKey || !config.apiSecret) {
    renderSetupRequired();
    return;
  }

  app.projectTitle.textContent = config.projectName;

  // Use proxy path '/api' which maps to 'https://api.alchemer.com/v5'
  const url = `/api/survey/${config.surveyId}/quotas?api_token=${encodeURIComponent(config.apiKey)}&api_token_secret=${encodeURIComponent(config.apiSecret)}`;

  try {
    app.lastUpdated.textContent = "Đang cập nhật...";
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const result = await response.json();

    if (result.result_ok) {
      processData(result.quotas);
    } else {
      renderError("API trả về lỗi.", result.message || "Không xác định");
    }
  } catch (error) {
    console.error("Fetch Error:", error);
    renderError("Không thể tải dữ liệu.", "Kiểm tra kết nối mạng hoặc cấu hình API.");
  }
};

const processData = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    app.tableContainer.innerHTML = '<p style="padding: 3rem; text-align: center; color: var(--text-secondary);">Không có dữ liệu quota.</p>';
    renderSuccess("Đã tải xong nhưng không có quota nào.");
    return;
  }

  const rows = data.map(item => {
    const id = item.id;
    const name = item.name || 'N/A';
    const responses = parseInt(item.responses, 10) || 0;
    const limit = parseInt(item.limit, 10) || 0;
    const isFull = responses >= limit;

    // Calculate percentage
    let percent = 0;
    if (limit > 0) {
      percent = Math.min(100, Math.round((responses / limit) * 100));
    } else if (responses > 0) {
      percent = 100; // No limit but has responses? Treat as fullish or just show count.
    }

    // Bootstrap Progress Bar Class
    let bgClass = 'bg-primary';
    if (percent >= 100) bgClass = 'bg-danger';
    else if (percent >= 80) bgClass = 'bg-warning';

    return `
      <tr>
        <td><strong>#${id}</strong></td>
        <td>${name}</td>
        <td>
          <div class="d-flex flex-column gap-1">
            <div class="progress">
              <div class="progress-bar ${bgClass}" role="progressbar" style="width: ${percent}%" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <div class="text-end text-muted small">
              <strong>${responses}</strong> / ${limit} (${percent}%)
            </div>
          </div>
        </td>
        <td class="text-center">
          <span class="badge ${isFull ? 'bg-danger' : 'bg-success'} rounded-pill">
            ${isFull ? 'Đã đủ' : 'Đang thu'}
          </span>
        </td>
      </tr>
    `;
  }).join('');

  app.tableContainer.innerHTML = `
    <div class="table-responsive">
      <table class="table table-bordered table-striped table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th style="width: 10%;">ID</th>
            <th style="width: 40%;">Tên Quota</th>
            <th style="width: 35%;">Tiến độ</th>
            <th style="width: 15%; text-align: center;">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
  renderSuccess(`Đã tải thành công ${data.length} quota.`);
};

// Init
fetchAndRenderData();
setInterval(fetchAndRenderData, 300000); // 5 minutes
