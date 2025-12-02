import { createI18n } from 'vue-i18n';

const messages = {
  // --- KAMUS UTAMA (INGGRIS) ---
  // Ini yang akan tampil pertama kali saat web dibuka
  en: {
    sidebar: {
      dashboard: 'Dashboard',
      projects: 'Projects',
      about: 'About Me',
      guestbook: 'Guestbook'
    },
    actions: {
      save: 'Save Changes',
      cancel: 'Cancel',
      delete: 'Delete'
    },
    greeting: 'Welcome back, {name}!'
  },

  // --- INDONESIA ---
  id: {
    sidebar: {
      dashboard: 'Dasbor',
      projects: 'Proyek',
      about: 'Tentang Saya',
      guestbook: 'Buku Tamu'
    },
    actions: {
      save: 'Simpan Perubahan',
      cancel: 'Batal',
      delete: 'Hapus'
    },
    greeting: 'Selamat datang kembali, {name}!'
  }
};

const i18n = createI18n({
  legacy: false,
  locale: 'en', 
  fallbackLocale: 'en', 
  messages, 
});

export default i18n;