<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const menu = [
    { label: 'Beranda', id: 'home' },
    { label: 'Tentang', id: 'about' },
    { label: 'Keahlian', id: 'skills' },
    { label: 'Pengalaman', id: 'experience' },
    { label: 'Proyek', id: 'projects' },
    { label: 'Sertifikat', id: 'certificates' },
]

const open = ref(false)
const activeId = ref<string | null>(null)
let observer: IntersectionObserver | undefined

onMounted(() => {
    observer = new IntersectionObserver(
        (entries) =>
            entries.forEach((e) => {
                if (!e.isIntersecting) return
                activeId.value = menu.some((m) => m.id === e.target.id) ? e.target.id : null
            }),
        { rootMargin: '-40% 0px -55% 0px' },
    )
        ;[...menu.map((m) => m.id), 'contact'].forEach((id) => {
            const el = document.getElementById(id)
            if (el) observer!.observe(el)
        })
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
    <header class="sticky top-0 z-40 w-full glass-header border-b border-neutral-200/80 transition-all duration-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-20">
                <a href="#home" class="flex items-center group">
                    <!-- <img src="/favicon.png" alt="Logo Portfolio Web"
                        class="w-10 h-10 rounded-xl object-contain group-hover:scale-105 transition-transform" /> -->
                    <span class="text-xl font-extrabold tracking-tight text-neutral-900">Portfolio Web</span>
                </a>
                <nav class="hidden md:flex items-center space-x-8 text-sm font-semibold text-neutral-600">
                    <a v-for="m in menu" :key="m.id" :href="`#${m.id}`"
                        :class="['nav-link hover:text-brand-600 transition', { active: activeId === m.id }]">{{ m.label
                        }}</a>
                </nav>
                <div class="hidden md:flex items-center space-x-4">
                    <a href="https://github.com/azuvicenna" target="_blank" rel="noopener"
                        class="hidden lg:block text-sm font-bold text-neutral-700 hover:text-neutral-900 px-3 py-2 transition">GitHub</a>
                    <a href="CV_ID_Atyla_Azfa_Al_Harits.pdf" download
                        class="bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all transform active:scale-95">Download
                        CV</a>
                </div>
                <div class="flex md:hidden">
                    <button
                        class="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50 focus:outline-none"
                        aria-label="Buka menu" @click="open = !open">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        <div v-show="open" id="mobileNav"
            class="md:hidden border-b border-neutral-200 bg-white/95 backdrop-blur px-4 pt-2 pb-6 space-y-3">
            <a v-for="m in menu" :key="m.id" :href="`#${m.id}`"
                :class="['nav-link block text-base font-semibold text-neutral-800 py-2', { active: activeId === m.id }]"
                @click="open = false">{{ m.label }}</a>
            <a href="CV_ID_Atyla_Azfa_Al_Harits.pdf" download
                class="block text-center bg-brand-600 text-white font-bold text-sm px-5 py-3 rounded-full"
                @click="open = false">Download CV</a>
        </div>
    </header>
</template>