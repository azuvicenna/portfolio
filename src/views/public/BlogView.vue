<script setup>
import { ref, computed } from 'vue';
import { useQuery, keepPreviousData } from '@tanstack/vue-query';
import { apiWithMeta } from '@/utils/api';
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';

const page = ref(1);
const limit = 6;

const { data: apiResponse, isLoading, isError } = useQuery({
    queryKey: ['blogs', page],
    queryFn: () => apiWithMeta(`/blogs?page=${page.value}&limit=${limit}`),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
});

const blogs = computed(() => {
    const res = apiResponse.value;
    if (Array.isArray(res)) return res;
    if (res?.data && Array.isArray(res.data)) return res.data;
    return [];
});

const meta = computed(() => {
    return apiResponse.value?.pagination || { total_pages: 1 };
});

const nextPage = () => {
    if (meta.value && page.value < meta.value.total_pages) {
        page.value++;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

const prevPage = () => {
    if (page.value > 1) {
        page.value--;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};
</script>

<template>
    <div class="blog-list-container">

        <div v-if="isLoading" class="state-container">
            <Loader2 class="animate-spin" :size="32" color="#FB923C" />
            <p>Loading articles...</p>
        </div>

        <div v-else-if="isError" class="state-container">
            <AlertCircle :size="32" class="text-red-500 mb-2" />
            <p>Gagal memuat artikel.</p>
        </div>

        <div v-else>
            <div class="blog-list">
                <RouterLink v-for="blog in blogs" :key="blog.id" :to="`/blogs/${blog.slug}`" class="blog-item">
                    <div class="blog-avatar">{{ blog.language || 'ID' }}</div>
                    <div class="blog-content">
                        <h3 class="blog-title">{{ blog.title }}</h3>
                        <span class="blog-date">{{ blog.published_at }}</span>
                    </div>
                </RouterLink>
            </div>

            <div class="pagination-controls" v-if="meta.total_pages > 1">

                <button @click="prevPage" :disabled="page === 1" class="btn-page">
                    <ChevronLeft :size="20" />
                    Prev
                </button>

                <span class="page-info">
                    Page <b>{{ page }}</b> of {{ meta.total_pages }}
                </span>

                <button @click="nextPage" :disabled="page >= meta.total_pages" class="btn-page">
                    Next
                    <ChevronRight :size="20" />
                </button>

            </div>

        </div>

    </div>
</template>

<style scoped>
.blog-list {
    margin-top: 40px;
}

.blog-item {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 15px;
    text-decoration: none;
    transition: background-color 0.3s ease;
}

.blog-item:hover {
    background-color: #f5f0e8;
}

.blog-avatar {
    flex-shrink: 0;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 18px;
    color: var(--text-dark);
}

.blog-title {
    font-size: 17px;
    font-weight: 500;
    color: var(--text-dark);
    margin-bottom: 4px;
}

.blog-date {
    font-size: 14px;
    color: var(--text-gray);
}

.state-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    color: var(--text-gray);
    font-size: 14px;
}

.pagination-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px dashed #eee;
}

.btn-page {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid #ddd;
    background-color: white;
    color: #555;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-page:hover:not(:disabled) {
    background-color: var(--text-orange, #FB923C);
    border-color: var(--text-orange, #FB923C);
    color: white;
}

.btn-page:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f9f9f9;
}

.page-info {
    font-size: 14px;
    color: #666;
}

.animate-spin {
    animation: spin 1s linear infinite;
    margin-bottom: 10px;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>