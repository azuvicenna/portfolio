<script setup lang="ts">
const svgUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`

const rows = (n: number): number[] => [...Array(n).keys()]

/** Mockup screenshot aplikasi (placeholder) berupa SVG. `index` memilih salah satu dari 4 layout. */
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

const projects = [
    { name: 'SIMPUS (Sistem Informasi Puskesmas)', stack: ['Laravel', 'VueJS', 'PostgreSQL', 'Docker'], color: '#16A34A', desc: 'Duis aute irure reprehenderit in voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat.' },
    { name: 'SITUGAS MTs BPI Baturompe', stack: ['Laravel', 'MySQL', 'Livewire'], color: '#2563EB', desc: 'Cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum lorem ipsum dolor.' },
    { name: 'Perpustakaan Digital', stack: ['Laravel', 'TailwindCSS', 'MySQL'], color: '#D97706', desc: 'Sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { name: 'Absensi & Undian (Balai Kota)', stack: ['Laravel', 'MySQL', 'FaceAPI.JS', 'Docker'], color: '#9333EA', desc: 'Enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis.' },
]
</script>

<template>
    <section id="projects" class="py-20 bg-cream">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center max-w-2xl mx-auto mb-14">
                <span class="text-brand-700 font-bold text-xs uppercase tracking-widest">Karya nyata</span>
                <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 mb-4">Proyek pilihan</h2>
                <p class="text-neutral-600 text-sm sm:text-base font-medium">Aplikasi yang saya bangun untuk kebutuhan
                    nyata.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <article v-for="(p, i) in projects" :key="p.name"
                    class="bg-cream-card border border-neutral-200 rounded-3xl p-4 hover:border-brand-500/50 transition-all duration-300">
                    <img :src="projectMockup(p.color, i)" :alt="`Tampilan aplikasi ${p.name}`"
                        class="w-full aspect-video object-cover rounded-2xl border border-neutral-200" loading="lazy" />
                    <div class="p-4 pt-6">
                        <h3 class="text-xl font-extrabold mb-3">{{ p.name }}</h3>
                        <p class="text-neutral-600 text-sm leading-relaxed font-medium mb-5">{{ p.desc }}</p>
                        <div class="flex flex-wrap gap-2">
                            <span v-for="t in p.stack" :key="t"
                                class="text-[11px] font-bold px-2.5 py-1 rounded-md bg-brand-100 text-brand-700">{{ t
                                }}</span>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    </section>
</template>