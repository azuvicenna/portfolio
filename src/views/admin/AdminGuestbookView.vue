<script setup>
import { ref, computed } from 'vue';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/vue-query';
import { api } from '@/utils/api';
import { supabase } from '@/config/supabase';
import {
  Trash2, MessageSquare, Loader2, AlertTriangle,
  CheckCircle, XCircle, RefreshCw, ChevronLeft, ChevronRight,
  Eye, EyeOff // Import Icon Mata
} from 'lucide-vue-next';

// --- SETUP ---
const queryClient = useQueryClient();
const isDeleteModalOpen = ref(false);
const itemToDelete = ref(null);

// Pagination State
const page = ref(1);
const limit = 10;

// Toast State
const toast = ref({ show: false, message: '', type: 'success' });
const showMessage = (msg, type = 'success') => {
  toast.value = { show: true, message: msg, type };
  setTimeout(() => toast.value.show = false, 3000);
};

// --- API ACTIONS ---

// 1. FETCH GUESTBOOK (READ)
const { data: apiResponse, isLoading, refetch, isRefetching } = useQuery({
  queryKey: ['guestbook', page],
  queryFn: async () => {
    const res = await api(`/guestbook?page=${page.value}&limit=${limit}`);
    return res;
  },
  placeholderData: keepPreviousData,
  staleTime: 0
});

// Computed Data
const messages = computed(() => {
  const raw = apiResponse.value;
  let dataToMap = [];

  if (raw) {
    if (Array.isArray(raw)) dataToMap = raw;
    else if (raw.data && Array.isArray(raw.data)) dataToMap = raw.data;
    else if (raw.data?.data && Array.isArray(raw.data.data)) dataToMap = raw.data.data;
  }

  return dataToMap.map(item => ({
    id: item.id,
    message: item.message,
    createdAt: item.created_at,
    // Default true jika field is_visible belum ada di API
    isVisible: item.is_visible !== undefined ? item.is_visible : true,
    visitor: {
      name: item.visitors?.name || 'Anonymous',
      avatar: item.visitors?.avatar_url || '',
      initial: item.visitors?.initial || '?'
    }
  }));
});

// Computed Pagination Meta
const meta = computed(() => {
  const raw = apiResponse.value;
  const pag = raw?.pagination || raw?.data?.pagination || {};
  return {
    current_page: pag.current_page || 1,
    total_pages: pag.total_pages || 1,
    total_items: pag.total_data || 0
  };
});

const nextPage = () => { if (page.value < meta.value.total_pages) page.value++; };
const prevPage = () => { if (page.value > 1) page.value--; };

// 2. TOGGLE VISIBILITY (UPDATE) - BARU
const toggleMutation = useMutation({
  mutationFn: async ({ id, currentStatus }) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Login dulu bang.");

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    // Kirim kebalikan dari status sekarang (!currentStatus)
    const res = await fetch(`${API_URL}/api/v1/guestbook/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ is_visible: !currentStatus })
    });

    if (!res.ok) throw new Error("Gagal update status.");
    return res.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['guestbook'] });
    showMessage("Status visibility berhasil diubah!", 'success');
  },
  onError: (e) => showMessage(e.message, 'error')
});

// 3. DELETE MESSAGE
const deleteMutation = useMutation({
  mutationFn: async (id) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Login dulu bang.");

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const res = await fetch(`${API_URL}/api/v1/guestbook/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${session.access_token}` }
    });

    if (!res.ok) throw new Error("Gagal menghapus pesan.");
    return res.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['guestbook'] });
    showMessage("Pesan dihapus!", 'success');
    closeDeleteModal();
  },
  onError: (e) => showMessage(e.message, 'error')
});

// --- HELPER ---
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

// --- MODAL & ACTION LOGIC ---
const confirmDelete = (item) => {
  itemToDelete.value = item;
  isDeleteModalOpen.value = true;
};
const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  itemToDelete.value = null;
};

const handleToggle = (item) => {
  toggleMutation.mutate({ id: item.id, currentStatus: item.isVisible });
};
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-8 relative pb-20">

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Guestbook</h1>
        <p class="text-slate-500 mt-1">Moderate messages from your visitors.</p>
      </div>

      <button @click="refetch" :disabled="isLoading || isRefetching"
        class="flex items-center gap-2 bg-white border border-gray-200 text-slate-600 px-4 py-2.5 rounded-xl hover:bg-gray-50 hover:text-[#FB923C] hover:border-[#FB923C] transition font-bold text-sm shadow-sm disabled:opacity-70">
        <RefreshCw :size="16" :class="{ 'animate-spin': isLoading || isRefetching }" />
        <span>Refresh Data</span>
      </button>
    </div>

    <div
      class="bg-white rounded-[2rem] shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col">

      <div v-if="isLoading" class="p-12 text-center flex justify-center">
        <Loader2 class="animate-spin text-[#FB923C]" :size="40" />
      </div>

      <div v-else-if="!messages || messages.length === 0"
        class="p-12 text-center text-slate-400 flex flex-col items-center">
        <MessageSquare :size="48" class="mb-4 opacity-50" />
        <p>No messages found.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-bold bg-gray-50/50">
              <th class="px-8 py-5">Visitor</th>
              <th class="px-6 py-5 w-1/2">Message</th>
              <th class="px-6 py-5 whitespace-nowrap">Date</th>
              <th class="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="item in messages" :key="item.id" class="group transition duration-200"
              :class="item.isVisible ? 'hover:bg-orange-50/30' : 'bg-gray-50 opacity-75 hover:opacity-100'">

              <td class="px-8 py-5 align-top">
                <div class="flex gap-4 items-center">
                  <div
                    class="w-10 h-10 rounded-full flex-shrink-0 bg-gray-200 overflow-hidden border border-white shadow-sm flex items-center justify-center text-gray-500 font-bold text-sm">
                    <img v-if="item.visitor.avatar" :src="item.visitor.avatar" class="w-full h-full object-cover" />
                    <span v-else>{{ item.visitor.initial }}</span>
                  </div>
                  <div>
                    <h3 class="font-bold text-slate-800 text-sm">{{ item.visitor.name }}</h3>
                    <span v-if="!item.isVisible"
                      class="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-bold uppercase ml-2 md:hidden">Hidden</span>
                  </div>
                </div>
              </td>

              <td class="px-6 py-5 align-top">
                <div class="relative">
                  <p class="text-slate-600 text-sm leading-relaxed whitespace-pre-line"
                    :class="{ 'line-through text-slate-400': !item.isVisible }">
                    {{ item.message }}
                  </p>
                  <span v-if="!item.isVisible" class="text-[10px] font-bold text-slate-400 mt-1 block">(Pesan
                    disembunyikan dari publik)</span>
                </div>
              </td>

              <td class="px-6 py-5 align-top whitespace-nowrap">
                <span class="text-xs font-bold text-slate-400 bg-gray-100 px-2 py-1 rounded-md">
                  {{ formatDate(item.createdAt) }}
                </span>
              </td>

              <td class="px-8 py-5 align-top text-right">
                <div class="flex items-center justify-end gap-2">

                  <button @click="handleToggle(item)" class="p-2 rounded-xl transition"
                    :class="item.isVisible ? 'text-green-500 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'"
                    :title="item.isVisible ? 'Hide Message' : 'Show Message'">
                    <component :is="item.isVisible ? Eye : EyeOff" :size="18" />
                  </button>

                  <button @click="confirmDelete(item)"
                    class="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                    title="Delete Message">
                    <Trash2 :size="18" />
                  </button>

                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="meta.total_pages > 1"
        class="border-t border-gray-100 px-8 py-4 bg-gray-50/30 flex items-center justify-between">
        <span class="text-xs text-slate-500 font-medium">
          Page <b>{{ meta.current_page }}</b> of <b>{{ meta.total_pages }}</b> ({{ meta.total_items }} messages)
        </span>
        <div class="flex items-center gap-2">
          <button @click="prevPage" :disabled="page === 1"
            class="p-2 rounded-lg border border-gray-200 bg-white text-slate-600 hover:bg-[#FB923C] hover:text-white hover:border-[#FB923C] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1 text-xs font-bold">
            <ChevronLeft :size="14" /> Prev
          </button>
          <button @click="nextPage" :disabled="page >= meta.total_pages"
            class="p-2 rounded-lg border border-gray-200 bg-white text-slate-600 hover:bg-[#FB923C] hover:text-white hover:border-[#FB923C] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1 text-xs font-bold">
            Next
            <ChevronRight :size="14" />
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
              Are you sure you want to delete message from <strong class="text-slate-700">{{ itemToDelete?.visitor?.name
                }}</strong>?
            </p>
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>