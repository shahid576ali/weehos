const cardsPerPage = 2;
let activeReview = 'user';
let isLoading = false;
let userReviews = [];
let criticReviews = [];
let userCurrentPage = 0;
let criticCurrentPage = 0;

const loaderHTML = `
  <div class="loader-container" id="loader-container">
    <div class="loader-box">
      <div class="loading_box"></div>
    </div>
  </div>
`;

document.addEventListener('DOMContentLoaded', function () {
    const userReviewsSection = document.querySelector('.review:first-child');
    const criticReviewsSection = document.querySelector('.review:last-child');
    const userReviewsContent = document.querySelector('.user_review_1');
    const criticReviewsContent = document.querySelector('.critic_container');
    const bookBtn = document.getElementById('bookBtn');

    updateActiveState();

    userReviewsSection.addEventListener('click', function () {
        activeReview = 'user';
        updateActiveState();
    });

    criticReviewsSection.addEventListener('click', function () {
        activeReview = 'critic';
        updateActiveState();
    });

    function updateActiveState() {
        if (activeReview === 'user') {
            userReviewsSection.classList.remove('review_user');
            userReviewsSection.classList.add('review_critic');
            criticReviewsSection.classList.remove('review_critic');
            criticReviewsSection.classList.add('review_user');
            userReviewsContent.style.display = 'block';
            criticReviewsContent.style.display = 'none';
        } else {
            criticReviewsSection.classList.remove('review_user');
            criticReviewsSection.classList.add('review_critic');
            userReviewsSection.classList.remove('review_critic');
            userReviewsSection.classList.add('review_user');
            criticReviewsContent.style.display = 'block';
            userReviewsContent.style.display = 'none';
        }
    }

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

    initializeReviews(userReviewsData, criticReviewsData);
    window.addEventListener('scroll', handleScroll);

    initializeRatingFunctionality();
});

function loadMoreReviews(isUserReview) {
    const container = isUserReview ? document.querySelector('.user_review_1') : document.querySelector('.critic_container');
    if (!container) {
        console.error(isUserReview ? "User review container not found" : "Critic review container not found");
        return;
    }

    const existingLoader = container.querySelector('#loader-container');
    if (existingLoader) {
        existingLoader.remove();
    }

    container.insertAdjacentHTML('beforeend', loaderHTML);
    const loader = container.querySelector('#loader-container');

    setTimeout(() => {
        const reviews = isUserReview ? userReviews : criticReviews;
        const currentPage = isUserReview ? userCurrentPage : criticCurrentPage;
        const startIndex = currentPage * cardsPerPage;
        const endIndex = Math.min((currentPage + 1) * cardsPerPage, reviews.length);

        for (let i = startIndex; i < endIndex; i++) {
            const card = isUserReview ? createUserCard(reviews[i], i) : createCriticCard(reviews[i], i);
            container.insertBefore(card, loader);
        }

        if (isUserReview) {
            userCurrentPage++;
        } else {
            criticCurrentPage++;
        }

        loader.remove();

        if (endIndex >= reviews.length) {
            if (isUserReview) {
                userReviewsLoaded = true;
            } else {
                criticReviewsLoaded = true;
            }
        }

        isLoading = false;
    }, 1000);
}

let userReviewsLoaded = false;
let criticReviewsLoaded = false;

function handleScroll() {
    if (isLoading) return;

    const activeContainer = document.querySelector(activeReview === 'user' ? '.user_review_1' : '.critic_container');
    if (!activeContainer) {
        console.error("Active review container not found");
        return;
    }

    const contentBottom = activeContainer.offsetTop + activeContainer.offsetHeight;
    if ((window.innerHeight + window.scrollY) >= contentBottom - 10) {
        isLoading = true;
        if (activeReview === 'user' && !userReviewsLoaded) {
            loadMoreReviews(true);
        } else if (activeReview === 'critic' && !criticReviewsLoaded) {
            loadMoreReviews(false);
        }
    }
}

function updateActiveState() {
    if (activeReview === 'user') {
        userReviewsSection.classList.remove('review_user');
        userReviewsSection.classList.add('review_critic');
        criticReviewsSection.classList.remove('review_critic');
        criticReviewsSection.classList.add('review_user');
        userReviewsContent.style.display = 'block';
        criticReviewsContent.style.display = 'none';
        if (!userReviewsLoaded) {
            loadMoreReviews(true);
        }
    } else {
        criticReviewsSection.classList.remove('review_user');
        criticReviewsSection.classList.add('review_critic');
        userReviewsSection.classList.remove('review_critic');
        userReviewsSection.classList.add('review_user');
        criticReviewsContent.style.display = 'block';
        userReviewsContent.style.display = 'none';
        if (!criticReviewsLoaded) {
            loadMoreReviews(false);
        }
    }
}

function handleScroll() {
    if (isLoading) return;

    const activeContainer = document.querySelector(activeReview === 'user' ? '.user_review_1' : '.critic_container');
    if (!activeContainer) {
        console.error("Active review container not found");
        return;
    }
    const contentBottom = activeContainer.offsetTop + activeContainer.offsetHeight;
    if ((window.innerHeight + window.scrollY) >= contentBottom - 10) {
        isLoading = true;
        loadMoreReviews(activeReview === 'user');
    }
}

function initializeReviews(userReviewsData, criticReviewsData) {
    userReviews = userReviewsData;
    criticReviews = criticReviewsData;

    loadMoreReviews(true);
    loadMoreReviews(false);
}

function createUserCard(review) {
    const userCard = document.createElement("div");
    userCard.className = "user-card";
    userCard.style = "width: 100%; margin: 16px 0px 0px; background-color: rgb(255, 255, 255); max-width: unset; scroll-snap-align: start; box-shadow: rgb(0, 0, 0) 0px 1px 6px -5px;";
    userCard.innerHTML = `
        <div class="user-card-content">
            <section class="user-header">
                <div class="user-info">
                    <div height="40px" width="40px" class="user-avatar" style="border-radius: 50%; background: none">
                        <img alt="${review.title}" width="40px" height="40px" class="avatar-img" style="border-radius: 50%; opacity: 1" src="https://in.bmscdn.com/in/synopsis-new/noimguser.jpg" />
                    </div>
                    <div class="user-details">
                        <div class="user-name">
                            <h5 class="user-name-text">${review.name}</h5>
                        </div>
                    </div>
                </div>
                <div class="user-rating">
                    <svg width="24" height="24"></svg>
                    <div>${review.rating}</div>
                </div>
            </section>
            <div class="user-review">
                <h5 class="review-title">${review.title}</h5>
                <p class="review-content">${review.content}</p>
            </div>
        </div>
        <div class="review-footer">
            <div class="review-actions">
                <button role="button" class="like-button">
                    <svg width="24" height="24"></svg><span>${review.likes}</span>
                </button>
                <button class="comment-button">
                    <svg width="24" height="24"></svg>
                </button>
            </div>
            <div class="review-meta">
                <span>${review.daysAgo} Days ago</span>
                <button role="button" class="report-button">
                    <svg width="24" height="24"></svg>
                </button>
            </div>
        </div>
    `;
    return userCard;
}

function createCriticCard(review, i) {
    const criticCard = document.createElement("div");
    criticCard.className = "critic-card";
    criticCard.style = "width: 100%; margin: 0 0 16px 0; padding-top:50px; background-color: rgb(255, 255, 255); max-width: unset; scroll-snap-align: start; box-shadow: rgb(0, 0, 0) 0px 1px 6px -5px;";
    criticCard.innerHTML = `
        <div class="critic-card-content">
            <section class="critic-header">
                <div class="critic-info">
                    <div height="40px" width="40px" class="critic-avatar" style="border-radius: 50%; background: none">
                        <div class="avatar-placeholder" style="opacity: 0">
                            <svg width="20" height="20"></svg>
                        </div>
                        <img alt="${review.name}" width="40px" height="40px" class="avatar-img" style="border-radius: 50%; opacity: 1" src="https://in.bmscdn.com/in/synopsis-new/noimguser.jpg" />
                    </div>
                    <div class="critic-details">
                        <div class="critic-name">
                            <h5 class="critic-name-text">${review.name}</h5>
                        </div>
                    </div>
                </div>
                <div class="critic-rating">
                    <svg width="24" height="24"></svg>
                    <div>${review.rating}</div>
                </div>
            </section>
            <div class="critic-review">
                <h5 class="review-title">${review.title}</h5>
                <p class="review-content">${review.content}</p>
                <p class="additional-content" id="additionalContent${i}" style="display: none;">${review.additionalContent}</p>
                <span class="read-more" id="readMore${i}" onclick="toggleContent(${i})">&nbsp;...more</span>
            </div>
        </div>
    `;
    return criticCard;
}


function toggleContent(index) {
    const additionalContent = document.getElementById(`additionalContent${index}`);
    const readMore = document.getElementById(`readMore${index}`);

    if (additionalContent.style.display === "none") {
        additionalContent.style.display = "block";
        readMore.textContent = " ...less";
    } else {
        additionalContent.style.display = "none";
        readMore.textContent = " ...more";
    }
}

function initializeRatingFunctionality() {
    const rateBtn = document.querySelector('.rate-btn');
    const popup = document.getElementById('rating-popup');
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

    window.addEventListener('click', function (event) {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });

    ratingInput.addEventListener('input', function () {
        const value = ratingInput.value;
        ratingValue.textContent = value;
        updateHashtagSuggestions(value);
        ratingInput.style.background = `linear-gradient(to right, red 0%, red ${(value - ratingInput.min) / (ratingInput.max - ratingInput.min) * 100}%, #DEE2E6 ${(value - ratingInput.min) / (ratingInput.max - ratingInput.min) * 100}%, #DEE2E6 100%)`;
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
}

const userReviewsData = [
    {
        name: "Magrika",
        rating: "10/10",
        title: "#SuperDirection #GreatActing #AwesomeStory",
        content: "Loved the movie!",
        likes: 3236,
        daysAgo: 19
    },
    {
        name: "Rahul",
        rating: "9/10",
        title: "Fantastic movie",
        content: "Great performances all around.",
        likes: 2150,
        daysAgo: 15
    },
    {
        name: "Priya",
        rating: "8/10",
        title: "Entertaining",
        content: "A fun watch with family.",
        likes: 1890,
        daysAgo: 12
    }
];

const criticReviewsData = [
    {
        name: "India TV",
        rating: "7/10",
        title: "Munjya",
        content: "A supernatural rollercoaster with a good blend of comedy.",
        additionalContent: "The director's vision shines through in every frame."
    },
    {
        name: "Film Companion",
        rating: "8/10",
        title: "A Pleasant Surprise",
        content: "This movie exceeds expectations with its clever script.",
        additionalContent: "The performances of the lead actors are particularly noteworthy."
    },
    {
        name: "NDTV Movies",
        rating: "7.5/10",
        title: "Solid Entertainment",
        content: "A well-crafted film that keeps you engaged throughout.",
        additionalContent: "The cinematography deserves special mention."
    },
    {
        name: "India TV",
        rating: "7/10",
        title: "Munjya",
        content: "A supernatural rollercoaster with a good blend of comedy.",
        additionalContent: "The director's vision shines through in every frame."
    }
];
