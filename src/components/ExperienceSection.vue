<script setup lang="ts">
const education = [
    { logo: '/logo/universitas-bsi.png', badge: '2023 - Sekarang', title: 'Sistem Informasi (S1)', org: 'Universitas Bina Sarana Informatika', points: ['Terlibat proyek pengabdian masyarakat (mandiri & hibah pemerintah).', 'Membangun aplikasi mobile dengan Flutter.', 'Mengerjakan proyek machine learning menggunakan Python.'] },
    { logo: '/logo/smkn3banjar.png', badge: '2020 - 2023', title: 'Rekayasa Perangkat Lunak (RPL)', org: 'SMK Negeri 3 Banjar', points: ['Membangun proyek menggunakan PHP & framework Laravel.', 'Merancang struktur database SQL kuat (MySQL).'] },
]
const work = [
    { logo: '/logo/diskominfo-kota-tasikmalaya.png', title: 'Software Developer', date: 'Sep 2025 - Des 2025', org: 'Diskominfo Kota Tasikmalaya', points: ['Pengembangan dan pemeliharaan aplikasi SIMPUS (Sistem Informasi Puskesmas).', 'Melakukan riset mandiri untuk memetakan alur data kesehatan kompleks menjadi skema database yang efisien.', 'Bekerja remote dengan sistem kolaborasi Git dan Kanban board.'] },
    { logo: '/logo/mutiara-digital-printing.jpe', title: 'Siswa Magang', date: 'Feb 2022 - Apr 2022', org: 'Mutiara Digital Printing Kota Banjar', points: ['Asisten teknikal karyawan di bidang percetakan banner/spanduk.', 'Membangun aplikasi toko percetakan online berbasis web dengan CodeIgniter 4.'] },
]
const bulletsClass = 'mt-4 list-disc pl-4 marker:text-neutral-400 space-y-2 text-sm text-neutral-600 font-medium leading-relaxed'
const logoClass = 'w-12 h-12 shrink-0 rounded-lg object-contain bg-white border border-neutral-200'
</script>

<template>
    <section id="experience" class="py-20 bg-white border-t border-neutral-200/80">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-16">
            <div>
                <h2 class="flex items-center gap-4 text-2xl sm:text-3xl font-extrabold tracking-tight mb-10"><svg
                        class="w-8 h-8 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8"
                        stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                        <path
                            d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
                        <path d="M22 10v6" />
                        <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
                    </svg>Riwayat Pendidikan</h2>
                <div class="border-l border-neutral-300 ml-2.5 space-y-10">
                    <div v-for="(e, i) in education" :key="e.title" class="relative flex gap-4 pl-8">
                        <span
                            :class="['absolute -left-2.25 top-1.5 w-4.25 h-4.25 rounded-full border-2 bg-white', i === 0 ? 'border-neutral-900' : 'border-neutral-300']"></span>
                        <img :src="e.logo" alt="" :class="logoClass" />
                        <div class="min-w-0">
                            <span
                                class="inline-block text-xs font-bold bg-neutral-100 border border-neutral-200 text-neutral-700 rounded-full px-3 py-1 mb-2">{{
                                    e.badge }}</span>
                            <h3 class="text-xl font-extrabold leading-snug">{{ e.title }}</h3>
                            <p class="text-neutral-500 font-medium">{{ e.org }}</p>
                            <ul :class="bulletsClass">
                                <li v-for="p in e.points" :key="p">{{ p }}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h2 class="flex items-center gap-4 text-2xl sm:text-3xl font-extrabold tracking-tight mb-10"><svg
                        class="w-8 h-8 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8"
                        stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                        <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        <rect width="20" height="14" x="2" y="6" rx="2" />
                    </svg>Pengalaman Kerja</h2>
                <div class="space-y-6">
                    <article v-for="w in work" :key="w.title"
                        class="flex gap-4 bg-white border border-neutral-300 rounded-2xl p-6 hover:border-brand-500/50 transition">
                        <img :src="w.logo" alt="" :class="logoClass" />
                        <div class="min-w-0 flex-1">
                            <div class="flex flex-wrap items-start justify-between gap-x-4">
                                <h3 class="text-xl font-extrabold leading-snug">{{ w.title }}</h3>
                                <span class="text-sm text-neutral-500 font-medium pt-1">{{ w.date }}</span>
                            </div>
                            <p class="text-neutral-500 font-medium">{{ w.org }}</p>
                            <ul :class="bulletsClass">
                                <li v-for="p in w.points" :key="p">{{ p }}</li>
                            </ul>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    </section>
</template>