<script setup>
import { ref, watch } from 'vue';
import { Plus, Pencil, Trash2, X, Loader2, BookOpen, Clock, Globe } from 'lucide-vue-next';

// State
const isModalOpen = ref(false);
const isEditing = ref(false);
const isSubmitting = ref(false);

// Blog model
const currentBlog = ref({
  id: null,
  title: '',
  slug: '',
  summary: '',
  content: '', // Konten utama (Markdown)
  coverImage: '',
  language: 'ID', // Default ID
  tags: [], // Array of strings
  isPublished: false,
  publishedAt: new Date().toISOString().split('T')[0] // Default hari ini
});

// Data Dummy Blogs
const blogs = ref([
  { id: 1, title: 'Pesan semantik pada perintah commit Git', slug: 'semantic-commit-git', language: 'ID', summary: 'Panduan singkat mengenai Semantic Commit.', isPublished: true, publishedAt: '2024-01-29', tags: ['git', 'best-practice'], coverImage: 'https://via.placeholder.com/100/1e40af/ffffff?text=B1' },
  { id: 2, title: 'Deploy HonoJS to Railway', slug: 'deploy-hono-railway', language: 'EN', summary: 'A step-by-step guide.', isPublished: false, publishedAt: null, tags: ['hono', 'deployment'], coverImage: 'https://via.placeholder.com/100/f59e0b/ffffff?text=B2' },
]);

// Helper: Menghasilkan slug dari title
const generateSlug = (title) => {
  return title.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Logika Modal & Edit
const openCreateModal = () => {
  isEditing.value = false;
  currentBlog.value = { id: null, title: '', slug: '', summary: '', content: '', coverImage: '', language: 'ID', tags: [], isPublished: false, publishedAt: new Date().toISOString().split('T')[0] };
  isModalOpen.value = true;
};

const openEditModal = (blog) => {
  isEditing.value = true;
  // Saat edit, tags array diubah jadi string (dipisah koma) agar mudah diedit
  currentBlog.value = { ...blog, tags: blog.tags.join(', ') }; 
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const saveBlog = () => {
  // Logika konversi Tags (String dipisah koma -> Array)
  const tagsArray = currentBlog.value.tags 
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag !== '');

  // Logika simpan data ke Hono akan masuk di sini
  isSubmitting.value = true;
  setTimeout(() => {
    // Simulasi sukses
    alert(`Simulasi: Blog "${currentBlog.value.title}" (Status: ${currentBlog.value.isPublished ? 'Published' : 'Draft'}) berhasil disimpan!`);
    isSubmitting.value = false;
    closeModal();
  }, 1000);
};

// Auto-generate slug saat title berubah (hanya saat membuat project baru)
watch(() => currentBlog.value.title, (newTitle) => {
  if (!isEditing.value) {
    currentBlog.value.slug = generateSlug(newTitle);
  }
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">Blogs</h1>
      <button 
        @click="openCreateModal"
        class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        <Plus :size="20" />
        <span>Write New Article</span>
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-5/12">Title / Slug</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">Tags / Language</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="blog in blogs" :key="blog.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <p class="font-semibold text-gray-800">{{ blog.title }}</p>
              <p class="text-xs text-gray-500 break-all">/blog/{{ blog.slug }}</p>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                :class="blog.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'"
              >
                <Clock :size="14" class="mr-1" />
                {{ blog.isPublished ? 'Published' : 'Draft' }}
              </span>
              <p v-if="blog.isPublished" class="text-xs text-gray-400 mt-1">
                {{ blog.publishedAt }}
              </p>
            </td>
            <td class="px-6 py-4">
              <span 
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                :class="blog.language === 'ID' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'"
              >
                <Globe :size="12" class="mr-1" />
                {{ blog.language }}
              </span>
              <p class="text-xs text-gray-500 line-clamp-1 mt-1">{{ blog.tags.join(', ') }}</p>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <button @click="openEditModal(blog)" class="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50">
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
          <h3 class="text-xl font-bold text-gray-800">{{ isEditing ? 'Edit Article' : 'Write New Article' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <X :size="24" />
          </button>
        </div>
        
        <form @submit.prevent="saveBlog" class="p-6 space-y-6">
          
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div class="md:col-span-1 space-y-4">
              <div class="bg-gray-50 p-4 rounded-xl border space-y-4">
                <h3 class="text-sm font-bold text-gray-700">Status & Publish</h3>
                
                <div class="flex items-center gap-2">
                  <input v-model="currentBlog.isPublished" id="isPublished" type="checkbox" class="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                  <label for="isPublished" class="text-sm font-medium text-gray-700">Publish Now</label>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
                  <input v-model="currentBlog.publishedAt" type="date" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500" />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select v-model="currentBlog.language" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500">
                    <option value="ID">Bahasa Indonesia</option>
                    <option value="EN">English</option>
                  </select>
                </div>
              </div>

              <div class="bg-gray-50 p-4 rounded-xl border">
                <img :src="currentBlog.coverImage || 'https://via.placeholder.com/200?text=Cover+Image'" class="w-full h-auto object-cover rounded-lg mb-3" />
                <label class="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                <input v-model="currentBlog.coverImage" type="url" placeholder="Paste link disini" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500" />
              </div>
            </div>

            <div class="md:col-span-3 space-y-4">
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input v-model="currentBlog.title" type="text" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                  <input v-model="currentBlog.slug" type="text" required :placeholder="generateSlug(currentBlog.title)" class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 focus:ring-blue-500" />
                  <p class="text-xs text-gray-400 mt-1 truncate">/blog/{{ currentBlog.slug }}</p>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Summary (Short description for list/SEO)</label>
                <textarea v-model="currentBlog.summary" rows="2" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500"></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Content (Full Article - Markdown)</label>
                <textarea v-model="currentBlog.content" rows="10" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 font-mono text-sm"></textarea>
                <p class="text-xs text-gray-400 mt-1 text-right">Gunakan Markdown untuk formatting.</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tags (Pisahkan dengan koma: honojs, git, tutorial)</label>
                <input v-model="currentBlog.tags" type="text" placeholder="e.g. javascript, tailwind, deployment" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500" />
              </div>

            </div>
          </div>


          <div class="flex justify-end pt-4 space-x-3 border-t">
            <button type="button" @click="closeModal" class="px-4 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 transition">Cancel</button>
            <button type="submit" :disabled="isSubmitting" class="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50">
              <Loader2 v-if="isSubmitting" class="animate-spin" :size="20" />
              <span v-else>Save Article</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>