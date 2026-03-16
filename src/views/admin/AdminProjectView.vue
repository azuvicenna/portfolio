<script setup>
import { ref, watch, computed } from 'vue';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/vue-query';
import { api } from '@/utils/api';
import { supabase } from '@/config/supabase';
import { z } from 'zod';
import { marked } from 'marked';
import {
  Plus, Pencil, Trash2, X, Star, Monitor, Loader2,
  AlertTriangle, CheckCircle, XCircle, Eye, EyeOff,
  Bold, Italic, Link, Underline, ChevronLeft, ChevronRight
} from 'lucide-vue-next';

const queryClient = useQueryClient();
const isModalOpen = ref(false);
const isEditing = ref(false);
const isDeleteModalOpen = ref(false);
const itemToDelete = ref(null);
const errors = ref({});
const isPreview = ref(false);

const page = ref(1);
const limit = 6;

const categories = ['Web Development', 'Mobile App', 'Backend API', 'UI/UX Design', 'DevOps', 'Fullstack', 'Tools/CLI', 'Legacy'];

const toast = ref({ show: false, message: '', type: 'success' });
const showMessage = (msg, type = 'success') => {
  toast.value = { show: true, message: msg, type };
  setTimeout(() => toast.value.show = false, 3000);
};

const form = ref({
  id: null,
  title: '',
  slug: '',
  category: categories[0],
  summary: '',
  content: '',
  imageUrl: '',
  tools: '',
  demoUrl: '',
  repoUrl: '',
  isFeatured: false
});

const projectSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  category: z.string().min(1, "Kategori wajib dipilih"),
  summary: z.string().min(1, "Ringkasan wajib diisi"),
  content: z.string().min(10, "Konten minimal 10 karakter"),
  imageUrl: z.string().url("URL Gambar tidak valid").optional().or(z.literal('')),
  tools: z.string().min(1, "Tools wajib diisi"),
  demoUrl: z.string().url("URL Demo tidak valid").optional().or(z.literal('')),
  repoUrl: z.string().url("URL Repo tidak valid").optional().or(z.literal('')),
});

watch(form, (newVal) => {
  if (!isEditing.value && newVal.title) {
    form.value.slug = newVal.title.toString().toLowerCase().trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  }
  const result = projectSchema.safeParse(newVal);
  if (!result.success) {
    const formatted = {};
    result.error.issues.forEach(i => formatted[i.path[0]] = i.message);
    errors.value = formatted;
  } else {
    errors.value = {};
  }
}, { deep: true });

const { data: apiResponse, isLoading } = useQuery({
  queryKey: ['admin-projects'],
  queryFn: () => api('/projects/admin/all'),
  placeholderData: keepPreviousData,
  staleTime: 0
});

const allProjects = computed(() => {
  const raw = apiResponse.value;
  if (!raw) return [];
  const data = raw.data || raw;
  return Array.isArray(data) ? data : [];
});

const projects = computed(() => {
  const start = (page.value - 1) * limit;
  const end = start + limit;

  return allProjects.value.slice(start, end).map(item => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    category: item.category,
    summary: item.summary,
    content: item.content,
    imageUrl: item.image_url || item.imageUrl || '',
    tools: Array.isArray(item.tools) ? item.tools : [],
    demoUrl: item.demo_url || item.demoUrl || '',
    repoUrl: item.repo_url || item.repoUrl || '',
    isFeatured: item.is_featured || item.isFeatured || false
  }));
});

const meta = computed(() => {
  const total = allProjects.value.length;
  return {
    current_page: page.value,
    total_pages: Math.ceil(total / limit) || 1,
    total_items: total
  };
});

const nextPage = () => { if (page.value < meta.value.total_pages) page.value++; };
const prevPage = () => { if (page.value > 1) page.value--; };

const saveMutation = useMutation({
  mutationFn: async (formData) => {
    const validation = projectSchema.safeParse(formData);
    if (!validation.success) throw new Error("Mohon perbaiki input yang merah.");

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Sesi habis, login ulang.");

    const toolsArray = formData.tools.split(',').map(t => t.trim()).filter(t => t !== '');

    const payload = {
      title: formData.title,
      slug: formData.slug,
      category: formData.category,
      summary: formData.summary,
      content: formData.content,
      image_url: formData.imageUrl,
      tools: toolsArray,
      demo_url: formData.demoUrl,
      repo_url: formData.repoUrl,
      is_featured: formData.isFeatured
    };

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    let url = `${API_URL}/api/v1/projects`;
    let method = 'POST';

    if (isEditing.value) {
      url = `${API_URL}/api/v1/projects/${formData.id}`;
      method = 'PUT';
    }

    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Gagal menyimpan project.");
    return res.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
    showMessage(isEditing.value ? "Project diperbarui!" : "Project ditambahkan!");
    closeModal();
  },
  onError: (e) => showMessage(e.message, 'error')
});

const deleteMutation = useMutation({
  mutationFn: async (id) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Sesi habis, login ulang.");

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const res = await fetch(`${API_URL}/api/v1/projects/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${session.access_token}` }
    });

    if (!res.ok) throw new Error("Gagal menghapus.");
    return res.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
    showMessage("Project dihapus!", 'success');
    closeDeleteModal();
  },
  onError: (e) => showMessage(e.message, 'error')
});

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
    id: null, title: '', slug: '', category: categories[0], summary: '', content: '', imageUrl: '',
    tools: '', demoUrl: '', repoUrl: '', isFeatured: false
  };
  isModalOpen.value = true;
};

const openEditModal = (item) => {
  isEditing.value = true;
  errors.value = {};
  form.value = { ...item, tools: Array.isArray(item.tools) ? item.tools.join(', ') : item.tools };
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
        <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Portfolio Projects</h1>
        <p class="text-slate-500 mt-1">Manage your showcased work and case studies.</p>
      </div>
      <button @click="openCreateModal"
        class="flex items-center gap-2 text-white px-5 py-3 rounded-2xl transition shadow-lg shadow-orange-100 font-medium group"
        style="background-color: #FB923C;">
        <Plus :size="20" class="group-hover:rotate-90 transition transform duration-300" />
        <span>Add Project</span>
      </button>
    </div>

    <div
      class="bg-white rounded-[2rem] shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col">

      <div v-if="isLoading" class="p-12 text-center flex justify-center">
        <Loader2 class="animate-spin text-[#FB923C]" :size="40" />
      </div>

      <div v-else-if="!projects || projects.length === 0"
        class="p-12 text-center text-slate-400 flex flex-col items-center">
        <Monitor :size="48" class="mb-4 opacity-50" />
        <p>No projects found.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-bold bg-gray-50/50">
              <th class="px-8 py-5">Project Details</th>
              <th class="px-6 py-5">Category & Tools</th>
              <th class="px-6 py-5 text-center">Status</th>
              <th class="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="item in projects" :key="item.id" class="group hover:bg-orange-50/30 transition duration-200">
              <td class="px-8 py-5">
                <div class="flex gap-4">
                  <img :src="item.imageUrl || 'https://via.placeholder.com/100'" :alt="item.title"
                    class="w-16 h-12 object-cover rounded-xl shadow-sm border border-gray-100 bg-gray-50">
                  <div>
                    <h3 class="font-bold text-slate-800 text-base">{{ item.title }}</h3>
                    <p class="text-xs text-gray-400 mt-0.5 font-mono">/projects/{{ item.slug }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-5">
                <div class="space-y-1.5">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-50 text-[#FB923C] border border-orange-100">
                    {{ item.category }}
                  </span>
                  <p class="text-xs text-gray-500 font-medium truncate max-w-[200px]">
                    {{ item.tools.join(', ') }}
                  </p>
                </div>
              </td>
              <td class="px-6 py-5 text-center">
                <div v-if="item.isFeatured"
                  class="inline-flex p-2 rounded-lg bg-yellow-50 text-yellow-500 border border-yellow-100"
                  title="Featured Project">
                  <Star :size="16" fill="currentColor" />
                </div>
                <span v-else class="text-xs text-gray-400">-</span>
              </td>
              <td class="px-8 py-5 text-right">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a v-if="item.demoUrl" :href="item.demoUrl" target="_blank"
                    class="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition">
                    <Monitor :size="16" />
                  </a>
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

      <div v-if="meta.total_pages > 1"
        class="border-t border-gray-100 px-8 py-4 bg-gray-50/30 flex items-center justify-between">
        <span class="text-xs text-slate-500 font-medium">
          Showing page <b>{{ meta.current_page }}</b> of <b>{{ meta.total_pages }}</b> ({{ meta.total_items }} projects)
        </span>
        <div class="flex items-center gap-2">
          <button @click="prevPage" :disabled="page === 1"
            class="p-2 rounded-lg border border-gray-200 bg-white text-slate-600 hover:bg-[#FB923C] hover:text-white hover:border-[#FB923C] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1 text-xs font-bold">
            <ChevronLeft :size="14" /> Prev
          </button>

          <button @click="nextPage" :disabled="page >= meta.total_pages"
            class="p-2 rounded-lg border border-gray-200 bg-white text-slate-600 hover:bg-[#FB923C] hover:text-white hover:border-[#FB923C] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1 text-xs font-bold">
            Next
            <ChevronRight :size="14" />
          </button>
        </div>
      </div>

    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isModalOpen" class="fixed inset-0 z-[999] overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

            <div
              class="relative z-10 w-full max-w-4xl transform rounded-[2rem] bg-white p-8 text-left shadow-2xl transition-all border border-gray-100 my-8">
              <div class="flex items-center justify-between mb-8">
                <div>
                  <h2 class="text-2xl font-bold text-slate-800">{{ isEditing ? 'Edit Project' : 'Add New Project' }}
                  </h2>
                  <p class="text-slate-400 text-sm">Showcase your latest work.</p>
                </div>
                <button @click="closeModal"
                  class="p-2 bg-gray-50 text-gray-400 hover:text-slate-800 hover:bg-gray-100 rounded-full transition">
                  <X :size="24" />
                </button>
              </div>

              <form @submit.prevent="saveMutation.mutate(form)" class="space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div class="md:col-span-1 space-y-4">
                    <div class="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-center">
                      <img :src="form.imageUrl || 'https://via.placeholder.com/300'"
                        class="w-full h-auto rounded-xl shadow-sm border border-white mb-4 object-cover aspect-video">
                      <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-500 uppercase tracking-wider block text-left">Image
                          URL</label>
                        <input v-model="form.imageUrl" type="url" placeholder="https://..."
                          class="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl outline-none text-sm text-slate-800 custom-focus"
                          :class="{ 'border-red-500': errors.imageUrl }" />
                      </div>
                    </div>
                    <div
                      class="flex items-center gap-3 p-4 bg-yellow-50 rounded-2xl border border-yellow-100 cursor-pointer"
                      @click="form.isFeatured = !form.isFeatured">
                      <div class="w-5 h-5 rounded border flex items-center justify-center bg-white"
                        :class="form.isFeatured ? 'border-yellow-500 text-yellow-500' : 'border-gray-300'">
                        <Star v-if="form.isFeatured" :size="14" fill="currentColor" />
                      </div>
                      <label class="text-sm font-bold text-yellow-700 cursor-pointer select-none">Set as
                        Featured</label>
                    </div>
                  </div>

                  <div class="md:col-span-2 space-y-5">
                    <div class="space-y-2">
                      <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Title</label>
                      <input v-model="form.title" type="text"
                        class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-slate-800 font-medium custom-focus"
                        :class="{ 'border-red-500 bg-red-50': errors.title }" />
                      <span v-if="errors.title" class="text-xs text-red-500">{{ errors.title }}</span>
                    </div>

                    <div class="grid grid-cols-2 gap-5">
                      <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                        <select v-model="form.category"
                          class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-slate-800 custom-focus">
                          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                        </select>
                      </div>
                      <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Slug</label>
                        <div class="relative">
                          <span class="absolute left-4 top-3.5 text-gray-400 text-sm">/</span>
                          <input v-model="form.slug" type="text"
                            class="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-slate-800 custom-focus"
                            :class="{ 'border-red-500 bg-red-50': errors.slug }" />
                        </div>
                      </div>
                    </div>

                    <div class="space-y-2">
                      <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Tech Stack (Comma
                        Separated)</label>
                      <input v-model="form.tools" type="text" placeholder="Vue, Laravel, Docker"
                        class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-slate-800 custom-focus"
                        :class="{ 'border-red-500 bg-red-50': errors.tools }" />
                      <span v-if="errors.tools" class="text-xs text-red-500">{{ errors.tools }}</span>
                    </div>

                    <div class="grid grid-cols-2 gap-5">
                      <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Demo URL</label>
                        <input v-model="form.demoUrl" type="url"
                          class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-slate-800 custom-focus" />
                      </div>
                      <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Repo URL</label>
                        <input v-model="form.repoUrl" type="url"
                          class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-slate-800 custom-focus" />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Summary</label>
                  <textarea v-model="form.summary" rows="2"
                    class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-slate-800 resize-none custom-focus"
                    :class="{ 'border-red-500 bg-red-50': errors.summary }"></textarea>
                  <span v-if="errors.summary" class="text-xs text-red-500">{{ errors.summary }}</span>
                </div>

                <div class="space-y-2">
                  <div class="flex justify-between items-center">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Content (Markdown)</label>
                    <div class="flex gap-2">
                      <button type="button" @click="insertMarkdown('bold')" class="p-1 hover:bg-gray-100 rounded"
                        title="Bold">
                        <Bold :size="14" />
                      </button>
                      <button type="button" @click="insertMarkdown('italic')" class="p-1 hover:bg-gray-100 rounded"
                        title="Italic">
                        <Italic :size="14" />
                      </button>
                      <button type="button" @click="insertMarkdown('underline')" class="p-1 hover:bg-gray-100 rounded"
                        title="Underline">
                        <Underline :size="14" />
                      </button>
                      <button type="button" @click="insertMarkdown('link')" class="p-1 hover:bg-gray-100 rounded"
                        title="Link">
                        <Link :size="14" />
                      </button>
                      <div class="w-px h-4 bg-gray-300 mx-1"></div>
                      <button type="button" @click="isPreview = !isPreview"
                        class="flex items-center gap-1 text-xs font-bold text-[#FB923C]">
                        <component :is="isPreview ? EyeOff : Eye" :size="14" /> {{ isPreview ? 'Edit' : 'Preview' }}
                      </button>
                    </div>
                  </div>

                  <div v-if="!isPreview">
                    <textarea ref="textareaRef" v-model="form.content" rows="8"
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-slate-800 font-mono text-sm custom-focus resize-y"
                      :class="{ 'border-red-500 bg-red-50': errors.content }"></textarea>
                  </div>
                  <div v-else
                    class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl min-h-[200px] prose prose-sm max-w-none"
                    v-html="marked.parse(form.content || '')"></div>

                  <span v-if="errors.content" class="text-xs text-red-500">{{ errors.content }}</span>
                </div>

                <div class="flex justify-end gap-3 pt-6 border-t border-gray-100">
                  <button type="button" @click="closeModal"
                    class="px-6 py-2.5 rounded-xl text-slate-500 font-bold hover:bg-gray-50 transition">Cancel</button>
                  <button type="submit" :disabled="saveMutation.isPending.value"
                    class="flex items-center gap-2 px-6 py-2.5 text-white rounded-xl font-bold transition shadow-lg shadow-orange-100 disabled:opacity-70"
                    style="background-color: #FB923C;">
                    <Loader2 v-if="saveMutation.isPending.value" class="animate-spin" :size="20" />
                    <span v-else>Save Project</span>
                  </button>
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
            <h3 class="text-xl font-bold text-slate-800 mb-2">Delete Project?</h3>
            <p class="text-slate-500 text-sm mb-8">Are you sure you want to delete <strong class="text-slate-700">"{{
              itemToDelete?.title }}"</strong>?</p>
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
      <div v-if="toast.show"
        class="fixed bottom-6 right-6 z-50 bg-white border border-gray-100 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>