// Data Requests http://www.omdbapi.com/?apikey=[yourkey]&
// IMG Reqests http://img.omdbapi.com/?apikey=[yourkey]&
// API Key 373b4567
const moviesWrapper = document.querySelector(".movies--wrapper");

async function renderMovies(filter) {
    const moviesFetch = await fetch(`http://www.omdbapi.com/?apikey=373b4567&s=${getUserInput(event)}`);
    const moviesData = await moviesFetch.json();

    if (filter === 'OLD_TO_NEW') {
        moviesData.Search.sort((a, b) => a.Year.toFixed(4) - b.Year.toFixed(4))
        console.log('old to new.')
    }
    if (filter === 'NEW_TO_OLD') {
        moviesData.Search.sort((a, b) => b.Year.toFixed(4) - a.Year.toFixed(4))
        console.log('new to old.')
    }

    let movieInnerHTML = moviesData.Search.map((movie) => movieHTML(movie)).slice(0, 9).join('');

    if (filter === 'TYPE_MOVIE') {
        let sortToMovie = moviesData.Search.filter(movie => movie.Type !== 'series')
        movieInnerHTML = sortToMovie.map((movie) => movieHTML(movie)).slice(0, 9).join('')
    }
    if (filter === 'TYPE_SERIES') {
        let sortToMovie = moviesData.Search.filter(movie => movie.Type !== 'movie')
        movieInnerHTML = sortToMovie.map((movie) => movieHTML(movie)).slice(0, 9).join('')
    }
    console.log(moviesData.Search[6].Year.toFixed(4))

    moviesWrapper.innerHTML = movieInnerHTML;

    console.log(moviesData.Search)


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