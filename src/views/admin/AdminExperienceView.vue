<script setup>
import { ref } from 'vue';
import { Plus, Pencil, Trash2, X, Loader2, Calendar } from 'lucide-vue-next';

// State
const isModalOpen = ref(false);
const isEditing = ref(false);
const isSubmitting = ref(false);

const currentExperience = ref({
  id: null,
  position: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  description: '' // Nanti ini jadi textarea di modal
});

// Data Dummy (Nanti diganti fetch dari Hono)
const experiences = ref([
  { id: 1, position: 'Web Developer', company: 'Diskominfo', location: 'Tasikmalaya', startDate: '2025-09-01', endDate: null },
  { id: 2, position: 'Freelance Developer', company: 'Self-Employed', location: 'Banjar', startDate: '2024-10-01', endDate: '2025-08-31' },
]);

// Logika Modal
const openCreateModal = () => {
  isEditing.value = false;
  currentExperience.value = { id: null, position: '', company: '', location: '', startDate: '', endDate: '', description: '' };
  isModalOpen.value = true;
};

const openEditModal = (exp) => {
  isEditing.value = true;
  currentExperience.value = { ...exp }; // Copy data
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const saveExperience = () => {
  // Logika simpan data ke Hono akan masuk di sini
  isSubmitting.value = true;
  setTimeout(() => {
    // Simulasi sukses
    alert('Simulasi: Data berhasil disimpan!');
    isSubmitting.value = false;
    closeModal();
    // Nanti setelah Hono terpasang, data di `experiences` di-refresh
  }, 1000);
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">Experiences</h1>
      <button 
        @click="openCreateModal"
        class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        <Plus :size="20" />
        <span>Add New</span>
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position / Company</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="exp in experiences" :key="exp.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <p class="font-semibold text-gray-800">{{ exp.position }}</p>
              <p class="text-sm text-gray-500">{{ exp.company }}</p>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ exp.location }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ exp.startDate }} — {{ exp.endDate || 'Now' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <button @click="openEditModal(exp)" class="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50">
                <Pencil :size="18" />
              </button>
              <button class="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50">
                <Trash2 :size="18" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300">
        <div class="p-6 border-b flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-800">{{ isEditing ? 'Edit Experience' : 'Add New Experience' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <X :size="24" />
          </button>
        </div>
        
        <form @submit.prevent="saveExperience" class="p-6 space-y-4">
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Position / Role</label>
              <input v-model="currentExperience.position" type="text" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Company / Institution</label>
              <input v-model="currentExperience.company" type="text" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500" />
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input v-model="currentExperience.location" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input v-model="currentExperience.startDate" type="date" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
              <input v-model="currentExperience.endDate" type="date" :placeholder="currentExperience.endDate ? '' : 'Current'" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description (Bullet points / Markdown)</label>
            <textarea v-model="currentExperience.description" rows="5" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500"></textarea>
          </div>

          <div class="flex justify-end pt-4 space-x-3 border-t">
            <button type="button" @click="closeModal" class="px-4 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 transition">Cancel</button>
            <button type="submit" :disabled="isSubmitting" class="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50">
              <Loader2 v-if="isSubmitting" class="animate-spin" :size="20" />
              <span v-else>Save Experience</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Style untuk menghilangkan ikon default date input */
input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0;
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>