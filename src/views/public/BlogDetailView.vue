<script setup>
import { watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { api } from '@/utils/api';
import { marked } from 'marked';
import { Loader2, AlertTriangle } from 'lucide-vue-next';

const route = useRoute();
const slug = route.params.slug;

const { data: blog, isLoading, isError } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
        const res = await api(`/blogs/${slug}`);
        return res.data || res;
    },
    retry: 1
});

watch(blog, (newBlog) => {
    if (newBlog?.title) {
        document.title = `${newBlog.title} - My Portfolio`;
    }
});

onMounted(() => {
    window.scrollTo(0, 0);
});
</script>

<template>
    <div class="blog-detail-container">

        <div v-if="isLoading" class="state-container">
            <Loader2 class="animate-spin text-orange-400 mb-2" :size="40" />
            <p>Memuat artikel...</p>
        </div>

        <div v-else-if="isError" class="state-container text-red-500">
            <AlertTriangle :size="40" class="mb-2" />
            <p class="font-bold">Terjadi Kesalahan</p>
            <p class="text-sm">{{ error.message || 'Gagal mengambil data' }}</p>
        </div>

        <div v-else-if="!blog" class="state-container text-gray-400">
            <FileX :size="40" class="mb-2" />
            <p>Artikel tidak ditemukan.</p>
        </div>

        <div v-else class="article-wrapper animate-fade-in">
            <div v-if="blog.cover_image" class="cover-container">
                <img :src="blog.cover_image" class="cover-image" alt="Cover" />
            </div>

            <div class="article-header">
                <h1 class="title">{{ blog.title }}</h1>
                <div class="meta">
                    <span>{{ blog.published_at }}</span>
                    <span class="dot">•</span>
                    <span>{{ blog.views || 0 }} Views</span>
                    <span class="dot">•</span>
                    <span class="lang-badge">{{ blog.language }}</span>
                </div>

                <div v-if="blog.tags && blog.tags.length > 0" class="tags-container">
                    <span v-for="tag in blog.tags" :key="tag" class="tag">#{{ tag }}</span>
                </div>
            </div>

            <div class="prose" v-html="marked.parse(blog.content || '')"></div>
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

.cover-container {
    width: 100%;
    height: 350px;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 30px;
    background-color: #f3f4f6;
}

.cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.title {
    font-size: 36px;
    font-weight: 800;
    color: var(--text-dark);
    margin-bottom: 15px;
    line-height: 1.3;
}

.meta {
    font-size: 14px;
    color: #888;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 5px;
}

.dot {
    margin: 0 5px;
}

.lang-badge {
    background: #eee;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 600;
    font-size: 12px;
    color: #555;
}

.tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 40px;
}

.tag {
    font-size: 13px;
    color: var(--text-orange);
    background-color: #fff7ed;
    padding: 4px 10px;
    border-radius: 20px;
    font-weight: 500;
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