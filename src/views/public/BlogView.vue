<script setup>
</script>

<template>
    <div class="blog-list">

        <a href="https://medium.com/@reezedev/git-semantic-commit-message-d2cc926f72f3" target="_blank"
            class="blog-item">
            <div class="blog-avatar">ID</div>
            <div class="blog-content">
                <h3 class="blog-title">Pesan semantik pada perintah commit Git</h3>
                <span class="blog-date">Jan 29, 2024</span>
            </div>
        </a>
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
</style>