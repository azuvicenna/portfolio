<script setup lang="ts">
const certs = [
    { name: 'Sertifikat Pengalaman Kerja - Diskominfo Kota Tasikmalaya', date: 'Nov 2025', id: '400.14.5.4/054/KOMINFO/2025', tag: 'SQL', image: '/certifications/sertifikat-magang-diskominfo.jpe' },
    { name: 'Pemrograman TypeScript untuk Pemula sampai Mahir - Programmer Zaman Now', date: 'Okt 2025', id: 'cert_wmjt1cyk', tag: 'TypeScript', image: '/certifications/pzn-typescript.jpe' },
    { name: 'Database Design and Database Programming with SQL - Digital Talent Scholarship', date: 'Feb 2024', id: '2007340840-230/TSA/BLSDM.Kominfo/2024', tag: 'SQL', image: '/certifications/digitalent-sql.jpe' },
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
                    <img :src="c.image" :alt="`Sertifikat ${c.name}`"
                        class="w-full aspect-10/7 object-cover rounded-2xl border border-neutral-200 cursor-pointer"
                        loading="lazy" />
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