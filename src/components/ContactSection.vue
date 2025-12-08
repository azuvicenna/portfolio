<script setup>
import { useQuery } from '@tanstack/vue-query';
import { api } from '@/utils/api';

const { data: profile } = useQuery({
    queryKey: ['about'],
    queryFn: () => api('/about'),
    staleTime: 1000 * 60 * 60,
});
</script>

<template>
    <div class="contact-section">
        <ul v-if="profile">

            <li v-if="profile.email">
                <div class="icon"><i class="fas fa-envelope"></i></div>
                <div class="text">
                    <h5>Email</h5>
                    <a :href="`mailto:${profile.email}`">{{ profile.email }}</a>
                </div>
            </li>

            <li v-if="profile.linkedin_url">
                <div class="icon"><i class="fab fa-linkedin"></i></div>
                <div class="text">
                    <h5>LinkedIn</h5>
                    <a :href="profile.linkedin_url" target="_blank">{{ profile.linkedin_url }}</a>
                </div>
            </li>

            <li v-if="profile.github_url">
                <div class="icon"><i class="fab fa-github"></i></div>
                <div class="text">
                    <h5>Github</h5>
                    <a :href="profile.github_url" target="_blank">{{ profile.github_url }}</a>
                </div>
            </li>

        </ul>
    </div>
</template>

<style scoped>
/* STYLE ASLI ANDA (TIDAK DIUBAH) */
.contact-section {
    padding: 20px 40px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.contact-section ul {
    list-style: none;
}

.contact-section li {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20px;
}

.contact-section li:last-child {
    margin-bottom: 0;
}

.contact-section .icon {
    font-size: 20px;
    margin-right: 15px;
    width: 25px;
    text-align: center;
    color: var(--text-dark);
    margin-top: 2px;
}

.contact-section .text h5 {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 3px;
    letter-spacing: 1px;
    text-transform: uppercase;
}

.contact-section .text p,
.contact-section .text a {
    font-size: 13px;
    color: var(--text-dark);
    text-decoration: none;
    word-break: break-all;
    line-height: 1.4;
    font-weight: 400;
}

.contact-section .text a:hover {
    text-decoration: underline;
}
</style>