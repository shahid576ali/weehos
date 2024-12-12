const categories = [
    "Musicians",
    "Poets",
    "Dancers",
    "Classical",
];

const artists = {
    Musicians: [
        { name: "Mandeep Singh", photo: "images/artists/mandeep.jpg", rating: 4.5 },
        { name: "Naviin", photo: "images/artists/naviin.jpg", rating: 4.8 },
        { name: "Bob Johnson", photo: "images/artists/mandeep.jpg", rating: 4.2 },
        { name: "Alice Cooper", photo: "images/artists/naviin.jpg", rating: 4.7 },
        { name: "David Bowie", photo: "images/artists/mandeep.jpg", rating: 5.0 },
        { name: "Freddie Mercury", photo: "images/artists/naviin.jpg", rating: 5.0 },
        { name: "Ella Fitzgerald", photo: "images/artists/mandeep.jpg", rating: 4.9 },
    ],
    Poets: [
        { name: "Alice Brown", photo: "images/artists/naviin.jpg", rating: 4.7 },
        { name: "Charlie Davis", photo: "images/artists/mandeep.jpg", rating: 4.6 },
    ],
    Dancers: [
        { name: "Eva Green", photo: "images/artists/mandeep.jpg", rating: 4.9 },
        { name: "Tom Hardy", photo: "images/artists/naviin.jpg", rating: 4.8 },
        { name: "Meryl Streep", photo: "images/artists/mandeep.jpg", rating: 5.0 },
        { name: "Leonardo DiCaprio", photo: "images/artists/naviin.jpg", rating: 4.9 },
    ],
    Classical: [
        { name: "Marina Abramović", photo: "images/artists/mandeep.jpg", rating: 4.7 },
        { name: "Yoko Ono", photo: "images/artists/naviin.jpg", rating: 4.5 },
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