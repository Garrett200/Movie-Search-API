// Data Requests http://www.omdbapi.com/?apikey=[yourkey]&
// IMG Reqests http://img.omdbapi.com/?apikey=[yourkey]&
// API Key 373b4567

async function renderMovies() {
    const moviesWrapper = document.querySelector(".movies--wrapper");

    const moviesFetch = await fetch("http://www.omdbapi.com/?apikey=373b4567&s=Tokyo-Drift");
    const moviesData = await moviesFetch.json();
    console.log(moviesData.Search)

    movieArr = moviesData.Search.map((movie) => movie);

    console.log(movieArr[0].Title)

}

renderMovies();

function getUserInput() {
    let search = document.querySelector(".header__search").value;
    console.log(search)
}

getUserInput();