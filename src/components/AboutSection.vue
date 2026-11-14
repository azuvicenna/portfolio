<script setup lang="ts">
interface ProfileDetail {
    readonly label: string
    readonly value: string
}

interface WorkPrinciple {
    readonly title: string
    readonly description: string
}

const profileDetails: readonly ProfileDetail[] = [
    { label: 'Nama', value: 'Atyla Azfa Al Harits' },
    { label: 'Domisili', value: 'Ciamis, Jawa Barat' },
    { label: 'Pendidikan Terakhir', value: 'D3 Sistem Informasi — UBSI (IPK 3.94)' },
    { label: 'Pendidikan Aktif', value: 'S1 Sistem Informasi — UBSI' },
    { label: 'Bahasa', value: 'Indonesia (Aktif), Jepang (Pemula)' },
]

const workPrinciples: readonly WorkPrinciple[] = [
    {
        title: 'Berorientasi pada Solusi Operasional',
        description: 'Menerjemahkan alur kerja manual dan kebutuhan administrasi menjadi sistem informasi yang praktis digunakan.',
    },
    {
        title: 'Arsitektur Rapi & Mudah Dipelihara',
        description: 'Mengutamakan perancangan database relasional yang solid serta struktur kode dan templat yang reusable.',
    },
    {
        title: 'Adaptif & Kolaboratif',
        description: 'Terbiasa bekerja secara individu maupun berkolaborasi dalam tim dengan alur kerja Agile maupun SDLC terstruktur.',
    },
]
</script>

<template>
    <section id="about" class="py-20 bg-white border-t border-neutral-200/80">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="max-w-2xl mb-14">
                <span class="text-brand-700 font-bold text-xs uppercase tracking-widest">Tentang Saya</span>
                <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 mt-2 mb-4">
                    Latar belakang dan cara saya bekerja
                </h2>
                <p class="text-neutral-600 text-sm sm:text-base font-medium leading-relaxed">
                    Gambaran singkat mengenai perjalanan akademik, fokus pengembangan, serta pendekatan yang saya
                    terapkan dalam membangun perangkat lunak.
                </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
                <div class="lg:col-span-7 space-y-5 text-neutral-600 text-sm sm:text-base leading-relaxed font-medium">
                    <p>
                        Saya adalah <strong class="font-bold text-neutral-900">Software Developer</strong> lulusan D3
                        Sistem Informasi dari Universitas Bina Sarana Informatika dengan fokus utama pada pengembangan
                        <strong class="font-bold text-neutral-900">backend</strong>. Ketertarikan saya pada rekayasa
                        perangkat lunak dimulai sejak menempuh pendidikan kejuruan di bidang Rekayasa Perangkat Lunak
                        (RPL), yang kemudian membentuk cara pandang saya dalam merancang sistem yang terstruktur.
                    </p>
                    <p>
                        Dalam perjalanan praktisnya, saya banyak terlibat dalam pembangunan sistem informasi untuk
                        sektor layanan publik, pendidikan, hingga digitalisasi operasional usaha. Pengalaman magang di
                        instansi pemerintah daerah maupun perusahaan swasta melatih saya untuk memahami kebutuhan
                        pengguna secara langsung dan mengubah proses manual menjadi sistem terintegrasi yang andal.
                    </p>
                    <p>
                        Di luar aspek teknis penulisan kode, saya menaruh perhatian besar pada manajemen prioritas,
                        pemecahan masalah secara sistematis, dan kemampuan belajar mandiri untuk menyesuaikan diri
                        dengan kebutuhan proyek.
                    </p>

                    <div class="pt-6 border-t border-neutral-200/80">
                        <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-5">
                            Pendekatan Kerja
                        </h3>
                        <div class="space-y-4">
                            <div v-for="principle in workPrinciples" :key="principle.title"
                                class="flex items-start gap-3.5">
                                <span class="w-1.5 h-1.5 rounded-full bg-brand-600 mt-2 shrink-0"></span>
                                <div>
                                    <h4 class="text-sm font-bold text-neutral-900">{{ principle.title }}</h4>
                                    <p class="text-xs sm:text-sm text-neutral-600 mt-0.5 leading-relaxed">
                                        {{ principle.description }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <aside class="lg:col-span-5 bg-neutral-50 border border-neutral-200/90 rounded-2xl p-6 sm:p-7">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-5">
                        Informasi Singkat
                    </h3>
                    <dl class="divide-y divide-neutral-200/80">
                        <div v-for="detail in profileDetails" :key="detail.label"
                            class="py-3.5 first:pt-0 last:pb-0 flex flex-col gap-1">
                            <dt class="text-xs font-semibold text-neutral-500">{{ detail.label }}</dt>
                            <dd class="text-sm font-bold text-neutral-900">{{ detail.value }}</dd>
                        </div>
                    </dl>
                </aside>
            </div>
        </div>
    </section>
</template>