const movieAPIpath = 'https://api.themoviedb.org/';
const api_key = '46270c06c4dcf45c52b9f26efbe2841d';

const popularMoviesURL = new URL(movieAPIpath + '/3/movie/popular');
popularMoviesURL.searchParams.append('api_key', api_key);

const searchMoviesURL = new URL(movieAPIpath + '3/search/movie');
searchMoviesURL.searchParams.append('api_key', api_key);

const form = document.getElementById('search-form');
const searchBtn = document.getElementById('search-btn');

// CREATE MOVIE ELEMENT
const createMovieElement = (movie, container) => {
  const movieElement = document.createElement('div');
  movieElement.classList.add('movie');
  container.appendChild(movieElement);

  //add poster
  const posterURL = 'https://image.tmdb.org/t/p/w185';
  const moviePoster = document.createElement('img');
  moviePoster.src = posterURL + movie.poster_path;

  //add title
  const movieTitle = document.createElement('span');
  movieTitle.innerHTML = movie.title;
  movieTitle.classList.add('movie-title');

  //apend elements
  movieElement.appendChild(moviePoster);
  movieElement.appendChild(movieTitle);
  movieElement.addEventListener('click', () => movieSelected(movie.id));
};

// SEARCH FUNCTION
const getSearchResults = (searchValue) => {
  const container = document.querySelector('.search-results');
  searchMoviesURL.searchParams.append('query', searchValue);
  const popularMovies = document.querySelector('.movies');

  popularMovies.style.display = 'none';
  if (container.children.length != 0) {
    container.innerHTML = '';
  }

  fetch(searchMoviesURL)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (container.children.length == 0) {
        data.results.forEach(function(movie) {
          createMovieElement(movie, container);
        });
      }
    });
};

const searchForMovies = (e) => {
  e.preventDefault();
  const form = document.getElementById('search-form');
  const searchText = document.getElementById('search-field');
  let searchValue = searchText.value;
  console.log(searchValue);
  getSearchResults(searchValue);
  form.reset();
};

// load popular movies (home page)
const loadPopular = () => {
  fetch(popularMoviesURL)
    .then(response => response.json())
    .then(data => {
      data.results.forEach(function(movie) {
        const container = document.querySelector('.movies');
        createMovieElement(movie, container);
      });
    });
}

loadPopular();

form.addEventListener('submit', searchForMovies);
searchBtn.addEventListener('click', searchForMovies);

const movieSelected = (id) => {
  sessionStorage.setItem('movieID', id);
  window.location = 'movie.html';
}

function getMovie() {
  const movieID = sessionStorage.getItem('movieID');
  const findMoviesURL = new URL(movieAPIpath + '3/movie/' + movieID);
  findMoviesURL.searchParams.append('api_key', api_key);

  const container = document.querySelector('.movie-selected');
  const posterContainer = document.querySelector('.poster');
  const movieInfo = document.querySelector('.movie-info');
  const overview = document.querySelector('.overview')
  const trailers = document.querySelector('.trailers');

  fetch(findMoviesURL)
    .then(response => response.json())
    .then(movie => {
      console.log(movie);

      //add poster
      const posterURL = 'https://image.tmdb.org/t/p/w342';
      const moviePoster = document.createElement('img');
      moviePoster.src = posterURL + movie.poster_path;

      //add title
      const movieTitle = document.createElement('h1');
      movieTitle.innerHTML = movie.title;
      movieTitle.classList.add('title');

      //add release-date
      const releaseDate = document.createElement('span');
      const releaseYear = movie.release_date.slice(0, 4);
      releaseDate.innerHTML = `(${releaseYear})`;
      releaseDate.classList.add('release-date');

      // add rating
      const rating = document.createElement('span');
      rating.innerHTML = `${movie.vote_average}`;
      rating.classList.add('rating');

      //add genres
      const genre = document.createElement('span');
      genre.classList.add('genre');

      const genreName = () => {
        console.log(movie.genres[0].name);
        let outcome = [];
        for (i = 0; i < movie.genres.length; i++) {
          outcome.push(movie.genres[i].name);
        }
        const result = outcome.join(' | ');
        genre.innerHTML = `<br> ${result}`;
      };

      genreName();

      //add runtime
      const runtime = document.createElement('span');
      runtime.classList.add('runtime');
      runtime.innerHTML = `<i class="far fa-clock"></i> ${movie.runtime} min`;

      //add description
      const movieOverview = document.createElement('p');
      movieOverview.innerHTML = movie.overview;
      movieOverview.classList.add('overview');

      //add movie credits
      const movieCredits = document.createElement('div');
      movieCredits.classList.add('movie-credits');

      const findCastURL = new URL(movieAPIpath + `3/movie/${movieID}/credits`);
      findCastURL.searchParams.append('api_key', api_key);

      fetch(findCastURL)
        .then(response => response.json())
        .then(data => {
          console.log(data);
        });

      //add videos
      const findVideosURL = new URL(movieAPIpath + `3/movie/${movieID}/videos`);
      findVideosURL.searchParams.append('api_key', api_key);

      fetch(findVideosURL)
        .then(response => response.json())
        .then(data => {
          console.log(data);

          data.results.forEach((video, index) => {
            const videos = document.createElement('div');
            videos.classList.add('popup');
            let trailer = `<iframe width="360" height="315" src="https://www.youtube.com/embed/${video.key}"  frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`

            if (video.name.indexOf('Trailer') !== -1 && index <= 2) {
              videos.innerHTML = trailer;
              trailers.appendChild(videos);
            }
          });
        });

      //apend elements
      movieInfo.appendChild(movieTitle);
      movieInfo.appendChild(releaseDate);
      movieInfo.appendChild(rating);
      movieInfo.appendChild(genre);
      movieInfo.appendChild(runtime);
      overview.appendChild(movieOverview);
      posterContainer.appendChild(moviePoster);

    });
}