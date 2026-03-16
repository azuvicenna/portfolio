<script setup>
import { ref, watch, nextTick } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { api } from '@/utils/api';
import { supabase } from '@/config/supabase';
import { marked } from 'marked';
import { z } from 'zod';
import {
  Eye, Briefcase, MessageSquare, Activity,
  Plus, Pencil, Trash2, X, Loader2,
  User, Mail, Link as LinkIcon, AlertTriangle,
  Bold, Italic, Underline, Link, EyeOff, Type, Upload, Camera,
  CheckCircle, XCircle
} from 'lucide-vue-next';

const queryClient = useQueryClient();
const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isEditing = ref(false);
const itemToDelete = ref(null);
const errors = ref({});

const textareaRef = ref(null);
const isPreview = ref(false);

const avatarFile = ref(null);
const avatarPreview = ref(null);
const fileInputRef = ref(null);

const toast = ref({ show: false, message: '', type: 'success' });

const showMessage = (msg, type = 'success') => {
  toast.value = { show: true, message: msg, type };
  setTimeout(() => toast.value.show = false, 3000);
};

const stats = [
  { title: 'Total Views', value: '2,543', label: '+12%', icon: Eye, color: 'text-orange-600', bg: 'bg-orange-50', hover: 'group-hover:bg-orange-600' },
  { title: 'Projects', value: '12', label: 'Active', icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-50', hover: 'group-hover:bg-amber-600' },
  { title: 'Guestbook', value: '48', label: '3 New', icon: MessageSquare, color: 'text-red-600', bg: 'bg-red-50', hover: 'group-hover:bg-red-600' },
  { title: 'System Status', value: 'Good', label: 'Stable', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', hover: 'group-hover:bg-emerald-600' },
];

const form = ref({
  id: null,
  full_name: '',
  headline: '',
  email: '',
  linkedin_url: '',
  github_url: '',
  avatar_url: '',
  bio: ''
});

const aboutSchema = z.object({
  full_name: z.string().min(1, "Nama lengkap wajib diisi"),
  headline: z.string().min(1, "Headline wajib diisi"),
  email: z.string().email("Format email tidak valid").optional().or(z.literal('')),
  linkedin_url: z.string().url("URL LinkedIn tidak valid").optional().or(z.literal('')),
  github_url: z.string().url("URL GitHub tidak valid").optional().or(z.literal('')),
  avatar_url: z.string().optional(),
  bio: z.string().optional()
});

watch(form, (newVal) => {
  const result = aboutSchema.safeParse(newVal);
  if (!result.success) {
    const formatted = {};
    result.error.issues.forEach(i => formatted[i.path[0]] = i.message);
    errors.value = formatted;
  } else {
    errors.value = {};
  }
}, { deep: true });

const { data: aboutList, isLoading } = useQuery({
  queryKey: ['about-list'],
  queryFn: async () => {
    const res = await api('/about');
    return Array.isArray(res) ? res : (res.data || []);
  },
  staleTime: 0,
});

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      showMessage("Ukuran file terlalu besar! Maksimal 2MB.", 'error');
      return;
    }
    avatarFile.value = file;
    avatarPreview.value = URL.createObjectURL(file);
  }
};

const triggerFileInput = () => {
  fileInputRef.value.click();
};

const saveMutation = useMutation({
  mutationFn: async (formData) => {
    const validation = aboutSchema.safeParse(formData);
    if (!validation.success) {
      const formatted = {};
      validation.error.issues.forEach(i => formatted[i.path[0]] = i.message);
      errors.value = formatted;
      throw new Error("Mohon perbaiki input yang merah.");
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Sesi habis, login ulang.");

    let finalAvatarUrl = formData.avatar_url;

    if (avatarFile.value) {
      const fileExt = avatarFile.value.name.split('.').pop();
      const fileName = `avatar-${Date.now()}.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, avatarFile.value);

      if (uploadError) throw new Error("Gagal upload gambar: " + uploadError.message);

      const { data: publicUrlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      finalAvatarUrl = publicUrlData.publicUrl;
    }

    const payload = { ...formData, avatar_url: finalAvatarUrl };

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    let url = `${API_URL}/api/v1/about`;
    let method = 'POST';

    if (isEditing.value && formData.id) {
      url = `${API_URL}/api/v1/about/${formData.id}`;
      method = 'PUT';
    }

    const res = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Gagal menyimpan data profil.");
    return res.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['about-list'] });
    showMessage(isEditing.value ? "Profil berhasil diperbarui!" : "Profil berhasil ditambahkan!");
    closeModal();
  },
  onError: (e) => showMessage(e.message, 'error')
});

const deleteMutation = useMutation({
  mutationFn: async (id) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Sesi habis, login ulang.");

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const res = await fetch(`${API_URL}/api/v1/about/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${session.access_token}` }
    });

    if (!res.ok) throw new Error("Gagal menghapus data.");
    return res.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['about-list'] });
    showMessage("Profil berhasil dihapus!");
    closeDeleteModal();
  },
  onError: (e) => showMessage(e.message, 'error')
});

const insertMarkdown = (type) => {
  const textarea = textareaRef.value;
  if (!textarea) return;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = form.value.bio || '';
  const selection = text.substring(start, end);
  let replacement = '';
  switch (type) {
    case 'bold': replacement = `**${selection || 'text'}**`; break;
    case 'italic': replacement = `*${selection || 'text'}*`; break;
    case 'underline': replacement = `<u>${selection || 'text'}</u>`; break;
    case 'paragraph': replacement = `\n\n${selection || 'Paragraf'}\n\n`; break;
    case 'link': replacement = `[${selection || 'Link'}](https://)`; break;
  }
  form.value.bio = text.substring(0, start) + replacement + text.substring(end);
  nextTick(() => {
    textarea.focus();
    const newPos = start + replacement.length;
    textarea.setSelectionRange(newPos, newPos);
  });
};

const openCreateModal = () => {
  isEditing.value = false;
  isPreview.value = false;
  errors.value = {};
  avatarFile.value = null;
  avatarPreview.value = null;
  form.value = { id: null, full_name: '', headline: '', email: '', linkedin_url: '', github_url: '', avatar_url: '', bio: '' };
  isModalOpen.value = true;
};

const openEditModal = (item) => {
  isEditing.value = true;
  isPreview.value = false;
  errors.value = {};
  avatarFile.value = null;
  avatarPreview.value = null;
  form.value = { ...item };
  isModalOpen.value = true;
};

const closeModal = () => isModalOpen.value = false;
const confirmDelete = (item) => { itemToDelete.value = item; isDeleteModalOpen.value = true; };
const closeDeleteModal = () => { isDeleteModalOpen.value = false; itemToDelete.value = null; };
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-8 pb-12">

    <div
      class="relative overflow-hidden bg-gradient-to-r from-orange-500 to-amber-500 rounded-[2rem] p-8 text-white shadow-xl shadow-orange-200">
      <div class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold mb-2 tracking-tight">Dashboard Overview</h1>
          <p class="text-orange-50 opacity-90 font-medium">Manage your multiple profiles and contents.</p>
        </div>
        <div class="shrink-0 relative">
          <img :src="aboutList?.[0]?.avatar_url || 'https://ui-avatars.com/api/?background=random'" alt="Profile"
            class="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white/20 shadow-lg object-cover bg-white" />
        </div>
      </div>
      <div class="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 bg-orange-600/20 rounded-full blur-2xl"></div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="(stat, index) in stats" :key="index"
        class="bg-white p-6 rounded-[2rem] shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition group cursor-default">
        <div class="flex justify-between items-start mb-4">
          <div class="p-3 rounded-2xl transition duration-300"
            :class="[stat.bg, stat.color, stat.hover, 'group-hover:text-white']">
            <component :is="stat.icon" :size="24" />
          </div>
          <span
            class="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 border border-gray-100 group-hover:bg-white transition">{{
              stat.label }}</span>
        </div>
        <h3 class="text-3xl font-bold text-slate-800 mb-1 tracking-tight">{{ stat.value }}</h3>
        <p class="text-sm text-gray-500 font-medium">{{ stat.title }}</p>
      </div>
    </div>

    <div class="bg-white rounded-[2rem] shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
      <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h3 class="text-xl font-bold text-slate-800">About Profiles</h3>
          <p class="text-slate-400 text-sm mt-1">List of all profile variations available.</p>
        </div>
        <button @click="openCreateModal"
          class="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-lg shadow-orange-100 group"
          style="background-color: #FB923C;">
          <Plus :size="18" class="group-hover:rotate-90 transition duration-300" />
          <span>Add New Profile</span>
        </button>
      </div>

      <div v-if="isLoading" class="p-12 text-center flex justify-center">
        <Loader2 class="animate-spin text-[#FB923C]" :size="40" />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-bold bg-gray-50/50">
              <th class="px-6 py-4 rounded-tl-xl">Profile</th>
              <th class="px-6 py-4">Headline</th>
              <th class="px-6 py-4">Bio Preview</th>
              <th class="px-6 py-4 text-right rounded-tr-xl">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="item in aboutList" :key="item.id" class="group hover:bg-orange-50/20 transition">
              <td class="px-6 py-4 align-top">
                <div class="flex items-center gap-3">
                  <img :src="item.avatar_url || 'https://ui-avatars.com/api/?background=random'"
                    class="w-10 h-10 rounded-full object-cover bg-gray-100 border border-gray-200">
                  <div>
                    <div class="font-bold text-slate-800">{{ item.full_name }}</div>
                    <div class="text-xs text-gray-400">{{ item.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 align-top">
                <span class="text-sm font-medium text-slate-600 bg-gray-100 px-2 py-1 rounded-md">{{ item.headline
                }}</span>
              </td>
              <td class="px-6 py-4 align-top">
                <p class="text-xs text-gray-500 line-clamp-2 max-w-[250px]">{{ item.bio }}</p>
              </td>
              <td class="px-6 py-4 align-top text-right">
                <div class="flex justify-end gap-2">
                  <button @click="openEditModal(item)"
                    class="p-2 text-slate-400 hover:text-[#FB923C] hover:bg-orange-50 rounded-lg transition">
                    <Pencil :size="16" />
                  </button>
                  <button @click="confirmDelete(item)"
                    class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                    <Trash2 :size="16" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!aboutList || aboutList.length === 0">
              <td colspan="4" class="p-8 text-center text-slate-400">No profiles added yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
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
                  <h2 class="text-2xl font-bold text-slate-800">{{ isEditing ? 'Edit Profile' : 'Create New Profile' }}
                  </h2>
                  <p class="text-slate-400 text-sm">Manage profile information.</p>
                </div>
                <button @click="closeModal"
                  class="p-2 bg-gray-50 text-gray-400 hover:text-slate-800 hover:bg-gray-100 rounded-full transition">
                  <X :size="24" />
                </button>
              </div>

              <form @submit.prevent="saveMutation.mutate(form)" class="space-y-6">

                <div class="flex justify-center mb-6">
                  <div class="relative group cursor-pointer" @click="triggerFileInput">
                    <div
                      class="w-24 h-24 rounded-full overflow-hidden border-4 border-orange-50 shadow-md bg-gray-100 flex items-center justify-center">
                      <img v-if="avatarPreview || form.avatar_url" :src="avatarPreview || form.avatar_url"
                        class="w-full h-full object-cover" />
                      <User v-else :size="32" class="text-gray-400" />
                    </div>
                    <div
                      class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera :size="24" class="text-white" />
                    </div>
                    <input type="file" ref="fileInputRef" @change="handleFileChange" accept="image/*" class="hidden" />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                    <div class="relative">
                      <User :size="16" class="absolute left-3 top-3.5 text-gray-400" />
                      <input v-model="form.full_name" type="text"
                        class="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-slate-800 custom-focus"
                        :class="{ 'border-red-500': errors.full_name }" />
                    </div>
                    <span v-if="errors.full_name" class="text-xs text-red-500">{{ errors.full_name }}</span>
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase">Email</label>
                    <div class="relative">
                      <Mail :size="16" class="absolute left-3 top-3.5 text-gray-400" />
                      <input v-model="form.email" type="email"
                        class="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-slate-800 custom-focus"
                        :class="{ 'border-red-500': errors.email }" />
                    </div>
                    <span v-if="errors.email" class="text-xs text-red-500">{{ errors.email }}</span>
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-500 uppercase">Headline</label>
                  <input v-model="form.headline" type="text" placeholder="e.g. Backend Engineer"
                    class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-slate-800 custom-focus"
                    :class="{ 'border-red-500': errors.headline }" />
                  <span v-if="errors.headline" class="text-xs text-red-500">{{ errors.headline }}</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase">LinkedIn URL</label>
                    <input v-model="form.linkedin_url" type="url"
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-slate-800 custom-focus text-sm"
                      :class="{ 'border-red-500': errors.linkedin_url }" />
                    <span v-if="errors.linkedin_url" class="text-xs text-red-500">{{ errors.linkedin_url }}</span>
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase">GitHub URL</label>
                    <input v-model="form.github_url" type="url"
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-slate-800 custom-focus text-sm"
                      :class="{ 'border-red-500': errors.github_url }" />
                    <span v-if="errors.github_url" class="text-xs text-red-500">{{ errors.github_url }}</span>
                  </div>
                </div>

                <div class="space-y-2">
                  <div class="flex justify-between items-center">
                    <label class="text-xs font-bold text-slate-500 uppercase">Bio / About Me</label>
                    <div class="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
                      <button type="button" @click="insertMarkdown('bold')"
                        class="p-1 hover:text-[#FB923C] rounded transition">
                        <Bold :size="14" />
                      </button>
                      <button type="button" @click="insertMarkdown('italic')"
                        class="p-1 hover:text-[#FB923C] rounded transition">
                        <Italic :size="14" />
                      </button>
                      <button type="button" @click="insertMarkdown('underline')"
                        class="p-1 hover:text-[#FB923C] rounded transition">
                        <Underline :size="14" />
                      </button>
                      <button type="button" @click="insertMarkdown('paragraph')"
                        class="p-1 hover:text-[#FB923C] rounded transition">
                        <Type :size="14" />
                      </button>
                      <button type="button" @click="insertMarkdown('link')"
                        class="p-1 hover:text-[#FB923C] rounded transition">
                        <Link :size="14" />
                      </button>
                      <div class="w-[1px] h-4 bg-gray-300 mx-1"></div>
                      <button type="button" @click="isPreview = !isPreview"
                        class="p-1 rounded transition flex items-center gap-1 text-xs font-bold"
                        :class="isPreview ? 'text-white bg-[#FB923C]' : 'text-slate-500 hover:text-[#FB923C]'">
                        <component :is="isPreview ? EyeOff : Eye" :size="14" />
                      </button>
                    </div>
                  </div>
                  <div class="relative">
                    <textarea v-show="!isPreview" ref="textareaRef" v-model="form.bio" rows="6"
                      class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-slate-800 custom-focus resize-none font-mono text-sm leading-relaxed"></textarea>
                    <div v-show="isPreview"
                      class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl min-h-[160px] prose prose-sm max-w-none prose-p:text-slate-600 prose-a:text-orange-500 overflow-y-auto"
                      style="border-color: #FB923C;" v-html="marked.parse(form.bio || '')"></div>
                  </div>
                </div>

                <div class="flex justify-end gap-3 pt-6 border-t border-gray-100">
                  <button type="button" @click="closeModal"
                    class="px-6 py-2.5 rounded-xl text-slate-500 font-bold hover:bg-gray-50 transition">Cancel</button>
                  <button type="submit" :disabled="saveMutation.isPending.value"
                    class="flex items-center gap-2 px-6 py-2.5 text-white rounded-xl font-bold transition shadow-lg shadow-orange-100 disabled:opacity-70"
                    style="background-color: #FB923C;">
                    <Loader2 v-if="saveMutation.isPending.value" class="animate-spin" :size="20" />
                    <span v-else>Save Profile</span>
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
            <h3 class="text-xl font-bold text-slate-800 mb-2">Delete Profile?</h3>
            <p class="text-slate-500 text-sm mb-8">Are you sure you want to delete profile <strong
                class="text-slate-700">"{{ itemToDelete?.full_name }}"</strong>?</p>
            <div class="grid grid-cols-2 gap-3">
              <button @click="closeDeleteModal"
                class="py-3 rounded-xl text-slate-600 font-bold hover:bg-gray-50 transition border border-gray-200">Cancel</button>
              <button @click="deleteMutation.mutate(itemToDelete.id)" :disabled="deleteMutation.isPending.value"
                class="flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-200 disabled:opacity-70">
                <Loader2 v-if="deleteMutation.isPending.value" class="animate-spin" :size="20" /><span v-else>Yes,
                  Delete</span>
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

:deep(.prose) h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #FB923C;
}

:deep(.prose) p {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

:deep(.prose) a {
  color: #FB923C;
  text-decoration: none;
  font-weight: 600;
}

:deep(.prose) a:hover {
  text-decoration: underline;
}

:deep(.prose) strong {
  color: #1e293b;
  font-weight: 700;
}
</style>