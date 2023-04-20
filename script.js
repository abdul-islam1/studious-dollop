const API_KEY = "api_key=d38399774c0d58108382233182a71286";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY; //most popular movies
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const SEARCH_URL = BASE_URL + "/search/movie?" + API_KEY;

const mainDiv = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
let arrSearchTerm = [];
// for (let i = 0; i < localStorage.length; i++) {
//   arrSearchTerm[i] = localStorage.key(i);
// }

const showMovies = (movie) => {
  console.log(movie);
  mainDiv.innerHTML = "";
  for (const i in movie) {
    const movieDiv = document.createElement("div");
    movieDiv.setAttribute("class", "movie");
    movieDiv.setAttribute("id", `${movie[i].id}`);

    movieDiv.setAttribute("onclick", "DisplayMovieInfo(id)");

    movieDiv.innerHTML = `
    <img src="${IMAGE_BASE_URL + movie[i].poster_path}" alt="${
      movie[i].poster_path
    }" />
    <div class="movie-info">
      <h3>${movie[i].title}</h3>
      <span class="releaseDate">${movie[i].release_date}</span>
    </div>
    `;
    mainDiv.appendChild(movieDiv);
  }
};
getMovies = (API_URL, searchTerm) => {
  let flag = false;
  for (let i = 0; i < localStorage.length; i++) {
    if (searchTerm == localStorage.key(i)) {
      flag = true;
      break;
    }
  }
  if (flag === true) {
    let zObj = JSON.parse(localStorage.getItem(searchTerm));
    console.log("now from local");
    console.log(zObj);
    /////////////////////////////////////////////////////////////////////////////////////
    mainDiv.innerHTML = "";
    for (const i in zObj) {
      const movieDiv = document.createElement("div");
      movieDiv.setAttribute("class", "movie");
      movieDiv.setAttribute("id", `${zObj[i].id}`);

      movieDiv.setAttribute("onclick", "DisplayMovieInfo(id)");

      movieDiv.innerHTML = `
      <img src="${zObj[i].poster}" alt="${zObj[i].title}" />
      <div class="movie-info">
        <h3>${zObj[i].title}</h3>
        <span class="releaseDate">${zObj[i].release_date}</span>
      </div>
      `;
      mainDiv.appendChild(movieDiv);
    }
    ////////////////////////////////////////////////////////////////////////////////////
  } else {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        console.log("Coming form online api");
        showMovies(data.results);
        // console.log(data.results);
        let Discover = [];
        for (let i in data.results) {
          let x = {
            id: data.results[i].id,
            poster: IMAGE_BASE_URL + data.results[i].poster_path,
            title: data.results[i].title,
            plot: data.results[i].overview,
            rating: data.results[i].vote_average,
            release_date: data.results[i].release_date,
          };
          Discover.push(x);
        }
        Discover = JSON.stringify(Discover);
        localStorage.setItem("Discover", Discover);

        let x = JSON.parse(localStorage.getItem("Discover"));
        //console.log(x);
        for (let i in data.results) {
          const CAST_INFO_URL =
            BASE_URL + `/movie/${data.results[i].id}/credits?${API_KEY}`;

          fetch(CAST_INFO_URL) /// fetching cast names for separate display
            .then((res) => res.json())
            .then((data) => {
              let cast = "";
              for (let i in data.cast) {
                cast += data.cast[i].name + ", ";
              }
              cast = cast.substring(0, cast.length - 1);
              cast = cast.substring(0, cast.length - 1);
              cast += ".";
              let swap = x[i];
              swap.cast = cast;
              x[i] = swap;
              localStorage.setItem(searchTerm, JSON.stringify(x));
              localStorage.removeItem("Discover");
              localStorage.removeItem("arrCast");
            });
        }
      });
  }
};
getMovies(API_URL, "DiscoverMovies");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  document.getElementById("movie-info-result").style.display = "none";
  const searchTerm = search.value;
  if (searchTerm) {
    // console.log(searchTerm);
    // console.log(`Search API URL ${SEARCH_URL}&query=${searchTerm}`);
    fetch(SEARCH_URL + "&query=" + searchTerm)
      .then((res) => res.json())
      .then((data) => {
        getMovies(SEARCH_URL + "&query=" + searchTerm, searchTerm);

        //console.log(data.results);
      });
  } else {
    getMovies(API_URL, "DiscoverMovies");
  }
});

///////////////////////////////Display Selected movie Card/////////////////

const DisplayMovieInfo = (movieID) => {
  document.getElementById("movie-info-result").style.display = "block";
  for (let i = 0; i < localStorage.length; i++) {
    for (
      let j = 0;
      j < JSON.parse(localStorage.getItem(localStorage.key(i))).length;
      j++
    ) {
      if (
        movieID == JSON.parse(localStorage.getItem(localStorage.key(i)))[j].id
      ) {
        let z = JSON.parse(localStorage.getItem(localStorage.key(i)))[j];
        document.getElementById("movie-info-result").innerHTML = `
            <img src="${z.poster}" alt="${z.title}"/>
            <p><b>Title:&nbsp&nbsp&nbsp</b>${z.title}</p>
            <p><b>Plot:&nbsp&nbsp&nbsp</b>${z.plot}</p>
            <p><b>Rating:&nbsp&nbsp&nbsp</b>${z.rating}</p>
            <p><b>Cast:&nbsp&nbsp&nbsp</b>${z.cast}</p>
            `;
      }
    }
  }
};
