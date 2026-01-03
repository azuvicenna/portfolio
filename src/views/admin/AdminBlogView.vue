<script setup>
import { ref, watch, computed } from 'vue';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/vue-query';
import { api } from '@/utils/api';
import { supabase } from '@/config/supabase';
import { z } from 'zod';
import { marked } from 'marked';
import {
  Plus, Pencil, Trash2, X, BookOpen, Loader2, AlertTriangle, 
  Image as ImageIcon, CheckCircle, XCircle, Eye, EyeOff,
  Bold, Italic, Link, Underline, ChevronLeft, ChevronRight
} from 'lucide-vue-next';

// --- SETUP ---
const queryClient = useQueryClient();
const isModalOpen = ref(false);
const isEditing = ref(false);
const isDeleteModalOpen = ref(false);
const itemToDelete = ref(null);
const errors = ref({});
const isPreview = ref(false);

// --- PAGINATION STATE ---
const page = ref(1);
const limit = 6; // Sesuai 'per_page' di JSON

// State Toast
const toast = ref({ show: false, message: '', type: 'success' });
const showMessage = (msg, type = 'success') => {
  toast.value = { show: true, message: msg, type };
  setTimeout(() => toast.value.show = false, 3000);
};

// Form State
const form = ref({
  id: null,
  title: '',
  slug: '',
  summary: '',
  content: '',
  language: 'ID',
  publishedAt: '', // Format YYYY-MM-DD string
  coverImage: '',
  tags: '' // Comma separated string
});

// --- ZOD SCHEMA ---
const blogSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  summary: z.string().min(1, "Ringkasan wajib diisi"),
  content: z.string().min(10, "Konten minimal 10 karakter"),
  language: z.enum(['ID', 'EN']),
  // Tanggal opsional, tapi kalau diisi harus valid string
  publishedAt: z.string().optional().or(z.literal('')), 
  coverImage: z.string().url("URL Gambar tidak valid").optional().or(z.literal('')),
  tags: z.string().optional()
});

// Watcher Validation & Slug
watch(form, (newVal) => {
  if (!isEditing.value && newVal.title) {
    form.value.slug = newVal.title.toString().toLowerCase().trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  }
  const result = blogSchema.safeParse(newVal);
  if (!result.success) {
    const formatted = {};
    result.error.issues.forEach(i => formatted[i.path[0]] = i.message);
    errors.value = formatted;
  } else {
    errors.value = {};
  }
}, { deep: true });

// --- HELPER DATE ---
// Mengubah "Dec 6, 2025" atau ISO string menjadi "2025-12-06" untuk input date
const formatToInputDate = (val) => {
  if (!val) return '';
  const date = new Date(val);
  if (isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
};

// --- API ACTIONS ---

// 1. FETCH (READ)
const { data: apiResponse, isLoading } = useQuery({
  queryKey: ['blogs', page],
  queryFn: async () => {
    const res = await api(`/blogs?page=${page.value}&limit=${limit}`);
    return res;
  },
  placeholderData: keepPreviousData,
  staleTime: 0
});

// Computed Data & Meta
const blogs = computed(() => {
  const raw = apiResponse.value;
  let dataToMap = [];

  // Logic Robust untuk mencari array data
  if (raw) {
    if (Array.isArray(raw)) dataToMap = raw;
    else if (raw.data && Array.isArray(raw.data)) dataToMap = raw.data;
    else if (raw.data?.data && Array.isArray(raw.data.data)) dataToMap = raw.data.data;
  }

  return dataToMap.map(item => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    summary: item.summary,
    content: item.content || '', // Handle jika API list tidak kirim content
    language: item.language || 'ID',
    // Mapping snake_case -> camelCase
    coverImage: item.cover_image || item.coverImage || '',
    publishedAt: item.published_at || item.publishedAt || null, 
    tags: Array.isArray(item.tags) ? item.tags : [],
    views: item.views || 0
  }));
});

const meta = computed(() => {
  const raw = apiResponse.value;
  const pag = raw?.pagination || raw?.data?.pagination || {};
  return { 
    current_page: pag.current_page || 1, 
    total_pages: pag.total_pages || 1, 
    total_items: pag.total_data || 0 // Sesuai JSON Anda: total_data
  };
});

// Pagination Controls
const nextPage = () => { if (page.value < meta.value.total_pages) page.value++; };
const prevPage = () => { if (page.value > 1) page.value--; };

// 2. SAVE
const saveMutation = useMutation({
  mutationFn: async (formData) => {
    const validation = blogSchema.safeParse(formData);
    if (!validation.success) throw new Error("Mohon perbaiki input yang merah.");

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Login dulu bang.");

    const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t !== '');

    const payload = {
      title: formData.title,
      slug: formData.slug,
      summary: formData.summary,
      content: formData.content,
      language: formData.language,
      published_at: formData.publishedAt || null, // Snake case ke DB
      cover_image: formData.coverImage,
      tags: tagsArray
    };

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    let url = `${API_URL}/api/v1/blogs`;
    let method = 'POST';

    if (isEditing.value) {
      url = `${API_URL}/api/v1/blogs/${formData.id}`;
      method = 'PUT';
    }

    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Gagal menyimpan artikel.");
    return res.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['blogs'] });
    showMessage(isEditing.value ? "Artikel diperbarui!" : "Artikel diterbitkan!");
    closeModal();
  },
  onError: (e) => showMessage(e.message, 'error')
});

// 3. DELETE
const deleteMutation = useMutation({
  mutationFn: async (id) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Login dulu bang.");

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const res = await fetch(`${API_URL}/api/v1/blogs/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${session.access_token}` }
    });

    if (!res.ok) throw new Error("Gagal menghapus.");
    return res.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['blogs'] });
    showMessage("Artikel dihapus!", 'success');
    closeDeleteModal();
  },
  onError: (e) => showMessage(e.message, 'error')
});

// --- MARKDOWN & FORM LOGIC ---
const textareaRef = ref(null);
const insertMarkdown = (type) => {
  if (!textareaRef.value) return;
  const start = textareaRef.value.selectionStart;
  const end = textareaRef.value.selectionEnd;
  const text = form.value.content;
  const selection = text.substring(start, end);
  let replacement = '';

  switch (type) {
    case 'bold': replacement = `**${selection || 'text'}**`; break;
    case 'italic': replacement = `*${selection || 'text'}*`; break;
    case 'underline': replacement = `<u>${selection || 'text'}</u>`; break;
    case 'link': replacement = `[${selection || 'Link'}](https://)`; break;
  }

  form.value.content = text.substring(0, start) + replacement + text.substring(end);
  setTimeout(() => {
    textareaRef.value.focus();
    const newPos = start + replacement.length;
    textareaRef.value.setSelectionRange(newPos, newPos);
  }, 0);
};

const openCreateModal = () => {
  isEditing.value = false;
  errors.value = {};
  form.value = {
    id: null, title: '', slug: '', summary: '', content: '',
    language: 'ID', publishedAt: new Date().toISOString().split('T')[0],
    coverImage: '', tags: ''
  };
  isModalOpen.value = true;
};

const openEditModal = (item) => {
  isEditing.value = true;
  errors.value = {};
  form.value = {
    ...item,
    // Format tanggal agar masuk ke input date
    publishedAt: formatToInputDate(item.publishedAt),
    // Join tags array jadi string
    tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags
  };
  isModalOpen.value = true;
};

const closeModal = () => isModalOpen.value = false;
const confirmDelete = (item) => { itemToDelete.value = item; isDeleteModalOpen.value = true; };
const closeDeleteModal = () => { isDeleteModalOpen.value = false; itemToDelete.value = null; };
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-8 relative pb-20">

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Blog Posts</h1>
        <p class="text-slate-500 mt-1">Write, edit, and publish your thoughts.</p>
      </div>
      <button @click="openCreateModal"
        class="flex items-center gap-2 text-white px-5 py-3 rounded-2xl transition shadow-lg shadow-orange-100 font-medium group"
        style="background-color: #FB923C;">
        <Plus :size="20" class="group-hover:rotate-90 transition transform duration-300" />
        <span>Write New Article</span>
      </button>
    </div>

    <div class="bg-white rounded-[2rem] shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col">
      
      <div v-if="isLoading" class="p-12 text-center flex justify-center">
        <Loader2 class="animate-spin text-[#FB923C]" :size="40" />
      </div>

      <div v-else-if="!blogs || blogs.length === 0" class="p-12 text-center text-slate-400">
        <BookOpen :size="48" class="mb-4 opacity-50 mx-auto" />
        <p>No articles found.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-bold bg-gray-50/50">
              <th class="px-8 py-5">Article</th>
              <th class="px-6 py-5">Status & Date</th>
              <th class="px-6 py-5">Tags</th>
              <th class="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="item in blogs" :key="item.id" class="group hover:bg-orange-50/30 transition duration-200">
              <td class="px-8 py-5">
                <div class="flex gap-4">
                  <div
                    class="flex flex-col items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 text-xs font-bold border"
                    :class="item.language === 'ID' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'">
                    {{ item.language }}
                  </div>
                  <div>
                    <h3 class="font-bold text-slate-800 text-base line-clamp-1">{{ item.title }}</h3>
                    <p class="text-xs text-gray-400 mt-0.5 font-mono line-clamp-1">/blog/{{ item.slug }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-5">
                <div class="space-y-1">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border"
                    :class="item.publishedAt ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-100 text-gray-500 border-gray-200'">
                    {{ item.publishedAt ? 'Published' : 'Draft' }}
                  </span>
                  <p v-if="item.publishedAt" class="text-xs text-gray-400 font-medium">{{ item.publishedAt }}</p>
                </div>
              </td>
              <td class="px-6 py-5">
                <div class="flex flex-wrap gap-1 max-w-[200px]">
                  <span v-for="tag in item.tags.slice(0,3)" :key="tag"
                    class="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-bold uppercase tracking-wide border border-gray-200">
                    {{ tag }}
                  </span>
                  <span v-if="item.tags.length > 3" class="text-[10px] text-gray-400 self-center">+{{ item.tags.length - 3 }}</span>
                </div>
              </td>
              <td class="px-8 py-5 text-right">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="openEditModal(item)"
                    class="p-2 text-slate-400 hover:text-[#FB923C] hover:bg-orange-50 rounded-xl transition">
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

      <div v-if="meta.total_pages > 1" class="border-t border-gray-100 px-8 py-4 bg-gray-50/30 flex items-center justify-between">
        <span class="text-xs text-slate-500 font-medium">
          Showing page <b>{{ meta.current_page }}</b> of <b>{{ meta.total_pages }}</b> ({{ meta.total_items }} articles)
        </span>
        <div class="flex items-center gap-2">
          <button 
            @click="prevPage" :disabled="page === 1"
            class="p-2 rounded-lg border border-gray-200 bg-white text-slate-600 hover:bg-[#FB923C] hover:text-white hover:border-[#FB923C] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1 text-xs font-bold"
          >
            <ChevronLeft :size="14" /> Prev
          </button>
          <button 
            @click="nextPage" :disabled="page >= meta.total_pages"
            class="p-2 rounded-lg border border-gray-200 bg-white text-slate-600 hover:bg-[#FB923C] hover:text-white hover:border-[#FB923C] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1 text-xs font-bold"
          >
            Next <ChevronRight :size="14" />
          </button>
        </div>
      </div>

    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isModalOpen" class="fixed inset-0 z-[999] overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

            <div class="relative z-10 w-full max-w-6xl h-[90vh] flex flex-col transform rounded-[2rem] bg-white p-8 text-left shadow-2xl transition-all border border-gray-100 my-8">

              <div class="flex items-center justify-between mb-6 flex-shrink-0">
                <div>
                  <h2 class="text-2xl font-bold text-slate-800">{{ isEditing ? 'Edit Article' : 'Write New Article' }}</h2>
                  <p class="text-slate-400 text-sm">Share your knowledge.</p>
                </div>
                <button @click="closeModal"
                  class="p-2 bg-gray-50 text-gray-400 hover:text-slate-800 hover:bg-gray-100 rounded-full transition">
                  <X :size="24" />
                </button>
              </div>

              <form @submit.prevent="saveMutation.mutate(form)" class="flex-1 grid grid-cols-1 md:grid-cols-4 gap-8 overflow-hidden">
                <div class="md:col-span-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar border-r border-gray-100">
                  
                  <div class="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">Settings</label>
                    <div class="space-y-3">
                      <div class="space-y-1">
                        <label class="text-[10px] font-bold text-slate-400 uppercase">Publish Date</label>
                        <input v-model="form.publishedAt" type="date"
                          class="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none custom-focus text-slate-700">
                        <p class="text-[10px] text-gray-400">Leave empty to save as Draft.</p>
                      </div>
                      <div class="space-y-1">
                        <label class="text-[10px] font-bold text-slate-400 uppercase">Language</label>
                        <select v-model="form.language"
                          class="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none custom-focus text-slate-700">
                          <option value="ID">Bahasa Indonesia</option>
                          <option value="EN">English</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Cover Image</label>
                    <div class="aspect-video bg-gray-100 rounded-xl mb-2 flex items-center justify-center text-gray-400 border border-dashed border-gray-300 overflow-hidden relative group">
                      <img v-if="form.coverImage" :src="form.coverImage" class="w-full h-full object-cover"
                        alt="Cover Preview" @error="$event.target.style.display='none'" />
                      <div v-else class="flex flex-col items-center gap-2">
                        <ImageIcon :size="24" />
                        <span class="text-xs">Preview</span>
                      </div>
                    </div>
                    <input v-model="form.coverImage" type="url" placeholder="https://..."
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-slate-800 text-sm custom-focus" 
                      :class="{'border-red-500': errors.coverImage}" />
                    <span v-if="errors.coverImage" class="text-xs text-red-500">{{ errors.coverImage }}</span>
                  </div>

                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Tags</label>
                    <input v-model="form.tags" type="text" placeholder="hono, backend, tutorial"
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-slate-800 text-sm custom-focus" />
                    <p class="text-[10px] text-gray-400">Separated by comma.</p>
                  </div>
                </div>

                <div class="md:col-span-3 space-y-6 overflow-y-auto pr-2 custom-scrollbar flex flex-col h-full">
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Title</label>
                    <input v-model="form.title" type="text"
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-slate-800 font-bold text-lg custom-focus"
                      :class="{'border-red-500': errors.title}" />
                    <span v-if="errors.title" class="text-xs text-red-500">{{ errors.title }}</span>
                  </div>
                  
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Slug</label>
                    <div class="relative">
                      <span class="absolute left-4 top-3.5 text-gray-400 text-sm">/blog/</span>
                      <input v-model="form.slug" type="text"
                        class="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-slate-800 custom-focus"
                        :class="{'border-red-500': errors.slug}" />
                    </div>
                    <span v-if="errors.slug" class="text-xs text-red-500">{{ errors.slug }}</span>
                  </div>

                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Summary</label>
                    <textarea v-model="form.summary" rows="2"
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-slate-800 resize-none custom-focus"
                      :class="{'border-red-500': errors.summary}"></textarea>
                    <span v-if="errors.summary" class="text-xs text-red-500">{{ errors.summary }}</span>
                  </div>

                  <div class="space-y-2 flex-1 flex flex-col min-h-[300px]">
                    <div class="flex justify-between items-center">
                      <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Content (Markdown)</label>
                      <div class="flex gap-2">
                        <button type="button" @click="insertMarkdown('bold')" class="p-1 hover:bg-gray-100 rounded" title="Bold"><Bold :size="14"/></button>
                        <button type="button" @click="insertMarkdown('italic')" class="p-1 hover:bg-gray-100 rounded" title="Italic"><Italic :size="14"/></button>
                        <button type="button" @click="insertMarkdown('underline')" class="p-1 hover:bg-gray-100 rounded" title="Underline"><Underline :size="14"/></button>
                        <button type="button" @click="insertMarkdown('link')" class="p-1 hover:bg-gray-100 rounded" title="Link"><Link :size="14"/></button>
                        <div class="w-px h-4 bg-gray-300 mx-1"></div>
                        <button type="button" @click="isPreview = !isPreview" class="flex items-center gap-1 text-xs font-bold text-[#FB923C]">
                          <component :is="isPreview ? EyeOff : Eye" :size="14"/> {{ isPreview ? 'Edit' : 'Preview' }}
                        </button>
                      </div>
                    </div>

                    <div v-if="!isPreview" class="flex-1">
                      <textarea ref="textareaRef" v-model="form.content"
                        class="w-full h-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-slate-800 font-mono text-sm leading-relaxed resize-none custom-focus"
                        :class="{'border-red-500': errors.content}"></textarea>
                    </div>
                    <div v-else class="flex-1 w-full px-4 py-3 bg-white border border-gray-200 rounded-xl prose prose-sm max-w-none overflow-y-auto"
                         v-html="marked.parse(form.content || '')"></div>
                    
                    <span v-if="errors.content" class="text-xs text-red-500">{{ errors.content }}</span>
                  </div>

                  <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button type="button" @click="closeModal"
                      class="px-6 py-2.5 rounded-xl text-slate-500 font-bold hover:bg-gray-50 transition">Cancel</button>
                    <button type="submit" :disabled="saveMutation.isPending.value"
                      class="flex items-center gap-2 px-6 py-2.5 text-white rounded-xl font-bold transition shadow-lg shadow-orange-100 disabled:opacity-70"
                      style="background-color: #FB923C;">
                      <Loader2 v-if="saveMutation.isPending.value" class="animate-spin" :size="20" />
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
          <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="closeDeleteModal"></div>
          <div class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 text-center transform transition-all border border-gray-100">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-6">
              <AlertTriangle class="h-8 w-8 text-red-500" />
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-2">Delete Article?</h3>
            <p class="text-slate-500 text-sm mb-8">Are you sure you want to delete <strong class="text-slate-700">"{{ itemToDelete?.title }}"</strong>?</p>
            <div class="grid grid-cols-2 gap-3">
              <button @click="closeDeleteModal"
                class="py-3 rounded-xl text-slate-600 font-bold hover:bg-gray-50 transition border border-gray-200">Cancel</button>
              <button @click="deleteMutation.mutate(itemToDelete.id)" :disabled="deleteMutation.isPending.value"
                class="flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-200 disabled:opacity-70">
                <Loader2 v-if="deleteMutation.isPending.value" class="animate-spin" :size="20" />
                <span v-else>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Transition name="fade">
      <div v-if="toast.show" class="fixed bottom-6 right-6 z-50 bg-white border border-gray-100 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
        <div :class="toast.type === 'success' ? 'text-green-500' : 'text-red-500'">
          <component :is="toast.type === 'success' ? CheckCircle : XCircle" :size="24" />
        </div>
        <div>
          <h4 class="font-bold text-sm" :class="toast.type === 'success' ? 'text-green-700' : 'text-red-700'">
            {{ toast.type === 'success' ? 'Success!' : 'Error!' }}
          </h4>
          <p class="text-xs text-slate-500">{{ toast.message }}</p>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.custom-focus:focus {
  border-color: #FB923C;
  --tw-ring-color: #FB923C;
  --tw-ring-opacity: 0.2;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e2e8f0; border-radius: 20px; }
</style>