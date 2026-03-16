<script setup>
import { ref, computed, watch } from 'vue';
import { useQuery, keepPreviousData } from '@tanstack/vue-query';
import { apiWithMeta } from '@/utils/api';
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-vue-next';

const page = ref(1);
const limit = 10;
const selectedCategory = ref('All');

const categories = ['All', 'Web Development', 'Mobile Development', 'Machine Learning', 'Backend', 'Tools'];

const { data: apiResponse, isLoading, isError } = useQuery({
    queryKey: ['projects', page, selectedCategory],
    queryFn: () => {
        const params = new URLSearchParams({
            page: page.value,
            limit: limit
        });

        if (selectedCategory.value !== 'All') {
            params.append('category', selectedCategory.value);
        }

        return apiWithMeta(`/projects?${params.toString()}`);
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
});

const projects = computed(() => {
    const res = apiResponse.value;
    if (Array.isArray(res)) return res;
    if (res?.data && Array.isArray(res.data)) return res.data;
    if (res?.data?.data && Array.isArray(res.data.data)) return res.data.data;
    return [];
});

const meta = computed(() => {
    const res = apiResponse.value;
    return res?.pagination || res?.data?.pagination || { total_pages: 1 };
});

watch(selectedCategory, () => {
    page.value = 1;
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
    <div class="projects-list-container">

        <div class="category-tabs">
            <button v-for="cat in categories" :key="cat" @click="selectedCategory = cat" class="tab-btn"
                :class="{ active: selectedCategory === cat }">
                {{ cat }}
            </button>
        </div>

        <div v-if="isLoading" class="state-container">
            <Loader2 class="animate-spin" :size="32" color="#FB923C" />
            <p>Loading projects...</p>
        </div>

        <div v-else-if="isError" class="state-container">
            <AlertCircle :size="32" class="text-red-500 mb-2" />
            <p>Gagal memuat data projects.</p>
        </div>

        <div v-else>

            <div v-if="projects.length === 0" class="state-container">
                <p>No projects found in this category.</p>
            </div>

            <div class="projects-grid">
                <div v-for="project in projects" :key="project.id" class="project-item">

                    <component :is="project.content ? 'RouterLink' : 'div'"
                        :to="project.content ? `/projects/${project.slug}` : undefined" class="project-link-wrapper">
                        <div class="project-image">
                            <img :src="project.image_url || 'https://via.placeholder.com/400x250?text=No+Image'"
                                :alt="project.title" loading="lazy">
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
                    </component>

                </div>
            </div>

            <div class="pagination-controls" v-if="meta.total_pages > 1">
                <button @click="prevPage" :disabled="page === 1" class="btn-page">
                    <ChevronLeft :size="18" /> Prev
                </button>

                <span class="page-info">
                    Page <b>{{ page }}</b> of {{ meta.total_pages }}
                </span>

                <button @click="nextPage" :disabled="page >= meta.total_pages" class="btn-page">
                    Next
                    <ChevronRight :size="18" />
                </button>
            </div>

        </div>

    </div>
</template>

<style scoped>
.projects-list-container {
    margin-top: 40px;
}

.category-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 30px;
    justify-content: center;
}

.tab-btn {
    padding: 8px 16px;
    border-radius: 20px;
    border: 1px solid #eee;
    background-color: white;
    color: var(--text-gray);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.tab-btn:hover {
    background-color: #f9f9f9;
    border-color: #ddd;
}

.tab-btn.active {
    background-color: var(--text-orange);
    color: white;
    border-color: var(--text-orange);
}

.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
    margin-bottom: 40px;
}

.project-item {
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background-color: #fff;
    border: 1px solid #f0f0f0;
}

.project-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.project-link-wrapper {
    display: block;
    text-decoration: none;
    color: inherit;
    height: 100%;
}

a.project-link-wrapper {
    cursor: pointer;
}

.project-image img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    display: block;
    border-bottom: 1px solid #f0f0f0;
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
    line-height: 1.6;
    color: var(--text-gray);
}

.state-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 0;
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

.pagination-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px dashed #eee;
}

.btn-page {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 8px 14px;
    border-radius: 6px;
    border: 1px solid #ddd;
    background-color: white;
    color: #555;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-page:hover:not(:disabled) {
    background-color: var(--text-orange);
    border-color: var(--text-orange);
    color: white;
}

.btn-page:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f9f9f9;
}

.page-info {
    font-size: 13px;
    color: #666;
}
</style>