<script setup>
import ProfileSection from '@/components/ProfileSection.vue';
import MainNav from '@/components/MainNav.vue';
import ContactSection from '@/components/ContactSection.vue';
import ContentSection from '@/components/ContentSection.vue';
import { RouterView } from 'vue-router'

defineProps({
    header: String
})
</script>

<template>
    <div class="portfolio-layout-wrapper">
        <div class="portfolio-container">
            <aside class="sidebar">
                <ProfileSection />
                <MainNav />
                <ContactSection />
            </aside>

            <main class="main-content">
                <ContentSection :header="header">
                    <RouterView />
                </ContentSection>
            </main>
        </div>
    </div>
</template>

<style scoped>
.portfolio-layout-wrapper {
    font-family: 'Poppins', sans-serif;
    color: var(--text-dark);
    background-color: var(--bg-cream);
    min-height: 100vh;
    width: 100%;
    padding: 40px 0;
    display: flex;
    justify-content: center;
}

.portfolio-container {
    display: flex;
    max-width: 1300px;
    width: 95%;
    overflow: hidden;
    height: calc(100vh - 80px);
}

.sidebar {
    flex-basis: 400px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    background-color: var(--bg-cream);
    min-width: 0;
    overflow-y: auto;
    height: 100%;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.sidebar::-webkit-scrollbar {
    display: none;
}

.main-content {
    flex-grow: 1;
    padding: 30px 50px;
    background-color: var(--bg-cream);
    position: relative;
    overflow-y: auto;
    height: 100%;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

@media (max-width: 900px) {

    .portfolio-layout-wrapper {
        padding: 0;
        display: block;
    }

    .portfolio-container {
        flex-direction: column;
        width: 100%;
        height: auto;
        overflow: visible;
    }

    .sidebar {
        width: 100%;
        flex-basis: auto;
        height: auto;
        overflow-y: visible;
    }

    .main-content {
        width: 100%;
        height: auto;
        overflow-y: visible;
        padding: 40px 20px;
    }
}
</style>