import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '31704794-60eeb3a6ac83e8d6bcf335c57';

export const imagesGallery = async function (searchImg, page) {
  return await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${searchImg}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );
};
