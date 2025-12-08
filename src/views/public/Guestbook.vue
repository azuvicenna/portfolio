<script setup>
import { ref } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { api } from '@/utils/api';
import { Loader2, AlertCircle } from 'lucide-vue-next';

const queryClient = useQueryClient();

const form = ref({
    name: '',
    message: ''
});

const { data: messages, isLoading, isError } = useQuery({
    queryKey: ['guestbook'],
    queryFn: () => api('/guestbook'),
    staleTime: 1000 * 60,
});

const postMutation = useMutation({
    mutationFn: (newMessage) => {
        return new Promise(resolve => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
        form.value.message = '';
        queryClient.invalidateQueries({ queryKey: ['guestbook'] });
        alert('Pesan terkirim (Simulasi)!');
    }
});

const handleSubmit = () => {
    if (!form.value.message) return;
    postMutation.mutate({ message: form.value.message });
};
</script>

<template>
    <div class="guestbook-container">

        <div class="guestbook-form">
            <h3>Leave a Message</h3>
            <form @submit.prevent="handleSubmit">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input v-model="form.name" type="text" id="name" name="name" placeholder="Your name..." required>
                </div>
                <div class="form-group">
                    <label for="message">Message</label>
                    <textarea v-model="form.message" id="message" name="message" rows="4"
                        placeholder="Write your message here..." required></textarea>
                </div>
                <button type="submit" :disabled="postMutation.isPending.value">
                    {{ postMutation.isPending.value ? 'Posting...' : 'Post Message' }}
                </button>
            </form>
        </div>

        <div class="guestbook-entries">

            <div v-if="isLoading" class="state-container">
                <Loader2 class="animate-spin" :size="32" color="#FB923C" />
                <p>Loading messages...</p>
            </div>

            <div v-else-if="isError" class="state-container">
                <AlertCircle :size="32" class="text-red-500 mb-2" />
                <p>Gagal memuat pesan.</p>
            </div>

            <div v-else>
                <div v-for="entry in messages" :key="entry.id" class="entry-item">
                    <div class="entry-avatar">
                        <img v-if="entry.visitors.avatar_url" :src="entry.visitors.avatar_url" alt="Avatar"
                            style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />

                        <span v-else>
                            {{ entry.visitors.initial }}
                        </span>
                    </div>

                    <div class="entry-content">
                        <div class="entry-header">
                            <span class="entry-name">{{ entry.visitors.name }}</span>
                            <span class="entry-date">{{ entry.created_at }}</span>
                        </div>
                        <p class="entry-message">{{ entry.message }}</p>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
.guestbook-form {
    margin-top: 40px;
    margin-bottom: 50px;
}

.guestbook-form h3 {
    font-size: 18px;
    margin-bottom: 20px;
    font-weight: 500;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
}

.guestbook-form button {
    background-color: var(--text-orange);
    color: #fff;
    border: none;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.guestbook-form button:hover {
    background-color: #c96d38;
}

.guestbook-form button:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
}

.guestbook-entries {
    margin-top: 30px;
}

.entry-item {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
}

.entry-item:last-child {
    border-bottom: none;
    margin-bottom: 0;
}

.entry-avatar {
    flex-shrink: 0;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background-color: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 16px;
    color: var(--text-dark);
}

.entry-content {
    flex-grow: 1;
}

.entry-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.entry-name {
    font-weight: 600;
    font-size: 15px;
}

.entry-date {
    font-size: 12px;
    color: var(--text-gray);
}

.entry-message {
    font-size: 14px;
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