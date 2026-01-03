<script setup>
import { ref, nextTick, watch } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { api } from '@/utils/api';
import { supabase } from '@/config/supabase';
import { z } from 'zod';
import { marked } from 'marked';
import {
  Save, Upload, Loader2, User, Mail, Briefcase,
  Github, Linkedin, FileText,
  Bold, Italic, Underline, Link, Type, Eye, EyeOff,
  CheckCircle, XCircle
} from 'lucide-vue-next';

// --- STATE ---
const queryClient = useQueryClient();
const fileInput = ref(null);
const textareaRef = ref(null);
const errors = ref({});
const isPreview = ref(false);

// State untuk Custom Message/Toast
const toast = ref({
  show: false,
  message: '',
  type: 'success' // 'success' | 'error'
});

const form = ref({
  full_name: '',
  headline: '',
  email: '',
  bio: '',
  avatar_url: '',
  linkedin_url: '',
  github_url: '',
});

// --- HELPER: SHOW TOAST ---
const showMessage = (msg, type = 'success') => {
  toast.value = { show: true, message: msg, type };
  // Hilang otomatis setelah 3 detik
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

// --- VALIDASI ZOD ---
const profileSchema = z.object({
  full_name: z.string().min(1, "Nama lengkap wajib diisi"),
  headline: z.string().min(3, "Headline minimal 3 karakter"),
  bio: z.string().min(10, "Bio terlalu pendek (minimal 10 karakter)"),
  email: z.string().email("Format email tidak valid"),
  linkedin_url: z.string().url("URL LinkedIn tidak valid").optional().or(z.literal('')),
  github_url: z.string().url("URL GitHub tidak valid").optional().or(z.literal('')),
});

// Live Validation
watch(form, (newVal) => {
  const result = profileSchema.safeParse(newVal);
  if (!result.success) {
    const formatted = {};
    result.error.issues.forEach(i => formatted[i.path[0]] = i.message);
    errors.value = formatted;
  } else {
    errors.value = {};
  }
}, { deep: true });

// --- FETCH DATA ---
const { data: profileData, isLoading } = useQuery({
  queryKey: ['profile'],
  queryFn: () => api('/about'),
  staleTime: 0,
});

watch(profileData, (newData) => {
  if (newData) {
    form.value = {
      full_name: newData.full_name || '',
      headline: newData.headline || '',
      email: newData.email || '',
      bio: newData.bio || '',
      avatar_url: newData.avatar_url || '',
      linkedin_url: newData.linkedin_url || '',
      github_url: newData.github_url || '',
    };
  }
}, { immediate: true });

// --- MARKDOWN LOGIC ---
const insertMarkdown = (type) => {
  const textarea = textareaRef.value;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = form.value.bio;
  const selection = text.substring(start, end);

  let replacement = '';
  switch (type) {
    case 'bold': replacement = `**${selection || 'text'}**`; break;
    case 'italic': replacement = `*${selection || 'text'}*`; break;
    case 'underline': replacement = `<u>${selection || 'text'}</u>`; break;
    case 'paragraph': replacement = `\n\n${selection || 'Paragraf Baru'}\n\n`; break;
    case 'link': replacement = `[${selection || 'Link'}](https://)`; break;
  }

  form.value.bio = text.substring(0, start) + replacement + text.substring(end);

  nextTick(() => {
    textarea.focus();
    const newPos = start + replacement.length;
    textarea.setSelectionRange(newPos, newPos);
  });
};

// --- ACTION: UPLOAD FOTO (REAL) ---
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // 1. Validasi Ukuran (Max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    showMessage("Ukuran file terlalu besar! Maksimal 2MB.", 'error');
    return;
  }

  try {
    // Tampilkan loading di tombol save (hack dikit biar user nunggu)
    // Atau bisa bikin state loading khusus upload
    const originalAvatar = form.value.avatar_url;
    form.value.avatar_url = "https://via.placeholder.com/150?text=Uploading..."; // Placeholder visual

    const fileExt = file.name.split('.').pop();
    const fileName = `avatar-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // 2. Upload ke Supabase Storage
    // Pastikan bucket 'images' sudah dibuat & PUBLIC di Supabase
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 3. Ambil URL
    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    form.value.avatar_url = data.publicUrl;
    showMessage("Foto berhasil diupload! Jangan lupa klik Save.", 'success');

  } catch (error) {
    console.error(error);
    showMessage("Gagal upload foto: " + error.message, 'error');
  }
};

const triggerFileInput = () => {
  fileInput.value.click();
};

// --- ACTION: SAVE DATA ---
const saveMutation = useMutation({
  mutationFn: async (newData) => {
    const validation = profileSchema.safeParse(newData);
    if (!validation.success) {
      throw new Error("Mohon perbaiki input yang merah.");
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Sesi habis, login ulang.");

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const res = await fetch(`${API_URL}/api/v1/about`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify(newData)
    });

    if (!res.ok) throw new Error("Gagal menyimpan profil.");
    return res.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['profile'] });
    queryClient.invalidateQueries({ queryKey: ['about'] });
    showMessage("Profil berhasil diperbarui!", 'success');
  },
  onError: (err) => {
    showMessage(err.message, 'error');
  }
});
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-8 pb-12 relative">

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Edit Profile</h1>
        <p class="text-slate-500 mt-1">Update your personal information and bio.</p>
      </div>

      <button @click="saveMutation.mutate(form)" :disabled="saveMutation.isPending.value || isLoading"
        class="flex items-center gap-2 text-white px-6 py-3 rounded-2xl transition shadow-lg shadow-orange-100 font-medium disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
        style="background-color: #FB923C;">
        <Loader2 v-if="saveMutation.isPending.value" class="animate-spin" :size="20" />
        <Save v-else :size="20" />
        <span>Save Changes</span>
      </button>
    </div>

    <div v-if="isLoading" class="flex justify-center py-20">
      <Loader2 class="animate-spin" style="color: #FB923C;" :size="40" />
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">

      <div class="lg:col-span-1 space-y-6">
        <div
          class="bg-white p-8 rounded-[2rem] shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100 text-center relative overflow-hidden group">

          <div class="relative w-48 h-48 mx-auto mb-6">
            <img :src="form.avatar_url || 'https://via.placeholder.com/200'"
              class="w-full h-full object-cover rounded-full border-4 border-white shadow-xl transition-transform duration-500 group-hover:scale-105"
              alt="Avatar" />

            <div @click="triggerFileInput"
              class="absolute inset-0 bg-slate-900/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer backdrop-blur-[2px]">
              <Upload class="text-white mb-1" :size="24" />
              <span class="text-white text-xs font-bold uppercase tracking-wider">Change Photo</span>
            </div>
          </div>

          <h3 class="text-xl font-bold text-slate-800">{{ form.full_name || 'Your Name' }}</h3>
          <p class="text-slate-500 text-sm mt-1">{{ form.headline || 'Your Headline' }}</p>

          <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload" />

          <button @click="triggerFileInput"
            class="mt-6 w-full py-2.5 rounded-xl border border-gray-200 text-slate-600 text-sm font-bold hover:bg-gray-50 transition">
            Upload New Picture
          </button>
          <p class="text-xs text-gray-400 mt-3">Recommended: Square JPG/PNG, max 2MB.</p>
        </div>
      </div>

      <div class="lg:col-span-2 space-y-8">

        <div class="bg-white p-8 rounded-[2rem] shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100">
          <h3 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <User :size="20" style="color: #FB923C;" />
            Basic Information
          </h3>

          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <div class="relative">
                  <User :size="18" class="absolute left-4 top-3.5 text-gray-400" />
                  <input v-model="form.full_name" type="text"
                    class="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition text-slate-800 focus:bg-white focus:ring-2 focus:border-transparent custom-focus"
                    :class="{ 'border-red-500 bg-red-50': errors.full_name }" placeholder="e.g. John Doe" />
                </div>
                <span v-if="errors.full_name" class="text-xs text-red-500 font-medium">{{ errors.full_name }}</span>
              </div>

              <div class="space-y-2">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <div class="relative">
                  <Mail :size="18" class="absolute left-4 top-3.5 text-gray-400" />
                  <input v-model="form.email" type="email"
                    class="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition text-slate-800 focus:bg-white focus:ring-2 focus:border-transparent custom-focus"
                    :class="{ 'border-red-500 bg-red-50': errors.email }" placeholder="john@example.com" />
                </div>
                <span v-if="errors.email" class="text-xs text-red-500 font-medium">{{ errors.email }}</span>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Headline / Job Title</label>
              <div class="relative">
                <Briefcase :size="18" class="absolute left-4 top-3.5 text-gray-400" />
                <input v-model="form.headline" type="text"
                  class="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition text-slate-800 focus:bg-white focus:ring-2 focus:border-transparent custom-focus"
                  :class="{ 'border-red-500 bg-red-50': errors.headline }" placeholder="e.g. Fullstack Developer" />
              </div>
              <span v-if="errors.headline" class="text-xs text-red-500 font-medium">{{ errors.headline }}</span>
            </div>

            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Bio / About Me</label>
                <div class="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
                  <button @click="insertMarkdown('bold')" class="p-1 hover:text-[#FB923C] rounded transition">
                    <Bold :size="14" />
                  </button>
                  <button @click="insertMarkdown('italic')" class="p-1 hover:text-[#FB923C] rounded transition">
                    <Italic :size="14" />
                  </button>
                  <button @click="insertMarkdown('underline')" class="p-1 hover:text-[#FB923C] rounded transition">
                    <Underline :size="14" />
                  </button>
                  <button @click="insertMarkdown('paragraph')" class="p-1 hover:text-[#FB923C] rounded transition">
                    <Type :size="14" />
                  </button>
                  <button @click="insertMarkdown('link')" class="p-1 hover:text-[#FB923C] rounded transition">
                    <Link :size="14" />
                  </button>
                  <div class="w-[1px] h-4 bg-gray-300 mx-1"></div>
                  <button @click="isPreview = !isPreview"
                    class="p-1 rounded transition flex items-center gap-1 text-xs font-bold"
                    :class="isPreview ? 'text-white bg-[#FB923C]' : 'text-slate-500 hover:text-[#FB923C]'">
                    <component :is="isPreview ? EyeOff : Eye" :size="14" />
                  </button>
                </div>
              </div>

              <div class="relative">
                <div v-show="!isPreview">
                  <FileText :size="18" class="absolute left-4 top-3.5 text-gray-400" />
                  <textarea ref="textareaRef" v-model="form.bio" rows="8"
                    class="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition text-slate-800 leading-relaxed resize-none font-mono text-sm focus:bg-white focus:ring-2 focus:border-transparent custom-focus"
                    :class="{ 'border-red-500 bg-red-50': errors.bio }"
                    placeholder="Tell us about yourself (Markdown supported)..."></textarea>
                </div>

                <div v-show="isPreview"
                  class="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl min-h-[200px] prose prose-sm max-w-none prose-p:text-slate-600 prose-a:text-orange-500"
                  style="border-color: #FB923C;" v-html="marked.parse(form.bio || '')"></div>
              </div>
              <span v-if="errors.bio" class="text-xs text-red-500 font-medium">{{ errors.bio }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-8 rounded-[2rem] shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100">
          <h3 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Github :size="20" style="color: #FB923C;" />
            Social Profiles
          </h3>

          <div class="space-y-5">
            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">LinkedIn URL</label>
              <div class="flex">
                <div
                  class="w-12 bg-blue-50 border border-r-0 border-gray-200 rounded-l-xl flex items-center justify-center text-blue-700">
                  <Linkedin :size="18" />
                </div>
                <input v-model="form.linkedin_url" type="url"
                  class="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-r-xl outline-none transition text-slate-800 focus:bg-white focus:ring-2 focus:border-transparent custom-focus"
                  :class="{ 'border-red-500 bg-red-50': errors.linkedin_url }"
                  placeholder="https://linkedin.com/in/username" />
              </div>
              <span v-if="errors.linkedin_url" class="text-xs text-red-500 font-medium">{{ errors.linkedin_url }}</span>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">GitHub URL</label>
              <div class="flex">
                <div
                  class="w-12 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl flex items-center justify-center text-gray-700">
                  <Github :size="18" />
                </div>
                <input v-model="form.github_url" type="url"
                  class="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-r-xl outline-none transition text-slate-800 focus:bg-white focus:ring-2 focus:border-transparent custom-focus"
                  :class="{ 'border-red-500 bg-red-50': errors.github_url }" placeholder="https://github.com/username" />
              </div>
              <span v-if="errors.github_url" class="text-xs text-red-500 font-medium">{{ errors.github_url }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <Transition name="toast">
      <div v-if="toast.show"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border"
        :class="toast.type === 'success' ? 'bg-white border-green-100 text-slate-800' : 'bg-white border-red-100 text-slate-800'">

        <div class="p-2 rounded-full"
          :class="toast.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'">
          <component :is="toast.type === 'success' ? CheckCircle : XCircle" :size="24" />
        </div>

        <div class="pr-2">
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
  --tw-ring-color: #FB923C;
  border-color: #FB923C;
}

/* Toast Transition */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

/* Markdown Preview Styles */
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