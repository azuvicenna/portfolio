<script setup lang="ts">
type Tech = [name: string, icon: string]
interface Tile { title: string; span: string; big?: boolean; items: Tech[] }

const tiles: Tile[] = [
    {
        title: 'Bahasa pemrograman',
        span: 'lg:col-span-1',
        big: true,
        items: [['PHP', 'php'], ['Dart', 'dart'], ['TypeScript', 'typescript']]
    },
    {
        title: 'Framework & library',
        span: 'lg:col-span-2',
        items: [['Laravel', 'laravel'], ['Vue.js', 'vue'], ['Flutter', 'flutter'], ['ExpressJS', 'expressjs']]
    },
    {
        title: 'Database',
        span: 'lg:col-span-1',
        items: [['MySQL', 'mysql'], ['PostgreSQL', 'postgresql'], ['Redis', 'redis']]
    },
    {
        title: 'Tools & infrastructure',
        span: 'lg:col-span-1',
        items: [['Docker', 'docker'], ['Git/GitHub', 'github'], ['Cloudflare', 'cloudflare'], ['Jenkins', 'jenkins']]
    },
    {
        title: 'IDE & sistem operasi',
        span: 'lg:col-span-1',
        items: [['VS Code', 'vscode'], ['Antigravity', 'antigravity'], ['Windows', 'windows']]
    },
]

const languages = [
    { name: 'Bahasa Jepang', flag: 'jp', level: 'Tingkat Dasar', score: 2 },
    { name: 'Bahasa Inggris', flag: 'uk', level: 'Tingkat Dasar', score: 2 },
]
</script>

<template>
    <section id="skills" class="py-20 bg-cream">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center max-w-2xl mx-auto mb-14">
                <span class="text-brand-700 font-bold text-xs uppercase tracking-widest">Alat kerja</span>
                <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 mb-4">
                    Keahlian teknis &amp; bahasa
                </h2>
                <p class="text-neutral-600 text-sm sm:text-base font-medium">
                    Teknologi yang saya pakai sehari-hari dan bahasa yang sedang diperdalam.
                </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                <div
                    class="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-brand-500/50 transition-all duration-300">
                    <h3 class="text-sm font-extrabold text-neutral-700 mb-5">{{ tiles[0].title }}</h3>
                    <div class="grid grid-cols-3 gap-3 my-auto items-center justify-items-center">
                        <div v-for="[name, key] in tiles[0].items" :key="key"
                            class="flex flex-col items-center gap-2 text-center">
                            <span
                                class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-neutral-200 shadow-sm flex items-center justify-center">
                                <img :src="`/icons/${key}.svg`" :alt="name" class="w-8 h-8 shrink-0" />
                            </span>
                            <span class="text-xs font-bold text-neutral-800">{{ name }}</span>
                        </div>
                    </div>
                </div>

                <div
                    class="sm:col-span-2 lg:col-span-2 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-brand-500/50 transition-all duration-300">
                    <h3 class="text-sm font-extrabold text-neutral-700 mb-5">{{ tiles[1].title }}</h3>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 my-auto items-center justify-items-center">
                        <div v-for="[name, key] in tiles[1].items" :key="key"
                            class="flex flex-col items-center gap-2 text-center">
                            <span
                                class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-neutral-200 shadow-sm flex items-center justify-center">
                                <img :src="`/icons/${key}.svg`" :alt="name" class="w-8 h-8 shrink-0" />
                            </span>
                            <span class="text-xs font-bold text-neutral-800">{{ name }}</span>
                        </div>
                    </div>
                </div>

                <div
                    class="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-brand-500/50 transition-all duration-300">
                    <h3 class="text-sm font-extrabold text-neutral-700 mb-5">{{ tiles[2].title }}</h3>
                    <div class="grid grid-cols-3 gap-3 my-auto items-center justify-items-center">
                        <div v-for="[name, key] in tiles[2].items" :key="key"
                            class="flex flex-col items-center gap-2 text-center">
                            <span
                                class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-neutral-200 shadow-sm flex items-center justify-center">
                                <img :src="`/icons/${key}.svg`" :alt="name" class="w-8 h-8 shrink-0" />
                            </span>
                            <span class="text-xs font-bold text-neutral-800">{{ name }}</span>
                        </div>
                    </div>
                </div>

                <div
                    class="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-brand-500/50 transition-all duration-300">
                    <h3 class="text-sm font-extrabold text-neutral-700 mb-5">{{ tiles[3].title }}</h3>
                    <div
                        class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 my-auto items-center justify-items-center">
                        <div v-for="[name, key] in tiles[3].items" :key="key"
                            class="flex flex-col items-center gap-2 text-center">
                            <span
                                class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-neutral-200 shadow-sm flex items-center justify-center">
                                <img :src="`/icons/${key}.svg`" :alt="name" class="w-8 h-8 shrink-0" />
                            </span>
                            <span class="text-xs font-bold text-neutral-800">{{ name }}</span>
                        </div>
                    </div>
                </div>

                <div
                    class="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-brand-500/50 transition-all duration-300">
                    <h3 class="text-sm font-extrabold text-neutral-700 mb-5">{{ tiles[4].title }}</h3>
                    <div class="grid grid-cols-3 gap-3 my-auto items-center justify-items-center">
                        <div v-for="[name, key] in tiles[4].items" :key="key"
                            class="flex flex-col items-center gap-2 text-center">
                            <span
                                class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-neutral-200 shadow-sm flex items-center justify-center">
                                <img :src="`/icons/${key}.svg`" :alt="name" class="w-8 h-8 shrink-0" />
                            </span>
                            <span class="text-xs font-bold text-neutral-800">{{ name }}</span>
                        </div>
                    </div>
                </div>

                <div
                    class="sm:col-span-2 lg:col-span-3 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-brand-500/50 transition-all duration-300">
                    <h3 class="text-sm font-extrabold text-neutral-700 mb-5">Bahasa</h3>
                    <div class="grid sm:grid-cols-2 gap-6 my-auto">
                        <div v-for="l in languages" :key="l.name"
                            class="flex items-center gap-4 justify-center sm:justify-start">
                            <span class="w-12 h-12 shrink-0 rounded-full overflow-hidden ring-1 ring-neutral-200">
                                <svg v-if="l.flag === 'jp'" viewBox="0 0 40 40" class="w-full h-full">
                                    <circle cx="20" cy="20" r="20" fill="#fff" />
                                    <circle cx="20" cy="20" r="8" fill="#BC002D" />
                                </svg>
                                <svg v-else viewBox="0 0 40 40" class="w-full h-full">
                                    <defs>
                                        <clipPath id="ukc">
                                            <circle cx="20" cy="20" r="20" />
                                        </clipPath>
                                    </defs>
                                    <g clip-path="url(#ukc)">
                                        <rect width="40" height="40" fill="#012169" />
                                        <path d="M0 0L40 40M40 0L0 40" stroke="#fff" stroke-width="7" />
                                        <path d="M0 0L40 40M40 0L0 40" stroke="#C8102E" stroke-width="3" />
                                        <path d="M20 0V40M0 20H40" stroke="#fff" stroke-width="11" />
                                        <path d="M20 0V40M0 20H40" stroke="#C8102E" stroke-width="6" />
                                    </g>
                                </svg>
                            </span>
                            <div>
                                <p class="font-extrabold text-sm">{{ l.name }}</p>
                                <p class="text-xs text-neutral-500 font-medium mb-2">{{ l.level }}</p>
                                <div class="flex gap-1">
                                    <span v-for="s in 5" :key="s"
                                        :class="['h-1.5 w-6 rounded-full', s <= l.score ? 'bg-brand-500' : 'bg-neutral-200']"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
</template>