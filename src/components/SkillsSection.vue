<script setup lang="ts">
interface SkillItem {
    readonly name: string
    readonly icon: string
}

interface SkillTile {
    readonly title: string
    readonly spanClass: string
    readonly gridClass: string
    readonly items: readonly SkillItem[]
}

const tiles: readonly SkillTile[] = [
    {
        title: 'Bahasa pemrograman',
        spanClass: 'lg:col-span-1',
        gridClass: 'grid-cols-2',
        items: [
            { name: 'PHP', icon: 'php' },
            { name: 'Dart', icon: 'dart' },
            { name: 'TypeScript', icon: 'typescript' },
            { name: 'Go', icon: 'go' },
        ],
    },
    {
        title: 'Framework & library',
        spanClass: 'lg:col-span-2',
        gridClass: 'grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4',
        items: [
            { name: 'Laravel', icon: 'laravel' },
            { name: 'Vue.js', icon: 'vue' },
            { name: 'Flutter', icon: 'flutter' },
            { name: 'Express.js', icon: 'expressjs' },
        ],
    },
    {
        title: 'Tools, infrastruktur & IDE',
        spanClass: 'lg:col-span-2',
        gridClass: 'grid-cols-3 lg:grid-cols-6',
        items: [
            { name: 'Docker', icon: 'docker' },
            { name: 'Git/GitHub', icon: 'github' },
            { name: 'Jenkins', icon: 'jenkins' },
            { name: 'VS Code', icon: 'vscode' },
            { name: 'Antigravity', icon: 'antigravity' },
            { name: 'Windows', icon: 'windows' },
        ],
    },
    {
        title: 'Database',
        spanClass: 'lg:col-span-1',
        gridClass: 'grid-cols-3',
        items: [
            { name: 'MySQL', icon: 'mysql' },
            { name: 'PostgreSQL', icon: 'postgresql' },
            { name: 'Redis', icon: 'redis' },
        ],
    },
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

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div v-for="tile in tiles" :key="tile.title" :class="[
                    tile.spanClass,
                    'bg-white border border-neutral-200 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-brand-500/50 transition-all duration-300',
                ]">
                    <h3 class="text-sm font-extrabold text-neutral-700 mb-6">{{ tile.title }}</h3>
                    <div :class="['grid gap-4 my-auto items-center justify-items-center', tile.gridClass]">
                        <div v-for="item in tile.items" :key="item.icon"
                            class="group flex flex-col items-center gap-2 text-center">
                            <span
                                class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-neutral-50/70 border border-neutral-200/90 shadow-xs flex items-center justify-center group-hover:bg-white group-hover:border-brand-500/40 group-hover:-translate-y-0.5 transition-all duration-200">
                                <img :src="`/icons/${item.icon}.svg`" :alt="item.name" class="w-8 h-8 shrink-0" />
                            </span>
                            <span class="text-xs font-bold text-neutral-800">{{ item.name }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>