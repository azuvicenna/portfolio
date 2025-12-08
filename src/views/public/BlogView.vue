<script setup>
import { useQuery } from '@tanstack/vue-query';
import { api } from '@/utils/api';
import { Loader2, AlertCircle } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';

const { data: blogs, isLoading, isError } = useQuery({
    queryKey: ['blogs'], 
    queryFn: () => api('/blogs'), 
    staleTime: 1000 * 60 * 5, 
});
</script>

<template>
    <div class="blog-list">

        <div v-if="isLoading" class="state-container">
            <Loader2 class="animate-spin" :size="32" color="#FB923C" />
            <p>Loading articles...</p>
        </div>

        <div v-else-if="isError" class="state-container">
            <AlertCircle :size="32" class="text-red-500 mb-2" />
            <p>Gagal memuat artikel.</p>
        </div>

        <div v-else>
            <RouterLink 
                v-for="blog in blogs" 
                :key="blog.id"
                :to="`/blogs/${blog.slug}`" 
                class="blog-item"
            >
                <div class="blog-avatar">{{ blog.language || 'ID' }}</div>
                
                <div class="blog-content">
                    <h3 class="blog-title">{{ blog.title }}</h3>
                    <span class="blog-date">{{ blog.published_at }}</span>
                </div>
            </RouterLink>
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
.animate-spin {
    animation: spin 1s linear infinite;
    margin-bottom: 10px;
}
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
</style>