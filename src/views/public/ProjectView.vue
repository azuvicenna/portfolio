<script setup>
import { useQuery } from '@tanstack/vue-query';
import { api } from '@/utils/api';
import { Loader2, AlertCircle } from 'lucide-vue-next';

const { data: projects, isLoading, isError } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api('/projects'),
    staleTime: 1000 * 60 * 5,
});
</script>

<template>
    <div class="projects-list">

        <div v-if="isLoading" class="state-container">
            <Loader2 class="animate-spin" :size="32" color="#FB923C" />
            <p>Loading projects...</p>
        </div>

        <div v-else-if="isError" class="state-container">
            <AlertCircle :size="32" class="text-red-500 mb-2" />
            <p>Gagal memuat data projects.</p>
        </div>

        <div v-else>
            <div v-for="group in projects" :key="group.category" class="project-category">
                <h2>{{ group.category }}</h2>

                <div class="projects-grid">
                    <div v-for="project in group.items" :key="project.id" class="project-item">
                        <div class="project-image">
                            <img :src="project.image_url || 'https://via.placeholder.com/400x250?text=No+Image'"
                                :alt="project.title">
                        </div>

                        <div class="project-content">
                            <h3>{{ project.title }}</h3>

                            <p class="project-tech">
                                <strong>Tools:</strong>
                                {{ project.tools && project.tools.length ? project.tools.join(', ') : 'None' }}
                            </p>

                            <p class="project-description">
                                {{ project.summary || 'No description available.' }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
.projects-list {
    margin-top: 40px;
}

.project-category {
    margin-bottom: 50px;
}

.project-category h2 {
    font-size: 18px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--text-gray);
    margin-bottom: 25px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
}

.project-item {
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.project-image img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    display: block;
}

.project-content {
    padding: 20px;
}

.project-item h3 {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-orange);
    margin-bottom: 10px;
}

.project-tech {
    font-size: 12px;
    color: var(--text-gray);
    margin-bottom: 15px;
    font-weight: 500;
}

.project-description {
    font-size: 13px;
    line-height: 1.7;
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
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>