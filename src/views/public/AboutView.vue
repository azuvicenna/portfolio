<script setup>
import { useQuery } from '@tanstack/vue-query';
import { api } from '@/utils/api';
import { Loader2, AlertCircle } from 'lucide-vue-next';
import { marked } from 'marked';

const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['about-active'],
    queryFn: async () => {
        const res = await api('/about/active');
        return res.data || res;
    },
    staleTime: 1000 * 60 * 60,
});
</script>

<template>
    <div class="about">

        <div v-if="isLoading" class="loading-container">
            <Loader2 class="animate-spin" :size="32" color="#FB923C" />
        </div>

        <div v-else-if="isError || !profile" class="loading-container">
            <AlertCircle :size="32" class="text-red-500 mb-2" />
            <p>Gagal memuat data profil.</p>
        </div>

        <div v-else>
            <div class="title-name">
                <h2>{{ profile.full_name }}</h2>
                <h3>{{ profile.headline }}</h3>
            </div>

            <div class="bio-content" v-html="marked.parse(profile.bio || '')"></div>
        </div>

    </div>
</template>

<style scoped>
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px 0;
    color: var(--text-gray);
    font-size: 14px;
}

.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.title-name {
    margin-top: 20px;
    margin-bottom: 20px;
}

.title-name h2 {
    font-size: 36px;
    font-weight: 600;
    color: var(--text-orange);
    margin-bottom: 5px;
}

.title-name h3 {
    font-size: 13px;
    font-weight: 400;
    color: #888;
    letter-spacing: 2px;
    text-transform: uppercase;
}

.bio-content :deep(p) {
    font-size: 14px;
    line-height: 1.8;
    margin-bottom: 25px;
    color: var(--text-gray);
    font-weight: 400;
    max-width: 700px;
}

.bio-content :deep(strong),
.bio-content :deep(b) {
    font-weight: 600;
    color: var(--text-dark);
}

.bio-content :deep(a) {
    color: var(--text-orange);
    text-decoration: none;
    font-weight: 600;
}

.bio-content :deep(a:hover) {
    text-decoration: underline;
}
</style>