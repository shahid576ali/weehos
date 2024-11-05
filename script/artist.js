const categories = [
    "Musicians",
    "Poets",
    "Dancers",
    "Classical",
];

const artists = {
    Musicians: [
        { name: "Mandeep Singh", photo: "../img/mandeep.jpg", rating: 4.5 },
        { name: "Naviin", photo: "../img/naviin.jpg", rating: 4.8 },
        { name: "Bob Johnson", photo: "../img/mandeep.jpg", rating: 4.2 },
        { name: "Alice Cooper", photo: "../img/naviin.jpg", rating: 4.7 },
        { name: "David Bowie", photo: "../img/mandeep.jpg", rating: 5.0 },
        { name: "Freddie Mercury", photo: "../img/naviin.jpg", rating: 5.0 },
        { name: "Ella Fitzgerald", photo: "../img/mandeep.jpg", rating: 4.9 },
    ],
    Poets: [
        { name: "Alice Brown", photo: "../img/naviin.jpg", rating: 4.7 },
        { name: "Charlie Davis", photo: "../img/mandeep.jpg", rating: 4.6 },
    ],
    Dancers: [
        { name: "Eva Green", photo: "../img/mandeep.jpg", rating: 4.9 },
        { name: "Tom Hardy", photo: "../img/naviin.jpg", rating: 4.8 },
        { name: "Meryl Streep", photo: "../img/mandeep.jpg", rating: 5.0 },
        { name: "Leonardo DiCaprio", photo: "../img/naviin.jpg", rating: 4.9 },
    ],
    Classical: [
        { name: "Marina Abramović", photo: "../img/mandeep.jpg", rating: 4.7 },
        { name: "Yoko Ono", photo: "../img/naviin.jpg", rating: 4.5 },
    ],
};

function createArtistCard(artist) {
    const card = document.createElement("div");
    card.className = "artist-card";

    // Wrap the artist card content in a link
    card.innerHTML = `
      <a href="performerProfile.html?name=${artist.name}">
        <img src="${artist.photo}" alt="${artist.name}" class="artist-photo">
        <div class="artist-name">${artist.name}</div>
        <div class="artist-rating">Rating: ${artist.rating}</div>
      </a>
    `;

    return card;
}


function createCategorySection(category) {
    const section = document.createElement("div");
    section.className = "category-section";
    section.innerHTML = `<h2>${category}</h2>`;

    const slider = document.createElement("div");
    slider.className = "artist-slider";

    const categoryArtists = artists[category] || [];
    categoryArtists.forEach(artist => {
        slider.appendChild(createArtistCard(artist));
    });

    section.appendChild(slider);
    return section;
}

function initializePage() {
    const container = document.getElementById("container");
    categories.forEach(category => {
        container.appendChild(createCategorySection(category));
    });
}

// Initialize the page
initializePage();