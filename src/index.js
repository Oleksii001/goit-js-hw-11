
      // import axios from 'axios';
      // import Notiflix from 'notiflix';
      // import SimpleLightbox from 'simplelightbox';
      // import 'simplelightbox/dist/simple-lightbox.min.css';
      // import { fetchPhotos } from 'api-photo.js';
const apiKey = '37263308-2603284e2849c610a8b3f752c';
const perPage = 40;

let currentPage = 1;
let currentQuery = '';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

searchForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const searchQuery = document.querySelector('input[name="searchQuery"]').value;
  if (searchQuery.trim() !== '') {
    currentQuery = searchQuery;
    currentPage = 1;
    gallery.innerHTML = '';
    loadMoreButton.style.display = 'none';
    
    await performSearch(searchQuery);
  }
});

loadMoreButton.addEventListener('click', async function () {
  await performSearch(currentQuery);
});

async function performSearch(query) {
  const data = await fetchPhotos(query);

  if (data.hits.length > 0) {
    data.hits.forEach(function (image) {
      const card = createPhotoCard(image);
      gallery.insertAdjacentHTML('beforeend', card);
    });

    currentPage++;

    if (currentPage <= Math.ceil(data.totalHits / perPage)) {
      loadMoreButton.style.display = 'block';
    } else {
      loadMoreButton.style.display = 'none';
      gallery.insertAdjacentHTML(
        'beforeend',
        "<p>We're sorry, but you've reached the end of search results.</p>"
      );
    }
  } else {
    if (currentPage === 1) {
      gallery.innerHTML = '';
    }
    loadMoreButton.style.display = 'none';
    gallery.insertAdjacentHTML(
      'beforeend',
      `<p>Sorry, there are no images matching your search query. Please try again.</p>`              
    );
  }
}

function createPhotoCard(image) {
  const { webformatURL, likes, views, comments, downloads, tags } = image;

  return `
    <div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${likes}</p>
        <p class="info-item"><b>Views:</b> ${views}</p>
        <p class="info-item"><b>Comments:</b> ${comments}</p>
        <p class="info-item"><b>Downloads:</b> ${downloads}</p>
      </div>
    </div>
  `;
}

async function fetchPhotos(inputValue) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: inputValue,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: currentPage,
        per_page: perPage
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
