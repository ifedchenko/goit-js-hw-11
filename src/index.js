import ImagesApiService from './js/fetchImages';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const imageApiService = new ImagesApiService();
const perPage = imageApiService.perPage();

let currentPage = 1;
let maxPages = 0;

const simpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const refs = {
  searchForm: document.querySelector('.search-form'),
  cardsList: document.querySelector('.gallery'),
  buttonMore: document.querySelector('.load-more'),
  anchorPoint: document.querySelector('.anchor-point'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.buttonMore.addEventListener('click', onLoadMore);

const observer = new IntersectionObserver(onObserve);

function onSearch(evt) {
  evt.preventDefault();
  observer.unobserve(refs.anchorPoint);

  imageApiService.query = evt.currentTarget.elements.searchQuery.value.trim();

  if (imageApiService.query === '') {
    return Notify.warning('Please type text.');
  }

  refs.cardsList.textContent = '';

  imageApiService.resetPage();
  imageApiService
    .fetchImages()
    .then(({ hits, totalHits }) => {
      if (totalHits > 0) {
        Notify.success(`Hooray! We found ${totalHits} images.`);
        maxPages = Math.ceil(totalHits / perPage);
        if (maxPages === 1) {
          markupListImages(hits);
          // refs.buttonMore.classList.add('is-hidden');
        } else if (currentPage === 1) {
          markupListImages(hits);
          // refs.buttonMore.classList.remove('is-hidden');
        }
      } else if (currentPage > 1) {
        onLoadMore();
      } else {
        // refs.buttonMore.classList.add('is-hidden');
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
    })
    .catch(error => {
      console.log(error);
      Notify.failure('An error occurred. Please try again later.');
    })
    .finally(() => {
      observer.observe(refs.anchorPoint);
      simpleLightbox.refresh();
    });
}

function onObserve(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (currentPage === maxPages) {
        observer.unobserve(refs.anchorPoint);
        return;
      }
      observer.unobserve(refs.anchorPoint);
      onLoadMore();
    }
  });
}

function onLoadMore() {
  refs.buttonMore.classList.add('is-hidden');

  imageApiService
    .fetchImages()
    .then(({ hits, totalHits }) => {
      currentPage++;
      if (currentPage === maxPages) {
        observer.unobserve(refs.anchorPoint);
        // refs.buttonMore.classList.add('is-hidden');
        Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
        return;
      }
      markupListImages(hits);
      // refs.buttonMore.classList.remove('is-hidden');
      smoothScroll(refs.cardsList, 2.5);
    })
    .catch(error => {
      console.log(error);
      Notify.failure('An error occurred. Please try again later.');
    })
    .finally(() => {
      simpleLightbox.refresh();
      observer.observe(refs.anchorPoint);
    });
}

function markupListImages(hits) {
  const markup = hits
    .map(
      hit => `
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
    </div>`
    )
    .join('');

  refs.cardsList.insertAdjacentHTML('beforeend', markup);
}

function smoothScroll(element, increment) {
  const { height: cardHeight } =
    element.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * increment,
    behavior: 'smooth',
  });
}

// import ImagesApiService from './js/fetchImages';
// import { Notify } from 'notiflix';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';

// const imageApiService = new ImagesApiService();
// const perPage = imageApiService.perPage();

// let currentPage = 1;

// const simpleLightbox = new SimpleLightbox('.gallery a', {
//   captionsData: 'alt',
//   captionDelay: 250,
// });

// const refs = {
//   searchForm: document.querySelector('.search-form'),
//   cardsList: document.querySelector('.gallery'),
//   buttonMore: document.querySelector('.load-more'),
//   anchorPoint: document.querySelector('.anchor-point'),
// };

// refs.searchForm.addEventListener('submit', onSearch);
// refs.buttonMore.addEventListener('click', onLoadMore);

// const observer = new IntersectionObserver(onObserve, { rootMargin: '0px' });

// function onSearch(evt) {
//   evt.preventDefault();
//   observer.unobserve(refs.anchorPoint);

//   imageApiService.query = evt.currentTarget.elements.searchQuery.value.trim();

//   if (imageApiService.query === '') {
//     return Notify.warning('Please type text.');
//   }

//   refs.cardsList.textContent = '';

//   imageApiService.resetPage();
//   imageApiService
//     .fetchImages()
//     .then(({ hits, totalHits }) => {
//       if (totalHits > 0) {
//         Notify.success(`Hooray! We found ${totalHits} images.`);
//         const maxPages = Math.ceil(totalHits / perPage);
//         if (maxPages === 1) {
//           markupListImages(hits);
//           refs.buttonMore.classList.add('is-hidden');
//         } else if (currentPage === 1) {
//           markupListImages(hits);
//           refs.buttonMore.classList.remove('is-hidden');
//         }
//       } else if (currentPage > 1) {
//         onLoadMore();
//       } else {
//         refs.buttonMore.classList.add('is-hidden');
//         Notify.failure(
//           'Sorry, there are no images matching your search query. Please try again.'
//         );
//       }
//     })
//     .catch(error => {
//       console.log(error);
//       Notify.failure('An error occurred. Please try again later.');
//     })
//     .finally(() => {
//       observer.observe(refs.anchorPoint);
//       simpleLightbox.refresh();
//     });
// }

// function onObserve(entries) {
//   entries.forEach(entry => {
//     if (entry.isIntersecting == true) {
//       onLoadMore();
//     }
//   });
// }

// function onLoadMore() {
//   refs.buttonMore.classList.add('is-hidden');

//   imageApiService
//     .fetchImages()
//     .then(({ hits, totalHits }) => {
//       observer.unobserve(refs.anchorPoint);
//       currentPage++;
//       if (currentPage === Math.ceil(totalHits / perPage)) {
//         refs.buttonMore.classList.add('is-hidden');
//         Notify.failure(
//           "We're sorry, but you've reached the end of search results."
//         );
//         return;
//       }
//       markupListImages(hits);
//       refs.buttonMore.classList.remove('is-hidden');
//       smoothScroll(refs.cardsList, 2.5);
//     })
//     .catch(error => {
//       console.log(error);
//       Notify.failure('An error occurred. Please try again later.');
//     })
//     .finally(() => {
//       simpleLightbox.refresh();
//     });
// }

// function markupListImages(hits) {
//   const markup = hits
//   .map(
//     hit => `
//     <div class="photo-card">
//     <a class="gallery-link" href="${hit.largeImageURL}">
//     <img class="gallery-image" src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" width="300" />
//     <div class="info">
//     <p class="info-item"><b>Likes</b>${hit.likes}</p>
//     <p class="info-item"><b>Views</b>${hit.views}</p>
//     <p class="info-item"><b>Comments</b>${hit.comments}</p>
//     <p class="info-item"><b>Downloads</b>${hit.downloads}</p>
//     </div>
//     </a>
//     </div>`
//     )
//     .join('');

//     refs.cardsList.insertAdjacentHTML('beforeend', markup);
//   }

//   function smoothScroll(element, increment) {
//     const { height: cardHeight } =
//     element.firstElementChild.getBoundingClientRect();

//     window.scrollBy({
//       top: cardHeight * increment,
//       behavior: 'smooth',
//     });
//   }

// old version

// function loadNextPage(hits, maxPages) {
//   markupListImages(hits);
//   refs.buttonMore.classList.remove('is-hidden');

//   if (currentPage === maxPages) {
//     refs.buttonMore.classList.add('is-hidden');
//     // window.removeEventListener('scroll', infiniteScroll);
//     Notify.failure(
//       "We're sorry, but you've reached the end of search results."
//     );
//   }
//   currentPage++;
// }

// function infiniteScroll() {
//   const documentRect = document.documentElement.getBoundingClientRect();
//   if (documentRect.bottom < document.documentElement.clientHeight + 10) {
//     onLoadMore();
//   }
// }
// function onSearch(evt) {
//   evt.preventDefault();

//   imageApiService.query = evt.currentTarget.elements.searchQuery.value.trim();

//   if (imageApiService.query === '') {
//     return Notify.warning('Please type text.');
//   }

//   refs.cardsList.innerHTML = '';

//   imageApiService.resetPage();
//   imageApiService
//     .fetchImages()
//     .then(response => {
//       if (response.totalHits > 0) {
//         Notify.success(`Hooray! We found ${response.totalHits} images.`);
//         // limitImages = response.totalHits;
//         // limitImages = 100;
//         const maxPages = Math.ceil(response.totalHits / perPage);
//         markupListImages(response.hits);
//         if (currentPage === maxPages) {
//           refs.buttonMore.classList.add('is-hidden');
//         } else {
//           refs.buttonMore.classList.remove('is-hidden');
//         }
//       } else {
//         refs.buttonMore.classList.add('is-hidden');
//         Notify.failure(
//           'Sorry, there are no images matching your search query. Please try again.'
//         );
//       }
//     })
//     .catch(error => console.log(error))
//     .finally(() => {
//       simpleLightbox.refresh();
//     });
// }

// function onLoadMore() {
//   refs.buttonMore.classList.add('is-hidden');

//   imageApiService
//     .fetchImages()
//     .then(response => {
//       const maxPages = Math.ceil(response.totalHits / perPage);
//       markupListImages(response.hits);
//       currentPage++;
//       refs.buttonMore.classList.remove('is-hidden');
//       if (currentPage === maxPages) {
//         refs.buttonMore.classList.add('is-hidden');

//         Notify.failure(
//           "We're sorry, but you've reached the end of search results."
//         );
//       }
//       // console.log(currentPage);
//       // console.log(maxPages);
//     })
//     .catch(error => console.log(error))
//     .finally(() => {
//       simpleLightbox.refresh();
//     });
// }
// function markupListImages(hits) {
//   for (let i = 0; i < hits.length; i++) {
//     const hit = hits[i];

//     const markup = `
//       <div class="photo-card">
//         <a class="gallery-link" href="${hit.largeImageURL}">
//           <img class="gallery-image" src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" width="300" />
//           <div class="info">
//             <p class="info-item"><b>Likes</b>${hit.likes}</p>
//             <p class="info-item"><b>Views</b>${hit.views}</p>
//             <p class="info-item"><b>Comments</b>${hit.comments}</p>
//             <p class="info-item"><b>Downloads</b>${hit.downloads}</p>
//           </div>
//         </a>
//       </div>`;

//     refs.cardsList.insertAdjacentHTML('beforeend', markup);
//   }
// }
