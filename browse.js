//import debounce from 'lodash.debounce';
// Data Requests http://www.omdbapi.com/?apikey=[yourkey]&
// IMG Reqests http://img.omdbapi.com/?apikey=[yourkey]&
// API Key 373b4567

const menu = document.querySelector(".menu__backdrop");

function openMenu () {
    menu.style.display = 'flex';
    menu.classList.add("fade-in");
    timer = setTimeout(() => {
        menu.classList.remove("fade-in");
    }, 300);
}

function closeMenu() {
    menu.classList.add("fade-out");
    timer = setTimeout(() => {
        menu.classList.remove("fade-out");
        menu.style.display = 'none';
    }, 280);

}

function getUserInput() {
    return document.querySelector(".header__search").value;
}

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
    const spinner = document.querySelector(".spinner");

    let timer; // Defining timer before use

    try { // If the page is loaded, try to run the script
        const userInput = getUserInput(); // Redefining the user input constant
        if (!userInput) return; // If there is no input from the user (false), return and try the script again

        async function renderMovies(filter) { // Aysnc function to await the movies API to render them in
            clearTimeout(timer); // Stops the function until the timer has ran out

            // Adds the loading__visible class to the loading animations while the movies are not visible
            loading.classList.add("loading__visible"); 
            loadingAnimation.classList.add("loading__visible");
            spinner.style.display = 'flex'
            movieWrapper.style.display = 'none'

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
                spinner.style.display = 'none'
                movieWrapper.style.display = 'flex'
                movieWrapper.innerHTML = filteredMovies.map(movieHTML).join('');
            }, 300);
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