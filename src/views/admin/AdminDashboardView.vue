<script setup>
import {
  Eye,
  Briefcase,
  MessageSquare,
  Activity,
} from 'lucide-vue-next';

const stats = [
  { title: 'Total Views', value: '2,543', label: '+12%', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50', hover: 'group-hover:bg-blue-600' },
  { title: 'Projects', value: '12', label: 'Active', icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50', hover: 'group-hover:bg-purple-600' },
  { title: 'Guestbook', value: '48', label: '3 New', icon: MessageSquare, color: 'text-red-600', bg: 'bg-red-50', hover: 'group-hover:bg-red-600' },
  { title: 'System Status', value: 'Good', label: 'Stable', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', hover: 'group-hover:bg-emerald-600' },
];
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-8 pb-12">

    <div
      class="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-200">

      <div class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold mb-2 tracking-tight">Welcome back, Atyla! 👋</h1>
          <p class="text-indigo-100 opacity-90 font-medium">Here's what's happening with your portfolio today.</p>
        </div>

        <div class="shrink-0 relative">
          <img src="https://ui-avatars.com/api/?name=Atyla+Azfa&background=0D8ABC&color=fff&size=128" alt="Profile"
            class="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white/20 shadow-lg object-cover" />
          <span class="absolute bottom-1 right-1 w-4 h-4 bg-green-400 border-2 border-indigo-600 rounded-full"></span>
        </div>
      </div>

      <div class="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 bg-indigo-500/30 rounded-full blur-2xl"></div>
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

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

      <div class="lg:col-span-2 bg-white rounded-[2rem] shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-slate-800">Recent Messages</h3>
          <RouterLink to="/admin/guestbook" class="text-indigo-600 text-sm font-bold hover:text-indigo-800 transition">
            View All</RouterLink>
        </div>

        <div class="space-y-4">
          <div class="flex gap-4 p-5 rounded-3xl bg-gray-50 border border-transparent hover:border-gray-200 transition">
            <div
              class="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg flex-shrink-0">
              B</div>
            <div>
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <h4 class="font-bold text-slate-800">Budi Hartono</h4>
                <span class="text-xs text-gray-400 font-medium">• 2 hours ago</span>
                <span
                  class="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wide">Approved</span>
              </div>
              <p class="text-sm text-gray-600 leading-relaxed">"Keren banget portofolionya! Terutama bagian Project,
                rapih dan detail."</p>
            </div>
          </div>

          <div class="flex gap-4 p-5 rounded-3xl bg-white border border-gray-100 hover:shadow-md transition">
            <div
              class="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg flex-shrink-0">
              A</div>
            <div>
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <h4 class="font-bold text-slate-800">Anonim 22</h4>
                <span class="text-xs text-gray-400 font-medium">• 5 hours ago</span>
                <span
                  class="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-wide">New</span>
              </div>
              <p class="text-sm text-gray-600 leading-relaxed">"Bang, boleh share source code backend-nya gak? Lagi
                belajar Hono juga nih."</p>

              <div class="mt-3 flex gap-2">
                <button
                  class="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-100 transition">Approve</button>
                <button
                  class="text-xs bg-red-50 text-red-700 px-3 py-1.5 rounded-lg font-bold hover:bg-red-100 transition">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-white rounded-[2rem] shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
          <h3 class="text-xl font-bold text-slate-800 mb-6">Quick Actions</h3>

          <div class="space-y-3">
            <RouterLink to="/admin/projects"
              class="w-full flex items-center gap-4 p-4 rounded-2xl border border-dashed border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 transition group text-gray-500 bg-gray-50/50">
              <div
                class="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-indigo-600 transition">
                <Briefcase :size="20" />
              </div>
              <span class="font-bold text-sm">Add New Project</span>
            </RouterLink>

            <RouterLink to="/admin/blogs"
              class="w-full flex items-center gap-4 p-4 rounded-2xl border border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50 hover:text-purple-700 transition group text-gray-500 bg-gray-50/50">
              <div
                class="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-purple-600 transition">
                <BookOpen :size="20" />
              </div>
              <span class="font-bold text-sm">Write New Article</span>
            </RouterLink>
          </div>
        </div>

        <div class="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
          <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full -mr-10 -mt-10 blur-3xl opacity-50">
          </div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-purple-500 rounded-full -ml-8 -mb-8 blur-2xl opacity-50">
          </div>

          <div class="relative z-10">
            <h3 class="text-lg font-bold mb-1">Atyla Azfa</h3>
            <p class="text-slate-400 text-sm mb-6">Fullstack Developer</p>

            <div class="flex flex-wrap gap-2">
              <span
                class="bg-white/10 border border-white/5 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md">TypeScript</span>
              <span
                class="bg-white/10 border border-white/5 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md">Hono</span>
              <span
                class="bg-white/10 border border-white/5 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md">Vue</span>
            </div>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>