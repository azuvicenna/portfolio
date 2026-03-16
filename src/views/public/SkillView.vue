<script setup>
import { useQuery } from '@tanstack/vue-query';
import { api } from '@/utils/api';
import { Loader2, AlertCircle } from 'lucide-vue-next';

const { data: skills, isLoading, isError } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
        const res = await api('/skills');
        return res.data || res;
    },
    staleTime: 1000 * 60 * 60,
});
</script>

<template>
    <div class="skills-list">

        <div v-if="isLoading" class="state-container">
            <Loader2 class="animate-spin" :size="32" color="#FB923C" />
            <p>Loading skills...</p>
        </div>

        <div v-else-if="isError" class="state-container">
            <AlertCircle :size="32" class="text-red-500 mb-2" />
            <p>Gagal memuat data skills.</p>
        </div>

        <div v-else>
            <div v-for="group in skills" :key="group.category" class="skill-category">
                <h2>{{ group.category }}</h2>

                <div class="skills-grid">
                    <div v-for="skill in group.items" :key="skill.id" class="skill-item">
                        <img :src="skill.logo_url || 'https://via.placeholder.com/48'" :alt="skill.name + ' Logo'">
                        <p>{{ skill.name }}</p>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
.skills-list {
    margin-top: 40px;
}

.skill-category {
    margin-bottom: 40px;
}

.skill-category h2 {
    font-size: 18px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--text-gray);
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 25px;
}

.skill-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 15px;
    border-radius: 8px;
    transition: background-color 0.3s ease, transform 0.3s ease;
    cursor: pointer;
}

.skill-item:hover {
    background-color: #f0ebe2;
    transform: translateY(-5px);
}

.skill-item img {
    width: 48px;
    height: 48px;
    object-fit: contain;
}

.skill-item p {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-gray);
    text-align: center;
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