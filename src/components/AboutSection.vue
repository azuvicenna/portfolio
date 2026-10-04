<script setup lang="ts">
const points = ['Terbiasa membangun sistem informasi', 'Pengalaman di instansi pemerintah daerah', 'Terbuka untuk kolaborasi dan remote']
const does = ['Software Development', 'Machine Learning', 'DevOps', 'IT Infrastructure']
</script>

<template>
    <section id="about" class="py-20 bg-white border-t border-neutral-200/80">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center max-w-2xl mx-auto mb-14">
                <span class="text-brand-700 font-bold text-xs uppercase tracking-widest">Siapa saya</span>
                <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 mb-4">Mengenal saya lebih dekat</h2>
                <p class="text-neutral-600 text-sm sm:text-base font-medium">Latar belakang singkat dan cara saya
                    bekerja.</p>
            </div>
            <div
                class="max-w-4xl mx-auto bg-white border border-neutral-300 rounded-3xl shadow-soft-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
                <div class="md:col-span-5 bg-neutral-900 text-white p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                        <div
                            class="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-6">
                            <span class="w-2 h-2 rounded-full bg-amber-400"></span><span>Profil singkat</span>
                        </div>
                        <h3 class="text-2xl font-extrabold mb-2">Atyla Azfa Al Harits</h3>
                        <p class="text-neutral-400 text-xs sm:text-sm mb-8">Software Developer</p>
                        <ul class="space-y-4 text-sm font-medium text-neutral-300">
                            <li v-for="t in points" :key="t" class="flex items-center space-x-3">
                                <svg class="w-4 h-4 text-brand-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span>{{ t }}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="pt-8 mt-8 border-t border-neutral-800 text-xs text-neutral-500">Lokasi: <span
                            class="text-white font-bold">Ciamis, Indonesia</span></div>
                </div>
                <div class="md:col-span-7 p-6 sm:p-8 bg-white flex flex-col justify-between">
                    <div>
                        <h4 class="font-extrabold text-base mb-4">Sedikit tentang saya</h4>
                        <p class="text-neutral-600 text-sm leading-relaxed font-medium mb-6">Software Developer dengan
                            pengalaman praktis dalam membangun dan memelihara aplikasi web menggunakan PHP,
                            Laravel, TypeScript, dan Vue.js. Berfokus pada pengembangan backend, perancangan database
                            relasional, serta
                            pengembangan aplikasi secara remote menggunakan Git dan Kanban.</p>
                        <p class="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Yang Sedang Saya
                            Pelajari</p>
                        <div class="grid grid-cols-2 gap-2.5 mb-6">
                            <div v-for="t in does" :key="t"
                                class="border border-neutral-200 text-neutral-800 text-xs font-bold p-3 rounded-xl text-center">
                                {{ t }}</div>
                        </div>
                    </div>
                    <a href="#contact"
                        class="w-full text-center bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm py-3.5 rounded-xl shadow transition">Hubungi
                        saya</a>
                </div>
            </div>
        </div>
    </section>
</template>