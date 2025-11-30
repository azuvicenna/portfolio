<script setup>
import { ref } from 'vue';
import { Plus, Pencil, Trash2, X, Loader2, Link } from 'lucide-vue-next';

// Data statis untuk opsi kategori
const categories = ['Languages', 'Frameworks', 'Databases', 'Tools', 'Cloud', 'Others'];

// State
const isModalOpen = ref(false);
const isEditing = ref(false);
const isSubmitting = ref(false);

const currentSkill = ref({
  id: null,
  name: '',
  category: categories[0], // Default kategori
  logoUrl: '',
  displayOrder: 10
});

// Data Dummy Skills (diurutkan berdasarkan displayOrder)
const skills = ref([
  { id: 1, name: 'TypeScript', category: 'Languages', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-plain.svg', displayOrder: 1 },
  { id: 2, name: 'Dart', category: 'Languages', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg', displayOrder: 2 },
  { id: 3, name: 'Hono JS', category: 'Frameworks', logoUrl: 'https://www.hono.dev/images/hono-logo.png', displayOrder: 10 },
  { id: 4, name: 'PostgreSQL', category: 'Databases', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-plain.svg', displayOrder: 20 },
]);

// Logika Modal
const openCreateModal = () => {
  isEditing.value = false;
  currentSkill.value = { id: null, name: '', category: categories[0], logoUrl: '', displayOrder: 10 };
  isModalOpen.value = true;
};

const openEditModal = (skill) => {
  isEditing.value = true;
  currentSkill.value = { ...skill }; // Copy data
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const saveSkill = () => {
  // Logika simpan data ke Hono akan masuk di sini
  isSubmitting.value = true;
  setTimeout(() => {
    // Simulasi sukses
    alert(`Simulasi: Skill ${currentSkill.value.name} (${currentSkill.value.category}) berhasil disimpan!`);
    isSubmitting.value = false;
    closeModal();
    // Nanti setelah Hono terpasang, data di-refresh
  }, 1000);
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">Skills</h1>
      <button 
        @click="openCreateModal"
        class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        <Plus :size="20" />
        <span>Add New Skill</span>
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skill Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="skill in skills" :key="skill.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <img :src="skill.logoUrl" :alt="skill.name" class="w-8 h-8 object-contain" onerror="this.src='https://via.placeholder.com/32';" />
            </td>
            <td class="px-6 py-4 font-semibold text-gray-800">
              {{ skill.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                {{ skill.category }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ skill.displayOrder }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <button @click="openEditModal(skill)" class="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50">
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
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300">
        <div class="p-6 border-b flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-800">{{ isEditing ? 'Edit Skill' : 'Add New Skill' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <X :size="24" />
          </button>
        </div>
        
        <form @submit.prevent="saveSkill" class="p-6 space-y-4">
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
            <input v-model="currentSkill.name" type="text" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select v-model="currentSkill.category" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500">
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Display Order (1 = Highest)</label>
              <input v-model.number="currentSkill.displayOrder" type="number" min="1" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Logo URL (PNG, SVG, etc.)</label>
            <div class="flex items-center gap-3">
              <img :src="currentSkill.logoUrl" alt="Preview" class="w-8 h-8 object-contain border rounded p-1" onerror="this.style.display='none';" />
              <input v-model="currentSkill.logoUrl" type="url" placeholder="e.g. https://cdn.jsdelivr.net/..." class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500" />
              <Link :size="18" class="text-gray-500" />
            </div>
            <p class="text-xs text-gray-400 mt-1">Gunakan link CDN atau link dari Supabase Storage.</p>
          </div>
          

          <div class="flex justify-end pt-4 space-x-3 border-t">
            <button type="button" @click="closeModal" class="px-4 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 transition">Cancel</button>
            <button type="submit" :disabled="isSubmitting" class="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50">
              <Loader2 v-if="isSubmitting" class="animate-spin" :size="20" />
              <span v-else>Save Skill</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>