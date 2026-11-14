<script setup lang="ts">
interface SocialLink {
    readonly name: string
    readonly icon: string
    readonly href: string
}

const year: number = new Date().getFullYear()

const socialLinks: readonly SocialLink[] = [
    { name: 'GitHub', icon: 'github', href: 'https://github.com/azuvicenna' },
    { name: 'Kaggle', icon: 'kaggle', href: 'https://www.kaggle.com/atylaaalharits' },
    { name: 'Hugging Face', icon: 'huggingface', href: 'https://huggingface.co/azuvicenna' },
]
</script>

<template>
    <footer class="bg-cream py-6 text-xs text-neutral-500 font-medium">
        <div
            class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p class="text-gray-400">&copy; {{ year }} - Atyla Azfa Al Harits</p>

            <div class="flex items-center gap-4">
                <a v-for="link in socialLinks" :key="link.icon" :href="link.href" :aria-label="link.name"
                    :title="link.name" target="_blank" rel="noopener noreferrer"
                    class="inline-flex items-center justify-center">
                    <img :src="`/icons/${link.icon}.svg`" :alt="link.name" class="w-4 h-4 shrink-0 object-contain" />
                </a>
            </div>
        </div>
    </footer>
</template>