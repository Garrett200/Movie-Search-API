// Data Requests http://www.omdbapi.com/?apikey=[yourkey]&
// IMG Reqests http://img.omdbapi.com/?apikey=[yourkey]&
// API Key 373b4567

const moviesWrapper = document.querySelector(".movies--wrapper");

async function renderMovies(filter) {
    const moviesFetch = await fetch(`http://www.omdbapi.com/?apikey=373b4567&s=${getUserInput(event)}`);
    let moviesData = await moviesFetch.json();

    if (filter === 'OLD_TO_NEW') {
        let sortedByTime = moviesData.Search.map(movie => movie.Year.substring(0, 4))
        sortedByTime.sort((a, b) => a.Year - b.Year)
        console.log('old to new.')
        console.log(moviesData.Search.obj.Year)
    }
    if (filter === 'NEW_TO_OLD') {
        moviesData.Search.sort((a, b) => b.Year - a.Year)
        console.log('new to old.')
    }
    console.log(moviesData.Search)
    let movieInnerHTML = moviesData.Search.map((movie) => movieHTML(movie)).slice(0, 9).join('');

    if (filter === 'TYPE_MOVIE') {
        let sortToMovie = moviesData.Search.filter(movie => movie.Type === 'movie')
        movieInnerHTML = sortToMovie.map((movie) => movieHTML(movie)).slice(0, 9).join('')
    }
    if (filter === 'TYPE_SERIES') {
        let sortToMovie = moviesData.Search.filter(movie => movie.Type === 'series')
        movieInnerHTML = sortToMovie.map((movie) => movieHTML(movie)).slice(0, 9).join('')
    }

    moviesWrapper.innerHTML = movieInnerHTML;
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

renderMovies().then(response => {
    console.log(response);    
}).catch(e => {
    console.log(e)
})