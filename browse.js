import config from "./config.js";

const menu = document.querySelector(".menu__backdrop")
const movieWrapper = document.querySelector(".movie__list");
const loading = document.querySelector(".loading");
const loadingAnimation = document.querySelector(".loading-animation");
const spinner = document.querySelector(".spinner");
const filters = document.querySelector('#filter')
let filter = filters.value;
let timer;
let movieInfo;

function openMenu() {
    menu.style.display = 'flex';
    menu.classList.add("fade-in");
    timer = setTimeout(() => {
        menu.classList.remove("fade-in");
    }, 300);
    return console.log('menu open')
}

export function closeMenu() {
    menu.classList.add("fade-out");
    timer = setTimeout(() => {
        menu.classList.remove("fade-out");
        menu.style.display = 'none';
    }, 280);

}

export function switchTabs() {
    window.location.href = 'browse.html';
}


function getUserInput() {
    return document.querySelector(".header__search").value;
}

async function movieData() {
    try {
      const moviesData = await fetch(`https://www.omdbapi.com/?apikey=${config.apiKey}&s=${getUserInput()}`);
      const moviesObj = await moviesData.json();
      const movieArr = moviesObj.Search;
      movieInfo = movieArr || []; // Initialize movieInfo with an empty array if movieArr is null or undefined
      return movieArr;
    } catch (error) {
      console.error(`Error fetching movie data: ${error}`);
      return [];
    }
}

let moviesData = await movieData();

function movieHTML(movie) {
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


function parseYear(year) { // Defining parseYear for use in the filter functions
    return year.indexOf("-") === -1 ? parseInt(year) : parseInt(year.split("-")[0]); /* IndexOf finds the first occurence of '-' in the year string and if true
                                                                                      converts the year into a integer with parseInt and splits it at the '-' into two integers */
}

async function movieFilter() {
    let sortFunction;
    let movieInfo = moviesData;
    if (filter === 'TYPE_MOVIE' || filter === 'TYPE_SERIES') {
        console.log('filter')
        movieInfo = movieInfo.filter(movie => movie.Type === filter.split('_')[1].toLowerCase());
    }
    if (movieInfo) {
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
    } else {
        if (sortFunction) {
            movieInfo = movieInfo.sort(sortFunction);
        }
    }
}

async function renderMovies() {
    clearTimeout(timer);
    await movieFilter();
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
        }
    }, 1000);
}

document.addEventListener('input', async function() {
    await renderMovies();
});

filters.addEventListener('select', async () => {
    await movieFilter();
});