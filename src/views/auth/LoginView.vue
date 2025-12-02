<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Loader2, Lock, ArrowRight } from 'lucide-vue-next';

const router = useRouter();
const isLoading = ref(false);

const handleLogin = (provider) => {
    isLoading.value = true;

    setTimeout(() => {
        isLoading.value = false;
        router.push('/admin');
    }, 1500); 
};
</script>

<template>
    <div
        class="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden font-sans text-slate-800">

        <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div
                class="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob">
            </div>
            <div
                class="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000">
            </div>
            <div
                class="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000">
            </div>
        </div>

        <div
            class="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 border border-white/50">

            <div class="text-center mb-10">
                <div
                    class="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200 transform rotate-3 hover:rotate-0 transition duration-300">
                    <Lock class="text-white" :size="32" />
                </div>
                <h1 class="text-3xl font-bold text-slate-900 tracking-tight mb-2">Welcome Back!</h1>
                <p class="text-slate-500">Sign in to manage your portfolio.</p>
            </div>

            <div class="space-y-4">

                <button @click="handleLogin('google')" :disabled="isLoading"
                    class="relative w-full flex items-center justify-center gap-3 px-6 py-4 border border-gray-200 rounded-2xl hover:bg-white hover:border-gray-300 hover:shadow-lg transition-all duration-200 font-bold text-slate-700 bg-white/50 group disabled:opacity-70 disabled:cursor-not-allowed">
                    <svg class="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
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
                    <span>Continue with Google</span>
                    <ArrowRight v-if="!isLoading" :size="18"
                        class="absolute right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-slate-400" />
                </button>

                <button @click="handleLogin('github')" :disabled="isLoading"
                    class="relative w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#24292e] text-white rounded-2xl hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 font-bold shadow-lg shadow-slate-200 disabled:opacity-70 disabled:cursor-not-allowed">
                    <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path
                            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <span>Continue with GitHub</span>
                </button>

            </div>

            <div v-if="isLoading"
                class="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-[2.5rem] flex flex-col items-center justify-center z-20">
                <Loader2 class="animate-spin text-indigo-600 mb-2" :size="40" />
                <p class="text-sm font-bold text-indigo-600 animate-pulse">Authenticating...</p>
            </div>
        </div>

    </div>
</template>

<style scoped>
@keyframes blob {
    0% {
        transform: translate(0px, 0px) scale(1);
    }

    33% {
        transform: translate(30px, -50px) scale(1.1);
    }

    66% {
        transform: translate(-20px, 20px) scale(0.9);
    }

    100% {
        transform: translate(0px, 0px) scale(1);
    }
}

.animate-blob {
    animation: blob 7s infinite;
}

.animation-delay-2000 {
    animation-delay: 2s;
}

.animation-delay-4000 {
    animation-delay: 4s;
}
</style>