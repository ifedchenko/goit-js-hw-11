import ImagesApiService from './js/fetchImages';

const refs = {
  searchForm: document.querySelector('.search-form'),
  cardsList: document.querySelector('.gallery'),
  // buttonMore: document.querySelector('.load-more'),
};

const imageApiService = new ImagesApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.buttonMore.addEventListener('click', onLoadMore);

function onSearch(evt) {
  evt.preventDefault();

  imageApiService.query = evt.currentTarget.elements.searchQuery.value.trim();

  if (imageApiService.query === '') {
    return alert('Введите запрос');
  }

  refs.cardsList.innerHTML = '';

  imageApiService.resetPage();
  imageApiService
    .fetchImages()
    .then(hits => {
      if (hits.length > 0) {
        markupListImages(hits);
      } else {
        console.log('ничего не найдено.');
      }
    })
    .catch(error => console.log(error));
}

function onLoadMore() {
  imageApiService
    .fetchImages()
    .then(hits => markupListImages(hits))
    .catch(error => console.log(error));
}

function markupListImages(hits) {
  const markup = hits.map(hit => {
    return `
      <div class="photo-card">
      <a class="gallery-link" href="${hit.largeImageURL}">
        <img class="gallery-image" src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" width="300" />
        <div class="info">
            <p class="info-item"><b>Likes</b>${hit.likes}</p>
            <p class="info-item"><b>Views</b>${hit.views}</p>
            <p class="info-item"><b>Comments</b>${hit.comments}</p>
            <p class="info-item"><b>Downloads</b>${hit.downloads}</p>
        </div>
        </a>
      </div>
      `;
  });
  // refs.cardsList.innerHTML = markup.join('');
  refs.cardsList.insertAdjacentHTML('beforeend', markup.join(''));
}
