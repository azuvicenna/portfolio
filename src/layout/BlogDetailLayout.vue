<script setup>
import { ArrowLeft } from 'lucide-vue-next';
import { useRouter, RouterView } from 'vue-router'; // <--- Import RouterView

const router = useRouter();
</script>

<template>
    <div class="blog-layout-wrapper">
        <div class="blog-container">
            <main class="blog-content-area">

                <RouterView />

            </main>
        </div>
    </div>
</template>

<style scoped>
.blog-layout-wrapper {
    font-family: 'Poppins', sans-serif;
    color: var(--text-dark);
    background-color: var(--bg-cream);
    min-height: 100vh;
    width: 100%;
    padding: 40px 20px;
    display: flex;
    justify-content: center;
}

.blog-container {
    width: 100%;
    max-width: 900px;
    background-color: var(--bg-cream);
}

.blog-content-area {
    background-color: #fff;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    min-height: 80vh;
}

@media (max-width: 900px) {
    .blog-layout-wrapper {
        padding: 0;
    }

    .blog-content-area {
        padding: 30px 20px;
        border-radius: 0;
        box-shadow: none;
    }

    .back-button {
        position: static;
        margin: 20px;
        display: inline-flex;
    }
}
</style>