<script setup>
import { ref, watch } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { api } from '@/utils/api';
import { supabase } from '@/config/supabase';
import { z } from 'zod';
import {
  Plus, Pencil, Trash2, X, GraduationCap, Calendar, Loader2,
  AlertTriangle, MinusCircle, School
} from 'lucide-vue-next';

const queryClient = useQueryClient();
const isModalOpen = ref(false);
const isEditing = ref(false);
const isDeleteModalOpen = ref(false);
const itemToDelete = ref(null);
const errors = ref({});

const toast = ref({ show: false, message: '', type: 'success' });
const showMessage = (msg, type = 'success') => {
  toast.value = { show: true, message: msg, type };
  setTimeout(() => toast.value.show = false, 3000);
};

const form = ref({
  id: null,
  degree: '',
  institution: '',
  score: '',
  startDate: '',
  endDate: '',
  description: ['']
});

const educationSchema = z.object({
  degree: z.string().min(1, "Gelar/Jurusan wajib diisi"),
  institution: z.string().min(1, "Nama Institusi wajib diisi"),
  score: z.string().min(1, "Nilai/GPA wajib diisi"),
  startDate: z.string().min(1, "Tanggal mulai wajib diisi"),
  endDate: z.string().optional().nullable().or(z.literal('')),
  description: z.array(z.string().min(1, "Poin deskripsi tidak boleh kosong")).min(1, "Minimal 1 deskripsi"),
});

watch(form, (newVal) => {
  const result = educationSchema.safeParse(newVal);
  if (!result.success) {
    const formatted = {};
    result.error.issues.forEach(i => formatted[i.path[0]] = i.message);
    errors.value = formatted;
  } else {
    errors.value = {};
  }
}, { deep: true });

const formatToInputDate = (val) => {
  if (!val) return '';
  try {
    return new Date(val).toISOString().split('T')[0];
  } catch (e) {
    return '';
  }
};

const { data: educations, isLoading } = useQuery({
  queryKey: ['educations'],
  queryFn: async () => {
    const res = await api('/educations');
    return res.map(e => ({
      id: e.id,
      degree: e.degree,
      institution: e.institution,
      score: e.score ? String(e.score) : '',
      startDate: formatToInputDate(e.start_date || e.startDate),
      endDate: formatToInputDate(e.end_date || e.endDate),
      description: Array.isArray(e.description) ? e.description : (e.description ? [e.description] : [])
    }));
  },
  staleTime: 0
});

const saveMutation = useMutation({
  mutationFn: async (formData) => {
    const validation = educationSchema.safeParse(formData);
    if (!validation.success) {
      const formatted = {};
      validation.error.issues.forEach(i => formatted[i.path[0]] = i.message);
      errors.value = formatted;
      throw new Error("Mohon lengkapi data yang merah.");
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Sesi habis, login ulang.");

    const payload = {
      degree: formData.degree,
      institution: formData.institution,
      score: formData.score,
      start_date: formData.startDate,
      end_date: formData.endDate || null,
      description: formData.description
    };

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    let url = `${API_URL}/api/v1/educations`;
    let method = 'POST';

    if (isEditing.value) {
      url = `${API_URL}/api/v1/educations/${formData.id}`;
      method = 'PUT';
    }

    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Gagal menyimpan data.");
    return res.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['educations'] });
    showMessage(isEditing.value ? "Education updated!" : "Education added!");
    closeModal();
  },
  onError: (e) => showMessage(e.message, 'error')
});

const deleteMutation = useMutation({
  mutationFn: async (id) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Sesi habis, login ulang.");

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const res = await fetch(`${API_URL}/api/v1/educations/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${session.access_token}` }
    });

    if (!res.ok) throw new Error("Gagal menghapus.");
    return res.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['educations'] });
    showMessage("Education deleted!", 'success');
    closeDeleteModal();
  },
  onError: (e) => showMessage(e.message, 'error')
});

const formatDate = (dateString) => {
  if (!dateString) return 'Present';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
};

const openCreateModal = () => {
  isEditing.value = false;
  errors.value = {};
  form.value = {
    id: null, degree: '', institution: '', score: '', startDate: '', endDate: '',
    description: ['']
  };
  isModalOpen.value = true;
};

const openEditModal = (item) => {
  isEditing.value = true;
  errors.value = {};
  form.value = {
    ...item,
    description: item.description && item.description.length > 0 ? [...item.description] : ['']
  };
  isModalOpen.value = true;
};

const closeModal = () => isModalOpen.value = false;

const addDescription = () => form.value.description.push('');
const removeDescription = (index) => {
  if (form.value.description.length > 1) {
    form.value.description.splice(index, 1);
  }
};

const confirmDelete = (item) => {
  itemToDelete.value = item;
  isDeleteModalOpen.value = true;
};
const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  itemToDelete.value = null;
};
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-8 relative">

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Academic Background</h1>
        <p class="text-slate-500 mt-1">Manage your educational history, degrees, and certifications.</p>
      </div>
      <button @click="openCreateModal"
        class="flex items-center gap-2 text-white px-5 py-3 rounded-2xl transition shadow-lg shadow-orange-100 font-medium group"
        style="background-color: #FB923C;">
        <Plus :size="20" class="group-hover:rotate-90 transition transform duration-300" />
        <span>Add Education</span>
      </button>
    </div>

    <div class="bg-white rounded-[2rem] shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">

      <div v-if="isLoading" class="p-12 text-center flex justify-center">
        <Loader2 class="animate-spin text-[#FB923C]" :size="40" />
      </div>

      <div v-else-if="!educations || educations.length === 0"
        class="p-12 text-center text-slate-400 flex flex-col items-center">
        <GraduationCap :size="48" class="mb-4 opacity-50" />
        <p>No education history yet.</p>
      </div>

      <table v-else class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-bold bg-gray-50/50">
            <th class="px-8 py-5">Degree & Institution</th>
            <th class="px-6 py-5">GPA / Score</th>
            <th class="px-6 py-5">Timeline</th>
            <th class="px-8 py-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="item in educations" :key="item.id" class="group hover:bg-orange-50/30 transition duration-200">
            <td class="px-8 py-5 align-top">
              <div class="flex gap-4">
                <div
                  class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#FB923C] flex-shrink-0 group-hover:bg-[#FB923C] group-hover:text-white transition">
                  <GraduationCap :size="20" />
                </div>
                <div>
                  <h3 class="font-bold text-slate-800 text-base">{{ item.degree }}</h3>
                  <div class="flex items-center gap-1 text-slate-500 text-sm mt-0.5">
                    <School :size="14" />
                    <span>{{ item.institution }}</span>
                  </div>
                  <ul class="mt-2 pl-4 list-disc text-xs text-slate-400 space-y-1">
                    <li v-for="(desc, i) in item.description.slice(0, 2)" :key="i" class="line-clamp-1">
                      {{ desc }}
                    </li>
                    <li v-if="item.description.length > 2" class="list-none text-[10px] italic">
                      +{{ item.description.length - 2 }} more...
                    </li>
                  </ul>
                </div>
              </div>
            </td>
            <td class="px-6 py-5 align-top">
              <div
                class="flex items-center gap-2 text-sm text-slate-600 font-medium bg-gray-100 px-3 py-1.5 rounded-lg w-fit border border-gray-200">
                <span class="font-bold text-[#FB923C]">{{ item.score }}</span>
              </div>
            </td>
            <td class="px-6 py-5 align-top">
              <div class="flex items-center gap-2 text-sm">
                <Calendar :size="16" class="text-slate-400" />
                <span class="font-medium text-slate-700">
                  {{ formatDate(item.startDate) }} —
                  <span :class="!item.endDate ? 'text-[#FB923C] font-bold' : ''">{{ formatDate(item.endDate) }}</span>
                </span>
              </div>
            </td>
            <td class="px-8 py-5 align-top text-right">
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

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isModalOpen" class="fixed inset-0 z-[999] overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

            <div
              class="relative z-10 w-full max-w-2xl transform rounded-[2rem] bg-white p-8 text-left shadow-2xl transition-all border border-gray-100 my-8">
              <div class="flex items-center justify-between mb-8">
                <div>
                  <h2 class="text-2xl font-bold text-slate-800">{{ isEditing ? 'Edit Education' : 'Add Education' }}
                  </h2>
                  <p class="text-slate-400 text-sm">Add details about your degree and school.</p>
                </div>
                <button @click="closeModal"
                  class="p-2 bg-gray-50 text-gray-400 hover:text-slate-800 hover:bg-gray-100 rounded-full transition">
                  <X :size="24" />
                </button>
              </div>

              <form @submit.prevent="saveMutation.mutate(form)" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Degree / Major</label>
                    <input v-model="form.degree" type="text" placeholder="e.g. B.Sc. Information Systems"
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition placeholder-gray-400 text-slate-800 custom-focus"
                      :class="{ 'border-red-500 bg-red-50': errors.degree }" />
                    <span v-if="errors.degree" class="text-xs text-red-500">{{ errors.degree }}</span>
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Institution</label>
                    <input v-model="form.institution" type="text" placeholder="e.g. Bina Sarana Informatika"
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition placeholder-gray-400 text-slate-800 custom-focus"
                      :class="{ 'border-red-500 bg-red-50': errors.institution }" />
                    <span v-if="errors.institution" class="text-xs text-red-500">{{ errors.institution }}</span>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">GPA / Score</label>
                    <input v-model="form.score" type="text" placeholder="e.g. 3.6 / 4.0"
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition placeholder-gray-400 text-slate-800 custom-focus"
                      :class="{ 'border-red-500 bg-red-50': errors.score }" />
                    <span v-if="errors.score" class="text-xs text-red-500">{{ errors.score }}</span>
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Start Date</label>
                    <input v-model="form.startDate" type="date"
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition text-slate-600 custom-focus"
                      :class="{ 'border-red-500 bg-red-50': errors.startDate }" />
                    <span v-if="errors.startDate" class="text-xs text-red-500">{{ errors.startDate }}</span>
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">End Date</label>
                    <input v-model="form.endDate" type="date"
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition text-slate-600 custom-focus" />
                    <p class="text-[10px] text-gray-400">Biarkan kosong jika masih berjalan.</p>
                  </div>
                </div>

                <div class="space-y-3">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                    <span>Relevant Coursework / Achievements</span>
                    <span class="text-[10px] text-slate-400 normal-case">Klik + untuk tambah poin</span>
                  </label>

                  <div v-for="(desc, index) in form.description" :key="index" class="space-y-1">
                    <div class="flex gap-2 items-center">
                      <div class="w-6 text-center text-slate-300 font-bold text-sm">{{ index + 1 }}.</div>
                      <input v-model="form.description[index]" type="text"
                        placeholder="e.g. Relevant Coursework: Web Programming"
                        class="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none transition text-slate-800 custom-focus"
                        :class="{ 'border-red-500 bg-red-50': errors.description }" />
                      <button type="button" @click="removeDescription(index)" :disabled="form.description.length === 1"
                        class="p-2 text-slate-400 hover:text-red-500 disabled:opacity-30 disabled:hover:text-slate-400 transition">
                        <MinusCircle :size="20" />
                      </button>
                    </div>
                  </div>
                  <span v-if="errors.description" class="text-xs text-red-500 ml-8">{{ errors.description }}</span>

                  <button type="button" @click="addDescription"
                    class="ml-8 text-sm font-bold text-[#FB923C] hover:text-orange-600 flex items-center gap-1 transition">
                    <Plus :size="16" /> Add Point
                  </button>
                </div>

                <div class="flex justify-end gap-3 pt-6 border-t border-gray-100">
                  <button type="button" @click="closeModal"
                    class="px-6 py-2.5 rounded-xl text-slate-500 font-bold hover:bg-gray-50 transition">Cancel</button>
                  <button type="submit" :disabled="saveMutation.isPending.value"
                    class="flex items-center gap-2 px-6 py-2.5 text-white rounded-xl font-bold transition shadow-lg shadow-orange-100 disabled:opacity-70"
                    style="background-color: #FB923C;">
                    <Loader2 v-if="saveMutation.isPending.value" class="animate-spin" :size="20" />
                    <span v-else>Save Education</span>
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
            <h3 class="text-xl font-bold text-slate-800 mb-2">Delete Education?</h3>
            <p class="text-slate-500 text-sm mb-8">Are you sure you want to delete <strong class="text-slate-700">"{{
              itemToDelete?.degree }}"</strong>?</p>
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
          <div class="w-2 h-2 rounded-full bg-current"></div>
        </div>
        <p class="text-sm font-bold text-slate-700">{{ toast.message }}</p>
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

input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.6;
}
</style>