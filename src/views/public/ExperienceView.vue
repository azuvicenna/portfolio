<script setup>
import { useQuery } from '@tanstack/vue-query';
import { api } from '@/utils/api';
import { Loader2, AlertCircle } from 'lucide-vue-next';

const { data: experiences, isLoading, isError } = useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
        const res = await api('/experiences');
        return res.data || res;
    },
    staleTime: 1000 * 60 * 5,
});
</script>

<template>
    <div class="experience-list">

        <div v-if="isLoading" class="state-container">
            <Loader2 class="animate-spin" :size="32" color="#FB923C" />
            <p>Loading experiences...</p>
        </div>

        <div v-else-if="isError" class="state-container">
            <AlertCircle :size="32" class="text-red-500 mb-2" />
            <p>Gagal memuat data experiences.</p>
        </div>

        <div v-else>
            <div v-for="item in experiences" :key="item.id" class="experience-item">
                <h3>{{ item.position }}</h3>

                <div class="experience-meta">
                    <span class="company">
                        {{ item.company }} <span v-if="item.location">| {{ item.location }}</span>
                    </span>

                    <span class="date">
                        {{ item.duration_string }}
                    </span>
                </div>

                <ul class="experience-description" v-if="item.description && item.description.length">
                    <li v-for="(desc, index) in item.description" :key="index">
                        {{ desc }}
                    </li>
                </ul>
            </div>
        </div>

    </div>
</template>

<style scoped>
.experience-list {
    margin-top: 40px;
}

.experience-item {
    margin-bottom: 35px;
    padding-bottom: 25px;
    border-bottom: 1px solid #eee;
}

.experience-item:last-child {
    border-bottom: none;
    margin-bottom: 0;
}

.experience-item h3 {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-orange);
    margin-bottom: 5px;
}

.experience-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    font-size: 14px;
    color: var(--text-gray);
}

.experience-meta .company {
    font-weight: 500;
}

.experience-description {
    font-size: 14px;
    line-height: 1.8;
    color: var(--text-gray);
    padding-left: 20px;
    list-style: disc;
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
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>