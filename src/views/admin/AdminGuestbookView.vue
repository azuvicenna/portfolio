<script setup>
import { ref, computed } from 'vue';
import {
  Trash2,
  CheckCircle,
  XCircle,
  MessageSquare,
  Clock,
  Loader2,
  RefreshCw
} from 'lucide-vue-next';

// --- STATE ---
const isSubmitting = ref(false);
const filterStatus = ref('NEW');
const tabs = ['NEW', 'APPROVED', 'REJECTED', 'ALL'];

const messages = ref([
  {
    id: 1,
    name: 'Budi Hartono',
    email: 'budi@mail.com',
    message: 'Keren banget portofolionya! Terutama bagian Project, rapih dan detail. Saya suka pemilihan warnanya. Sukses terus bang!',
    status: 'NEW',
    createdAt: '2025-11-28T10:00:00Z'
  },
  {
    id: 2,
    name: 'Siti Aminah',
    email: 'siti@mail.com',
    message: 'Apakah Anda terbuka untuk peluang freelance saat ini? Saya punya project web desa yang butuh bantuan.',
    status: 'APPROVED',
    createdAt: '2025-11-27T15:30:00Z'
  },
  {
    id: 3,
    name: 'John Doe',
    email: 'john@spam.com',
    message: 'Cheap web hosting services available here: [Link Removed]',
    status: 'REJECTED',
    createdAt: '2025-11-26T08:12:00Z'
  },
]);

// --- COMPUTED ---
const filteredMessages = computed(() => {
  if (filterStatus.value === 'ALL') {
    return messages.value;
  }
  return messages.value.filter(msg => msg.status === filterStatus.value);
});

const getCount = (status) => {
  if (status === 'ALL') return messages.value.length;
  return messages.value.filter(msg => msg.status === status).length;
};

// --- HELPER ---
const formatDateRelative = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 172800) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getStatusColor = (status) => {
  switch (status) {
    case 'NEW': return 'bg-blue-100 text-blue-700';
    case 'APPROVED': return 'bg-green-100 text-green-700';
    case 'REJECTED': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getBorderColor = (status) => {
  switch (status) {
    case 'NEW': return 'border-l-blue-500';
    case 'APPROVED': return 'border-l-green-500';
    case 'REJECTED': return 'border-l-red-500';
    default: return 'border-l-gray-300';
  }
};

// --- ACTIONS ---
const updateStatus = (id, newStatus) => {
  isSubmitting.value = true;
  setTimeout(() => {
    const index = messages.value.findIndex(m => m.id === id);
    if (index !== -1) {
      messages.value[index].status = newStatus;
    }
    isSubmitting.value = false;
  }, 500);
};

const deleteMessage = (id) => {
  if (confirm('Are you sure you want to delete this message?')) {
    isSubmitting.value = true;
    setTimeout(() => {
      messages.value = messages.value.filter(m => m.id !== id);
      isSubmitting.value = false;
    }, 500);
  }
};

const refreshData = () => {
  isSubmitting.value = true;
  setTimeout(() => {
    isSubmitting.value = false;
  }, 1000);
};
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-8">

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Guestbook</h1>
        <span
          class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500 border border-gray-200">Moderation</span>
      </div>

      <button @click="refreshData" :disabled="isSubmitting"
        class="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-100 transition disabled:opacity-50">
        <RefreshCw :size="16" :class="{ 'animate-spin': isSubmitting }" />
        <span>Refresh</span>
      </button>
    </div>

    <div class="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 w-fit">
      <button v-for="tab in tabs" :key="tab" @click="filterStatus = tab"
        class="px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2" :class="filterStatus === tab
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
          : 'text-gray-500 hover:bg-gray-50'">
        {{ tab.charAt(0) + tab.slice(1).toLowerCase() }}
        <span class="bg-white/20 px-1.5 py-0.5 rounded text-[10px]"
          :class="filterStatus !== tab ? 'bg-gray-200 text-gray-600' : ''">
          {{ getCount(tab) }}
        </span>
      </button>
    </div>

    <div class="space-y-4">

      <div v-if="filteredMessages.length === 0"
        class="p-12 text-center flex flex-col items-center justify-center text-slate-400">
        <MessageSquare :size="48" class="mb-4 opacity-50" />
        <p>No messages found in {{ filterStatus.toLowerCase() }} folder.</p>
      </div>

      <div v-for="msg in filteredMessages" :key="msg.id"
        class="bg-white p-6 rounded-[2rem] shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-l-4 border-gray-100 group transition hover:shadow-lg"
        :class="getBorderColor(msg.status)">
        <div class="flex justify-between items-start mb-4">
          <div class="flex gap-4">
            <div class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0" :class="{
              'bg-blue-50 text-blue-600': msg.status === 'NEW',
              'bg-green-50 text-green-600': msg.status === 'APPROVED',
              'bg-red-50 text-red-600': msg.status === 'REJECTED'
            }">
              {{ msg.name.charAt(0).toUpperCase() }}
            </div>

            <div>
              <h3 class="font-bold text-slate-800 text-lg">{{ msg.name }}</h3>
              <a :href="`mailto:${msg.email}`"
                class="text-sm text-gray-400 hover:text-indigo-600 transition flex items-center gap-1">
                {{ msg.email }}
              </a>
            </div>
          </div>

          <div class="text-right">
            <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
              :class="getStatusColor(msg.status)">
              {{ msg.status }}
            </span>
            <p class="text-xs text-gray-400 mt-1 font-medium flex items-center justify-end gap-1">
              <Clock :size="12" /> {{ formatDateRelative(msg.createdAt) }}
            </p>
          </div>
        </div>

        <p class="text-slate-600 leading-relaxed mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100 italic">
          "{{ msg.message }}"
        </p>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-50">

          <button @click="deleteMessage(msg.id)" :disabled="isSubmitting"
            class="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition font-bold text-sm disabled:opacity-50">
            <Trash2 :size="16" />
            <span>Delete</span>
          </button>

          <button v-if="msg.status !== 'REJECTED'" @click="updateStatus(msg.id, 'REJECTED')" :disabled="isSubmitting"
            class="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition font-bold text-sm border border-gray-200 disabled:opacity-50">
            <XCircle :size="16" />
            <span>Reject</span>
          </button>

          <button v-if="msg.status !== 'APPROVED'" @click="updateStatus(msg.id, 'APPROVED')" :disabled="isSubmitting"
            class="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition font-bold text-sm shadow-md shadow-indigo-100 disabled:opacity-50">
            <CheckCircle :size="16" />
            <span>Approve</span>
          </button>

          <button v-if="msg.status === 'APPROVED'" @click="updateStatus(msg.id, 'NEW')" :disabled="isSubmitting"
            class="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl transition font-bold text-sm disabled:opacity-50">
            <span>Set to New</span>
          </button>

        </div>
      </div>

    </div>

  </div>
</template>