<script setup lang="ts">
import { ref, computed } from 'vue'

interface Project {
    name: string
    stack: string[]
    color: string
    desc: string
    image?: string
}

const svgUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
const rows = (n: number): number[] => [...Array(n).keys()]

function projectMockup(color: string, index: number): string {
    const c = color
    const frame =
        `<rect width="640" height="360" fill="#F4F3ED"/><rect width="640" height="34" fill="#fff"/>` +
        `<circle cx="18" cy="17" r="5" fill="#F87171"/><circle cx="36" cy="17" r="5" fill="#FBBF24"/><circle cx="54" cy="17" r="5" fill="#4ADE80"/>`

    const bodies = [
        `<rect y="34" width="110" height="326" fill="#0F172A"/><rect x="16" y="54" width="78" height="10" rx="5" fill="${c}"/><rect x="132" y="54" width="180" height="16" rx="6" fill="#0F172A" opacity=".8"/>` +
        [132, 288, 444]
            .map(
                (x) =>
                    `<rect x="${x}" y="86" width="140" height="80" rx="12" fill="#fff"/><rect x="${x + 14}" y="102" width="50" height="8" rx="4" fill="${c}"/>`,
            )
            .join('') +
        `<rect x="132" y="184" width="452" height="150" rx="12" fill="#fff"/><path d="M150 310L220 270L290 285L360 235L430 255L500 215L566 230" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`,

        `<rect x="40" y="60" width="560" height="36" rx="10" fill="${c}"/>` +
        rows(5)
            .map(
                (r) =>
                    `<rect x="40" y="${110 + r * 44}" width="560" height="36" rx="10" fill="#fff"/><rect x="56" y="${124 + r * 44}" width="120" height="8" rx="4" fill="#CBD5E1"/><rect x="480" y="${122 + r * 44}" width="100" height="12" rx="6" fill="${c}" opacity=".3"/>`,
            )
            .join(''),

        rows(4)
            .map(
                (k) =>
                    `<rect x="${40 + k * 146}" y="70" width="126" height="170" rx="12" fill="#fff"/><rect x="${52 + k * 146}" y="82" width="102" height="100" rx="8" fill="${c}" opacity="${0.25 + k * 0.2}"/><rect x="${52 + k * 146}" y="198" width="80" height="8" rx="4" fill="#0F172A" opacity=".7"/><rect x="${52 + k * 146}" y="214" width="56" height="8" rx="4" fill="#CBD5E1"/>`,
            )
            .join('') + `<rect x="40" y="264" width="560" height="60" rx="12" fill="#fff"/>`,

        `<rect x="40" y="60" width="330" height="270" rx="16" fill="#0F172A"/><circle cx="205" cy="170" r="56" fill="none" stroke="${c}" stroke-width="4" stroke-dasharray="10 8"/><circle cx="205" cy="160" r="24" fill="#475569"/><rect x="170" y="196" width="70" height="34" rx="17" fill="#475569"/><rect x="394" y="60" width="206" height="270" rx="16" fill="#fff"/>` +
        rows(4)
            .map(
                (r) =>
                    `<circle cx="420" cy="${96 + r * 58}" r="14" fill="${c}" opacity=".35"/><rect x="444" y="${88 + r * 58}" width="100" height="8" rx="4" fill="#0F172A" opacity=".7"/><rect x="444" y="${104 + r * 58}" width="66" height="8" rx="4" fill="#CBD5E1"/>`,
            )
            .join(''),
    ]

    const body = bodies[index % bodies.length]
    return svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">${frame}${body}</svg>`)
}

const allProjects: Project[] = [
    {
        name: 'SIMPUS (Sistem Informasi Puskesmas)',
        stack: ['Laravel', 'TailwindCSS', 'VueJS', 'PostgreSQL', 'Typst', 'Docker'],
        color: '#16A34A',
        image: '/projects/simpus.png',
        desc: 'Sistem pelayanan kesehatan terpadu Kota Tasikmalaya berarsitektur multi-tenant untuk layanan rawat jalan, rawat inap, UGD, serta operasional lintas klaster.',
    },
    {
        name: 'Perpustakaan Digital Sekolah',
        stack: ['Laravel', 'TailwindCSS', 'MySQL'],
        color: '#D97706',
        image: '/projects/perpus-digital.png',
        desc: 'Sistem pengelolaan peminjaman dan pengembalian buku fisik secara online dengan fitur membaca buku digital, notifikasi, serta integrasi Payment Gateway Tripay.',
    },
    {
        name: 'SIG Desa Kaputihan',
        stack: ['QGIS', 'Laravel', 'VueJS', 'TailwindCSS', 'InertiaJS', 'MySQL'],
        color: '#EF4444',
        image: '/projects/sig-kaputihan.png',
        desc: 'Sistem Informasi Geografis pemetaan batas wilayah desa/dusun/RT/RW, titik lokasi bangunan, survei statistik, serta jadwal kegiatan desa.',
    },
    {
        name: 'Absensi & Undian (Balai Kota)',
        stack: ['Laravel', 'TailwindCSS', 'VueJS', 'FaceAPIJS', 'PostgreSQL', 'Docker'],
        color: '#9333EA',
        image: '/projects/absensi-undian.png',
        desc: 'Sistem absensi berbasis geofencing dan face recognition untuk kegiatan Hari Kesehatan Nasional yang dilengkapi fitur pengundian kupon hadiah otomatis.',
    },
    {
        name: 'Personal Portfolio Web',
        stack: ['TypeScript', 'VueJS', 'TailwindCSS'],
        color: '#14B8A6',
        image: '/projects/portfolio.png',
        desc: 'Aplikasi portfolio berbasis web untuk mempresentasikan personal branding Software Developer Atyla Azfa Al Harits.',
    },
    {
        name: 'Yomu Japanese',
        stack: ['TypeScript', 'VueJS', 'TailwindCSS'],
        color: '#14B8A6',
        image: '/projects/yomu-japanese.png',
        desc: 'Aplikasi PWA pembelajaran bahasa Jepang (Hiragana, Katakana, kosakata, tata bahasa) yang mendukung fitur internasionalisasi/multi-bahasa (i18n).',
    },
    {
        name: 'Islamiku',
        stack: ['JavaScript', 'VueJS', 'TailwindCSS'],
        color: '#10B981',
        image: '/projects/islamiku.png',
        desc: 'Aplikasi Islami yang menyediakan Al-Qur\'an 114 surah dengan audio, Asmaul Husna, doa harian, dan niat shalat melalui konsumsi API eksternal.',
    },
    {
        name: 'Kaputihan Mart',
        stack: ['Laravel', 'MySQL'],
        color: '#F59E0B',
        image: '/projects/kaputihan-mart.png',
        desc: 'Platform belanja online produk UMKM lokal Desa Kaputihan yang terintegrasi dengan WhatsApp untuk memudahkan pembeli berkomunikasi dengan penjual.',
    },
    {
        name: 'SIMDOKU',
        stack: ['Laravel', 'Livewire', 'MySQL'],
        color: '#8B5CF6',
        image: '/projects/simdoku.png',
        desc: 'Sistem pengarsipan dan administrasi dokumen terpusat untuk pendataan beasiswa, pembuatan surat tugas, proposal, laporan, hingga pengajuan dana.',
    },
    {
        name: 'SISKOMDIG',
        stack: ['Laravel', 'MySQL'],
        color: '#3B82F6',
        image: '/projects/siskomdig.png',
        desc: 'Portal media informasi dan company profile bagi pelaku UMKM Desa Serang yang dilengkapi pengelolaan kegiatan komunitas, data mitra, dan portal berita.',
    },
    {
        name: 'SITUGAS MTs BPI Baturompe',
        stack: ['Laravel', 'Livewire', 'MySQL'],
        color: '#2563EB',
        image: '/projects/situgas.png',
        desc: 'Aplikasi pengelolaan modul ajar, absensi siswa, pembagian dan penilaian tugas, serta jadwal pelajaran untuk mendukung pembelajaran paperless.',
    },
    {
        name: 'SITAKO',
        stack: ['K3s', 'Docker', 'ExpressJS', 'TypeScript', 'VueJS', 'TailwindCSS', 'Flutter', 'PostgreSQL', 'Redis'],
        color: '#EC4899',
        image: '/projects/sitako.png',
        desc: 'Sistem perpustakaan multi-platform (web & mobile) berarsitektur standalone dan multi-replica yang dikembangkan dengan orkestasi K3s.',
    },
]

const showAll = ref(false)

const displayedProjects = computed(() => {
    return showAll.value ? allProjects : allProjects.slice(0, 4)
})

const toggleShowAll = () => {
    showAll.value = !showAll.value
}
</script>

<template>
    <section id="projects" class="py-20 bg-cream">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center max-w-2xl mx-auto mb-14">
                <span class="text-brand-700 font-bold text-xs uppercase tracking-widest">Karya nyata</span>
                <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 mb-4">Proyek pilihan</h2>
                <p class="text-neutral-600 text-sm sm:text-base font-medium">
                    Aplikasi yang saya bangun untuk kebutuhan nyata.
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <article v-for="(p, i) in displayedProjects" :key="p.name"
                    class="group bg-cream-card border border-neutral-200 rounded-3xl p-4 hover:border-brand-500/50 transition-all duration-300 cursor-pointer">
                    <div class="rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100">
                        <img :src="p.image || projectMockup(p.color, i)" :alt="`Tampilan aplikasi ${p.name}`"
                            class="w-full aspect-video object-cover scale-105 transition-transform duration-500 group-hover:scale-100"
                            loading="lazy" />
                    </div>
                    <div class="p-4 pt-6">
                        <h3 class="text-xl font-extrabold mb-3">{{ p.name }}</h3>
                        <p class="text-neutral-600 text-sm leading-relaxed font-medium mb-5">{{ p.desc }}</p>
                        <div class="flex flex-wrap gap-2">
                            <span v-for="t in p.stack" :key="t"
                                class="text-[11px] font-bold px-2.5 py-1 rounded-md bg-brand-100 text-brand-700">
                                {{ t }}
                            </span>
                        </div>
                    </div>
                </article>
            </div>

            <div class="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button @click="toggleShowAll"
                    class="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer">
                    {{ showAll ? 'Lihat lebih sedikit' : 'Lihat selengkapnya' }}
                </button>
            </div>
        </div>
    </section>
</template>