// Data Requests http://www.omdbapi.com/?apikey=[yourkey]&
// IMG Reqests http://img.omdbapi.com/?apikey=[yourkey]&
// API Key 373b4567

const movieWrapper = document.querySelector(".movie__list");

async function renderMovies(filter) {
    const moviesFetch = await fetch(`http://www.omdbapi.com/?apikey=373b4567&s=${getUserInput(event)}`);
    let moviesData = await moviesFetch.json();

    if (filter === 'ALPHABETICAL') {
        moviesData.Search.sort((a, b) => {
            if (a.Title < b.Title) {
                return -1;
            }
            if (a.Title > b.Title) {
                return 1;
            }
            return 0;
        })
        console.log('alphabetical')
    }

    if (filter === 'OLD_TO_NEW') {
        moviesData.Search.sort((a, b) => {
            var yearA = a.Year.indexOf("-") == -1 ? parseInt(a.Year) : parseInt(a.Year.split("-")[0]);
            var yearB = b.Year.indexOf("-") == -1 ? parseInt(b.Year) : parseInt(b.Year.split("-")[0]);
            return yearA - yearB
        })
        console.log('old to new')
    }

    if (filter === 'NEW_TO_OLD') {
        moviesData.Search.sort((a, b) => {
            var yearA = a.Year.indexOf("-") == -1 ? parseInt(a.Year) : parseInt(a.Year.split("-")[0]);
            var yearB = b.Year.indexOf("-") == -1 ? parseInt(b.Year) : parseInt(b.Year.split("-")[0]);
            return yearB - yearA
        })
        console.log('new to old')
    }

    let movieInnerHTML = moviesData.Search.map((movie) => movieHTML(movie)).slice(0, 9).join('');

    if (filter === 'TYPE_MOVIE') {
        let sortToMovie = moviesData.Search.filter(movie => movie.Type === 'movie')
        movieInnerHTML = sortToMovie.map((movie) => movieHTML(movie)).slice(0, 9).join('')
        console.log('only movies')
    }
    if (filter === 'TYPE_SERIES') {
        let sortToMovie = moviesData.Search.filter(movie => movie.Type === 'series')
        movieInnerHTML = sortToMovie.map((movie) => movieHTML(movie)).slice(0, 9).join('')
        console.log('only series')
    }

    movieWrapper.innerHTML = movieInnerHTML;
}

function movieHTML(movie) {
    return `<img class="movie__img" src="${movie.Poster}">
                <div class="movie__info">
                    <h1 class="movie__title">${movie.Title}</h1>
                    <h3 class="movie__date">${movie.Year}</h3>
                    <h3 class="movie__type">${movie.Type}</h3>
                    <button class="watch__btn">Rent or Buy</button>
                </div>`

}

function getUserInput() {
    let input = document.querySelector(".header__search").value;
    return input;
}

const source = document.querySelector(".header__search")
source.addEventListener('input', renderMovies)

function filterChange(event) {
    return renderMovies(event.target.value)
}

renderMovies().then(response => {
    console.log(response);    
}).catch(e => {
    console.log(e)
})