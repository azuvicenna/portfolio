<script setup>
import { Users, Eye, FileText, MessageCircle } from 'lucide-vue-next';

const stats = [
  { title: 'Total Projects', value: '12', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
  { title: 'Total Blogs', value: '5', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100' },
  { title: 'Guestbook', value: '48', icon: MessageCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { title: 'Total Views', value: '1.2K', icon: Eye, color: 'text-orange-600', bg: 'bg-orange-100' },
];
</script>

<template>
  <div class="space-y-6">
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div 
        v-for="(stat, index) in stats" 
        :key="index"
        class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition"
      >
        <div class="p-3 rounded-lg" :class="stat.bg">
          <component :is="stat.icon" :class="stat.color" :size="24" />
        </div>
        <div>
          <p class="text-sm text-gray-500 font-medium">{{ stat.title }}</p>
          <h3 class="text-2xl font-bold text-gray-800">{{ stat.value }}</h3>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-gray-800 text-lg">New Messages</h3>
          <button class="text-sm text-blue-600 hover:underline">View All</button>
        </div>
        
        <div class="space-y-4">
          <div v-for="i in 3" :key="i" class="flex gap-4 p-3 hover:bg-gray-50 rounded-lg transition cursor-pointer">
            <div class="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0" />
            <div>
              <p class="font-semibold text-gray-800 text-sm">Anonymous User</p>
              <p class="text-gray-500 text-sm line-clamp-1">Website-nya keren banget bang, ajarin dong...</p>
              <span class="text-xs text-gray-400">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 class="font-bold text-gray-800 text-lg mb-4">Quick Actions</h3>
        <div class="grid grid-cols-2 gap-4">
          <button class="p-4 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition flex flex-col items-center justify-center gap-2">
            <FileText :size="24" />
            <span class="text-sm font-medium">Add Project</span>
          </button>
          <button class="p-4 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-purple-500 hover:text-purple-500 transition flex flex-col items-center justify-center gap-2">
            <BookOpen :size="24" />
            <span class="text-sm font-medium">Write Blog</span>
          </button>
        </div>
      </div>

    </div>

  </div>
</template>