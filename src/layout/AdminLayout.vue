<script setup>
import { ref } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import {
    LayoutDashboard,
    Briefcase,
    BookOpen,
    MessageSquare,
    User,
    LogOut,
    GraduationCap,
    Wrench
} from 'lucide-vue-next';

const isSidebarOpen = ref(true);
const route = useRoute();

const menus = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Profile', path: '/admin/about', icon: User },
    { name: 'Experiences', path: '/admin/experiences', icon: Briefcase },
    { name: 'Educations', path: '/admin/educations', icon: GraduationCap },
    { name: 'Skills', path: '/admin/skills', icon: Wrench },
    { name: 'Projects', path: '/admin/projects', icon: Briefcase },
    { name: 'Blogs', path: '/admin/blogs', icon: BookOpen },
    { name: 'Guestbook', path: '/admin/guestbook', icon: MessageSquare },
];
</script>

<template>
    <div class="flex h-screen w-full bg-gray-100 font-sans overflow-hidden">

        <aside class="bg-slate-900 text-white w-64 flex flex-col flex-shrink-0 transition-all duration-300 h-full"
            :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-64 absolute lg:relative lg:translate-x-0'">
            <div class="p-6 flex items-center justify-center border-b border-slate-700 flex-shrink-0">
                <h1 class="text-2xl font-bold tracking-wider">Admin Panel</h1>
            </div>

            <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-2 no-scrollbar">
                <RouterLink v-for="menu in menus" :key="menu.path" :to="menu.path"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200"
                    :class="route.path === menu.path ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'">
                    <component :is="menu.icon" :size="20" class="flex-shrink-0" />
                    <span class="font-medium truncate">{{ menu.name }}</span>
                </RouterLink>
            </nav>

            <div class="p-4 border-t border-slate-700 flex-shrink-0">
                <button
                    class="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-slate-800 rounded-lg transition">
                    <LogOut :size="20" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>

        <div class="flex-1 flex flex-col h-full overflow-hidden">

            <header class="bg-white shadow-sm h-16 flex items-center justify-between px-6 z-10 flex-shrink-0">
                <h2 class="text-xl font-semibold text-gray-800">
                    {{menus.find(m => m.path === route.path)?.name || 'Dashboard'}}
                </h2>

                <div class="flex items-center gap-4">
                    <div class="text-right hidden md:block">
                        <p class="text-sm font-medium text-gray-900">Atyla Azfa</p>
                        <p class="text-xs text-gray-500">Administrator</p>
                    </div>
                    <div class="h-10 w-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
                        <img src="https://ui-avatars.com/api/?name=Atyla+Azfa&background=0D8ABC&color=fff"
                            alt="Admin" />
                    </div>
                </div>
            </header>

            <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                <RouterView />
            </main>

        </div>
    </div>
</template>

<style scoped>
body,
html {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
}

#app {
    height: 100%;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>