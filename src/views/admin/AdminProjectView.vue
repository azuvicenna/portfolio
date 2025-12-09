<script setup>
import { ref, watch } from 'vue';
import {
  Plus, Pencil, Trash2, X, Star, Monitor, Code, Loader2, Image as ImageIcon, AlertTriangle
} from 'lucide-vue-next';

// --- STATE ---
const isModalOpen = ref(false);
const isEditing = ref(false);
const isSubmitting = ref(false);

// --- STATE DELETE MODAL (BARU) ---
const isDeleteModalOpen = ref(false);
const itemToDelete = ref(null);

const categories = ['Web Development', 'Mobile App', 'Backend API', 'UI/UX Design', 'DevOps'];

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

const projects = ref([
  {
    id: 1,
    title: 'SIMGos Web App',
    slug: 'simgos-web-app',
    category: 'Web Development',
    summary: 'Comprehensive health reporting system.',
    content: '# SIMGos\n\nFull detail here...',
    tools: ['TypeScript', 'Hono', 'Supabase'],
    imageUrl: 'https://via.placeholder.com/100/4f46e5/ffffff?text=SIM',
    isFeatured: true,
    demoUrl: '#',
    repoUrl: '#'
  },
  {
    id: 2,
    title: 'Portfolio V2',
    slug: 'portfolio-v2',
    category: 'Backend API',
    summary: 'Personal portfolio built with modern stack.',
    content: '# Portfolio\n\nMy personal site...',
    tools: ['Vue', 'Tailwind', 'Bun'],
    imageUrl: 'https://via.placeholder.com/100/f59e0b/ffffff?text=Port',
    isFeatured: false,
    demoUrl: '#',
    repoUrl: '#'
  },
]);

// --- HELPER FUNCTIONS ---
const generateSlug = (text) => text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');

// --- MODAL LOGIC (CREATE/EDIT) ---
const openCreateModal = () => {
  isEditing.value = false;
  form.value = { id: null, title: '', slug: '', category: categories[0], summary: '', content: '', imageUrl: '', tools: '', demoUrl: '', repoUrl: '', isFeatured: false };
  isModalOpen.value = true;
};

const openEditModal = (item) => {
  isEditing.value = true;
  form.value = { ...item, tools: item.tools.join(', ') };
  isModalOpen.value = true;
};

const closeModal = () => isModalOpen.value = false;

watch(() => form.value.title, (newTitle) => {
  if (!isEditing.value && newTitle) form.value.slug = generateSlug(newTitle);
});

const saveProject = () => {
  isSubmitting.value = true;
  const toolsArray = form.value.tools.split(',').map(t => t.trim()).filter(t => t !== '');
  const projectPayload = { ...form.value, tools: toolsArray };

  setTimeout(() => {
    if (isEditing.value) {
      const index = projects.value.findIndex(p => p.id === form.value.id);
      if (index !== -1) projects.value[index] = { ...projectPayload };
    } else {
      projects.value.unshift({ ...projectPayload, id: Date.now() });
    }
    isSubmitting.value = false;
    closeModal();
  }, 800);
};

// --- LOGIC DELETE (BARU) ---
const confirmDelete = (item) => {
  itemToDelete.value = item;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  itemToDelete.value = null;
};

const deleteProject = () => {
  if (!itemToDelete.value) return;
  isSubmitting.value = true;

  setTimeout(() => {
    projects.value = projects.value.filter(p => p.id !== itemToDelete.value.id);
    isSubmitting.value = false;
    closeDeleteModal();
  }, 800);
};
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-8">

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Portfolio Projects</h1>
        <p class="text-slate-500 mt-1">Manage your showcased work and case studies.</p>
      </div>
      <button @click="openCreateModal"
        class="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl hover:bg-slate-800 transition shadow-lg shadow-slate-200 font-medium group">
        <Plus :size="20" class="group-hover:rotate-90 transition transform duration-300" />
        <span>Add Project</span>
      </button>
    </div>

    <div class="bg-white rounded-[2rem] shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
      <div v-if="projects.length === 0" class="p-12 text-center text-slate-400">
        <Monitor :size="48" class="mb-4 opacity-50 mx-auto" />
        <p>No projects added yet.</p>
      </div>

      <table v-else class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-bold bg-gray-50/50">
            <th class="px-8 py-5">Project Details</th>
            <th class="px-6 py-5">Category & Tools</th>
            <th class="px-6 py-5 text-center">Status</th>
            <th class="px-8 py-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="item in projects" :key="item.id" class="group hover:bg-gray-50/80 transition duration-200">
            <td class="px-8 py-5">
              <div class="flex gap-4">
                <img :src="item.imageUrl || 'https://via.placeholder.com/100'" :alt="item.title"
                  class="w-16 h-12 object-cover rounded-xl shadow-sm border border-gray-100">
                <div>
                  <h3 class="font-bold text-slate-800 text-base">{{ item.title }}</h3>
                  <p class="text-xs text-gray-400 mt-0.5 font-mono">/projects/{{ item.slug }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-5">
              <div class="space-y-1.5">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">{{
                  item.category }}</span>
                <p class="text-xs text-gray-500 font-medium truncate max-w-[150px]">{{ item.tools.join(', ') }}</p>
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

              <form @submit.prevent="saveProject" class="space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div class="md:col-span-1 space-y-4">
                    <div class="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-center">
                      <img :src="form.imageUrl || 'https://via.placeholder.com/300'"
                        class="w-full h-auto rounded-xl shadow-sm border border-white mb-4 object-cover aspect-video">
                      <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-500 uppercase tracking-wider block text-left">Image
                          URL</label>
                        <input v-model="form.imageUrl" type="url" placeholder="https://..."
                          class="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-800" />
                      </div>
                    </div>
                    <div class="flex items-center gap-3 p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                      <input v-model="form.isFeatured" type="checkbox" id="featured"
                        class="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-500 border-gray-300" />
                      <label for="featured" class="text-sm font-bold text-yellow-700 cursor-pointer select-none">Set as
                        Featured</label>
                    </div>
                  </div>

                  <div class="md:col-span-2 space-y-5">
                    <div class="space-y-2">
                      <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Title</label>
                      <input v-model="form.title" type="text"
                        class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 font-medium"
                        required />
                    </div>
                    <div class="grid grid-cols-2 gap-5">
                      <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                        <select v-model="form.category"
                          class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800">
                          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                        </select>
                      </div>
                      <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Slug</label>
                        <div class="relative"><span
                            class="absolute left-4 top-3.5 text-gray-400 text-sm">/projects/</span><input
                            v-model="form.slug" type="text"
                            class="w-full pl-20 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
                            required /></div>
                      </div>
                    </div>
                    <div class="space-y-2">
                      <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Tech Stack</label>
                      <input v-model="form.tools" type="text"
                        class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800" />
                    </div>
                    <div class="grid grid-cols-2 gap-5">
                      <div class="space-y-2"><label
                          class="text-xs font-bold text-slate-500 uppercase tracking-wider">Demo URL</label><input
                          v-model="form.demoUrl" type="url"
                          class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800" />
                      </div>
                      <div class="space-y-2"><label
                          class="text-xs font-bold text-slate-500 uppercase tracking-wider">Repo URL</label><input
                          v-model="form.repoUrl" type="url"
                          class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800" />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="space-y-2"><label
                    class="text-xs font-bold text-slate-500 uppercase tracking-wider">Summary</label><textarea
                    v-model="form.summary" rows="2"
                    class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 resize-none"></textarea>
                </div>
                <div class="space-y-2"><label
                    class="text-xs font-bold text-slate-500 uppercase tracking-wider">Content</label><textarea
                    v-model="form.content" rows="6"
                    class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 font-mono text-sm"></textarea>
                </div>

                <div class="flex justify-end gap-3 pt-6 border-t border-gray-100">
                  <button type="button" @click="closeModal"
                    class="px-6 py-2.5 rounded-xl text-slate-500 font-bold hover:bg-gray-50 transition">Cancel</button>
                  <button type="submit" :disabled="isSubmitting"
                    class="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 disabled:opacity-70">
                    <Loader2 v-if="isSubmitting" class="animate-spin" :size="20" /><span v-else>Save Project</span>
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
              <button @click="deleteProject" :disabled="isSubmitting"
                class="flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-200 disabled:opacity-70">
                <Loader2 v-if="isSubmitting" class="animate-spin" :size="20" /><span v-else>Yes, Delete</span>
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