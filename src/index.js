import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';

// // <div class="photo-card"> <img src="" alt="" loading="lazy" /><div class="info"><p class="info-item"> <b>Likes</b></p><p class="info-item"><b>Views</b></p><p class="info-item"><b>Comments</b></p><p class="info-item"><b>Downloads</b></p></div></div>
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '31704794-60eeb3a6ac83e8d6bcf335c57';
let page = 1;
let searchImg = '';
const totalHits = '';

const { searchForm, gallery, loadMore } = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

searchForm.addEventListener('submit', onSearch);
loadMore.addEventListener('click', onLoadMore);
loadMore.disabled = true;

function onSearch(e) {
  e.preventDefault();
  searchImg = e.currentTarget.elements.searchQuery.value;
  resetPage();
  imagesGalleryApi(searchImg).then(data => {
    clearGallery();
    if (data.hits.length === 0) {
      loadMore.disabled = true;
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.     '
      );
    }
    gallery.insertAdjacentHTML('beforeend', createImgMarkup(data.hits));
    Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images`);
    loadMore.disabled = false;
  });
}

function onLoadMore() {
  loadMore.disabled = true;

  imagesGalleryApi(searchImg).then(data => {
    gallery.insertAdjacentHTML('beforeend', createImgMarkup(data.hits));
    loadMore.disabled = false;
  });
}

function imagesGalleryApi(searchImg) {
  return fetch(
    `${BASE_URL}?key=${API_KEY}&q=${searchImg}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=3`
  )
    .then(resp => {
      if (!resp.ok) {
        throw new Error(resp.statusText);
      }
      page += 1;
      return resp.json();
    })
    .catch(err => {
      console.log(err);
    });
}

function createImgMarkup(arr) {
  console.log(arr);
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card"> <img src="${webformatURL}" alt="${tags}" width = 70px loading="lazy" /><div class="info"><p class="info-item"> <b>Likes ${likes}</b></p><p class="info-item"><b>Views ${views}</b></p><p class="info-item"><b>Comments ${comments}</b></p><p class="info-item"><b>Downloads ${downloads}</b></p></div></div>`
    )
    .join('');
}

function resetPage() {
  page = 1;
}

function clearGallery() {
  gallery.innerHTML = '';
}
