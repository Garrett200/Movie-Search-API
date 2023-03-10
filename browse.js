// Establishing variables
const menu = document.querySelector(".menu__backdrop")
const movieWrapper = document.querySelector(".movie__list");
const loading = document.querySelector(".loading");
const loadingAnimation = document.querySelector(".loading-animation");
const spinner = document.querySelector(".spinner");
const filters = document.querySelector("#filter");
const searchBar = document.querySelector(".header__search");
const menuBtn = document.querySelector(".menu__btn");
const results = document.querySelector(".search__results");
const searchBtn = document.querySelector(".search-btn");
const index = document.querySelector("#index");
const browse = document.querySelector("#browse");
const none = document.querySelector(".none");
let timer;
let searchTerm;
let movieInfo;
let open = false;
let isModalOpen = false;


// MENU OPEN/CLOSE | FOOTER LINK MSG
// CONTACT BTN MENU | EMAIL FORM AND LOADING ANIM

// Menu Open and Close Function
function menuFunc() {

    // Checks if the menu is open by using the 'open' variable
    if (open) {

        // Closes the menu with an animation and sets the var to false
        open = false;
        menu.classList.add("fade-out");
        timer = setTimeout(() => {
            menu.classList.remove("fade-out");
            menu.style.display = 'none';
        }, 280);
    } else {

        // Opens the menu with an animation and sets the var to true
        open = true;
        menu.style.display = 'flex';
        menu.classList.add("fade-in");
        timer = setTimeout(() => {
            menu.classList.remove("fade-in");
        }, 300);
    }
}


// Footer Link Message Function
function message() {

    // Displays the message with a fade in animation then fades out
    none.style.display = 'flex';
    timer = setTimeout(() => {
        none.classList.add("message-exit");
    }, 900);
    none.classList.remove("message-exit");
    timer = setTimeout(() => {
        none.style.display = 'none';
    }, 1200);

}


// Email Form and Loading Animation Function
function contact(event) {
    // Prevents any default action if the event is not handled
    event.preventDefault()

    // Diplays a loading animation 
    const loading = document.querySelector('.modal__overlay--loading');
    const success = document.querySelector('.modal__overlay--success');
    loading.classList += " modal__overlay--visible";

    // Sends the users message and once done, hides the animation and displays
    // a 'success' overlay or displays an error overlay if the form was not sent
    emailjs
        .sendForm(
            'service_lo59kw2',
            'template_sgafzrp',
            event.target,
            'hDCgqlu9cChmWH-zT'
    ).then(() => {
        loading.classList.remove("modal__overlay--visible");
        success.classList += " modal__overlay--visible";
    }).catch(() => {
        loading.classList.remove("modal__overlay--visible");
        alert(
            "The email service is temporarily unavailable. Please contact me directly at garrettjrh@live.com"
        )
    })
}


// Contact Button Menu Function
function toggleModal() {

    // Hides the menu
    menu.style.display = 'none';

    // Checks if the isModalOpen var is true or not and opens/closes the modal
    // based on its current state then changes the var
    if (isModalOpen) {
        isModalOpen = false;
        return document.body.classList.remove("modal--open");
    } else {
        isModalOpen = true;
        document.body.classList += " modal--open";
    }
}

// INDEX PAGE EVENT LISTENERS

function switchTabs() {

    // Checks if the user has pressed the enter key or not
    searchBar.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {

            // stores input value in local storage
            const userInput = searchBar.value;
            localStorage.setItem('searchTerm', userInput);

            // navigates to browse page with user's input
            window.location.href = `browse.html`;
        }
    })
}

function searchEnter() {

    // Checks if the search button has been clicked
    searchBtn.addEventListener('click', function (event) {

        // stores input value in local storage
        const userInput = searchBar.value;
        localStorage.setItem('searchTerm', userInput);

        // navigate to browse page with user's input
        window.location.href = `browse.html`;
    });
}

// BROWSE PAGE | MOVIE RENDERING AND FILTERING FUNCTIONS

const getUserInput = (searchTerm = '') => {
    return searchTerm || document.querySelector(".header__search").value;
};

async function movieData() {
    try {
        const moviesData = await fetch(`https://www.omdbapi.com/?apikey=373b4567&s=${getUserInput()}`);
        const moviesObj = await moviesData.json();
        const { Search: movieArr } = moviesObj;
        movieInfo = movieArr || [];
        return movieInfo;
    } catch (error) {
        console.error(`Error fetching movie data: ${error}`);
        return [];
    }
}

function movieHTML(movie) {


    if (movie.Poster === "N/A") {
        return `<li class="movie">
                    <div class="movie__wrapper">
                        <div class="no-movie-wrapper">
                            <img class="no-movie-img" src="assets/no-image.png">
                            <span class="no-movie-span">No Image Found.<span>
                        </div>
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
    } else {
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
}


function parseYear(year) {
    return year.indexOf("-") === -1 ? parseInt(year) : parseInt(year.split("-")[0]);
}

async function movieFilter() {
    let sortFunction;
    let filter = filters.value;
    let moviesData = await movieData();
    let movieInfo = moviesData;

    if (!movieInfo) {
        console.log('Nothing found.')
        return;
    }

    if (filter === 'ALPHABETICAL') {
        sortFunction = (a, b) => a.Title.localeCompare(b.Title);
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
    } else if (filter === 'TYPE_MOVIE' || filter === 'TYPE_SERIES') {
        movieInfo = movieInfo.filter(movie => movie.Type === filter.split('_')[1].toLowerCase());
    }

    movieInfo = movieInfo.sort(sortFunction);
    movieWrapper.innerHTML = movieInfo.map(movieHTML).join('');
}

async function renderMovies() {

    // Cancels any previously established timeout
    clearTimeout(timer);


    let moviesData = await movieData();
    let movieInfo = moviesData || [];

    // Hides "No Results Found." then adds
    results.style.display = 'none';
    loading.style.display = 'flex';
    loadingAnimation.style.display = 'flex';
    spinner.style.display = 'flex';
    movieWrapper.style.display = 'none';

    if (movieInfo) {
        movieWrapper.innerHTML = movieInfo.map(movieHTML).join('');
    }

    timer = setTimeout(async () => {
        loading.style.display = 'none';
        loadingAnimation.style.display = 'none';
        spinner.style.display = 'none';
        if (movieInfo) {
            movieWrapper.style.display = 'flex';
        } else if (!getUserInput()) {
            results.style.display = 'none';
        } else {
            results.style.display = 'flex';
        }
    }, 900);
}

  

// PAGE CHECK & EVENT LISTENERS FOR BOTH PAGES

async function checkPage() {

    // Checks if the ID 'browse' is true or if the ID 'index' is true
    if (browse) {

        // Establishing the users input from the index page search bar
        const searchTerm = localStorage.getItem('searchTerm');

        // Declares the value of the search bar as the users input 'searchTerm'
        const searchField = document.querySelector('.header__search');
        searchField.value = searchTerm;

        if (searchTerm) {
            await renderMovies();
            localStorage.setItem('searchTerm', "");
        }
        searchBar.addEventListener('input', async () => {
            await renderMovies();
        });

        filters.addEventListener('change', function () {
            movieFilter();
        });
    } else if (index) {
        switchTabs();
        searchEnter();
    } else {
        return;
    }
}
checkPage();