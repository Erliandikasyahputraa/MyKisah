export default class RegisterPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async getRegistered({ name, email, password }) {
    this.#view.showSubmitLoadingButton();
    try {

      const response = await this.#model.getRegistered({ name, email, password });

      if (!response.ok) {
        console.error('getRegistered: response:', response);
      
        // ✅ Tambahkan pengecekan isi pesan error
        if (response.message && response.message.toLowerCase().includes('email is already taken')) {
          this.#view.registerFailed('Email sudah digunakan. Silakan gunakan email lain.');
        } else {
          this.#view.registerFailed(response.message || 'Terjadi kesalahan saat mendaftar.');
        }
      
        return;
      }
      

      this.#view.registeredSuccessfully(response.message, response.data);
    } catch (error) {
      console.error('getRegistered: error:', error);
      this.#view.registerFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}