<script setup>
import { ref, watch } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { api } from '@/utils/api';
import { supabase } from '@/config/supabase';
import { z } from 'zod';
import {
  Plus, Pencil, Trash2, X, Wrench, Loader2, AlertTriangle, CheckCircle, XCircle
} from 'lucide-vue-next';

const queryClient = useQueryClient();
const isModalOpen = ref(false);
const isEditing = ref(false);
const isDeleteModalOpen = ref(false);
const itemToDelete = ref(null);
const errors = ref({});

const categories = ['Languages', 'Frameworks', 'Databases', 'Tools', 'Cloud', 'DevOps', 'Frontend', 'Backend'];

const toast = ref({ show: false, message: '', type: 'success' });
const showMessage = (msg, type = 'success') => {
  toast.value = { show: true, message: msg, type };
  setTimeout(() => toast.value.show = false, 3000);
};

const form = ref({
  id: null,
  name: '',
  category: categories[0],
  displayOrder: 1,
  logoUrl: ''
});

const skillSchema = z.object({
  name: z.string().min(1, "Nama skill wajib diisi"),
  category: z.string().min(1, "Kategori wajib dipilih"),
  displayOrder: z.number().min(1, "Urutan minimal 1"),
  logoUrl: z.string().url("URL Logo tidak valid").optional().or(z.literal(''))
});

watch(form, (newVal) => {
  const result = skillSchema.safeParse(newVal);
  if (!result.success) {
    const formatted = {};
    result.error.issues.forEach(i => formatted[i.path[0]] = i.message);
    errors.value = formatted;
  } else {
    errors.value = {};
  }
}, { deep: true });

const { data: skills, isLoading } = useQuery({
  queryKey: ['admin-skills'],
  queryFn: async () => {
    const res = await api('/skills/admin/all');
    const rawData = Array.isArray(res) ? res : (res.data || []);

    return rawData.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      displayOrder: item.display_order || item.displayOrder || 0,
      logoUrl: item.logo_url || item.logoUrl || ''
    }));
  },
  staleTime: 0
});

const saveMutation = useMutation({
  mutationFn: async (formData) => {
    const validation = skillSchema.safeParse(formData);
    if (!validation.success) {
      const formatted = {};
      validation.error.issues.forEach(i => formatted[i.path[0]] = i.message);
      errors.value = formatted;
      throw new Error("Mohon perbaiki input yang merah.");
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Sesi habis, login ulang.");

    const payload = {
      name: formData.name,
      category: formData.category,
      display_order: formData.displayOrder,
      logo_url: formData.logoUrl
    };

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    let url = `${API_URL}/api/v1/skills`;
    let method = 'POST';

    if (isEditing.value) {
      url = `${API_URL}/api/v1/skills/${formData.id}`;
      method = 'PUT';
    }

    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Gagal menyimpan skill.");
    return res.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
    showMessage(isEditing.value ? "Skill diperbarui!" : "Skill ditambahkan!");
    closeModal();
  },
  onError: (e) => showMessage(e.message, 'error')
});

const deleteMutation = useMutation({
  mutationFn: async (id) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Sesi habis, login ulang.");

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const res = await fetch(`${API_URL}/api/v1/skills/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${session.access_token}` }
    });

    if (!res.ok) throw new Error("Gagal menghapus.");
    return res.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
    showMessage("Skill dihapus!", 'success');
    closeDeleteModal();
  },
  onError: (e) => showMessage(e.message, 'error')
});

const getCategoryColor = (category) => {
  switch (category) {
    case 'Languages': return 'bg-blue-50 text-blue-600 border-blue-100';
    case 'Frontend': return 'bg-sky-50 text-sky-600 border-sky-100';
    case 'Backend': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
    case 'Databases': return 'bg-purple-50 text-purple-600 border-purple-100';
    case 'Tools': return 'bg-orange-50 text-orange-600 border-orange-100';
    case 'DevOps': return 'bg-slate-50 text-slate-600 border-slate-100';
    case 'Cloud': return 'bg-cyan-50 text-cyan-600 border-cyan-100';
    default: return 'bg-gray-50 text-gray-600 border-gray-100';
  }
};

const openCreateModal = () => {
  isEditing.value = false;
  errors.value = {};

  const nextOrder = skills.value && skills.value.length > 0
    ? Math.max(...skills.value.map(s => s.displayOrder)) + 1
    : 1;

  form.value = {
    id: null,
    name: '',
    category: categories[0],
    displayOrder: nextOrder,
    logoUrl: ''
  };
  isModalOpen.value = true;
};

const openEditModal = (item) => {
  isEditing.value = true;
  errors.value = {};
  form.value = { ...item };
  isModalOpen.value = true;
};

const closeModal = () => isModalOpen.value = false;

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
        <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Tech Stack</h1>
        <p class="text-slate-500 mt-1">Manage programming languages, frameworks, and tools.</p>
      </div>
      <button @click="openCreateModal"
        class="flex items-center gap-2 text-white px-5 py-3 rounded-2xl transition shadow-lg shadow-orange-100 font-medium group"
        style="background-color: #FB923C;">
        <Plus :size="20" class="group-hover:rotate-90 transition transform duration-300" />
        <span>Add Skill</span>
      </button>
    </div>

    <div class="bg-white rounded-[2rem] shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">

      <div v-if="isLoading" class="p-12 text-center flex justify-center">
        <Loader2 class="animate-spin text-[#FB923C]" :size="40" />
      </div>

      <div v-else-if="!skills || skills.length === 0"
        class="p-12 text-center text-slate-400 flex flex-col items-center">
        <Wrench :size="48" class="mb-4 opacity-50 mx-auto" />
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
          <tr v-for="item in skills" :key="item.id" class="group hover:bg-orange-50/30 transition duration-200">
            <td class="px-8 py-4">
              <div
                class="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm p-2 overflow-hidden">
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
              class="relative z-10 w-full max-w-lg transform rounded-[2rem] bg-white p-8 text-left shadow-2xl transition-all border border-gray-100 my-8">
              <div class="flex items-center justify-between mb-8">
                <div>
                  <h2 class="text-2xl font-bold text-slate-800">{{ isEditing ? 'Edit Skill' : 'Add Skill' }}</h2>
                  <p class="text-slate-400 text-sm">Add a new technology to your stack.</p>
                </div>
                <button @click="closeModal"
                  class="p-2 bg-gray-50 text-gray-400 hover:text-slate-800 hover:bg-gray-100 rounded-full transition">
                  <X :size="24" />
                </button>
              </div>

              <form @submit.prevent="saveMutation.mutate(form)" class="space-y-6">
                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Skill Name</label>
                  <input v-model="form.name" type="text" placeholder="e.g. Docker"
                    class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition text-slate-800 custom-focus"
                    :class="{ 'border-red-500 bg-red-50': errors.name }" />
                  <span v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</span>
                </div>

                <div class="grid grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                    <select v-model="form.category"
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-slate-800 custom-focus">
                      <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                    </select>
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Display Order</label>
                    <input v-model.number="form.displayOrder" type="number" placeholder="1"
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-slate-800 custom-focus"
                      :class="{ 'border-red-500 bg-red-50': errors.displayOrder }" />
                    <span v-if="errors.displayOrder" class="text-xs text-red-500">{{ errors.displayOrder }}</span>
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Logo URL (CDN)</label>
                  <div class="flex gap-3">
                    <div
                      class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200 flex-shrink-0 p-2 overflow-hidden">
                      <img v-if="form.logoUrl" :src="form.logoUrl" class="w-full h-full object-contain" />
                      <Wrench v-else class="text-gray-400" :size="20" />
                    </div>
                    <input v-model="form.logoUrl" type="url" placeholder="https://cdn.jsdelivr.net/..."
                      class="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-slate-800 custom-focus"
                      :class="{ 'border-red-500 bg-red-50': errors.logoUrl }" />
                  </div>
                  <span v-if="errors.logoUrl" class="text-xs text-red-500">{{ errors.logoUrl }}</span>
                </div>

                <div class="flex justify-end gap-3 pt-6 border-t border-gray-100">
                  <button type="button" @click="closeModal"
                    class="px-6 py-2.5 rounded-xl text-slate-500 font-bold hover:bg-gray-50 transition">Cancel</button>
                  <button type="submit" :disabled="saveMutation.isPending.value"
                    class="flex items-center gap-2 px-6 py-2.5 text-white rounded-xl font-bold transition shadow-lg shadow-orange-100 disabled:opacity-70"
                    style="background-color: #FB923C;">
                    <Loader2 v-if="saveMutation.isPending.value" class="animate-spin" :size="20" />
                    <span v-else>Save Skill</span>
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
            <h3 class="text-xl font-bold text-slate-800 mb-2">Delete Skill?</h3>
            <p class="text-slate-500 text-sm mb-8">Are you sure you want to delete <strong class="text-slate-700">"{{
              itemToDelete?.name }}"</strong>?</p>
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