import RegisterPresenter from './register-presenter';
import * as MyKisahAPI from '../../../data/api';

export default class RegisterPage {
  #presenter = null;

  async render() {
    return `
      <section class="register-container">
        <div class="register-form-container">
          <h1 class="register__title">Daftar Akun dulu gasie</h1>

          <form id="register-form" class="register-form">
            <div class="form-control">
              <label for="name-input" class="register-form__name-title">Nama Lengkap <span style="color: red">*</span></label>
              <div class="register-form__title-container">
                <input id="name-input" type="text" name="name" placeholder="Masukkan nama lengkap Anda">
              </div>
            </div>
            <div class="form-control">
              <label for="email-input" class="register-form__email-title">Email <span style="color: red">*</span></label>
              <div class="register-form__title-container">
                <input id="email-input" type="email" name="email" placeholder="Contoh: nama@example.com">
              </div>
            </div>
            <div class="form-control">
              <label for="password-input" class="register-form__password-title">Password <span style="color: red">*</span></label>
              <div class="register-form__title-container">
                <input id="password-input" type="password" name="password" placeholder="Masukkan password baru">
              </div>
            </div>
            <div class="form-buttons register-form__form-buttons">
              <div id="submit-button-container">
                <button class="btn" type="submit">Daftar Akun</button>
              </div>
              <p class="register-form__already-have-account">Sudah punya akun? <a href="#/login">Masuk</a></p>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      view: this,
      model: MyKisahAPI,
    });

    this.#setupForm();
  }

  #setupForm() {
    document.getElementById('register-form').addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = {
        name: document.getElementById('name-input').value,
        email: document.getElementById('email-input').value,
        password: document.getElementById('password-input').value,
      };

      await this.#presenter.getRegistered(data);
    });
  }

  // ✅ GANTI NAMA METHOD INI SESUAI DENGAN YANG DIHARAPKAN PRESENTER
  registerFailed(message) {
    alert(message);
  }

  registeredSuccessfully(message) {
    console.log(message);
    location.hash = '/login';
  }

  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit" disabled>
        <i class="fas fa-spinner loader-button"></i> Daftar Akun
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit">Daftar Akun</button>
    `;
  }
}