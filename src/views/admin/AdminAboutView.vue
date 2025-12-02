<script setup>
import { ref, onMounted } from 'vue';
import { 
  Save, 
  Upload, 
  Loader2, 
  User, 
  Mail, 
  Briefcase, 
  Github, 
  Linkedin, 
  Instagram,
  FileText
} from 'lucide-vue-next';

// --- STATE ---
const isLoading = ref(false);
const isSaving = ref(false);
const fileInput = ref(null);

const form = ref({
  full_name: '',
  headline: '',
  email: '',
  bio: '',
  avatar_url: '',
  linkedin_url: '',
  github_url: '',
  instagram_url: ''
});

// --- ACTIONS ---

const fetchData = async () => {
  isLoading.value = true;
  // Simulasi delay fetch dari Supabase
  setTimeout(() => {
    form.value = {
      full_name: 'Atyla Azfa',
      headline: 'Backend Developer | Information Systems Student',
      email: 'azfaalharits25@gmail.com',
      bio: "I am a passionate developer focused on building scalable backend systems using Node.js, Hono, and PostgreSQL.\n\nCurrently studying at Bina Sarana Informatika University.",
      avatar_url: 'https://ui-avatars.com/api/?name=Atyla+Azfa&background=0D8ABC&color=fff&size=256',
      linkedin_url: 'https://linkedin.com/in/atyla',
      github_url: 'https://github.com/atyla',
      instagram_url: 'https://instagram.com/atyla'
    };
    isLoading.value = false;
  }, 500);
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const previewUrl = URL.createObjectURL(file);
  form.value.avatar_url = previewUrl;
  
  console.log('File selected:', file.name);
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const saveData = () => {
  isSaving.value = true;
  setTimeout(() => {
    isSaving.value = false;
    alert('Profile updated successfully!');
  }, 1000);
};

// --- LIFECYCLE ---
onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-8 pb-12">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Edit Profile</h1>
        <p class="text-slate-500 mt-1">Update your personal information and bio.</p>
      </div>
      
      <button 
        @click="saveData" 
        :disabled="isSaving || isLoading"
        class="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl hover:bg-slate-800 transition shadow-lg shadow-slate-200 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <Loader2 v-if="isSaving" class="animate-spin" :size="20" />
        <Save v-else :size="20" />
        <span>Save Changes</span>
      </button>
    </div>

    <div v-if="isLoading" class="flex justify-center py-20">
      <Loader2 class="animate-spin text-slate-300" :size="40" />
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white p-8 rounded-[2rem] shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100 text-center relative overflow-hidden group">
          
          <div class="relative w-48 h-48 mx-auto mb-6">
            <img 
              :src="form.avatar_url || 'https://via.placeholder.com/200'" 
              class="w-full h-full object-cover rounded-full border-4 border-white shadow-xl"
              alt="Avatar"
            />
            
            <div 
              @click="triggerFileInput"
              class="absolute inset-0 bg-slate-900/50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer backdrop-blur-sm"
            >
              <Upload class="text-white mb-1" :size="24" />
              <span class="text-white text-xs font-bold uppercase tracking-wider">Change Photo</span>
            </div>
          </div>

          <h3 class="text-xl font-bold text-slate-800">{{ form.full_name || 'Your Name' }}</h3>
          <p class="text-slate-500 text-sm mt-1">{{ form.headline || 'Your Headline' }}</p>

          <input 
            type="file" 
            ref="fileInput" 
            class="hidden" 
            accept="image/*"
            @change="handleFileUpload"
          />
          
          <button 
            @click="triggerFileInput"
            class="mt-6 w-full py-2.5 rounded-xl border border-gray-200 text-slate-600 text-sm font-bold hover:bg-gray-50 transition"
          >
            Upload New Picture
          </button>
          <p class="text-xs text-gray-400 mt-3">Recommended: Square JPG/PNG, max 2MB.</p>
        </div>
      </div>

      <div class="lg:col-span-2 space-y-8">
        
        <div class="bg-white p-8 rounded-[2rem] shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100">
          <h3 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <User :size="20" class="text-indigo-600" />
            Basic Information
          </h3>
          
          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <div class="relative">
                  <User :size="18" class="absolute left-4 top-3.5 text-gray-400" />
                  <input v-model="form.full_name" type="text" class="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-slate-800" placeholder="e.g. John Doe" />
                </div>
              </div>
              
              <div class="space-y-2">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <div class="relative">
                  <Mail :size="18" class="absolute left-4 top-3.5 text-gray-400" />
                  <input v-model="form.email" type="email" class="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-slate-800" placeholder="john@example.com" />
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Headline / Job Title</label>
              <div class="relative">
                <Briefcase :size="18" class="absolute left-4 top-3.5 text-gray-400" />
                <input v-model="form.headline" type="text" class="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-slate-800" placeholder="e.g. Fullstack Developer" />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                <span>Bio / About Me</span>
                <span class="text-indigo-600 text-[10px] bg-indigo-50 px-2 py-0.5 rounded">Markdown Supported</span>
              </label>
              <div class="relative">
                <FileText :size="18" class="absolute left-4 top-3.5 text-gray-400" />
                <textarea v-model="form.bio" rows="6" class="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-slate-800 leading-relaxed resize-none" placeholder="Tell us about yourself..."></textarea>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white p-8 rounded-[2rem] shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100">
          <h3 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Github :size="20" class="text-indigo-600" />
            Social Profiles
          </h3>
          
          <div class="space-y-5">
            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">LinkedIn URL</label>
              <div class="flex">
                <div class="w-12 bg-blue-50 border border-r-0 border-gray-200 rounded-l-xl flex items-center justify-center text-blue-700">
                  <Linkedin :size="18" />
                </div>
                <input v-model="form.linkedin_url" type="url" class="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-r-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-slate-800" placeholder="https://linkedin.com/in/username" />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">GitHub URL</label>
              <div class="flex">
                <div class="w-12 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl flex items-center justify-center text-gray-700">
                  <Github :size="18" />
                </div>
                <input v-model="form.github_url" type="url" class="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-r-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-slate-800" placeholder="https://github.com/username" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>