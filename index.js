// Data Requests http://www.omdbapi.com/?apikey=[yourkey]&
// IMG Reqests http://img.omdbapi.com/?apikey=[yourkey]&
// API Key 373b4567
const moviesWrapper = document.querySelector(".movies--wrapper");

async function renderMovies(filter) {
    const moviesFetch = await fetch(`http://www.omdbapi.com/?apikey=373b4567&s=${getUserInput(event)}`);
    const moviesData = await moviesFetch.json();

    let movies = moviesData.Search

    if (filter === 'OLD_TO_NEW') {
        moviesData.Search.sort((a, b) => a.Year - b.Year)
        console.log('Sorting successful, old to new.')
    }
    else if (filter === 'NEW_TO_OLD') {
        moviesData.Search.sort((a, b) => b.Year - a.Year)
        console.log('Sorting successful, new to old.')
    }
    else if (filter === 'TYPE') {
        if (movies.Type === 'movie') {
            return movies.filter(movie => movie.Type === 'movie')
        }
        else {
            console.log('all movies')
        }
    }

    movieInnerHTML = moviesData.Search.map((movie) => movieHTML(movie)).join('');
    moviesWrapper.innerHTML = movieInnerHTML;
    sortedMovies = moviesData.Search.sort((a, b) => a.Year - b.Year)
    console.log(sortedMovies)

}

function movieHTML(movie) {
    return `<div class="movie">
                <img class="movie__img" src="${movie.Poster}" alt="">
                <h4 class="movie__title">${movie.Title}</h4>
                <p class="movie__year">${movie.Year}</p>
                <p class="media__type">${movie.Type}</p>
            </div>`

}

function getUserInput() {
    let input = document.querySelector(".header__search").value;
    return input;
}

function filterChange(event) {
    return renderMovies(event.target.value)
}

const source = document.querySelector(".header__search")
source.addEventListener('input', renderMovies)

renderMovies();