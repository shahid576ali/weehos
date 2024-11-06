const events = [
    {
        id: 1,
        title: "Music Festival",
        date: "September 20, 2024",
        category: "music",
        performer: "performer1",
        image: "img/miceevent.jpg",
    },
    {
        id: 2,
        title: "MICE Event",
        date: "October 5, 2024",
        category: "sports",
        performer: "performer2",
        image: "img/miceevent.jpg",
    },
    {
        id: 3,
        title: "Corporate Event",
        date: "November 15, 2024",
        category: "arts",
        performer: "performer3",
        image: "img/miceevent.jpg",
    },
    {
        id: 4,
        title: "Rock Concert",
        date: "December 1, 2024",
        category: "music",
        performer: "performer1",
        image: "img/miceevent.jpg",
    },
    {
        id: 5,
        title: "Sports Event",
        date: "January 10, 2025",
        category: "sports",
        performer: "performer2",
        image: "img/familygettogether.jpg",
    },
    {
        id: 6,
        title: "Theater Play",
        date: "February 20, 2025",
        category: "arts",
        performer: "performer3",
        image: "img/familygettogether.jpg",
    },
    {
        id: 7,
        title: "Jazz Night",
        date: "March 15, 2025",
        category: "music",
        performer: "performer2",
        image: "img/familygettogether.jpg",
    },
    {
        id: 8,
        title: "Birthday Event",
        date: "April 5, 2025",
        category: "sports",
        performer: "performer1",
        image: "img/familygettogether.jpg",
    },
    {
        id: 9,
        title: "Wedding Event",
        date: "May 1, 2025",
        category: "arts",
        performer: "performer3",
        image: "img/friends.jpeg",
    },
    {
        id: 10,
        title: "Fun Event",
        date: "June 10, 2025",
        category: "music",
        performer: "performer1",
        image: "img/friends.jpeg",
    },
];

function createEventCard(event) {
    return `
        <div class="event-card" data-category="${event.category}" data-performer="${event.performer}">
            <img src="${event.image}" alt="${event.title}" class="event-image">
            <div class="event-details">
                <h3 class="event-title">${event.title}</h3>
                <p class="event-date">${event.date}</p>
            </div>
        </div>
    `;
}

function renderEvents(filteredEvents) {
    const eventGrid = document.getElementById("event-grid");
    eventGrid.innerHTML = filteredEvents.map(createEventCard).join("");
}

function applyFilter() {
    const eventNameFilter = document.getElementById("eventNameFilter").value.toLowerCase();
    const performerFilter = document.getElementById("performerFilter").value.toLowerCase();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const eventTypeFilter = document.getElementById("eventTypeFilter").value.toLowerCase();

    const filteredEvents = events.filter((event) => {
        const matchesTitle = event.title.toLowerCase().includes(eventNameFilter);
        const matchesPerformer = event.performer.toLowerCase().includes(performerFilter);
        const matchesDate =
            (!startDate || new Date(event.date) >= new Date(startDate)) &&
            (!endDate || new Date(event.date) <= new Date(endDate));
        const matchesType = !eventTypeFilter || event.title.toLowerCase().includes(eventTypeFilter);

        return matchesTitle && matchesPerformer && matchesDate && matchesType;
    });

    renderEvents(filteredEvents);
}

function liveFilter() {
    const searchTerm = document.getElementById("search-input").value.toLowerCase();
    const filteredEvents = events.filter((event) => {
        return event.title.toLowerCase().includes(searchTerm) ||
            event.date.toLowerCase().includes(searchTerm) ||
            event.category.toLowerCase().includes(searchTerm) ||
            event.performer.toLowerCase().includes(searchTerm);
    });

    renderEvents(filteredEvents);
}

function showFilterOptions() {
    const filterBy = document.getElementById("filterBy").value;
    document.querySelectorAll(".filter-options").forEach((option) => {
        option.style.display = "none";
    });
    if (filterBy) {
        document.getElementById(`${filterBy}Options`).style.display = "block";
    }
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

window.onload = function () {
    const eventTypeFromURL = getQueryParam("eventType");
    if (eventTypeFromURL) {
        const eventTypeFilter = document.getElementById("eventTypeFilter");
        eventTypeFilter.value = eventTypeFromURL;
        applyFilter();
    }
    else {
        renderEvents(events);
    }
};

document.getElementById("search-input").addEventListener("input", liveFilter);
