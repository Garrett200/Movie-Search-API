//import debounce from 'lodash.debounce';
// Data Requests https://www.omdbapi.com/?apikey=[yourkey]&
// IMG Reqests https://img.omdbapi.com/?apikey=[yourkey]&
// API Key 373b4567
import config from "./config.js";


function getUserInput() {
    return document.querySelector(".header__search").value;
}

async function movieData() {
  try {
    const moviesData = await fetch(`https://www.omdbapi.com/?apikey=${config.apiKey}&s=${getUserInput()}`);
    const moviesObj = await moviesData.json();
    const movieArr = moviesObj.Search;
    return movieArr;
  } catch (error) {
    console.error(`Error fetching movie data: ${error}`);
    return [];
  }
}

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

const movieWrapper = document.querySelector(".movie__list");
const input = document.getElementById("input");
const movieWrappers = document.querySelectorAll(".movie__wrapper");
const loading = document.querySelector(".loading");
const loadingAnimation = document.querySelector(".loading-animation");
const spinner = document.querySelector(".spinner");
const searchBar = document.querySelector('.header__search')
const filter = searchBar.value;
let movieInfo;

function parseYear(year) { // Defining parseYear for use in the filter functions
    return year.indexOf("-") === -1 ? parseInt(year) : parseInt(year.split("-")[0]); /* IndexOf finds the first occurence of '-' in the year string and if true
                                                                                      converts the year into a integer with parseInt and splits it at the '-' into two integers */
}

async function filteredMovies() {
    let sortFunction;

    if (!movieInfo) {
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

document.addEventListener('input', async function() {
    let timer;
    clearTimeout(timer);

    loading.classList.add("loading__visible");
    loadingAnimation.classList.add("loading__visible");
    spinner.style.display = 'flex'
    movieWrapper.style.display = 'none'

    await filteredMovies();
    timer = setTimeout(() => {
        loading.classList.remove("loading__visible");
        loadingAnimation.classList.remove("loading__visible");
        spinner.style.display = 'none'
        movieWrapper.style.display = 'flex'
        movieWrapper.innerHTML = movieInfo.map(movieHTML).join('');
    }, 300)
})