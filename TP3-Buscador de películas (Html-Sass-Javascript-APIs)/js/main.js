/////////////////////////////////////////////////////
//       Trabajo Práctico 3 - JS - DOM
/////////////////////////////////////////////////////

// Integrantes
// * Karen Burdman
// * Melisa Cerda 

//////////////////////////////////////////////////////////////////////////
    //     ÍNDICE
    //     ******
    // 1. Referencias a elementos HTML 
    //     1.a Modelos de elementos para clonar
    //     1.b Elementos pertenecientes al pop up
    //     1.c Elementos generales y contenedores
    //     1.d Botones de las distintas categorías
    //     1.e Botones y elementos del menú mobile
    // 2. Constantes y variables necesarias
    // 3. Funciones
    //     3.a. Funciones que crean / clonan elementos
    //     3.b. Funciones que modifican información de las películas
    //     3.c. Funciones correspondientes al pop up
    //     3.d. Funciones de transiciones entre categorías
    //     3.e. Funciones de búsqueda de películas
    //     3.f. Funciones que cambian las categorías
    //     3.g. Funciones específicas de mobile
    //     3.h. Llamados a onclick
    //     3.i. Llamada a la función para cuando se carga la página
//////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////
//      1. Referencias a elementos HTML 
/////////////////////////////////////////////////////

// 1.a Modelos de elementos para clonar
const movieModel = document.getElementsByClassName('movie')[0];
const sectionModel = document.getElementsByClassName('rowResults')[0];
const moviesModel = document.getElementsByClassName('movies')[0];
const textSectionModel = document.getElementsByClassName('categoryHeader')[0];
const titleModel = document.getElementsByClassName('categoryTitle')[0];
const viewAllButton = document.getElementsByClassName('buttonViewAll')[0];
const loadMore = document.getElementsByClassName('loadMore')[0];

// 1.b Elementos pertenecientes al pop up
const selectedMovieContainer = document.getElementById('moviePopUp');
const selectedMovie = document.getElementById('movieDetails');
const closeWindow = document.getElementById('button-close');
const background = document.getElementById('background');
const poster = document.getElementById('movieImg');
const movieTitle = document.getElementById('title');
const tagline = document.getElementById('subtitle');
const description = document.getElementById('sumary');
const genres = document.getElementById('genre');
const releaseDate = document.getElementById('releaseDate');
const loading = document.getElementById('loading');

// 1.c Elementos generales y contenedores
const container = document.getElementById('content');
const search = document.getElementById('searchInput');
const searchBar = document.getElementById('search');
const banner = document.getElementById('banner');
const pageTitle = document.getElementById('pageTitle');

// 1.d Botones de las distintas categorías
const popular = document.getElementById('popular');
const topRated = document.getElementById('topRated');
const upcoming = document.getElementById('upcoming');
const nowPlaying = document.getElementById('nowPlaying');
const pageLogo = document.getElementById('logo');

// 1.e Botones y elementos del menú mobile
const popularMobile = document.getElementById('popularMobile');
const topRatedMobile = document.getElementById('topRatedMobile');
const upcomingMobile = document.getElementById('upcomingMobile');
const nowPlayingMobile = document.getElementById('nowPlayingMobile');
const hamburguerMenu = document.getElementById('hamburguerMenu');
const menuMobile = document.getElementById('backMenu-mobile');
const searchMobile = document.getElementById('searchInput-mobile');
const logoMobile = document.getElementById('logo-mobile');


/////////////////////////////////////////////////////
//      2. Constantes y variables necesarias
/////////////////////////////////////////////////////

const apiKey = `8889eb6c797eb7fd3af45738dee54e67`;
let currentPage = 1;
let menuIsOpened = false;
let timer;

/////////////////////////////////////////////////////
//      3. Funciones
/////////////////////////////////////////////////////

// 3.a. Funciones que crean / clonan elementos

const createTextSection = currentTitle => {
    let newTextSection = textSectionModel.cloneNode(true);
    let newTitle = titleModel.cloneNode(true);
    newTextSection.innerHTML = '';
    newTitle.innerHTML = currentTitle;
    newTextSection.appendChild(newTitle);
    return newTextSection
}

const createViewAll = container => {
    let viewAll = viewAllButton.cloneNode(true);
    container.appendChild(viewAll);
    return viewAll
}

const createResultsNumberInfo = movies => {
    let numberOfResults = document.createElement('h6');
    numberOfResults.innerHTML = `${movies.total_results} results`;
    return numberOfResults
}

// 3.b. Funciones que modifican información de las películas

const homeMovies = (currentTitle, apiUrl) => {
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        let movies = data.results.slice(0,5);
        let newSection = sectionModel.cloneNode(true);
        let textSection = createTextSection(currentTitle);
        createViewAll(textSection).onclick = () => {
            changeMoviesInfo(currentTitle, apiUrl)
        };
        let newMoviesContainer = moviesModel.cloneNode(true);
        newSection.innerHTML = '';
        newMoviesContainer.innerHTML = '';
        newSection.appendChild(textSection);
        for (let movie of movies){
            loadBasicInfo(movie, newMoviesContainer)
        }
        newSection.appendChild(newMoviesContainer);
        container.appendChild(newSection);
    });
}

const loadMoreMovies = (apiUrl, container) => {
    fetch(`${apiUrl}&page=${currentPage}`)
    .then(response => response.json())
    .then(data => {
        for (let movie of data.results){
            loadBasicInfo(movie, container)
        }
    })
}

const loadBasicInfo = (movie, moviesContainer) => {
    let newMovie = movieModel.cloneNode(true);
    if (movie.poster_path) {
        newMovie.children[0].children[0].src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    }
    newMovie.children[1].innerHTML = movie.title;
    newMovie.onclick = () => {moreInfo(movie.id)};
    moviesContainer.appendChild(newMovie);
}

const moreMovies = (movies, currentTitle, apiUrl) => {
    container.innerHTML = '';
    let newSection = sectionModel.cloneNode(true);
    newSection.innerHTML = '';
    let newTextSection = createTextSection(currentTitle);
    let numberOfResults = createResultsNumberInfo(movies);
    newTextSection.appendChild(numberOfResults);
    let newMoviesContainer = moviesModel.cloneNode(true);
    newMoviesContainer.innerHTML = '';
    for (let movie of movies.results) {
        loadBasicInfo(movie, newMoviesContainer)
    }
    newSection.appendChild(newTextSection);
    newSection.appendChild(newMoviesContainer);
    if (movies.results.length >= 20) {
        let newLoadMore = loadMore.cloneNode(true);
        newLoadMore.onclick = () => {
            currentPage++;
            loadMoreMovies(apiUrl, newMoviesContainer);
        };
        newSection.appendChild(newLoadMore);
    }
    container.appendChild(newSection);
}

const loadHomeMovies = () => {
    container.innerHTML = '';
    homeMovies('Popular Movies', `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`);
    homeMovies('Top Rated', `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`);
    homeMovies('Upcoming Movies', `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}`);
    homeMovies('Now Playing', `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`);
}

const changeMoviesInfo = (currentTitle, apiUrl) => {
    search.value = '';
    resetForChange();
    setTimeout(() => {
        container.style.opacity = '1';
        container.style.transition = '0.5s';
        fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            moreMovies(data, currentTitle, apiUrl) 
        })
    }, 500);
}

// 3.c. Funciones correspondientes al pop up

const formatDate = date => {
    let year = date.slice(0, 4);
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'];
    let month = months[Number(date.slice(5, 7)) -1];
    let day = date.slice(8, 10);
    return `${day} ${month} ${year}`
}

const moreInfo = movieId => {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        background.children[0].src = 'img/no-background-img.jpg';
        poster.children[0].src = 'img/no-image.png';
        if (data.backdrop_path) {
            background.children[0].src = `https://image.tmdb.org/t/p/w1280${data.backdrop_path}`;
        }
        if (data.poster_path) {
            poster.children[0].src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
        }
        movieTitle.innerHTML = data.title;
        tagline.innerHTML = data.tagline;
        description.innerHTML = data.overview;
        genres.innerHTML = data.genres.map(genre => genre.name).join(', ');
        releaseDate.innerHTML = formatDate(data.release_date);
        showPopUp();
    });
}

const showPopUp = () => {
    closeWindow.style.display= 'flex';
    selectedMovieContainer.style.visibility = 'visible';
    loading.style.width = '25px';
    loading.style.height = '25px';
    loading.style.transition = '0.5s';
    setTimeout(() => {
        selectedMovie.style.visibility = 'visible';
        selectedMovie.style.transition = '0.5s';
    }, 500)
}

const hidePopUp = () => {
    selectedMovieContainer.style.visibility = 'hidden';
    selectedMovie.style.visibility = 'hidden';
    selectedMovie.style.transition = '0s';
    loading.style.transition = '0s';
    loading.style.width = '50px';
    loading.style.height = '50px';
    closeWindow.style.display = 'none';
}

closeWindow.onclick = () => {hidePopUp()}

// 3.d. Funciones de transiciones entre categorías

const resetForChange = () => {
    currentPage = 1;
    banner.classList.remove('banner');
    banner.classList.add('hiddenBanner');
    pageTitle.innerHTML = 'THE MOVIE DB APP';
    pageTitle.style.visibility = 'hidden';
    container.style.paddingTop = '60px';
    container.style.opacity = '0';
    container.style.transition = '0.5s';
    window.scrollTo(0, 0);
    resetButtonsBackground();
}

const resetButtonsBackground = () => {
    popular.style.backgroundColor = 'white';
    topRated.style.backgroundColor = 'white';
    upcoming.style.backgroundColor = 'white';
    nowPlaying.style.backgroundColor = 'white';
}

const resetBanner = () => {
    pageTitle.style.visibility = 'visible';
    banner.classList.remove('hiddenBanner');
    banner.classList.add('banner');
    container.style.paddingTop = '0px';
    container.style.opacity = '1';
    container.style.transition = '0.5s';
}

const noResultsForSearch = () => {
    container.innerHTML= '';
    pageTitle.innerHTML = 'NOTHING FOUND';
    resetBanner();
}

// 3.e. Funciones de búsqueda de películas

const searchMovie = movie => {
    resetForChange();
    setTimeout(() => {
        let apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movie}`;
        fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            container.style.opacity = '1';
            container.style.transition = '0.5s';
            if (data.results.length >= 1) {
                moreMovies(data, 'Search Results', apiUrl)
            } else {
                noResultsForSearch()
            }
        });
    }, 500);
}

search.onkeypress = event => {
    if (event.keyCode === 13) {
        searchMovie(search.value);
    }
}

searchMobile.oninput = () => {
    menuIsOpened = true;
    changeMenu();
    clearTimeout(timer);
    timer = setTimeout(function () {
        if (searchMobile.value)
            searchMovie(searchMobile.value);
    }, 300);
}

// 3.f. Funciones que cambian las categorías

const clickPopular = () => {
    changeMoviesInfo('Popular Movies', `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`);
    popular.style.backgroundColor = 'whitesmoke';
    popular.style.transition = '1.5s';
}

const clickTopRated = () => {
    changeMoviesInfo('Top Rated', `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`);
    topRated.style.backgroundColor = 'whitesmoke';
    topRated.style.transition = '1.5s';
}

const clickUpcoming = () => {
    changeMoviesInfo('Upcoming Movies', `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}`);
    upcoming.style.backgroundColor = 'whitesmoke';
    upcoming.style.transition = '1.5s';
}

const clickNowPlaying = () => {
    changeMoviesInfo('Now Playing', `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`);
    nowPlaying.style.backgroundColor = 'whitesmoke';
    nowPlaying.style.transition = '1.5s';
}

const clickPageLogo = () => {
    search.value = '';
    resetForChange();
    setTimeout(() => {
        resetBanner();
        loadHomeMovies();
    }, 500);
}

// 3.g. Funciones específicas de mobile

let lines = document.getElementsByClassName('line');

const changeMenu = () => {
    if (!menuIsOpened) {
        setTimeout(()=> { 
        menuMobile.style.display = 'flex';
        menuMobile.style.opacity = '1';
        menuMobile.style.transition = '0.5s';
        lines[0].style.transform = 'rotate(45deg) translateX(5px) translateY(5px)';
        lines[1].style.opacity = '0';
        lines[2].style.transform = 'rotate(-45deg) translateX(6px) translateY(-5px)';
        //lines[2].style.width = '40px';
        }, 500);        
        menuIsOpened = true;
    } else {
        setTimeout(()=> { 
        menuMobile.style.display = 'none';
        menuMobile.style.opacity = '0';
        menuMobile.style.transition = '0.5s';
        lines[0].style.transform = 'rotate(0deg)';
        lines[1].style.opacity = '1';
        lines[2].style.transform = 'rotate(0deg)';
        }, 500); 
        menuIsOpened = false;
    }
}

const clickMobileCategory = () => {
    menuIsOpened = true;
    changeMenu();
    container.style.opacity = '0';
    menuMobile.style.transition = '0.5s';
    menuMobile.style.opacity = '0';
    menuMobile.style.display = 'none';
}

// 3.h. Llamados a onclick
popular.onclick = () => {clickPopular()}
topRated.onclick = () => {clickTopRated()}
upcoming.onclick = () => {clickUpcoming()}
nowPlaying.onclick = () => {clickNowPlaying()}
pageLogo.onclick = () => {clickPageLogo()}
logoMobile.onclick = () => {clickPageLogo()}
hamburguerMenu.onclick = () => {changeMenu();}

popularMobile.onclick = () => {
    clickPopular();
    clickMobileCategory()
}

topRatedMobile.onclick = () => {
    clickTopRated();
    clickMobileCategory()
}

upcomingMobile.onclick = () => {
    clickUpcoming();
    clickMobileCategory();
}

nowPlayingMobile.onclick = () => {
    clickNowPlaying();
    clickMobileCategory();
}

// 3.i. Llamada a la función para cuando se carga la página

loadHomeMovies();