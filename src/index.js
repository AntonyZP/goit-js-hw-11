import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import './css/styles.css';
import { imagesGallery } from './axiosAPI';

const { searchForm, gallery, loadMore } = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};
const simpleligthbox = new SimpleLightbox('.gallery a', { loop: false });
let page = 1;
let searchImg = '';

searchForm.addEventListener('submit', onSearch);
loadMore.addEventListener('click', onLoadMore);
loadMore.disabled = true;

function onSearch(e) {
  e.preventDefault();
  searchImg = e.currentTarget.elements.searchQuery.value.trim();
  resetPage();
  imagesGallery(searchImg)
    .then(resp => {
      if (resp.data.hits.length < 1) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.     '
        );
        loadMore.disabled = true;
        clearGallery();
        throw new Error();
      }
      clearGallery();
      loadMore.disabled = false;
      gallery.insertAdjacentHTML('beforeend', createImgMarkup(resp.data.hits));
      Notiflix.Notify.success(`Hooray! We found ${resp.data.totalHits} images`);
    })
    .catch(err => {
      console.log(err);
    })
    .then(() => simpleligthbox.refresh());
}

function onLoadMore(e) {
  imagesGallery(searchImg, (page += 1)).then(resp => {
    gallery.insertAdjacentHTML('beforeend', createImgMarkup(resp.data.hits));
    loadMore.disabled = false;
    if (resp.data.hits.length < 40) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMore.disabled = true;
    }
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
        `<div class="photo-card"><div class="thumb"><a class="gallery-item" href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a></div>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            <span>${likes}</span>
          </p>
          <p class="info-item">
            <b>Views</b>
            <span>${views}</span>
          </p>
          <p class="info-item">
            <b>Comments</b>
            <span>${comments}</span>
          </p>
          <p class="info-item">
            <b>Downloads</b>
            <span>${downloads}</span>
          </p>
        </div>
      </div>`
    )
    .join('');
}

function resetPage() {
  page = 1;
}

function clearGallery() {
  gallery.innerHTML = '';
}
