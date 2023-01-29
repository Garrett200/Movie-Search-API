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

    let movieInnerHTML = moviesData.Search.map((movie) => movieHTML(movie)).join('');

    if (filter === 'TYPE_MOVIE') {
        let sortToMovie = moviesData.Search.filter(movie => movie.Type === 'movie')
        movieInnerHTML = sortToMovie.map((movie) => movieHTML(movie)).join('')
        console.log('only movies')
    }
    if (filter === 'TYPE_SERIES') {
        let sortToMovie = moviesData.Search.filter(movie => movie.Type === 'series')
        movieInnerHTML = sortToMovie.map((movie) => movieHTML(movie)).join('')
        console.log('only series')
    }

    movieWrapper.innerHTML = movieInnerHTML;


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

function getUserInput() {
    let input = document.querySelector(".header__search").value;
    return input;

}

const source = document.querySelector(".header__search");
source.addEventListener('input', renderMovies);

renderMovies().then(response => {
    console.log(response);    
}).catch(e => {
    console.log(e)
})

let timeout;
source.addEventListener("input", function() {
    clearTimeout(timeout);
    document.querySelector(".movie__list").style.display = 'none'
    const animationWrapper = document.querySelector(".loading");
    const animation = document.querySelector(".loading-animation")
    animationWrapper.classList.add("loading__visible");
    animation.classList.add("loading__visible")
    timeout = setTimeout(function() {
        animationWrapper.classList.remove("loading__visible");
        animation.classList.remove("loading__visible");
        document.querySelector(".movie__list").style.display = 'flex'
    }, 500);
  });

function filterChange(event) {
    return renderMovies(event.target.value);
}