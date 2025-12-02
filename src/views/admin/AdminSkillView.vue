<script setup>
import { ref } from 'vue';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Wrench,
  Link,
  Loader2
} from 'lucide-vue-next';

// --- STATE ---
const isModalOpen = ref(false);
const isEditing = ref(false);
const isSubmitting = ref(false);

const categories = ['Languages', 'Frameworks', 'Databases', 'Tools'];

const form = ref({
  id: null,
  name: '',
  category: categories[0],
  displayOrder: 1,
  logoUrl: ''
});

const skills = ref([
  {
    id: 1,
    name: 'TypeScript',
    category: 'Languages',
    displayOrder: 1,
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg'
  },
  {
    id: 2,
    name: 'Vue.js',
    category: 'Frameworks',
    displayOrder: 2,
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg'
  },
  {
    id: 3,
    name: 'PostgreSQL',
    category: 'Databases',
    displayOrder: 3,
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg'
  },
]);

// --- HELPER FUNCTIONS ---
const getCategoryColor = (category) => {
  switch (category) {
    case 'Languages': return 'bg-blue-50 text-blue-600 border-blue-100';
    case 'Frameworks': return 'bg-green-50 text-green-600 border-green-100';
    case 'Databases': return 'bg-purple-50 text-purple-600 border-purple-100';
    default: return 'bg-gray-50 text-gray-600 border-gray-100';
  }
};

// --- MODAL LOGIC ---
const openCreateModal = () => {
  isEditing.value = false;
  form.value = {
    id: null,
    name: '',
    category: categories[0],
    displayOrder: skills.value.length + 1,
    logoUrl: ''
  };
  isModalOpen.value = true;
};

const openEditModal = (item) => {
  isEditing.value = true;
  form.value = { ...item };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

// --- CRUD LOGIC (SIMULASI) ---
const saveSkill = () => {
  isSubmitting.value = true;

  setTimeout(() => {
    if (isEditing.value) {
      const index = skills.value.findIndex(s => s.id === form.value.id);
      if (index !== -1) {
        skills.value[index] = { ...form.value };
      }
    } else {
      skills.value.push({
        ...form.value,
        id: Date.now()
      });
    }

    skills.value.sort((a, b) => a.displayOrder - b.displayOrder);

    isSubmitting.value = false;
    closeModal();
  }, 800);
};

const deleteSkill = (id) => {
  if (confirm('Are you sure you want to delete this skill?')) {
    skills.value = skills.value.filter(s => s.id !== id);
  }
};
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-8">

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Tech Stack</h1>
        <p class="text-slate-500 mt-1">Manage programming languages, frameworks, and tools.</p>
      </div>

      <button @click="openCreateModal"
        class="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl hover:bg-slate-800 transition shadow-lg shadow-slate-200 font-medium group">
        <Plus :size="20" class="group-hover:rotate-90 transition transform duration-300" />
        <span>Add Skill</span>
      </button>
    </div>

    <div class="bg-white rounded-[2rem] shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">

      <div v-if="skills.length === 0" class="p-12 text-center flex flex-col items-center justify-center text-slate-400">
        <Wrench :size="48" class="mb-4 opacity-50" />
        <p>No skills added yet.</p>
      </div>

      <table v-else class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-bold bg-gray-50/50">
            <th class="px-8 py-5">Logo</th>
            <th class="px-6 py-5">Skill Name</th>
            <th class="px-6 py-5">Category</th>
            <th class="px-6 py-5 text-center">Order</th>
            <th class="px-8 py-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">

          <tr v-for="item in skills" :key="item.id" class="group hover:bg-gray-50/80 transition duration-200">
            <td class="px-8 py-4">
              <div
                class="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm p-2">
                <img v-if="item.logoUrl" :src="item.logoUrl" :alt="item.name" class="w-full h-full object-contain">
                <Wrench v-else class="text-gray-300" />
              </div>
            </td>

            <td class="px-6 py-4">
              <h3 class="font-bold text-slate-800 text-base">{{ item.name }}</h3>
            </td>

            <td class="px-6 py-4">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border"
                :class="getCategoryColor(item.category)">
                {{ item.category }}
              </span>
            </td>

            <td class="px-6 py-4 text-center text-sm font-medium text-slate-500">
              {{ item.displayOrder }}
            </td>

            <td class="px-8 py-4 text-right">
              <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="openEditModal(item)"
                  class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                  title="Edit">
                  <Pencil :size="16" />
                </button>
                <button @click="deleteSkill(item.id)"
                  class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition" title="Delete">
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
              class="relative z-10 w-full max-w-lg transform rounded-[2rem] bg-white p-8 text-left shadow-2xl transition-all border border-gray-100 my-8">

              <div class="flex items-center justify-between mb-8">
                <div>
                  <h2 class="text-2xl font-bold text-slate-800">
                    {{ isEditing ? 'Edit Skill' : 'Add Skill' }}
                  </h2>
                  <p class="text-slate-400 text-sm">Add a new technology to your stack.</p>
                </div>
                <button @click="closeModal"
                  class="p-2 bg-gray-50 text-gray-400 hover:text-slate-800 hover:bg-gray-100 rounded-full transition">
                  <X :size="24" />
                </button>
              </div>

              <form @submit.prevent="saveSkill" class="space-y-6">

                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Skill Name</label>
                  <input v-model="form.name" type="text" placeholder="e.g. Docker"
                    class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
                    required />
                </div>

                <div class="grid grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                    <select v-model="form.category"
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800">
                      <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                    </select>
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Display Order</label>
                    <input v-model.number="form.displayOrder" type="number" placeholder="1"
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800" />
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Logo URL
                    (CDN/Storage)</label>
                  <div class="flex gap-3">
                    <div
                      class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200 flex-shrink-0 p-2 overflow-hidden">
                      <img v-if="form.logoUrl" :src="form.logoUrl" class="w-full h-full object-contain" />
                      <Wrench v-else class="text-gray-400" :size="20" />
                    </div>
                    <input v-model="form.logoUrl" type="url" placeholder="https://cdn.jsdelivr.net/..."
                      class="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800" />
                  </div>
                </div>

                <div class="flex justify-end gap-3 pt-6 border-t border-gray-100">
                  <button type="button" @click="closeModal"
                    class="px-6 py-2.5 rounded-xl text-slate-500 font-bold hover:bg-gray-50 transition">
                    Cancel
                  </button>
                  <button type="submit" :disabled="isSubmitting"
                    class="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed">
                    <Loader2 v-if="isSubmitting" class="animate-spin" :size="20" />
                    <span v-else>Save Skill</span>
                  </button>
                </div>
              </form>

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
</style>