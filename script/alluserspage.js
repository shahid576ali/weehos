document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#eventTable tbody');
    const entriesPerPageSelect = document.getElementById('entriesPerPage');
    const entryCountDiv = document.getElementById('entryCount');
    const paginationNumbers = document.getElementById('paginationNumbers');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const searchInput = document.getElementById('searchInput');
    const aboutIcon = document.getElementById('aboutIcon');
    const closePhotoModal = document.getElementsByClassName('photo-modal')[0];
    const modal = document.getElementById('positionModal');
    const closeBtn = document.getElementsByClassName('close')[0];
    const positionSelect = document.getElementById('positionSelect');
    const savePositionBtn = document.getElementById('savePosition');
    const roleSelect = document.getElementById('roleSelect');
    const performersSelect = document.getElementById('performersSelect');
    let currentEditIndex = -1;

    let currentPage = 1;
    let entriesPerPage = parseInt(entriesPerPageSelect.value);
    let filteredEntries = [];
    let showingUsersWithoutPhoto = false;

    let entries = [];

    const fetchData = async () => {
        try {
            const response = await fetch('all_users.php');
            const data = await response.json();
    
            entries = data.map(user => ({
                photo: getPhotoPath(user),
                userId: user.user_id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                user_type: user.user_type,
                organization_genre: user.organization_genre
            }));
    
            filteredEntries = entries;
            renderTable();
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };
    
    const getPhotoPath = (user) => {
        const folder = 'images/allusers/';
        const photoName = user.photo
            ? `${user.id}.png`
            : 'user.png';
        return folder + photoName;
    };

    const renderTable = () => {
        tableBody.innerHTML = '';
        const startIndex = (currentPage - 1) * entriesPerPage;
        const endIndex = startIndex + entriesPerPage;
        const currentEntries = showingUsersWithoutPhoto
            ? filteredEntries.filter(entry => !entry.photo)
            : filteredEntries;
        const displayedEntries = currentEntries.slice(startIndex, endIndex);

        displayedEntries.forEach((entry, index) => {
            const row = document.createElement('tr');
            const photoCell = document.createElement('td');
            const photo = document.createElement('img');
            if (entry.photo) {
                photo.src = entry.photo;
            } else {
                photo.src = "images/allusers/user.png";
                notifyUser(entry);
            }
            photo.alt = entry.name;
            photo.classList.add('photo');
            photo.addEventListener('click', () => showEnlargedPhoto(entry.photo));
            photoCell.appendChild(photo);
            row.appendChild(photoCell);

            const userIdCell = document.createElement('td');
            userIdCell.textContent = entry.userId;
            row.appendChild(userIdCell);

            ['name', 'email', 'phone','user_type', 'organization_genre'].forEach(key => {
                const cell = document.createElement('td');
                cell.textContent = entry[key];
                row.appendChild(cell);
            });

            const actionCell = document.createElement('td');
            const moveUpButton = createActionButton('⬆', 'move-up', () => moveEntry(startIndex + index, -1));
            const moveDownButton = createActionButton('⬇', 'move-down', () => moveEntry(startIndex + index, 1));
            const changePositionButton = createActionButton('✎', 'change-position', () => openPositionModal(startIndex + index));
            const emailButton = createActionButton('✉', 'email', () => openEmailModal(entry));
            actionCell.appendChild(moveUpButton);
            actionCell.appendChild(moveDownButton);
            actionCell.appendChild(changePositionButton);
            actionCell.appendChild(emailButton);
            row.appendChild(actionCell);
            tableBody.appendChild(row);
        });

        updatePagination();
        updateNotificationArea();
    };

    const updateNotificationArea = () => {
        const notificationArea = document.getElementById('notificationArea');
        const notificationText = document.getElementById('notificationText');
        const aboutIcon = document.getElementById('aboutIcon');
        const usersWithoutPhoto = filteredEntries.filter(entry => !entry.photo);

        if (usersWithoutPhoto.length > 0) {
            notificationText.textContent = `${usersWithoutPhoto.length} user(s) need to upload a profile photo.`;
            notificationArea.style.display = 'flex';
            aboutIcon.style.display = 'inline';
        } else {
            notificationArea.style.display = 'none';
        }
    };

    const notifyUser = (entry) => {
        console.log(`Notification sent to ${entry.name} (${entry.email}): Please upload a profile photo.`);
    };

    const toggleUsersWithoutPhoto = () => {
        showingUsersWithoutPhoto = !showingUsersWithoutPhoto;
        currentPage = 1;
        renderTable();
    };

    const showEnlargedPhoto = (src) => {
        const modal = document.getElementById('photoModal');
        const enlargedPhoto = document.getElementById('enlargedPhoto');
        enlargedPhoto.src = src;
        modal.style.display = 'block';
    };

    closePhotoModal.onclick = () => {
        document.getElementById('photoModal').style.display = 'none';
    };

    const saveChanges = () => {
        const changes = entries.map(entry => ({
            name: entry.name,
            position: entry.position
        }));
        localStorage.setItem('userChanges', JSON.stringify(changes));
    };

    const createActionButton = (text, className, onClick) => {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.add('action-button', className);
        button.addEventListener('click', onClick);
        return button;
    };

    const moveEntry = (index, direction) => {
        const newIndex = index + direction;
        if (newIndex >= 0 && newIndex < filteredEntries.length) {
            const [movedEntry] = filteredEntries.splice(index, 1);
            filteredEntries.splice(newIndex, 0, movedEntry);
            entries = [...filteredEntries];
            saveChanges();
            currentPage = Math.floor(newIndex / entriesPerPage) + 1;
            renderTable();
        }
    };

    const openPositionModal = (index) => {
        currentEditIndex = index;
        positionSelect.value = filteredEntries[index].position;
        modal.style.display = 'block';
    };

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    savePositionBtn.onclick = () => {
        if (currentEditIndex !== -1) {
            filteredEntries[currentEditIndex].position = positionSelect.value;
            entries = [...filteredEntries];
            saveChanges();
            renderTable();
            modal.style.display = 'none';
        }
    };


    function openEmailModal(entry) {
        const modal = document.getElementById('emailModal');
        const span = modal.querySelector('.close');

        performersSelect.innerHTML = '';

        roleSelect.innerHTML = '<option value="">All Positions</option>';
        const positions = [...new Set(filteredEntries.map(user => user.position))];
        positions.forEach(position => {
            const option = document.createElement('option');
            option.value = position;
            option.textContent = position;
            roleSelect.appendChild(option);
        });

        function updatePerformers() {
            const selectedPosition = roleSelect.value;
            performersSelect.innerHTML = '';
            filteredEntries.forEach(user => {
                if (!selectedPosition || user.position === selectedPosition) {
                    const option = document.createElement('option');
                    option.value = user.userId;
                    option.textContent = `${user.name} (${user.position})`;
                    performersSelect.appendChild(option);
                }
            });
        }

        updatePerformers();

        roleSelect.addEventListener('change', updatePerformers);


        modal.style.display = 'block';

        span.onclick = function () {
            modal.style.display = 'none';
        }

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    }

    document.getElementById('sendInvitation').addEventListener('click', function () {
        const selectedPerformers = Array.from(performersSelect.selectedOptions)
            .map(option => {
                const user = filteredEntries.find(u => u.userId === option.value);
                return {
                    name: user.name,
                    position: user.position,
                    photo: user.photo
                };
            });

        if (selectedPerformers.length === 0) {
            alert('Please select at least one performer.');
            return;
        }

        const eventDetails = {
            name: document.getElementById('eventName').value,
            description: document.getElementById('eventDescription').value,
            dateTime: document.getElementById('eventDateTime').value,
            venue: document.getElementById('eventVenue').value,
            organizer: {
                name: document.getElementById('organizerName').value,
                email: document.getElementById('organizerEmail').value,
                phone: document.getElementById('organizerPhone').value
            }
        };

        localStorage.setItem('selectedPerformers', JSON.stringify(selectedPerformers));
        localStorage.setItem('eventDetails', JSON.stringify(eventDetails));

        window.open('preEventInvitation.html', '_blank');
    });

    const updatePagination = () => {
        const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);
        paginationNumbers.innerHTML = '';

        const maxVisiblePages = 5;
        const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);
        let startPage = Math.max(1, currentPage - halfMaxVisiblePages);
        let endPage = Math.min(totalPages, currentPage + halfMaxVisiblePages);

        if (currentPage <= halfMaxVisiblePages) {
            endPage = Math.min(totalPages, maxVisiblePages);
        }

        if (currentPage > totalPages - halfMaxVisiblePages) {
            startPage = Math.max(1, totalPages - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            paginationNumbers.appendChild(createPageButton(1));
            if (startPage > 2) {
                paginationNumbers.appendChild(createEllipsis());
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationNumbers.appendChild(createPageButton(i));
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationNumbers.appendChild(createEllipsis());
            }
            paginationNumbers.appendChild(createPageButton(totalPages));
        }

        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;

        const startIndex = (currentPage - 1) * entriesPerPage + 1;
        const endIndex = Math.min(currentPage * entriesPerPage, filteredEntries.length);
        entryCountDiv.textContent = `Showing ${startIndex} to ${endIndex} of ${filteredEntries.length} entries`;
    };

    const createPageButton = (page) => {
        const pageButton = document.createElement('button');
        pageButton.textContent = page;
        pageButton.classList.toggle('active', page === currentPage);
        pageButton.addEventListener('click', () => {
            currentPage = page;
            renderTable();
        });
        return pageButton;
    };

    const createEllipsis = () => {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        ellipsis.classList.add('ellipsis');
        return ellipsis;
    };

    const filterEntries = () => {
        const searchTerm = searchInput.value.toLowerCase();
        filteredEntries = entries.filter(entry => {
            const matchesSearch = Object.values(entry).some(value =>
                value.toString().toLowerCase().includes(searchTerm)
            );
            return showingUsersWithoutPhoto ? matchesSearch && !entry.photo : matchesSearch;
        });
        currentPage = 1;
        renderTable();
    };

    entriesPerPageSelect.addEventListener('change', (event) => {
        entriesPerPage = parseInt(event.target.value);
        renderTable();
    });

    searchInput.addEventListener('input', filterEntries);

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    nextButton.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });

    filteredEntries = entries;

    const tableHeaders = document.querySelectorAll('#eventTable th');
    tableHeaders.forEach((header, index) => {
        header.addEventListener('click', () => {
            const isAscending = header.classList.contains('asc');
            tableHeaders.forEach(h => h.classList.remove('asc', 'desc'));
            header.classList.toggle(isAscending ? 'desc' : 'asc');

            const key = getKeyFromIndex(index);
            sortEntries(key, !isAscending);
        });
    });

    function getKeyFromIndex(index) {
        const keys = ['photo', 'userId', 'name', 'email', 'phone', 'user_type', 'organization_genre'];
        return keys[index];
    }

    function sortEntries(key, ascending) {
        filteredEntries.sort((a, b) => {
            if (key === 'userId') {
                const aNum = parseInt(a[key].replace('USER', ''));
                const bNum = parseInt(b[key].replace('USER', ''));
                return ascending ? aNum - bNum : bNum - aNum;
            }
            if (a[key] < b[key]) return ascending ? -1 : 1;
            if (a[key] > b[key]) return ascending ? 1 : -1;
            return 0;
        });
        renderTable();
    }

    aboutIcon.addEventListener('click', toggleUsersWithoutPhoto);
    initializeEntries();
    filterEntries();
    fetchData();
});