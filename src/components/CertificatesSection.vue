<script setup lang="ts">
import { useImageModal } from '../composables/useImageModal'

const { openModal } = useImageModal()

const certs = [
    {
        name: 'Pemrograman Dart untuk Pemula sampai Mahir - Programmer Zaman Now',
        date: 'Okt 2026',
        id: 'PZN-course-dart-3660-1791030600',
        tag: 'Dart',
        image: '/certifications/pzn-dart.png',
    },
    {
        name: 'Pemrograman Go-Lang untuk Pemula sampai Mahir - Programmer Zaman Now',
        date: 'Okt 2026',
        id: 'UC-d94c2bdc-615f-4be2-8d97-ea45a6928037',
        tag: 'Go',
        image: '/certifications/pzn-go.png',
    },
    {
        name: 'Pemrograman TypeScript untuk Pemula sampai Mahir - Programmer Zaman Now',
        date: 'Okt 2025',
        id: 'cert_wmjt1cyk',
        tag: 'TypeScript',
        image: '/certifications/pzn-typescript.png',
    },
    {
        name: 'Sertifikat Pengalaman Kerja - Diskominfo Kota Tasikmalaya',
        date: 'Nov 2025',
        id: '400.14.5.4/054/KOMINFO/2025',
        tag: 'SQL',
        image: '/certifications/sertifikat-diskominfo.png',
    },
    {
        name: 'Database Design and Database Programming with SQL - Digital Talent Scholarship',
        date: 'Feb 2024',
        id: '2007340840-230/TSA/BLSDM.Kominfo/2024',
        tag: 'SQL',
        image: '/certifications/digitalent-sql.png',
    },
    {
        name: 'Sertifikat Anggota Resmi IMPHNEN',
        date: 'Nov 2026',
        id: '@azfa_alharits',
        tag: 'Member IMPHNEN',
        image: '/certifications/sertifikat-imphnen.png',
    },
]
</script>

<template>
    <section id="certificates" class="py-20 bg-white border-t border-neutral-200/80">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center max-w-2xl mx-auto mb-14">
                <span class="text-brand-700 font-bold text-xs uppercase tracking-widest">Bukti kompetensi</span>
                <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 mb-4">Sertifikat</h2>
                <p class="text-neutral-600 text-sm sm:text-base font-medium">Sertifikat resmi yang saya peroleh.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <article v-for="c in certs" :key="c.id"
                    class="bg-white border border-neutral-200 rounded-3xl p-4 shadow-sm hover:border-brand-500/50 transition-all duration-300 flex flex-col">
                    <div class="relative group/img cursor-zoom-in rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100"
                        @click="openModal(c.image, c.name, `Credential ID: ${c.id} • Diterbitkan ${c.date}`)">
                        <img :src="c.image" :alt="`Sertifikat ${c.name}`"
                            class="w-full aspect-10/7 object-cover group-hover/img:scale-105 transition-transform duration-500"
                            loading="lazy" />
                        <div class="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-neutral-800 text-xs font-bold shadow-md backdrop-blur">
                                <svg class="w-3.5 h-3.5 text-neutral-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                                </svg>
                                Perbesar
                            </span>
                        </div>
                    </div>
                    <div class="p-4 pt-6 flex-1 flex flex-col">
                        <h3 class="text-base font-extrabold leading-snug mb-3">{{ c.name }}</h3>
                        <p class="text-xs font-medium text-neutral-500 mb-1">Diterbitkan {{ c.date }}</p>
                        <p class="text-xs font-medium text-neutral-500 break-all mb-4">Credential ID {{ c.id }}</p>
                        <div class="mt-auto"><span
                                class="text-[11px] font-bold px-2.5 py-1 rounded-md bg-brand-100 text-brand-700">{{
                                    c.tag }}</span></div>
                    </div>
                </article>
            </div>
        </div>
    </section>
</template>