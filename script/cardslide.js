function initializeCardSlide() {
    console.log("Initializing card slider...");

    const cardContainer = document.querySelector('.card-container');
    const cards = document.querySelectorAll('.card.movie');

    // Check if elements are present
    if (!cardContainer || cards.length === 0) {
        console.error("Card container or cards not found. Retrying...");
        setTimeout(initializeCardSlide, 500); // Retry after 500ms if elements are not found
        return;
    }

    const cardWidth = cards[0].clientWidth; // Get card width dynamically
    const totalCards = cards.length - 1; // Exclude the cloned card if any
    
    console.log(`Found card container and ${cards.length} cards. Card width: ${cardWidth}px`);

    function moveRight() {
        const maxScrollLeft = cardContainer.scrollWidth - cardContainer.clientWidth;

        if (cardContainer.scrollLeft >= maxScrollLeft) {
            cardContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            cardContainer.scrollBy({
                top: 0,
                left: cardWidth,
                behavior: 'smooth'
            });
        }
    }

    function moveLeft() {
        if (cardContainer.scrollLeft <= 0) {
            cardContainer.scrollTo({ left: totalCards * cardWidth, behavior: 'smooth' });
        } else {
            cardContainer.scrollBy({
                top: 0,
                left: -cardWidth,
                behavior: 'smooth'
            });
        }
    }

    function autoScroll() {
        const maxScrollLeft = cardContainer.scrollWidth - cardContainer.clientWidth;

        if (cardContainer.scrollLeft >= maxScrollLeft) {
            cardContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            moveRight();
        }
    }

    let autoScrollInterval = setInterval(autoScroll, 3000); // 3000ms = 3 seconds

    // Pause auto-scroll on mouse enter and resume on mouse leave
    cardContainer.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
    cardContainer.addEventListener('mouseleave', () => {
        autoScrollInterval = setInterval(autoScroll, 3000);
    });

    console.log("Card slider initialized successfully.");
}
