import '../style.css'

const form = document.getElementById('adminForm');
const inputs = {
    apiKey: document.getElementById('apiKey'),
    apiSecret: document.getElementById('apiSecret')
};
const statusMessage = document.getElementById('statusMessage');

// Load existing config
const loadConfig = () => {
    inputs.apiKey.value = localStorage.getItem('apiKey') || '';
    inputs.apiSecret.value = localStorage.getItem('apiSecret') || '';
};

// Save config
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const config = {
        apiKey: inputs.apiKey.value.trim(),
        apiSecret: inputs.apiSecret.value.trim()
    };

    if (!config.apiKey || !config.apiSecret) {
        statusMessage.innerHTML = '<span style="color: var(--error-text);">Vui lòng điền đầy đủ thông tin API.</span>';
        return;
    }

    localStorage.setItem('apiKey', config.apiKey);
    localStorage.setItem('apiSecret', config.apiSecret);

    statusMessage.innerHTML = '<span style="color: var(--success-text);">Đã lưu cấu hình API thành công!</span>';
});

loadConfig();

// Link Generator Logic
const generatorForm = document.getElementById('generatorForm');
const genProjectName = document.getElementById('genProjectName');
const genSurveyId = document.getElementById('genSurveyId');
const resultContainer = document.getElementById('resultContainer');
const generatedLink = document.getElementById('generatedLink');
const copyBtn = document.getElementById('copyBtn');
const openLinkBtn = document.getElementById('openLinkBtn');

if (generatorForm) {
    generatorForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = genSurveyId.value.trim();
        const name = genProjectName.value.trim();

        if (!id) return;

        const baseUrl = window.location.origin;
        const url = new URL(baseUrl);
        url.searchParams.set('id', id);
        if (name) {
            url.searchParams.set('name', name);
        }

        const linkUrl = url.toString();
        generatedLink.value = linkUrl;
        openLinkBtn.href = linkUrl;
        resultContainer.classList.remove('d-none');

        // Save to localStorage
        saveLink({
            name: name || `Dự án ${id}`,
            id: id,
            url: linkUrl
        });

        // Render updated list
        renderSavedLinks();
    });
}

if (copyBtn) {
    copyBtn.addEventListener('click', () => {
        generatedLink.select();
        navigator.clipboard.writeText(generatedLink.value).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Đã copy!';
            setTimeout(() => copyBtn.textContent = originalText, 2000);
        });
    });
}

// Saved Links Management
const savedLinksContainer = document.getElementById('linkHistory');

function getSavedLinks() {
    const saved = localStorage.getItem('savedProjects');
    return saved ? JSON.parse(saved) : [];
}

function saveLink(project) {
    const links = getSavedLinks();
    // Check if link already exists
    const exists = links.find(l => l.id === project.id && l.name === project.name);
    if (!exists) {
        links.push(project);
        localStorage.setItem('savedProjects', JSON.stringify(links));
    }
}

function deleteLink(index) {
    const links = getSavedLinks();
    links.splice(index, 1);
    localStorage.setItem('savedProjects', JSON.stringify(links));
    renderSavedLinks();
}

function renderSavedLinks() {
    const links = getSavedLinks();

    if (links.length === 0) {
        savedLinksContainer.innerHTML = '<p class="text-muted text-center mb-0">Chưa có link nào được lưu.</p>';
        return;
    }

    const listHtml = `
    <div class="table-responsive">
      <table class="table table-hover align-middle mb-0">
        <thead class="table-light">
          <tr>
            <th>Tên Dự Án</th>
            <th>ID</th>
            <th class="text-end">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          ${links.map((link, index) => `
            <tr>
              <td class="fw-semibold">${link.name}</td>
              <td><span class="badge bg-secondary">${link.id}</span></td>
              <td class="text-end">
                <a href="${link.url}" target="_blank" class="btn btn-sm btn-outline-primary me-1">Mở</a>
                <button class="btn btn-sm btn-outline-danger" onclick="window.deleteLink(${index})">Xóa</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

    savedLinksContainer.innerHTML = listHtml;
}

// Make deleteLink available globally for onclick handlers
window.deleteLink = deleteLink;

// Initial render
renderSavedLinks();
