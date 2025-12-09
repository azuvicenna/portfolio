<script setup>
import { ref, watch } from 'vue';
import {
  Plus, Pencil, Trash2, X, BookOpen,
  Loader2, AlertTriangle, Image as ImageIcon
} from 'lucide-vue-next';

// --- STATE UTAMA ---
const isModalOpen = ref(false);
const isEditing = ref(false);
const isSubmitting = ref(false);

// --- STATE DELETE MODAL (BARU) ---
const isDeleteModalOpen = ref(false);
const itemToDelete = ref(null);

const form = ref({
  id: null,
  title: '',
  slug: '',
  summary: '',
  content: '',
  language: 'ID',
  isPublished: false,
  publishedAt: new Date().toISOString().split('T')[0],
  coverImage: '',
  tags: ''
});

// Data Dummy (Simulasi)
const blogs = ref([
  {
    id: 1,
    title: 'Tutorial Hono JS Dasar',
    slug: 'tutorial-hono-js',
    summary: 'Panduan lengkap memulai backend dengan Hono JS.',
    content: '# Hono JS\n\nIsi artikel...',
    language: 'ID',
    isPublished: true,
    publishedAt: '2025-11-28',
    coverImage: '',
    tags: ['Backend', 'JS']
  },
  {
    id: 2,
    title: 'Deploying to Railway',
    slug: 'deploy-railway',
    summary: 'Step-by-step guide to deploy your app.',
    content: '# Deployment\n\nSteps...',
    language: 'EN',
    isPublished: false,
    publishedAt: null,
    coverImage: '',
    tags: ['DevOps']
  },
]);

// --- HELPER FUNCTIONS ---
const generateSlug = (text) => text.toString().toLowerCase().trim()
  .replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');

const formatDate = (dateString) => {
  if (!dateString) return 'Not set';
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// --- LOGIC: CREATE / EDIT ---
const openCreateModal = () => {
  isEditing.value = false;
  form.value = {
    id: null, title: '', slug: '', summary: '', content: '',
    language: 'ID', isPublished: false, publishedAt: new Date().toISOString().split('T')[0],
    coverImage: '', tags: ''
  };
  isModalOpen.value = true;
};

const openEditModal = (item) => {
  isEditing.value = true;
  form.value = { ...item, tags: item.tags.join(', ') };
  isModalOpen.value = true;
};

const closeModal = () => isModalOpen.value = false;

// Auto-slug
watch(() => form.value.title, (newTitle) => {
  if (!isEditing.value && newTitle) form.value.slug = generateSlug(newTitle);
});

const saveBlog = () => {
  isSubmitting.value = true;

  // Simulasi Save
  setTimeout(() => {
    const tagsArray = form.value.tags.split(',').map(t => t.trim()).filter(t => t !== '');
    const payload = {
      ...form.value,
      tags: tagsArray,
      publishedAt: form.value.isPublished ? form.value.publishedAt : null
    };

    if (isEditing.value) {
      const index = blogs.value.findIndex(b => b.id === form.value.id);
      if (index !== -1) blogs.value[index] = { ...payload };
    } else {
      blogs.value.unshift({ ...payload, id: Date.now() });
    }

    isSubmitting.value = false;
    closeModal();
  }, 1000);
};

// --- LOGIC: DELETE (BARU) ---
const confirmDelete = (item) => {
  itemToDelete.value = item;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  itemToDelete.value = null;
};

const deleteBlog = () => {
  if (!itemToDelete.value) return;
  isSubmitting.value = true;

  // Simulasi Delete
  setTimeout(() => {
    blogs.value = blogs.value.filter(b => b.id !== itemToDelete.value.id);
    isSubmitting.value = false;
    closeDeleteModal();
  }, 1000);
};
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-8">

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Blog Posts</h1>
        <p class="text-slate-500 mt-1">Write, edit, and publish your thoughts.</p>
      </div>
      <button @click="openCreateModal"
        class="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl hover:bg-slate-800 transition shadow-lg shadow-slate-200 font-medium group">
        <Plus :size="20" class="group-hover:rotate-90 transition transform duration-300" />
        <span>Write New Article</span>
      </button>
    </div>

    <div class="bg-white rounded-[2rem] shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
      <div v-if="blogs.length === 0" class="p-12 text-center text-slate-400">
        <BookOpen :size="48" class="mb-4 opacity-50 mx-auto" />
        <p>No articles yet.</p>
      </div>

      <table v-else class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-bold bg-gray-50/50">
            <th class="px-8 py-5">Article</th>
            <th class="px-6 py-5">Status & Date</th>
            <th class="px-6 py-5">Tags</th>
            <th class="px-8 py-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="item in blogs" :key="item.id" class="group hover:bg-gray-50/80 transition duration-200">
            <td class="px-8 py-5">
              <div class="flex gap-4">
                <div
                  class="flex flex-col items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 text-xs font-bold border"
                  :class="item.language === 'ID' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'">
                  {{ item.language }}
                </div>
                <div>
                  <h3 class="font-bold text-slate-800 text-base">{{ item.title }}</h3>
                  <p class="text-xs text-gray-400 mt-0.5 font-mono">/blog/{{ item.slug }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-5">
              <div class="space-y-1">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border"
                  :class="item.isPublished ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-100 text-gray-500 border-gray-200'">
                  {{ item.isPublished ? 'Published' : 'Draft' }}
                </span>
                <p class="text-xs text-gray-400 font-medium">{{ formatDate(item.publishedAt) }}</p>
              </div>
            </td>
            <td class="px-6 py-5">
              <div class="flex flex-wrap gap-1">
                <span v-for="tag in item.tags" :key="tag"
                  class="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-bold uppercase tracking-wide">
                  {{ tag }}
                </span>
              </div>
            </td>
            <td class="px-8 py-5 text-right">
              <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="openEditModal(item)"
                  class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition">
                  <Pencil :size="16" />
                </button>
                <button @click="confirmDelete(item)"
                  class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition">
                  <Trash2 :size="16" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isModalOpen" class="fixed inset-0 z-[999] overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

            <div
              class="relative z-10 w-full max-w-6xl h-[90vh] flex flex-col transform rounded-[2rem] bg-white p-8 text-left shadow-2xl transition-all border border-gray-100 my-8">

              <div class="flex items-center justify-between mb-6 flex-shrink-0">
                <div>
                  <h2 class="text-2xl font-bold text-slate-800">{{ isEditing ? 'Edit Article' : 'Write New Article' }}
                  </h2>
                  <p class="text-slate-400 text-sm">Share your knowledge.</p>
                </div>
                <button @click="closeModal"
                  class="p-2 bg-gray-50 text-gray-400 hover:text-slate-800 hover:bg-gray-100 rounded-full transition">
                  <X :size="24" />
                </button>
              </div>

              <form @submit.prevent="saveBlog" class="flex-1 grid grid-cols-1 md:grid-cols-4 gap-8 overflow-hidden">
                <div class="md:col-span-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar border-r border-gray-100">
                  <div class="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">Publish
                      Status</label>
                    <div class="flex items-center gap-3 mb-4">
                      <input v-model="form.isPublished" type="checkbox" id="published"
                        class="w-5 h-5 text-green-600 rounded focus:ring-green-500 border-gray-300">
                      <label for="published" class="text-sm font-bold text-slate-700 cursor-pointer">Publish Now</label>
                    </div>
                    <div class="space-y-2">
                      <label class="text-xs font-bold text-slate-400">Date</label>
                      <input v-model="form.publishedAt" type="date"
                        class="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none">
                    </div>
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Language</label>
                    <select v-model="form.language"
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 text-sm">
                      <option value="ID">Bahasa Indonesia</option>
                      <option value="EN">English</option>
                    </select>
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Cover Image URL</label>

                    <div
                      class="aspect-video bg-gray-100 rounded-xl mb-2 flex items-center justify-center text-gray-400 border border-dashed border-gray-300 overflow-hidden relative">
                      <img v-if="form.coverImage" :src="form.coverImage" class="w-full h-full object-cover"
                        alt="Cover Preview"
                        @error="$event.target.src = 'https://via.placeholder.com/300?text=Invalid+URL'" />
                      <div v-else class="flex flex-col items-center gap-2">
                        <ImageIcon :size="24" />
                        <span class="text-xs">No image selected</span>
                      </div>
                    </div>

                    <input v-model="form.coverImage" type="url" placeholder="https://..."
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 text-sm" />
                    <p class="text-[10px] text-slate-400">Paste public URL from Supabase Storage or Unsplash.</p>
                  </div>
                </div>

                <div class="md:col-span-3 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Title</label>
                    <input v-model="form.title" type="text"
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 font-bold text-lg"
                      required />
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Slug</label>
                    <input v-model="form.slug" type="text"
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
                      required />
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Summary</label>
                    <textarea v-model="form.summary" rows="2"
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 resize-none"></textarea>
                  </div>
                  <div class="space-y-2 h-full flex flex-col min-h-[300px]">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Content (Markdown)</label>
                    <textarea v-model="form.content"
                      class="flex-1 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 font-mono text-sm leading-relaxed resize-none"></textarea>
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Tags</label>
                    <input v-model="form.tags" type="text" placeholder="comma separated"
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800" />
                  </div>
                  <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button type="button" @click="closeModal"
                      class="px-6 py-2.5 rounded-xl text-slate-500 font-bold hover:bg-gray-50 transition">Cancel</button>
                    <button type="submit" :disabled="isSubmitting"
                      class="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 disabled:opacity-70">
                      <Loader2 v-if="isSubmitting" class="animate-spin" :size="20" />
                      <span v-else>Save Article</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isDeleteModalOpen" class="fixed inset-0 z-[1000] flex items-center justify-center p-4">

          <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="closeDeleteModal">
          </div>

          <div
            class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 text-center transform transition-all border border-gray-100">

            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-6">
              <AlertTriangle class="h-8 w-8 text-red-500" />
            </div>

            <h3 class="text-xl font-bold text-slate-800 mb-2">Delete Article?</h3>
            <p class="text-slate-500 text-sm mb-8">
              Are you sure you want to delete <strong class="text-slate-700">"{{ itemToDelete?.title }}"</strong>?
              This action cannot be undone.
            </p>

            <div class="grid grid-cols-2 gap-3">
              <button @click="closeDeleteModal"
                class="py-3 rounded-xl text-slate-600 font-bold hover:bg-gray-50 transition border border-gray-200">
                Cancel
              </button>
              <button @click="deleteBlog" :disabled="isSubmitting"
                class="flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-200 disabled:opacity-70">
                <Loader2 v-if="isSubmitting" class="animate-spin" :size="20" />
                <span v-else>Yes, Delete</span>
              </button>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 20px;
}
</style>