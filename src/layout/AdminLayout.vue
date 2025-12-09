<script setup>
import { ref, computed } from 'vue';
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import { supabase } from '@/config/supabase'; // Pastikan path config benar
import {
    LayoutDashboard,
    User,
    Briefcase,
    BookOpen,
    MessageSquare,
    GraduationCap,
    Wrench,
    LogOut,
    ExternalLink,
    AlertTriangle,
    Loader2
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();

// State Modal Logout
const isLogoutModalOpen = ref(false);
const isLoggingOut = ref(false);

const mainMenus = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'About', path: '/admin/about', icon: User },
];

const contentMenus = [
    { name: 'Experiences', path: '/admin/experiences', icon: Briefcase },
    { name: 'Educations', path: '/admin/educations', icon: GraduationCap },
    { name: 'Skills', path: '/admin/skills', icon: Wrench },
    { name: 'Projects', path: '/admin/projects', icon: Briefcase, count: 12 },
    { name: 'Blogs', path: '/admin/blogs', icon: BookOpen },
    { name: 'Guestbook', path: '/admin/guestbook', icon: MessageSquare, count: 3, alert: true },
];

const isActive = (path) => {
    if (path === '/admin' && route.path !== '/admin') return false;
    return route.path.startsWith(path);
};

const pageTitle = computed(() => {
    const allMenus = [...mainMenus, ...contentMenus];
    const activeMenu = allMenus.find(m => m.path === route.path);
    return activeMenu ? activeMenu.name : 'Dashboard';
});

// LOGIC LOGOUT
const openLogoutModal = () => {
    isLogoutModalOpen.value = true;
};

const closeLogoutModal = () => {
    isLogoutModalOpen.value = false;
};

const handleLogout = async () => {
    isLoggingOut.value = true;
    try {
        await supabase.auth.signOut();
        // Redirect ke halaman login setelah logout
        router.push('/login');
    } catch (error) {
        console.error('Logout error:', error);
        alert('Gagal logout, silakan coba lagi.');
    } finally {
        isLoggingOut.value = false;
        closeLogoutModal();
    }
};
</script>

<template>
    <div class="flex h-screen w-full bg-gray-50 text-slate-800 plus-jakarta-sans overflow-hidden">

        <aside class="w-72 bg-white border-r border-gray-200 hidden md:flex flex-col z-20">
            <div class="h-20 flex items-center px-8 border-b border-gray-50 flex-shrink-0">
                <div class="flex items-center gap-3">
                    <div
                        class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        DEV</div>
                    <span class="text-xl font-bold tracking-tight text-slate-900">My Portfolio Panel</span>
                </div>
            </div>

            <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-1 no-scrollbar">
                <p class="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Main Menu</p>
                <RouterLink v-for="menu in mainMenus" :key="menu.path" :to="menu.path"
                    class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium mb-1" :class="isActive(menu.path)
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100'
                        : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'">
                    <component :is="menu.icon" :size="20"
                        :class="isActive(menu.path) ? 'text-indigo-600' : 'text-slate-400'" />
                    {{ menu.name }}
                </RouterLink>

                <p class="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 mt-8">Content Manager</p>
                <RouterLink v-for="menu in contentMenus" :key="menu.path" :to="menu.path"
                    class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium mb-1 group" :class="isActive(menu.path)
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100'
                        : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'">
                    <component :is="menu.icon" :size="20"
                        :class="isActive(menu.path) ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'" />
                    <span class="flex-1">{{ menu.name }}</span>

                    <span v-if="menu.count" class="ml-auto py-0.5 px-2 rounded-full text-xs font-bold"
                        :class="menu.alert ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'">
                        {{ menu.count }}
                    </span>
                </RouterLink>
            </nav>

            <div class="p-4 border-t border-gray-200 flex-shrink-0">
                <button @click="openLogoutModal"
                    class="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-red-50 hover:text-red-600 transition group">
                    <img src="https://ui-avatars.com/api/?name=Atyla+Azfa&background=0D8ABC&color=fff"
                        class="w-10 h-10 rounded-full border-2 border-white shadow-sm">
                    <div class="flex-1 min-w-0 text-left">
                        <p class="text-sm font-bold text-gray-900 group-hover:text-red-700 truncate">Atyla Azfa</p>
                        <p class="text-xs text-gray-500 group-hover:text-red-400 truncate">Administrator</p>
                    </div>
                    <LogOut :size="18" class="text-gray-400 group-hover:text-red-500" />
                </button>
            </div>
        </aside>

        <main class="flex-1 flex flex-col h-full overflow-hidden relative bg-gray-50">
            <header
                class="h-20 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30 flex-shrink-0">
                <div class="flex items-center gap-4">
                    <h2 class="text-xl font-bold text-slate-800">{{ pageTitle }}</h2>
                </div>
                <div class="flex items-center gap-4">
                    <a href="https://reeze.up.railway.app" target="_blank"
                        class="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition flex items-center gap-2 shadow-lg shadow-slate-200">
                        View Live Site
                        <ExternalLink :size="16" />
                    </a>
                </div>
            </header>

            <div class="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8 scroll-smooth">
                <RouterView />
            </div>
        </main>
    </div>

    <Teleport to="body">
        <Transition name="fade">
            <div v-if="isLogoutModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">

                <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                    @click="closeLogoutModal"></div>

                <div
                    class="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 text-center transform transition-all border border-gray-100 scale-100">

                    <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 mb-5">
                        <LogOut class="h-6 w-6 text-red-500 ml-1" />
                    </div>

                    <h3 class="text-lg font-bold text-slate-800 mb-2">Sign Out?</h3>
                    <p class="text-slate-500 text-sm mb-6">
                        Are you sure you want to end your session? You will need to login again to access the admin
                        panel.
                    </p>

                    <div class="grid grid-cols-2 gap-3">
                        <button @click="closeLogoutModal"
                            class="py-2.5 rounded-xl text-slate-600 font-bold hover:bg-gray-50 transition border border-gray-200 text-sm">
                            Cancel
                        </button>

                        <button @click="handleLogout" :disabled="isLoggingOut"
                            class="flex items-center justify-center gap-2 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-200 disabled:opacity-70 text-sm">
                            <Loader2 v-if="isLoggingOut" class="animate-spin" :size="16" />
                            <span v-else>Yes, Sign Out</span>
                        </button>
                    </div>

                </div>
            </div>
        </Transition>
    </Teleport>

</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

/* Transisi Modal */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>