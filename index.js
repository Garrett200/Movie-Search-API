// Data Requests http://www.omdbapi.com/?apikey=[yourkey]&
// IMG Reqests http://img.omdbapi.com/?apikey=[yourkey]&
// API Key 373b4567

async function renderMovies() {
    const moviesWrapper = document.querySelector(".movies--wrapper");

    const moviesFetch = await fetch(`http://www.omdbapi.com/?apikey=373b4567&s=${getUserInput(event)}`);
    const moviesData = await moviesFetch.json();

    console.log(moviesData);
    movieHTML = moviesData.Search.map((movie) => {
        return `<div class="movie">
                    <img class="movie__img" src="${movie.Poster}" alt="">
                    <h4 class="movie__title">${movie.Title}</h4>
                    <p class="movie__year">${movie.Year}</p>
                    <p class="media__type">${movie.Type}</p>
                </div>`
    }).join('');

    moviesWrapper.innerHTML = movieHTML;

}




function movieHTML() {
    return `<div class="movie">
                <img class="movie__img" src="" alt="">
                <h4 class="movie__title"></h4>
                <p class="movie__year"></p>
                <p class="media__type"></p>
            </div>`

}
movieHTML();

function getUserInput(event) {
    let input = document.querySelector(".header__search").value;

    return input;

}
getUserInput(event);



renderMovies();