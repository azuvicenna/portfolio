<script setup>
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { api } from '@/utils/api';
import { marked } from 'marked';
import {
    Loader2,
    AlertTriangle,
    FileX,
    ExternalLink,
    Github,
    Calendar
} from 'lucide-vue-next';

const route = useRoute();
const slug = route.params.slug;

const { data: project, isLoading, isError, error } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => api(`/projects/${slug}`),
    retry: 1
});

watch(project, (newProject) => {
    if (newProject && newProject.title) {
        document.title = `${newProject.title} - My Portfolio`;
    }
});
</script>

<template>
    <div class="project-detail-container">

        <div v-if="isLoading" class="state-container">
            <Loader2 class="animate-spin text-orange-400 mb-2" :size="40" />
            <p>Memuat project...</p>
        </div>

        <div v-else-if="isError" class="state-container text-red-500">
            <AlertTriangle :size="40" class="mb-2" />
            <p class="font-bold">Terjadi Kesalahan</p>
            <p class="text-sm">{{ error.message || 'Gagal mengambil data' }}</p>
        </div>

        <div v-else-if="!project" class="state-container text-gray-400">
            <FileX :size="40" class="mb-2" />
            <p>Project tidak ditemukan.</p>
        </div>

        <div v-else class="project-wrapper animate-fade-in">

            <div v-if="project.image_url" class="hero-image-container">
                <img :src="project.image_url" class="hero-image" :alt="project.title" />
            </div>

            <div class="project-header">
                <div class="header-top">
                    <span class="category-badge">{{ project.category }}</span>
                    <span class="date-badge">
                        <Calendar :size="14" class="mr-1" />
                        {{ project.created_at }}
                    </span>
                </div>

                <h1 class="title">{{ project.title }}</h1>
                <p class="summary">{{ project.summary }}</p>

                <div v-if="project.tools && project.tools.length" class="tools-container">
                    <span v-for="tool in project.tools" :key="tool" class="tool-tag">
                        {{ tool }}
                    </span>
                </div>

                <div class="actions-container">
                    <a v-if="project.demo_url" :href="project.demo_url" target="_blank" class="btn btn-primary">
                        <ExternalLink :size="18" /> Live Demo
                    </a>

                    <a v-if="project.repo_url" :href="project.repo_url" target="_blank" class="btn btn-secondary">
                        <Github :size="18" /> Repository
                    </a>
                </div>
            </div>

            <hr class="divider" />

            <div class="prose" v-html="marked.parse(project.content || '')"></div>

        </div>

    </div>
</template>

<style scoped>
.state-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    text-align: center;
    color: #888;
}

.animate-fade-in {
    animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.hero-image-container {
    width: 100%;
    height: 400px;
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 30px;
    background-color: #f3f4f6;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.hero-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.project-header {
    margin-bottom: 30px;
}

.header-top {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
}

.category-badge {
    background-color: var(--text-orange);
    color: white;
    font-size: 12px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.date-badge {
    display: flex;
    align-items: center;
    font-size: 13px;
    color: #888;
}

.title {
    font-size: 32px;
    font-weight: 800;
    color: var(--text-dark);
    margin-bottom: 10px;
    line-height: 1.2;
}

.summary {
    font-size: 16px;
    color: var(--text-gray);
    line-height: 1.6;
    margin-bottom: 20px;
}

.tools-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 25px;
}

.tool-tag {
    font-size: 13px;
    color: var(--text-dark);
    background-color: #f3f4f6;
    padding: 4px 12px;
    border-radius: 20px;
    font-weight: 500;
    border: 1px solid #e5e7eb;
}

.actions-container {
    display: flex;
    gap: 15px;
}

.btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s;
}

.btn-primary {
    background-color: var(--text-orange);
    color: white;
    border: 1px solid var(--text-orange);
}

.btn-primary:hover {
    background-color: #ea580c;
    border-color: #ea580c;
}

.btn-secondary {
    background-color: white;
    color: var(--text-dark);
    border: 1px solid #ddd;
}

.btn-secondary:hover {
    background-color: #f9fafb;
    border-color: #bbb;
}

.divider {
    border: 0;
    border-top: 1px solid #eee;
    margin: 30px 0;
}

:deep(.prose) {
    color: #333;
    line-height: 1.8;
    font-size: 16px;
}

:deep(.prose h2) {
    font-size: 24px;
    font-weight: 700;
    margin-top: 40px;
    margin-bottom: 15px;
    color: #111;
}

:deep(.prose h3) {
    font-size: 20px;
    font-weight: 600;
    margin-top: 30px;
    margin-bottom: 10px;
    color: #222;
}

:deep(.prose p) {
    margin-bottom: 20px;
}

:deep(.prose ul),
:deep(.prose ol) {
    margin-bottom: 20px;
    padding-left: 20px;
}

:deep(.prose li) {
    margin-bottom: 8px;
}

:deep(.prose ul) {
    list-style: disc;
}

:deep(.prose ol) {
    list-style: decimal;
}

:deep(.prose a) {
    color: var(--text-orange);
    text-decoration: underline;
}

:deep(.prose code) {
    background: #f3f4f6;
    padding: 2px 5px;
    border-radius: 4px;
    font-family: monospace;
    color: #e11d48;
    font-size: 0.9em;
}

:deep(.prose pre) {
    background: #1e293b;
    padding: 20px;
    border-radius: 8px;
    overflow-x: auto;
    margin-bottom: 25px;
}

:deep(.prose pre code) {
    background: transparent;
    color: #e2e8f0;
    padding: 0;
}

:deep(.prose img) {
    max-width: 100%;
    border-radius: 8px;
    margin: 20px 0;
}

:deep(.prose blockquote) {
    border-left: 4px solid var(--text-orange);
    padding-left: 20px;
    font-style: italic;
    color: #555;
    margin: 20px 0;
}
</style>