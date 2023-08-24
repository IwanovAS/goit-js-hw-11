import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = '39027614-ebffabe42d69b2da9cdf04ec0';
const BASE_URL = 'https://pixabay.com/api/';
const ITEMS_PER_PAGE = 40;
let currentPage = 1;
let currentSearchQuery = '';

const searchForm = document.getElementById('search-form');
const gallery = document.getElementById('gallery');
const loadMoreBtn = document.getElementById('load-more');

searchForm.addEventListener('submit', handleSearch);
loadMoreBtn.addEventListener('click', loadMoreImages);

async function handleSearch(event) {
  event.preventDefault();
  currentPage = 1;
  currentSearchQuery = event.target.searchQuery.value.trim();
  await fetchImages(currentSearchQuery);
}

async function fetchImages(query) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: ITEMS_PER_PAGE,
        page: currentPage,
      },
    });

    const images = response.data.hits;
    if (images.length === 0) {
      Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    if (currentPage === 1) {
      gallery.innerHTML = '';
    }

    images.forEach(image => {
      const imageCard = createImageCard(image);
      gallery.appendChild(imageCard);
    });

    if (images.length < ITEMS_PER_PAGE) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    } else {
      loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    Notiflix.Notify.failure('An error occurred while fetching images.');
  }
}

function createImageCard(image) {
  const card = document.createElement('div');
  card.className = 'photo-card';

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = 'lazy';

  const info = document.createElement('div');
  info.className = 'info';
  info.innerHTML = `
    <p class="info-item"><b>Likes:</b> ${image.likes}</p>
    <p class="info-item"><b>Views:</b> ${image.views}</p>
    <p class="info-item"><b>Comments:</b> ${image.comments}</p>
    <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
  `;

  card.appendChild(img);
  card.appendChild(info);

  return card;
}

async function loadMoreImages() {
  currentPage++;
  await fetchImages(currentSearchQuery);
}

loadMoreBtn.style.display = 'none';
