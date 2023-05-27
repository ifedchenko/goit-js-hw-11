import ImagesApiService from './js/fetchImages';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const imageApiService = new ImagesApiService();
let limitImages = 0;
let counter = 0;
let simpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const refs = {
  searchForm: document.querySelector('.search-form'),
  cardsList: document.querySelector('.gallery'),
  buttonMore: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.buttonMore.addEventListener('click', onLoadMore);

function onSearch(evt) {
  evt.preventDefault();

  imageApiService.query = evt.currentTarget.elements.searchQuery.value.trim();

  if (imageApiService.query === '') {
    return Notify.warning('Please type text.');
  }

  refs.cardsList.innerHTML = '';

  imageApiService.resetPage();
  imageApiService
    .fetchImages()
    .then(response => {
      if (response.totalHits > 0) {
        Notify.success(`Hooray! We found ${response.totalHits} images.`);
        limitImages = response.totalHits;
        // limitImages = 100;
        markupListImages(response.hits);

        refs.buttonMore.classList.remove('is-hidden');
      } else {
        refs.buttonMore.classList.add('is-hidden');
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      simpleLightbox.refresh();
    });
}

function onLoadMore() {
  refs.buttonMore.classList.add('is-hidden');
  imageApiService
    .fetchImages()
    .then(response => {
      markupListImages(response.hits);
      refs.buttonMore.classList.remove('is-hidden');
    })
    .catch(error => console.log(error))
    .finally(() => {
      simpleLightbox.refresh();
    });
}

function markupListImages(hits) {
  for (let i = 0; i < hits.length; i++) {
    const hit = hits[i];
    counter++;
    // console.log(counter);
    // console.log(limitImages);

    if (counter > limitImages) {
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      break;
    }

    const markup = `
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
      </div>`;

    refs.cardsList.insertAdjacentHTML('beforeend', markup);
  }
}

// function markupListImages(hits) {
//   const markup = hits.map(hit => {
//     counter++;
//     console.log(counter);
//     console.log(limitImages);
//     if (counter >= limitImages) {
//       Notify.failure(
//         "We're sorry, but you've reached the end of search results."
//       );
//       return '';
//     } else {
//       return `
//       <div class="photo-card">
//       <a class="gallery-link" href="${hit.largeImageURL}">
//         <img class="gallery-image" src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" width="300" />
//         <div class="info">
//             <p class="info-item"><b>Likes</b>${hit.likes}</p>
//             <p class="info-item"><b>Views</b>${hit.views}</p>
//             <p class="info-item"><b>Comments</b>${hit.comments}</p>
//             <p class="info-item"><b>Downloads</b>${hit.downloads}</p>
//         </div>
//         </a>
//       </div>
//       `;
//     }
//   });
//   // refs.cardsList.innerHTML = markup.join('');
//   refs.cardsList.insertAdjacentHTML('beforeend', markup.join(''));
// }

// function markupListImages(hits) {
//   const limitImages = response.data.totalHits;
//   const markup = hits.reduce((acc, hit) => {
//     return (
//       acc +
//       `<div class="photo-card">
//       <a class="gallery-link" href="${hit.largeImageURL}">
//         <img class="gallery-image"
//                 src="${hit.webformatURL}"
//                 alt="${hit.tags}"
//                 loading="lazy"
//                 width="300" />
//         <div class="info">
//             <p class="info-item"><b>Likes</b>${hit.likes}</p>
//             <p class="info-item"><b>Views</b>${hit.views}</p>
//             <p class="info-item"><b>Comments</b>${hit.comments}</p>
//             <p class="info-item"><b>Downloads</b>${hit.downloads}</p>
//         </div>
//         </a>
//       </div>`
//     );
//   }, '');

//   refs.cardsList.insertAdjacentHTML('beforeend', markup);
// }
