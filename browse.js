//import debounce from 'lodash.debounce';
// Data Requests http://www.omdbapi.com/?apikey=[yourkey]&
// IMG Reqests http://img.omdbapi.com/?apikey=[yourkey]&
// API Key 373b4567

function getUserInput() {
    return document.querySelector(".header__search").value;
}

let userInput;
function switchTabs() {
    window.location.href = 'browse.html';
}

document.addEventListener("input", function () { // Event listener added to wait until the page is loaded to run the script
    // HTML Classes defined into constants ~
    const movieWrapper = document.querySelector(".movie__list");
    const input = document.getElementById("input");
    const movieWrappers = document.querySelectorAll(".movie__wrapper");
    const loading = document.querySelector(".loading");
    const loadingAnimation = document.querySelector(".loading-animation");
    const loadingVisible = document.querySelector(".loading__visible");

    const debounce = (func, delay) => { // Defining the debounce function
        let inDebounce; 
        return function() {
          const context = this;
          const args = arguments;
          clearTimeout(inDebounce);
          inDebounce = setTimeout(() => func.apply(context, args), delay);
        }
    };

    let timer; // Defining timer before use

    try { // If the page is loaded, try to run the script
        const userInput = getUserInput(); // Redefining the user input constant
        if (!userInput) return; // If there is no input from the user (false), return and try the script again

        if (input) { // If input has been made (true) run this function
            input.addEventListener("input", debounce(function() { // Debounce restricts the calling of the function too frequently
                movieWrapper.style.display = 'none'
            }, 100));
        }

        async function renderMovies(filter) { // Aysnc function to await the movies API to render them in
            clearTimeout(timer); // Stops the function until the timer has ran out

            // Adds the loading__visible class to the loading animations while the movies are not visible
            loading.classList.add("loading__visible"); 
            loadingAnimation.classList.add("loading__visible");

            const userInput = getUserInput();
            if (!userInput) return; // Checking once more for input otherwise stops the function

            const moviesFetch = await fetch(`http://www.omdbapi.com/?apikey=373b4567&s=${userInput}`); // Fetchs the the movies with the users input as the search
            let moviesData = await moviesFetch.json(); // Convert it to json
            if (!moviesData.Search) return; // If the array of movies hasnt been fetched yet, stop the function

            let sortFunction; // Defining sort function for future use
            if (filter === 'ALPHABETICAL') {
                sortFunction = (a, b) => a.Title.localeCompare(b.Title); // Comparing the titles with localeCompare to alphabetize
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
            }

            let filteredMovies = moviesData.Search;
            if (filter === 'TYPE_MOVIE' || filter === 'TYPE_SERIES') {
                filteredMovies = filteredMovies.filter(movie => movie.Type === filter.split('_')[1].toLowerCase());
            }

            if (sortFunction) {
                filteredMovies.sort(sortFunction);
            }

            timer = setTimeout(() => {
                loading.classList.remove("loading__visible");
                loadingAnimation.classList.remove("loading__visible");
                movieWrapper.innerHTML = filteredMovies.map(movieHTML).join('');
            }, 800);
        }

        function parseYear(year) { // Defining parseYear for use in the filter functions
            return year.indexOf("-") === -1 ? parseInt(year) : parseInt(year.split("-")[0]); /* IndexOf finds the first occurence of '-' in the year string and if true
                                                                                              converts the year into a integer with parseInt and splits it at the '-' into two integers */ 
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

        const source = document.querySelector(".header__search") // Defining where the users input will be tracked
        source.addEventListener('input', renderMovies); // Event listener to run the renderMovies function with every input

    } catch (error) { // If trying to run the script does not go through, send an error
        console.error(error);
    }

});
/*
window.onload = async function() {
    const userInput = localStorage.getItem("userInput");
    try {
        const response = await fetch(`http://www.omdbapi.com/?apikey=373b4567&s=${userInput}`, { method: 'GET' });
        const moviesData = await response.json();
        if(response.ok) {
            // use moviesData here
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.error(error);
    }
}

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
*/