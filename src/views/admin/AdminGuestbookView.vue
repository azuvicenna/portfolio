<script setup>
import { ref, computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { api } from '@/utils/api';
import {
  Trash2,
  CheckCircle,
  XCircle,
  MessageSquare,
  Clock,
  Loader2,
  RefreshCw,
  AlertCircle,
  AlertTriangle, // Icon Warning buat Modal
  X
} from 'lucide-vue-next';

// --- STATE UTAMA ---
const isSubmitting = ref(false);
const filterStatus = ref('ALL');
const tabs = ['NEW', 'APPROVED', 'REJECTED', 'ALL'];

// --- STATE DELETE MODAL (BARU) ---
const isDeleteModalOpen = ref(false);
const itemToDelete = ref(null);

// 1. Fetch Data Guestbook
const { data: messages, isLoading, isError, refetch } = useQuery({
  queryKey: ['guestbook-admin'],
  queryFn: () => api('/guestbook'),
  staleTime: 1000 * 60,
});

// --- COMPUTED ---
const filteredMessages = computed(() => {
  if (!messages.value) return [];
  if (filterStatus.value === 'ALL') return messages.value;

  // Mapping is_visible (boolean) ke status string untuk filtering visual
  // Asumsi: Backend mengembalikan array flat, kita filter manual di frontend
  // NOTE: Sebaiknya backend mengirim status string, tapi jika boolean:
  // True = Approved, False = Rejected. 'NEW' agak susah dideteksi hanya dari boolean 
  // kecuali ada flag khusus. Untuk sekarang kita filter berdasarkan field 'status' 
  // yang (diharapkan) dikirim backend atau kita mapping sendiri.

  return messages.value.filter(msg => msg.status === filterStatus.value);
});

const getCount = (status) => {
  if (!messages.value) return 0;
  if (status === 'ALL') return messages.value.length;
  return messages.value.filter(msg => msg.status === status).length;
};

// --- HELPER ---
const formatDateRelative = (dateString) => {
  if (!dateString) return '';
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

const getInitial = (name) => name ? name.charAt(0).toUpperCase() : '?';

// --- ACTIONS ---

// 1. Update Status
const updateStatus = (id, newStatus) => {
  isSubmitting.value = true;
  // TODO: Integrasi API PUT Status
  setTimeout(() => {
    // Simulasi update lokal
    if (messages.value) {
      const index = messages.value.findIndex(m => m.id === id);
      if (index !== -1) {
        messages.value[index].status = newStatus;
      }
    }
    isSubmitting.value = false;
  }, 500);
};

// 2. Logic Delete Modal (BARU)
const confirmDelete = (item) => {
  itemToDelete.value = item;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  itemToDelete.value = null;
};

const deleteMessage = () => {
  if (!itemToDelete.value) return;

  isSubmitting.value = true;

  // TODO: Integrasi API DELETE
  setTimeout(() => {
    // Simulasi hapus lokal (karena messages readonly dari useQuery, idealnya pakai queryClient)
    // Disini kita hanya refresh data untuk simulasi
    isSubmitting.value = false;
    closeDeleteModal();
    refetch();
  }, 500);
};

const refreshData = () => {
  isSubmitting.value = true;
  refetch().finally(() => {
    isSubmitting.value = false;
  });
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

      <button @click="refreshData" :disabled="isSubmitting || isLoading"
        class="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-100 transition disabled:opacity-50">
        <RefreshCw :size="16" :class="{ 'animate-spin': isSubmitting || isLoading }" />
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

      <div v-if="isLoading" class="p-12 text-center flex flex-col items-center justify-center text-slate-400">
        <Loader2 :size="40" class="animate-spin text-indigo-500 mb-2" />
        <p>Loading messages...</p>
      </div>

      <div v-else-if="isError" class="p-12 text-center flex flex-col items-center justify-center text-red-400">
        <AlertCircle :size="40" class="mb-2" />
        <p>Failed to load messages.</p>
      </div>

      <div v-else-if="filteredMessages.length === 0"
        class="p-12 text-center flex flex-col items-center justify-center text-slate-400">
        <MessageSquare :size="48" class="mb-4 opacity-50" />
        <p>No messages found in {{ filterStatus.toLowerCase() }} folder.</p>
      </div>

      <div v-else v-for="msg in filteredMessages" :key="msg.id"
        class="bg-white p-6 rounded-[2rem] shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-l-4 border-gray-100 group transition hover:shadow-lg"
        :class="getBorderColor(msg.status)">
        <div class="flex justify-between items-start mb-4">
          <div class="flex gap-4">
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 overflow-hidden"
              :class="{
                'bg-blue-50 text-blue-600': msg.status === 'NEW',
                'bg-green-50 text-green-600': msg.status === 'APPROVED',
                'bg-red-50 text-red-600': msg.status === 'REJECTED',
                'bg-gray-100 text-gray-600': !msg.status
              }">
              <img v-if="msg.visitors?.avatar_url" :src="msg.visitors.avatar_url" class="w-full h-full object-cover" />
              <span v-else>{{ getInitial(msg.visitors?.name || 'A') }}</span>
            </div>

            <div>
              <h3 class="font-bold text-slate-800 text-lg">{{ msg.visitors?.name || 'Anonymous' }}</h3>
              <a v-if="msg.visitors?.email" :href="`mailto:${msg.visitors.email}`"
                class="text-sm text-gray-400 hover:text-indigo-600 transition flex items-center gap-1">
                {{ msg.visitors.email }}
              </a>
            </div>
          </div>

          <div class="text-right">
            <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
              :class="getStatusColor(msg.status)">
              {{ msg.status || 'UNKNOWN' }}
            </span>
            <p class="text-xs text-gray-400 mt-1 font-medium flex items-center justify-end gap-1">
              <Clock :size="12" /> {{ formatDateRelative(msg.created_at) }}
            </p>
          </div>
        </div>

        <p class="text-slate-600 leading-relaxed mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100 italic">
          "{{ msg.message }}"
        </p>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-50">

          <button @click="confirmDelete(msg)" :disabled="isSubmitting"
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

            <h3 class="text-xl font-bold text-slate-800 mb-2">Delete Message?</h3>
            <p class="text-slate-500 text-sm mb-8">
              Are you sure you want to delete this message from <strong class="text-slate-700">{{
                itemToDelete?.visitors?.name || 'Anonymous' }}</strong>?
              This action cannot be undone.
            </p>

            <div class="grid grid-cols-2 gap-3">
              <button @click="closeDeleteModal"
                class="py-3 rounded-xl text-slate-600 font-bold hover:bg-gray-50 transition border border-gray-200">
                Cancel
              </button>

              <button @click="deleteMessage" :disabled="isSubmitting"
                class="flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-200 disabled:opacity-70 disabled:cursor-not-allowed">
                <Loader2 v-if="isSubmitting" class="animate-spin" :size="20" />
                <span v-else>Yes, Delete</span>
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
</style>