<script setup>
import { ref, onMounted } from 'vue';
import { Save, Upload, Loader2 } from 'lucide-vue-next';
// import { supabase } from '@/config/supabase'; // Tidak perlu diimport jika tidak dipakai

// State
// Kita set isLoading=false karena data sudah ada
const isLoading = ref(false);
const isSaving = ref(false);
const fileInput = ref(null);

const form = ref({
  // 1. DATA STATIS DITULIS DISINI
  full_name: 'Atyla Azfa Al Harits',
  headline: 'Backend Developer | Information System Student',
  bio: 'Ini adalah contoh bio yang bisa diedit. \n\nKami mendukung format Markdown.',
  email: 'azfaalharits25@gmail.com',
  linkedin_url: 'https://linkedin.com/in/atyla-azfa-al-harits',
  github_url: 'https://github.com/reezecodee',
  instagram_url: 'https://instagram.com/user_handle',
  avatar_url: 'https://ui-avatars.com/api/?name=Atyla+Azfa&background=0D8ABC&color=fff' // URL Avatar Statis
});

// 1. Fetch Data Dihilangkan
const fetchData = async () => {
  // Simulasi data sudah terisi
  isLoading.value = false;
};

// 2. Handle Upload Gambar (Simulasi)
const handleFileUpload = async (event) => {
  // --- HANYA SIMULASI ---
  alert('Simulasi: Gambar berhasil diupload. Cek console log.');
  const file = event.target.files[0];
  if (file) {
    // Tampilkan preview lokal
    form.value.avatar_url = URL.createObjectURL(file);
  }
};

// 3. Save Data ke Backend Hono (Simulasi)
const saveData = async () => {
  isSaving.value = true;
  await new Promise(resolve => setTimeout(resolve, 1200)); // Simulasi proses 1.2 detik

  // Tampilkan data yang akan dikirim
  console.log("[Data Tersimpan (Simulasi)]", form.value);
  alert(`[SIMULASI SUKSES] Profile Berhasil Diperbarui. \nHeadline: ${form.value.headline}`);

  isSaving.value = false;
};

// Trigger input file
const triggerFileInput = () => {
  fileInput.value.click();
};

// Tidak ada onMounted, karena data langsung terisi di atas
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Edit Profile</h1>
        <p class="text-gray-500 text-sm">Update informasi pribadi dan bio Anda.</p>
      </div>
      <button @click="saveData" :disabled="isSaving"
        class="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
        <Loader2 v-if="isSaving" class="animate-spin" :size="20" />
        <Save v-else :size="20" />
        <span>{{ isSaving ? 'Saving...' : 'Save Changes' }}</span>
      </button>
    </div>

    <div v-if="isLoading" class="text-center py-12">
      <Loader2 class="animate-spin mx-auto text-blue-500" :size="40" />
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">

      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <div class="relative w-40 h-40 mx-auto mb-4 group">
            <img :src="form.avatar_url || 'https://via.placeholder.com/150'"
              class="w-full h-full object-cover rounded-full border-4 border-gray-100 shadow-sm" alt="Avatar" />
            <div @click="triggerFileInput"
              class="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
              <Upload class="text-white" />
            </div>
          </div>

          <p class="text-sm text-gray-500 mb-2">Click image to change avatar</p>
          <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload" />
        </div>
      </div>

      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-5">
          <h3 class="font-semibold text-gray-800 border-b pb-3">Basic Information</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input v-model="form.full_name" type="text"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input v-model="form.email" type="email"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Headline</label>
            <input v-model="form.headline" type="text" placeholder="e.g. Backend Developer"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Bio (Markdown Support)</label>
            <textarea v-model="form.bio" rows="6"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea>
            <p class="text-xs text-gray-400 mt-1 text-right">Markdown syntax supported</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-5">
          <h3 class="font-semibold text-gray-800 border-b pb-3">Social Media</h3>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
              <input v-model="form.linkedin_url" type="url"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
              <input v-model="form.github_url" type="url"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>