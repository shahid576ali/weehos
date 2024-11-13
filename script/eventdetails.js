document.addEventListener('DOMContentLoaded', () => {
    const movieHero = document.querySelector('.movie-hero');
    const stickyHeader = document.getElementById('stickyHeader');
    const bookBtn = document.getElementById('bookBtn');
    const stickyBookBtn = document.getElementById('stickyBookBtn');

    // Sticky header functionality
    const showStickyHeader = () => {
        const scrollPosition = window.pageYOffset;
        const heroHeight = movieHero.offsetHeight;

        if (scrollPosition > heroHeight) {
            stickyHeader.classList.add('visible');
        } else {
            stickyHeader.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', showStickyHeader);

    // Booking functionality
    const handleBooking = (btn) => {
        if (confirm('Are you sure you want to book this event?')) {
            btn.textContent = 'Event Booked Successfully!';
            btn.classList.add('booked');
            btn.disabled = true;

            setTimeout(() => {
                btn.disabled = false;
                btn.textContent = 'Book Event';
                btn.classList.remove('booked');
            }, 2000);
        }
    };

    bookBtn.addEventListener('click', () => handleBooking(bookBtn));
    stickyBookBtn.addEventListener('click', () => handleBooking(stickyBookBtn));

    // Slider functionality
    const sliders = document.querySelectorAll('.cast-slider, .review-slider, .movie-carousel');

    sliders.forEach(slider => {
        const container = slider.querySelector('.cast-container, .review-container, .movie-carousel__container');
        const prevBtn = slider.querySelector('.prev-arrow, .movie-carousel__nav--prev');
        const nextBtn = slider.querySelector('.next-arrow, .movie-carousel__nav--next');

        if (!container || !prevBtn || !nextBtn) return;

        const updateArrows = () => {
            const isAtStart = container.scrollLeft <= 0;
            const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;

            prevBtn.style.display = isAtStart ? 'none' : 'block';
            nextBtn.style.display = isAtEnd ? 'none' : 'block';
        };

        const scrollContainer = (direction) => {
            const scrollAmount = direction * container.offsetWidth * 0.8;
            container.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        };

        container.addEventListener('scroll', updateArrows);

        nextBtn.addEventListener('click', () => scrollContainer(1));
        prevBtn.addEventListener('click', () => scrollContainer(-1));

        updateArrows();

        window.addEventListener('resize', updateArrows);
        window.addEventListener('load', updateArrows);
    });

    const readMoreButtons = document.querySelectorAll('.read-more');
    readMoreButtons.forEach(button => {
        button.addEventListener('click', () => {
            const reviewText = button.previousElementSibling;
            if (reviewText.style.maxHeight) {
                reviewText.style.maxHeight = null;
                button.textContent = '...more';
            } else {
                reviewText.style.maxHeight = reviewText.scrollHeight + 'px';
                button.textContent = 'Show less';
            }
        });
    });

    // rating
    const rateBtn = document.querySelector('.rate-btn');
    const popup = document.getElementById('rating-popup');
    const closeBtn = document.querySelector('.close');
    const ratingInput = document.getElementById('rating');
    const ratingValue = document.getElementById('rating-value');
    const hashtagSuggestions = document.getElementById('hashtag-suggestions');
    const hashtagInput = document.getElementById('hashtags');
    const ratingForm = document.getElementById('rating-form');

    const hashtagsByRating = {
        0: ["#awful", "#worst"],
        5: ["#average", "#okay"],
        10: ["#awesome", "#best"]
    };

    let currentHashtags = [];

    rateBtn.addEventListener('click', function () {
        popup.style.display = 'flex';
    });

    closeBtn.addEventListener('click', function () {
        popup.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });

    ratingInput.addEventListener('input', function () {
        const value = ratingInput.value;
        ratingValue.textContent = value;
        updateHashtagSuggestions(value);
        ratingInput.oninput = function () {
            this.style.background = `linear-gradient(to right, #333545 0%, #333545 ${(this.value - this.min) / (this.max - this.min) * 100}%, #DEE2E6 ${(this.value - this.min) / (this.max - this.min) * 100}%, #DEE2E6 100%)`
        };
    });

    hashtagInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addHashtag(hashtagInput.value);
            hashtagInput.value = '';
        }
    });

    hashtagSuggestions.addEventListener('click', function (event) {
        if (event.target.classList.contains('hashtag')) {
            removeHashtag(event.target.textContent);
        }
    });

    function addHashtag(hashtag) {
        if (hashtag && !currentHashtags.includes(hashtag)) {
            currentHashtags.push(hashtag);
            renderHashtags();
        }
    }

    function removeHashtag(hashtag) {
        currentHashtags = currentHashtags.filter(h => h !== hashtag);
        renderHashtags();
    }

    function renderHashtags() {
        hashtagSuggestions.innerHTML = '';
        currentHashtags.forEach(function (hashtag) {
            const span = document.createElement('span');
            span.textContent = hashtag;
            span.classList.add('hashtag');
            hashtagSuggestions.appendChild(span);
        });
    }

    function updateHashtagSuggestions(value) {
        hashtagSuggestions.innerHTML = '';
        const suggestions = hashtagsByRating[value] || [];
        suggestions.forEach(function (hashtag) {
            const span = document.createElement('span');
            span.textContent = hashtag;
            span.classList.add('hashtag');
            hashtagSuggestions.appendChild(span);
        });
        currentHashtags = suggestions;
    }

    ratingForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const rating = ratingInput.value;
        const hashtags = currentHashtags.join(', ');
        const review = document.getElementById('review').value;
        // send data to the server
        console.log({ rating, hashtags, review });
        popup.style.display = 'none';
    });
});
