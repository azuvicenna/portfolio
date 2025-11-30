<script setup>
import { ref, watch } from 'vue';
import { Plus, Pencil, Trash2, X, Loader2, Link, Upload, Star, Code, Monitor } from 'lucide-vue-next';

// State
const isModalOpen = ref(false);
const isEditing = ref(false);
const isSubmitting = ref(false);
const imageFile = ref(null); // File yang dipilih lokal

const categories = ['Web Development', 'Mobile App', 'Backend API', 'DevOps', 'UI/UX'];

// Project model
const currentProject = ref({
  id: null,
  title: '',
  slug: '',
  category: categories[0],
  summary: '',
  content: '', // Konten panjang (Markdown)
  imageUrl: '',
  tools: [], // Array of strings
  demoUrl: '',
  repoUrl: '',
  isFeatured: false,
});

// Data Dummy Projects
const projects = ref([
  { id: 1, title: 'SIMGos Web App', slug: 'simgos-web-app', category: 'Web Development', summary: 'Developed a comprehensive reports system.', tools: ['TypeScript', 'Hono', 'Supabase'], imageUrl: 'https://via.placeholder.com/100/1e40af/ffffff?text=P1', isFeatured: true, repoUrl: 'https://github.com/re/sim', demoUrl: 'https://demo.sim.app'},
  { id: 2, title: 'Portfolio v2', slug: 'portfolio-v2', category: 'Backend API', summary: 'Rebuilt portfolio using a modern stack.', tools: ['Vue', 'Tailwind', 'Bun'], imageUrl: 'https://via.placeholder.com/100/f59e0b/ffffff?text=P2', isFeatured: false, repoUrl: 'https://github.com/re/port', demoUrl: null},
]);

// Helper: Menghasilkan slug dari title (Mesin generate otomatis)
const generateSlug = (title) => {
  return title.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '') // Hapus karakter non-word
    .replace(/[\s_-]+/g, '-')  // Ganti spasi/underscore dengan dash
    .replace(/^-+|-+$/g, '');  // Hapus dash di awal/akhir
};

// Logika Modal & Edit
const openCreateModal = () => {
  isEditing.value = false;
  currentProject.value = { id: null, title: '', slug: '', category: categories[0], summary: '', content: '', imageUrl: '', tools: [], demoUrl: '', repoUrl: '', isFeatured: false };
  isModalOpen.value = true;
};

const openEditModal = (proj) => {
  isEditing.value = true;
  // Saat edit, tools array harus diubah jadi string (dipisah koma) agar mudah diedit
  currentProject.value = { ...proj, tools: proj.tools.join(', ') }; 
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const saveProject = () => {
  // Logika konversi Tools (String dipisah koma -> Array)
  const toolsArray = currentProject.value.tools 
    .split(',')
    .map(tool => tool.trim())
    .filter(tool => tool !== '');

  // Logika simpan data ke Hono akan masuk di sini
  isSubmitting.value = true;
  setTimeout(() => {
    // Simulasi sukses
    alert(`Simulasi: Project ${currentProject.value.title} berhasil disimpan! Tools: ${toolsArray.join(', ')}`);
    isSubmitting.value = false;
    closeModal();
  }, 1000);
};

// Auto-generate slug saat title berubah (hanya saat membuat project baru)
watch(() => currentProject.value.title, (newTitle) => {
  if (!isEditing.value) {
    currentProject.value.slug = generateSlug(newTitle);
  }
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">Projects</h1>
      <button 
        @click="openCreateModal"
        class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        <Plus :size="20" />
        <span>Add New Project</span>
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Image</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-4/12">Title / Slug</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">Category / Tools</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Featured</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="proj in projects" :key="proj.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <img :src="proj.imageUrl" :alt="proj.title" class="w-10 h-10 object-cover rounded-md" />
            </td>
            <td class="px-6 py-4">
              <p class="font-semibold text-gray-800">{{ proj.title }}</p>
              <p class="text-xs text-gray-500 break-all">/projects/{{ proj.slug }}</p>
            </td>
            <td class="px-6 py-4">
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 mb-1">
                {{ proj.category }}
              </span>
              <p class="text-xs text-gray-500 line-clamp-1">{{ proj.tools.join(', ') }}</p>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <Star :size="18" :class="proj.isFeatured ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'" />
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <a :href="proj.demoUrl" target="_blank" v-if="proj.demoUrl" class="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-50">
                <Monitor :size="18" />
              </a>
              <button @click="openEditModal(proj)" class="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50">
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

    <div v-if="isModalOpen" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl transform transition-all duration-300 my-8">
        <div class="p-6 border-b flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-800">{{ isEditing ? 'Edit Project' : 'Add New Project' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <X :size="24" />
          </button>
        </div>
        
        <form @submit.prevent="saveProject" class="p-6 space-y-6">
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div class="md:col-span-1 space-y-4">
              <div class="p-4 bg-gray-50 border rounded-xl text-center">
                <img :src="currentProject.imageUrl || 'https://via.placeholder.com/200'" class="w-full h-auto object-cover rounded-lg mb-3 border-4 border-white shadow-sm" />
                <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input v-model="currentProject.imageUrl" type="url" placeholder="Paste image link" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500" />
                <p class="text-xs text-gray-400 mt-1">Gunakan Supabase Storage atau link CDN.</p>
              </div>
              
              <div class="flex items-center gap-2 pt-2">
                <input v-model="currentProject.isFeatured" id="isFeatured" type="checkbox" class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label for="isFeatured" class="text-sm font-medium text-gray-700">Set as Featured Project</label>
              </div>
            </div>

            <div class="md:col-span-2 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                <input v-model="currentProject.title" type="text" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500" />
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select v-model="currentProject.category" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500">
                    <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                  <input v-model="currentProject.slug" type="text" required :placeholder="generateSlug(currentProject.title)" class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 focus:ring-blue-500" />
                  <p class="text-xs text-gray-400 mt-1 truncate">/projects/{{ currentProject.slug }}</p>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Summary (Short description for cards)</label>
                <textarea v-model="currentProject.summary" rows="2" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500"></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Main Content (Full detail page - Markdown)</label>
                <textarea v-model="currentProject.content" rows="6" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500"></textarea>
              </div>

              <h3 class="font-semibold text-gray-800 pt-2 border-t">Links & Tools</h3>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tools / Tech Stack (Separate by comma: React, Hono, Supabase)</label>
                <input v-model="currentProject.tools" type="text" placeholder="e.g. Next.js, Tailwind, PostgreSQL" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Live Demo URL</label>
                  <input v-model="currentProject.demoUrl" type="url" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Repository URL (GitHub)</label>
                  <input v-model="currentProject.repoUrl" type="url" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500" />
                </div>
              </div>
              
            </div>
          </div>


          <div class="flex justify-end pt-4 space-x-3 border-t">
            <button type="button" @click="closeModal" class="px-4 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 transition">Cancel</button>
            <button type="submit" :disabled="isSubmitting" class="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50">
              <Loader2 v-if="isSubmitting" class="animate-spin" :size="20" />
              <span v-else>Save Project</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>