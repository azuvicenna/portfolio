<script setup>
import { ref, computed } from 'vue';
import { CheckCircle, XCircle, Trash2, Clock, Filter, Loader2, MessageSquare, ExternalLink } from 'lucide-vue-next';

// State
const isSubmitting = ref(false);
const filterStatus = ref('NEW'); // Filter default
const statuses = ['NEW', 'APPROVED', 'REJECTED', 'ALL'];

// Data Dummy Guestbook Entries
const messages = ref([
  { id: 1, name: 'Budi Hartono', email: 'budi@mail.com', message: 'Keren banget portofolionya! Terutama bagian Project, rapih dan detail.', status: 'NEW', createdAt: '2025-11-28T10:00:00Z' },
  { id: 2, name: 'Siti Aminah', email: 'siti@mail.com', message: 'Apakah Anda terbuka untuk peluang freelance saat ini?', status: 'APPROVED', createdAt: '2025-11-27T15:30:00Z' },
  { id: 3, name: 'Anonim 33', email: 'anon@mail.com', message: 'Website Anda sangat membantu saya dalam memilih stack baru. Terima kasih!', status: 'NEW', createdAt: '2025-11-28T11:45:00Z' },
  { id: 4, name: 'John Doe', email: 'john@mail.com', message: 'Beberapa link di halaman projects saya rasa sudah kadaluarsa.', status: 'REJECTED', createdAt: '2025-11-26T08:12:00Z' },
]);

// Helper: Memfilter pesan berdasarkan status yang dipilih
const filteredMessages = computed(() => {
  if (filterStatus.value === 'ALL') {
    return messages.value;
  }
  return messages.value.filter(msg => msg.status === filterStatus.value);
});

// Helper: Menghitung jumlah untuk setiap status
const statusCounts = computed(() => {
  const counts = { NEW: 0, APPROVED: 0, REJECTED: 0, ALL: 0 };
  messages.value.forEach(msg => {
    counts[msg.status]++;
    counts.ALL++;
  });
  return counts;
});

// Logika Aksi Moderasi
const performAction = (id, action) => {
  isSubmitting.value = true;
  console.log(`Simulasi: Memproses pesan ID ${id} dengan aksi: ${action}`);

  // Simulasi API call
  setTimeout(() => {
    const index = messages.value.findIndex(msg => msg.id === id);
    if (index !== -1) {
      if (action === 'DELETE') {
        messages.value.splice(index, 1);
        alert(`Pesan ID ${id} berhasil dihapus (Simulasi)`);
      } else {
        const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
        messages.value[index].status = newStatus;
        alert(`Pesan ID ${id} berhasil diubah ke status ${newStatus} (Simulasi)`);
      }
    }
    isSubmitting.value = false;
  }, 500);
};

// Helper: Format tanggal
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

// Helper: Mendapatkan style status
const getStatusStyles = (status) => {
  switch (status) {
    case 'APPROVED': return 'bg-green-100 text-green-800';
    case 'REJECTED': return 'bg-red-100 text-red-800';
    case 'NEW':
    default: return 'bg-blue-100 text-blue-800';
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <MessageSquare :size="24" class="text-blue-600" />
        Guestbook Moderation
      </h1>
    </div>

    <div class="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
      <Filter :size="18" class="text-gray-500" />
      <span class="text-sm font-medium text-gray-700">Filter Status:</span>
      
      <button
        v-for="status in statuses"
        :key="status"
        @click="filterStatus = status"
        :disabled="isSubmitting"
        class="px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50"
        :class="{
          'bg-blue-600 text-white': filterStatus === status,
          'bg-gray-100 text-gray-700 hover:bg-gray-200': filterStatus !== status
        }"
      >
        {{ status }} ({{ statusCounts[status] }})
      </button>
      
      <Loader2 v-if="isSubmitting" class="animate-spin text-blue-500" :size="20" />
    </div>

    <div class="space-y-4">
      <div v-if="filteredMessages.length === 0" class="text-center p-12 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-500">
        <BookOpen :size="32" class="mx-auto mb-3" />
        <p class="font-medium">Tidak ada pesan yang sesuai dengan filter **{{ filterStatus }}**.</p>
      </div>

      <div 
        v-for="msg in filteredMessages" 
        :key="msg.id" 
        class="bg-white rounded-xl shadow-md p-5 border-l-4"
        :class="{
          'border-blue-500': msg.status === 'NEW',
          'border-green-500': msg.status === 'APPROVED',
          'border-red-500': msg.status === 'REJECTED',
        }"
      >
        <div class="flex justify-between items-start mb-3">
          <div>
            <div class="font-bold text-lg text-gray-800">{{ msg.name }}</div>
            <div class="text-sm text-gray-500 flex items-center space-x-2">
              <span>{{ msg.email }}</span>
              <a :href="`mailto:${msg.email}`" target="_blank" class="text-blue-500 hover:text-blue-700">
                <ExternalLink :size="14" />
              </a>
            </div>
          </div>
          <div class="text-right">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold" :class="getStatusStyles(msg.status)">
              {{ msg.status }}
            </span>
            <div class="text-xs text-gray-400 mt-1 flex items-center gap-1 justify-end">
              <Clock :size="12" />
              {{ formatTime(msg.createdAt) }}
            </div>
          </div>
        </div>

        <p class="text-gray-700 border-t border-b py-4 my-3 whitespace-pre-wrap">{{ msg.message }}</p>

        <div class="flex justify-end space-x-3 pt-2">
          
          <button 
            @click="performAction(msg.id, 'DELETE')" 
            :disabled="isSubmitting"
            class="flex items-center gap-1 text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
          >
            <Trash2 :size="18" />
            <span>Delete</span>
          </button>
          
          <button 
            v-if="msg.status !== 'REJECTED'"
            @click="performAction(msg.id, 'REJECT')" 
            :disabled="isSubmitting"
            class="flex items-center gap-1 text-orange-600 hover:text-orange-800 p-2 rounded-lg hover:bg-orange-50 transition disabled:opacity-50"
          >
            <XCircle :size="18" />
            <span>Reject</span>
          </button>

          <button 
            v-if="msg.status !== 'APPROVED'"
            @click="performAction(msg.id, 'APPROVE')" 
            :disabled="isSubmitting"
            class="flex items-center gap-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
          >
            <CheckCircle :size="18" />
            <span>Approve</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>