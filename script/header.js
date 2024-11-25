document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const eventCards = document.querySelectorAll(".card-container .movie");
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        eventCards.forEach((card) => {
            const title = card.querySelector("h3").textContent.toLowerCase();
            if (title.includes(query)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
});
