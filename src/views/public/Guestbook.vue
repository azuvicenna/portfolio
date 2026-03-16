<script setup>
import { ref, onMounted, computed } from 'vue';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/vue-query';
import { apiWithMeta } from '@/utils/api';
import { supabase } from '@/config/supabase';
import { Loader2, AlertCircle, LogOut, ChevronLeft, ChevronRight } from 'lucide-vue-next';

const page = ref(1);
const limit = 10;

const queryClient = useQueryClient();
const user = ref(null);

const form = ref({
    message: ''
});

onMounted(async () => {
    const { data } = await supabase.auth.getUser();
    user.value = data?.user || null;

    supabase.auth.onAuthStateChange((_event, session) => {
        user.value = session?.user || null;
    });
});

const handleLogin = async (provider) => {
    await supabase.auth.signInWithOAuth({
        provider: provider,
        options: { redirectTo: window.location.href }
    });
};

const handleLogout = async () => {
    await supabase.auth.signOut();
};

const { data: apiResponse, isLoading, isError } = useQuery({
    queryKey: ['guestbook', page],
    queryFn: () => apiWithMeta(`/guestbook?page=${page.value}&limit=${limit}`),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
});

const postMutation = useMutation({
    mutationFn: async (newMessage) => {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (!token) throw new Error("Please login first");

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

        const res = await fetch(`${API_URL}/api/v1/guestbook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newMessage)
        });

        if (!res.ok) throw new Error("Failed to post message");
        return res.json();
    },
    onSuccess: () => {
        form.value.message = '';
        queryClient.invalidateQueries({ queryKey: ['guestbook'] });
        alert('Pesan berhasil dikirim!');
    },
    onError: (err) => {
        alert(err.message);
    }
});

const handleSubmit = () => {
    if (!form.value.message.trim()) return;
    postMutation.mutate({ message: form.value.message });
};

const displayName = computed(() => {
    if (!user.value) return '';
    const meta = user.value.user_metadata;
    return meta?.full_name || meta?.user_name || meta?.preferred_username || user.value.email;
});

const messages = computed(() => {
    const res = apiResponse.value;
    if (res?.data && Array.isArray(res.data)) return res.data;
    if (res?.data?.data && Array.isArray(res.data.data)) return res.data.data;
    return [];
});

const meta = computed(() => {
    const res = apiResponse.value;
    return res?.pagination || res?.data?.pagination || { total_pages: 1 };
});

const nextPage = () => {
    if (meta.value && page.value < meta.value.total_pages) {
        page.value++;
    }
};

const prevPage = () => {
    if (page.value > 1) {
        page.value--;
    }
};
</script>

<template>
    <div class="guestbook-container">

        <div v-if="user" class="guestbook-form">
            <h3>Leave a Message</h3>

            <form @submit.prevent="handleSubmit">

                <div class="form-group">
                    <label>Name</label>
                    <input type="text" :value="displayName" disabled
                        style="background-color: #f3f4f6; color: #6b7280; cursor: not-allowed;">
                </div>

                <div class="form-group">
                    <label for="message">Message</label>
                    <textarea v-model="form.message" id="message" name="message" rows="4"
                        placeholder="Write your message here..." required></textarea>
                </div>

                <div class="form-actions">
                    <button type="submit" :disabled="postMutation.isPending.value" class="btn-submit">
                        <Loader2 v-if="postMutation.isPending.value" class="animate-spin mr-2" :size="16" />
                        {{ postMutation.isPending.value ? 'Posting...' : 'Post Message' }}
                    </button>

                    <button type="button" @click="handleLogout" class="btn-logout-form">
                        <LogOut :size="18" /> Logout
                    </button>
                </div>

            </form>
        </div>

        <div v-else class="guestbook-form guestbook-login">
            <h3>Join the Guestbook</h3>
            <p>Please login to leave a message.</p>

            <div class="login-buttons">
                <button type="button" @click="handleLogin('google')" class="btn-social">
                    <svg viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4" />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853" />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05" />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335" />
                    </svg>
                    Login with Google
                </button>

                <button type="button" @click="handleLogin('github')" class="btn-social github">
                    <svg viewBox="0 0 24 24">
                        <path
                            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    Login with GitHub
                </button>
            </div>
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
                            class="avatar-img" />
                        <span v-else>{{ entry.visitors.initial }}</span>
                    </div>
                    <div class="entry-content">
                        <div class="entry-header">
                            <span class="entry-name">{{ entry.visitors.name }}</span>
                            <span class="entry-date">{{ entry.created_at }}</span>
                        </div>
                        <p class="entry-message">{{ entry.message }}</p>
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

    </div>
</template>

<style scoped>
.guestbook-form {
    margin-top: 40px;
    margin-bottom: 50px;
}

.guestbook-login {
    text-align: center;
    border: 1px dashed #ddd;
    padding: 40px;
    border-radius: 8px;
}

.guestbook-form h3 {
    font-size: 18px;
    margin-bottom: 20px;
    font-weight: 500;
}

.guestbook-login p {
    font-size: 14px;
    margin-bottom: 20px;
    color: var(--text-gray);
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

.form-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 10px;
}

.btn-submit {
    background-color: var(--text-orange);
    color: #fff;
    border: none;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.btn-submit:hover {
    background-color: #c96d38;
}

.btn-submit:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
}

.guestbook-form .btn-logout-form {
    background-color: #fff;
    color: #ef4444;
    border: 1px solid #fee2e2;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    flex: 0 0 auto;
}

.guestbook-form .btn-logout-form:hover {
    background-color: #fef2f2;
    border-color: #ef4444;
}

.login-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
}

.btn-social {
    background-color: white;
    color: #333;
    border: 1px solid #ddd;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
}

.btn-social svg {
    width: 18px;
    height: 18px;
}

.btn-social.github {
    background-color: #333;
    color: white;
    border: none;
}

.btn-social.github svg {
    fill: white;
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
    overflow: hidden;
}

.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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