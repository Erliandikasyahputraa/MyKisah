export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async initialGalleryAndMap() {
    this.#view.showLoading();
    try {
      // Force refresh dari server, skip cache
      const response = await this.#model.getAllStories(true);

      if (!response.ok) {
        console.error('initialGalleryAndMap: response:', response);
        this.#view.populateStoriesListError(response.message);
        return;
      }

      this.#view.populateStoriesList(response.message, response.listStory); 
    } catch (error) {
      console.error('initialGalleryAndMap: error:', error);
      this.#view.populateStoriesListError(error.message);
    } finally {
      this.#view.hideLoading();
    }
  }

  // Tambah method untuk refresh manual
  async refreshStories() {
    return this.initialGalleryAndMap();
  }
}
