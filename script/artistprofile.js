let activeTab = 0;
let currentPage = 1;
let rowsPerPage = 5;
let searchTerm = '';
let currentSortColumn = -1;
let isAscending = true;

const eventsData = [
    { id: 1, name: 'Conference A', type: 'Conference', date: '2024-10-15', venue: 'Convention Center', status: 'Upcoming' },
    { id: 2, name: 'Workshop B', type: 'Workshop', date: '2024-11-20', venue: 'Tech Hub', status: 'Ongoing' },
    { id: 3, name: 'Seminar C', type: 'Seminar', date: '2024-12-05', venue: 'University Hall', status: 'Completed' },
    { id: 4, name: 'Conference A', type: 'Conference', date: '2024-10-15', venue: 'Convention Center', status: 'Upcoming' },
    { id: 5, name: 'Workshop B', type: 'Workshop', date: '2024-11-20', venue: 'Tech Hub', status: 'Ongoing' },
    { id: 6, name: 'Seminar C', type: 'Seminar', date: '2024-12-05', venue: 'University Hall', status: 'Completed' },
    { id: 7, name: 'Conference A', type: 'Conference', date: '2024-10-15', venue: 'Convention Center', status: 'Upcoming' },
    { id: 8, name: 'Workshop B', type: 'Workshop', date: '2024-11-20', venue: 'Tech Hub', status: 'Ongoing' },
    { id: 9, name: 'Seminar C', type: 'Seminar', date: '2024-12-05', venue: 'University Hall', status: 'Completed' },
    { id: 10, name: 'Conference A', type: 'Conference', date: '2024-10-15', venue: 'Convention Center', status: 'Upcoming' },
    // Add more mock data as needed
];

const requestsData = [
    { id: 1, name: 'Meeting D', type: 'Meeting', date: '2024-10-25', venue: 'Board Room' },
    { id: 2, name: 'Training E', type: 'Training', date: '2024-11-30', venue: 'Training Center' },
    { id: 3, name: 'Workshop F', type: 'Workshop', date: '2024-12-15', venue: 'Innovation Lab' },
    // Add more mock data as needed
];

function sortTable(columnIndex) {
    if (columnIndex === currentSortColumn) {
        isAscending = !isAscending;
    } else {
        currentSortColumn = columnIndex;
        isAscending = true;
    }

    renderTable();
}

function showTab(tabIndex) {
    activeTab = tabIndex;
    document.querySelectorAll('.tab-button').forEach((btn, index) => {
        btn.classList.toggle('active', index === tabIndex);
    });
    currentPage = 1;
    currentSortColumn = -1;
    isAscending = true;
    renderTable();
}

function filterTable() {
    searchTerm = document.getElementById('search-input').value.toLowerCase();
    currentPage = 1;
    renderTable();
}

function changeRowsPerPage() {
    rowsPerPage = parseInt(document.getElementById('rows-per-page').value);
    currentPage = 1;
    renderTable();
}

function changePage(direction) {
    const totalPages = Math.ceil(getFilteredData().length / rowsPerPage);
    currentPage = Math.max(1, Math.min(currentPage + direction, totalPages));
    renderTable();
}

function getFilteredData() {
    const data = activeTab === 0 ? eventsData : requestsData;
    let filteredData = data.filter(item =>
        Object.values(item).some(val =>
            val.toString().toLowerCase().includes(searchTerm)
        )
    );

    if (currentSortColumn !== -1) {
        const key = Object.keys(filteredData[0])[currentSortColumn];
        filteredData.sort((a, b) => {
            if (a[key] < b[key]) return isAscending ? -1 : 1;
            if (a[key] > b[key]) return isAscending ? 1 : -1;
            return 0;
        });
    }

    return filteredData;
}

function renderTable() {
    const filteredData = getFilteredData();
    const tableBody = document.querySelector('#data-table tbody');
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);

    tableBody.innerHTML = '';
    pageData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.type}</td>
            <td>${item.date}</td>
            <td>${item.venue}</td>
            <td>${activeTab === 0 ? item.status : getActionButtons()}</td>
        `;
        tableBody.appendChild(row);
    });

    updatePagination(filteredData.length);
}

function getActionButtons() {
    return `
        <button class="action-button accept" onclick="handleAction('accept')">Accept</button>
        <button class="action-button reject" onclick="handleAction('reject')">Reject</button>
        <button class="action-button postpone" onclick="handleAction('postpone')">Postpone</button>
    `;
}

function handleAction(action) {
    alert(`Action: ${action}`);
    // Implement the actual action logic here
}

function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / rowsPerPage);
    const pageInfo = document.getElementById('page-info');
    const pageNumbers = document.getElementById('page-numbers');

    pageInfo.textContent = `Showing ${((currentPage - 1) * rowsPerPage) + 1} to ${Math.min(currentPage * rowsPerPage, totalItems)} of ${totalItems} entries`;

    pageNumbers.innerHTML = '';
    const maxVisiblePages = 5;
    const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, currentPage - halfMaxVisiblePages);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        pageNumbers.appendChild(createPageButton(1));
        if (startPage > 2) {
            pageNumbers.appendChild(createEllipsis());
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.appendChild(createPageButton(i));
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pageNumbers.appendChild(createEllipsis());
        }
        pageNumbers.appendChild(createPageButton(totalPages));
    }

    const prevButton = document.querySelector('button[onclick="changePage(-1)"]');
    const nextButton = document.querySelector('button[onclick="changePage(1)"]');
    
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
}

function changePage(direction) {
    const totalPages = Math.ceil(getFilteredData().length / rowsPerPage);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderTable();
    }
}

function createPageButton(page) {
    const button = document.createElement('button');
    button.textContent = page;
    button.onclick = () => {
        currentPage = page;
        renderTable();
    };
    if (page === currentPage) {
        button.disabled = true;
    }
    return button;
}

function createEllipsis() {
    const span = document.createElement('span');
    span.textContent = '...';
    span.classList.add('ellipsis');
    return span;
}

renderTable();