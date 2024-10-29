const apiKey = '7773f7c40819262930cb3d276185311f'; // Replace with your TMDb API key
let currentPage = 1;
let totalPages = 0;
const resultsDiv = document.getElementById('results');
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const movieModal = document.getElementById('movieModal');
const modalTitle = document.getElementById('modalTitle');
const modalPoster = document.getElementById('modalPoster');
const modalOverview = document.getElementById('modalOverview');
const modalReleaseDate = document.getElementById('modalReleaseDate');
const modalRating = document.getElementById('modalRating');
const addToFavoritesButton = document.getElementById('addToFavoritesButton');
const closeButton = document.querySelector('.close-button');

searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        fetchMovies(query);
    }
});

function showSpinner() {
    document.getElementById('loading-spinner').style.display = 'block';
}

function hideSpinner() {
    document.getElementById('loading-spinner').style.display = 'none';
}

async function fetchMovies(query) {
    showSpinner(); // Show the spinner before fetching data
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${currentPage}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        totalPages = data.total_pages;
        displayResults(data.results);
        updatePagination();
    } catch (error) {
        console.error('Error fetching movies:', error);
        resultsDiv.innerHTML = '<p>Something went wrong. Please try again.</p>';
    } finally {
        hideSpinner(); // Hide the spinner after fetching data
    }
}

function displayResults(movies) {
    resultsDiv.innerHTML = '';
    movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.className = 'movie';
        movieDiv.innerHTML = `
            <h3>${movie.title}</h3>
            <p>Release Date: ${movie.release_date}</p>
            <p>Rating: ${movie.vote_average}</p>
            <button onclick="showMovieDetails(${movie.id})">View Details</button>
        `;
        resultsDiv.appendChild(movieDiv);
    });
}

function showMovieDetails(movieId) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(movie => {
            modalTitle.innerText = movie.title;
            modalPoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            modalOverview.innerText = movie.overview;
            modalReleaseDate.innerText = movie.release_date;
            modalRating.innerText = movie.vote_average;
            movieModal.style.display = 'block';
        })
        .catch(error => console.error('Error fetching movie details:', error));
}

closeButton.addEventListener('click', () => {
    movieModal.style.display = 'none';
});

window.onclick = function(event) {
    if (event.target === movieModal) {
        movieModal.style.display = 'none';
    }
};

addToFavoritesButton.addEventListener('click', () => {
    const title = modalTitle.innerText;
    alert(`${title} has been added to your favorites!`); // Placeholder for actual favorites logic
});

function updatePagination() {
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';

    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.innerText = 'Previous';
        prevButton.onclick = () => {
            currentPage--;
            fetchMovies(searchInput.value.trim());
        };
        paginationDiv.appendChild(prevButton);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.innerText = 'Next';
        nextButton.onclick = () => {
            currentPage++;
            fetchMovies(searchInput.value.trim());
        };
        paginationDiv.appendChild(nextButton);
    }
}


