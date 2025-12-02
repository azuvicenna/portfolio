<script setup>
import { ref } from 'vue';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Briefcase, 
  MapPin, 
  Calendar, 
  Building2,
  Loader2 
} from 'lucide-vue-next';

// --- STATE ---
const isModalOpen = ref(false);
const isEditing = ref(false);
const isSubmitting = ref(false);

const form = ref({
  id: null,
  position: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  description: ''
});

const experiences = ref([
  { 
    id: 1, 
    position: 'Web Developer', 
    company: 'Diskominfo Tasikmalaya', 
    location: 'Tasikmalaya', 
    startDate: '2025-09-01', 
    endDate: null, // Null = Present
    description: 'Developed the SIMGos web application from conception to deployment.' 
  },
  { 
    id: 2, 
    position: 'Freelance Frontend Dev', 
    company: 'Upwork', 
    location: 'Remote', 
    startDate: '2024-01-01', 
    endDate: '2025-08-01', 
    description: 'Built responsive landing pages for various international clients.' 
  },
]);

// --- HELPER FUNCTIONS ---
const formatDate = (dateString) => {
  if (!dateString) return 'Present';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
};

// --- MODAL LOGIC ---
const openCreateModal = () => {
  isEditing.value = false;
  form.value = { 
    id: null, 
    position: '', 
    company: '', 
    location: '', 
    startDate: '', 
    endDate: '', 
    description: '' 
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
const saveExperience = () => {
  isSubmitting.value = true;
  
  setTimeout(() => {
    if (isEditing.value) {
      const index = experiences.value.findIndex(e => e.id === form.value.id);
      if (index !== -1) {
        experiences.value[index] = { ...form.value };
      }
    } else {
      experiences.value.unshift({ 
        ...form.value, 
        id: Date.now() 
      });
    }
    
    isSubmitting.value = false;
    closeModal();
  }, 800); 
};

const deleteExperience = (id) => {
  if (confirm('Are you sure you want to delete this experience?')) {
    experiences.value = experiences.value.filter(e => e.id !== id);
  }
};
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-8">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Work History</h1>
        <p class="text-slate-500 mt-1">Manage your professional journey and resume details.</p>
      </div>
      
      <button 
        @click="openCreateModal"
        class="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl hover:bg-slate-800 transition shadow-lg shadow-slate-200 font-medium group"
      >
        <Plus :size="20" class="group-hover:rotate-90 transition transform duration-300" />
        <span>Add Experience</span>
      </button>
    </div>

    <div class="bg-white rounded-[2rem] shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
      
      <div v-if="experiences.length === 0" class="p-12 text-center flex flex-col items-center justify-center text-slate-400">
        <Briefcase :size="48" class="mb-4 opacity-50" />
        <p>No experience history yet.</p>
      </div>

      <table v-else class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-bold bg-gray-50/50">
            <th class="px-8 py-5">Role & Company</th>
            <th class="px-6 py-5">Location</th>
            <th class="px-6 py-5">Timeline</th>
            <th class="px-8 py-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          
          <tr 
            v-for="item in experiences" 
            :key="item.id" 
            class="group hover:bg-gray-50/80 transition duration-200"
          >
            <td class="px-8 py-5 align-top">
              <div class="flex gap-4">
                <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition">
                  <Briefcase :size="20" />
                </div>
                <div>
                  <h3 class="font-bold text-slate-800 text-base">{{ item.position }}</h3>
                  <div class="flex items-center gap-1 text-slate-500 text-sm mt-0.5">
                    <Building2 :size="14" />
                    <span>{{ item.company }}</span>
                  </div>
                </div>
              </div>
            </td>

            <td class="px-6 py-5 align-top">
              <div class="flex items-center gap-2 text-sm text-slate-600 font-medium bg-gray-100/50 px-3 py-1.5 rounded-lg w-fit">
                <MapPin :size="14" class="text-gray-400" />
                {{ item.location }}
              </div>
            </td>

            <td class="px-6 py-5 align-top">
              <div class="flex items-center gap-2 text-sm">
                <Calendar :size="16" class="text-slate-400" />
                <span class="font-medium text-slate-700">
                  {{ formatDate(item.startDate) }} — 
                  <span :class="!item.endDate ? 'text-green-600 font-bold' : ''">
                    {{ formatDate(item.endDate) }}
                  </span>
                </span>
              </div>
              <div v-if="!item.endDate" class="mt-2 inline-block">
                <span class="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Current Job
                </span>
              </div>
            </td>

            <td class="px-8 py-5 align-top text-right">
              <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  @click="openEditModal(item)"
                  class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition" 
                  title="Edit"
                >
                  <Pencil :size="16" />
                </button>
                <button 
                  @click="deleteExperience(item.id)"
                  class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition" 
                  title="Delete"
                >
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

            <div class="relative z-10 w-full max-w-2xl transform rounded-[2rem] bg-white p-8 text-left shadow-2xl transition-all border border-gray-100 my-8">
              
              <div class="flex items-center justify-between mb-8">
                <div>
                  <h2 class="text-2xl font-bold text-slate-800">
                    {{ isEditing ? 'Edit Experience' : 'Add Experience' }}
                  </h2>
                  <p class="text-slate-400 text-sm">Fill in the details about your professional journey.</p>
                </div>
                <button 
                  @click="closeModal" 
                  class="p-2 bg-gray-50 text-gray-400 hover:text-slate-800 hover:bg-gray-100 rounded-full transition"
                >
                  <X :size="24" />
                </button>
              </div>

              <form @submit.prevent="saveExperience" class="space-y-6">
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Job Position</label>
                    <input 
                      v-model="form.position"
                      type="text" 
                      placeholder="e.g. Senior Backend Dev" 
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition placeholder-gray-400 text-slate-800"
                      required
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Company Name</label>
                    <input 
                      v-model="form.company"
                      type="text" 
                      placeholder="e.g. Google Inc." 
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition placeholder-gray-400 text-slate-800"
                      required
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Location</label>
                    <input 
                      v-model="form.location"
                      type="text" 
                      placeholder="e.g. Jakarta, ID" 
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition placeholder-gray-400 text-slate-800" 
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Start Date</label>
                    <input 
                      v-model="form.startDate"
                      type="date" 
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-slate-600"
                      required
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">End Date</label>
                    <input 
                      v-model="form.endDate"
                      type="date" 
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-slate-600" 
                    />
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                  <textarea 
                    v-model="form.description"
                    rows="4" 
                    placeholder="Describe your responsibilities and achievements..." 
                    class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none placeholder-gray-400 text-slate-800"
                  ></textarea>
                </div>

                <div class="flex justify-end gap-3 pt-6 border-t border-gray-100">
                  <button 
                    type="button" 
                    @click="closeModal" 
                    class="px-6 py-2.5 rounded-xl text-slate-500 font-bold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    :disabled="isSubmitting"
                    class="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <Loader2 v-if="isSubmitting" class="animate-spin" :size="20" />
                    <span v-else>Save Experience</span>
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

input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.6;
}
</style>