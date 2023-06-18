import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


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
  } else {
    Notiflix.Notify.failure('Please enter something for a search.');
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
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } else {
    if (currentPage === 1) {
      gallery.innerHTML = '';
    }
    loadMoreButton.style.display = 'none';
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }
    const lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();
}

function createPhotoCard(image) {
  const { webformatURL, likes, views, comments, downloads, tags } = image;

return `
  <div class="photo-card">
    <a href="${webformatURL}">
      <img class="image" src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item"><b>Likes:</b> ${likes}</p>
      <p class="info-item"><b>Views:</b> ${views}</p>
      <p class="info-item"><b>Comments:</b> ${comments}</p>
      <p class="info-item"><b>Downloads:</b> ${downloads}</p>
    </div>
  </div>
`;}

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
    Notiflix.Notify.failure('Sorry, there was an error. Please try again.');
    throw error;
  }
}