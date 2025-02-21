const API_KEY = "53dead8f3e52892b9fa807cb73421f84";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Fetch Popular Movies
async function fetchPopularMovies() {
  const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
  const response = await fetch(url);
  const data = await response.json();
  displayMovies(data.results);
}

// Show the selected page and hide others
function showPage(pageId) {
  const pages = ["home", "about", "contact", "movie-details"];
  pages.forEach(id => {
    const page = document.getElementById(id);
    if (pageId === id) {
      page.classList.remove("d-none");
    } else {
      page.classList.add("d-none");
    }
  });
  
  // Highlight the active nav link
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("onclick").includes(pageId)) {
      link.classList.add("active");
    }
  });
}


// Search Movies
async function searchMovies() {
  const query = document.getElementById("search-input").value.trim();
  if (!query) return;

  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`;
  const response = await fetch(url);
  const data = await response.json();
  displayMovies(data.results);
}

// Display Movies in Grid
function displayMovies(movies) {
  const movieGrid = document.getElementById("movie-grid");
  movieGrid.innerHTML = ""; // Clear the grid

  movies.forEach(movie => {
    const poster = movie.poster_path
      ? `${IMAGE_BASE_URL}${movie.poster_path}`
      : "placeholder.jpg"; // Use a placeholder if no poster

    const movieCard = `
      <div class="col-lg-3 col-md-4 col-sm-6">
        <div class="card h-100 shadow">
          <img src="${poster}" class="card-img-top" alt="${movie.title}">
          <div class="card-body text-center">
            <h5 class="card-title">${movie.title}</h5>
            <button class="btn btn-primary" onclick="showDetails(${movie.id})">Details</button>
          </div>
        </div>
      </div>`;
    movieGrid.innerHTML += movieCard;
  });
}

// Show Movie Details
async function showDetails(movieId) {
  try {
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch movie details.");
    }

    const movie = await response.json();

    const poster = movie.poster_path
      ? `${IMAGE_BASE_URL}${movie.poster_path}`
      : "placeholder.jpg";

    document.getElementById("movie-details-content").innerHTML = `
      <img src="${poster}" alt="${movie.title}" class="img-fluid mb-3">
      <h2>${movie.title}</h2>
      <p>${movie.overview || "No description available."}</p>
      <p><strong>Duration:</strong> ${movie.runtime || "N/A"} minutes</p>
      <p><strong>Release Date:</strong> ${movie.release_date || "N/A"}</p>
      <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank" class="btn btn-primary mt-3">View on TMDb</a>
    `;

    // Show the "movie-details" section
    showPage("movie-details");
  } catch (error) {
    console.error("Error fetching movie details:", error);
    alert("Unable to load movie details. Please try again.");
  }
}

// Show the Popular Movies on Page Load
document.addEventListener("DOMContentLoaded", fetchPopularMovies);

