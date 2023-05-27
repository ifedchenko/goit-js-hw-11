import axios from 'axios';

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    const baseUrl = 'https://pixabay.com/api/';

    return await axios
      .get(`${baseUrl}`, {
        params: {
          key: `36686955-32d5f33599a736e8573496700`,
          q: this.searchQuery,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: 'true',
          per_page: 40,
          page: this.page,
        },
      })
      .then(response => {
        if (response.status !== 200) {
          throw new Error(response.status);
        }
        this.incrementPage();
        return response.data;
      });
  }

  // fetchImages() {
  //   const url = 'https://pixabay.com/api/';

  //   return fetch(
  //     `${url}?key=36679994-fdec862cf8a926d17bd3d37a5&q=${this.searchQuery}
  //     &image_type=photo&orientation=horizontal&safesearch=true
  //     &page=${this.page}&per_page=40&`
  //   )
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error(response.status);
  //       }
  //       return response.json();
  //     })
  //     .then(hits => {
  //       this.incrementPage();
  //       return hits;
  //     });
  // }

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
