export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchImages() {
    const url = 'https://pixabay.com/api/';

    return fetch(
      `${url}?key=36679994-fdec862cf8a926d17bd3d37a5&q=${this.searchQuery}
      &image_type=photo&orientation=horizontal&safesearch=true
      &page=${this.page}&per_page=40&`
    )
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(({ hits }) => {
        this.incrementPage();
        return hits;
      });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
