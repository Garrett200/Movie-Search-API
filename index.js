// Data Requests http://www.omdbapi.com/?apikey=[yourkey]&
// IMG Reqests http://img.omdbapi.com/?apikey=[yourkey]&
// API Key 373b4567

const movieHTML = document.querySelector(".movies--wrapper");

async function getMovieData() {
    const movieData = await fetch("http://www.omdbapi.com/?apikey=373b4567&s=all");
    const movieList = await movieData.json();
    console.log(movieList)

}

getMovieData();