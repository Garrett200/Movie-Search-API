// Variables being defined
const menu = document.querySelector(".menu__backdrop")
const movieWrapper = document.querySelector(".movie__list");
const loading = document.querySelector(".loading");
const loadingAnimation = document.querySelector(".loading-animation");
const spinner = document.querySelector(".spinner");
const filters = document.querySelector("#filter");
const searchBar = document.querySelector(".header__search");
const menuBtn = document.querySelector(".menu__btn");
const results = document.querySelector(".search__results");
const searchBtn = document.querySelector(".search-btn");
const index = document.querySelector("#index")
const browse = document.querySelector("#browse")
let timer;
let searchTerm;
let movieInfo;
let open;


// INDEX PAGE FUNCTIONS

function openMenu() {
    const open = true;
    menu.style.display = 'flex';
    menu.classList.add("fade-in");
    timer = setTimeout(() => {
        menu.classList.remove("fade-in");
    }, 300);
}

function closeMenu() {
    const open = false;
    menu.classList.add("fade-out");
    timer = setTimeout(() => {
        menu.classList.remove("fade-out");
        menu.style.display = 'none';
    }, 280);

}

// INDEX PAGE EVENT LISTENERS

function switchTabs() {
    searchBar.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {

            // stores input value in local storage
            const userInput = searchBar.value;
            localStorage.setItem('searchTerm', userInput);

            // navigate to browse page with user's input
            window.location.href = `browse.html`;
        }
    })
}

function searchEnter() {
    searchBtn.addEventListener('click', function (event) {

        // stores input value in local storage
        const userInput = searchBar.value;
        localStorage.setItem('searchTerm', userInput);

        // navigate to browse page with user's input
        window.location.href = `browse.html`;
    });
}

// BROWSE PAGE | MOVIE RENDERING AND FILTERING FUNCTIONS

function getUserInput() {
    if (searchTerm) {
        return searchTerm;
    } else {
        return document.querySelector(".header__search").value;
    }
}

async function movieData() {
    try {
        const moviesData = await fetch(`https://www.omdbapi.com/?apikey=373b4567&s=${getUserInput()}`);
        const moviesObj = await moviesData.json();
        const movieArr = moviesObj.Search;
        movieInfo = movieArr || []; // Initialize movieInfo with an empty array if movieArr is null or undefined
        return movieArr;
    } catch (error) {
        console.error(`Error fetching movie data: ${error}`);
        return [];
    }
}

function movieHTML(movie) {
    if (movie.Poster === "N/A") {
        return `<li class="movie">
                    <div class="movie__wrapper">
                        <img class="movie__img" src="assets/xmark-solid.svg">
                        <div class="movie__info">
                            <div class="movie__info-wrapper">
                                <h1 class="movie__title">${movie.Title}</h1>
                                <h3 class="movie__date">${movie.Year}</h3>
                            </div>
                            <div class="watch__btn-wrapper">
                                <button class="watch__btn click">Rent or Buy</button>
                            </div>
                        </div>
                    </div>
                </li>`
    } else {
        return `<li class="movie">
                    <div class="movie__wrapper">
                        <img class="movie__img" src="${movie.Poster}">
                        <div class="movie__info">
                            <div class="movie__info-wrapper">
                                <h1 class="movie__title">${movie.Title}</h1>
                                <h3 class="movie__date">${movie.Year}</h3>
                            </div>
                            <div class="watch__btn-wrapper">
                                <button class="watch__btn click">Rent or Buy</button>
                            </div>
                        </div>
                    </div>
                </li>`
    }
}


function parseYear(year) { // Defining parseYear for use in the filter functions
    return year.indexOf("-") === -1 ? parseInt(year) : parseInt(year.split("-")[0]); /* IndexOf finds the first occurence of '-' in the year string and if true
                                                                                      converts the year into a integer with parseInt and splits it at the '-' into two integers */
}

async function movieFilter() {
    let sortFunction;
    let filter = filters.value;
    let moviesData = await movieData();
    let movieInfo = moviesData;

    if (!movieInfo) {
        console.log('Nothing found.')
        return;
    }

    if (filter === 'ALPHABETICAL') {
        sortFunction = (a, b) => a.Title.localeCompare(b.Title);
    } else if (filter === 'OLD_TO_NEW') {
        sortFunction = (a, b) => {
            const yearA = parseYear(a.Year);
            const yearB = parseYear(b.Year);
            return yearA - yearB
        }
    } else if (filter === 'NEW_TO_OLD') {
        sortFunction = (a, b) => {
            const yearA = parseYear(a.Year);
            const yearB = parseYear(b.Year);
            return yearB - yearA
        }
    } else if (filter === 'TYPE_MOVIE' || filter === 'TYPE_SERIES') {
        movieInfo = movieInfo.filter(movie => movie.Type === filter.split('_')[1].toLowerCase());
    }

    movieInfo = movieInfo.sort(sortFunction);
    movieWrapper.innerHTML = movieInfo.map(movieHTML).join('');
}

async function renderMovies() {
    clearTimeout(timer);

    let moviesData = await movieData();
    let movieInfo = moviesData;

    results.style.display = 'none';
    loading.classList.add("loading__visible");
    loadingAnimation.classList.add("loading__visible");
    spinner.style.display = 'flex';
    movieWrapper.style.display = 'none';

    if (movieInfo) {
        movieWrapper.innerHTML = movieInfo.map(movieHTML).join('');
    }

    timer = setTimeout(async () => {
        loading.classList.remove("loading__visible");
        loadingAnimation.classList.remove("loading__visible");
        spinner.style.display = 'none';
        if (movieInfo) {
            movieWrapper.style.display = 'flex';
        } else if (!getUserInput()) {
            results.style.display = 'none';
        } else {
            results.style.display = 'flex';
        }
    }, 900);
}

// PAGE CHECK & EVENT LISTENERS

async function checkPage() {
    if (browse) {
        const searchTerm = localStorage.getItem('searchTerm');
        const searchField = document.querySelector('.header__search');
        searchField.value = searchTerm;

        if (searchTerm) {
            await renderMovies();
        }
        searchBar.addEventListener('input', async () => {
            await renderMovies();
        });

        filters.addEventListener('change', function () {
            movieFilter();
        });
    } else if (index) {
        switchTabs();
        searchEnter();
    } else {
        return;
    }
}
checkPage();