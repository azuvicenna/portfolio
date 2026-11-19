<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { useImageModal } from '../composables/useImageModal'

const { isOpen, modalImage, closeModal } = useImageModal()

const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen.value) {
        closeModal()
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
    <Teleport to="body">
        <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="isOpen"
                class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/85 backdrop-blur-md"
                @click.self="closeModal"
                role="dialog"
                aria-modal="true"
                :aria-label="modalImage.title"
            >
                <!-- Modal Card -->
                <div
                    class="relative max-w-5xl w-full max-h-[92vh] flex flex-col bg-neutral-900 border border-neutral-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-modal-in"
                >
                    <!-- Header -->
                    <div class="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800 bg-neutral-900/90 backdrop-blur">
                        <div class="truncate pr-4">
                            <h3 class="text-sm sm:text-base font-bold text-white truncate">
                                {{ modalImage.title }}
                            </h3>
                            <p v-if="modalImage.subtitle" class="text-xs text-neutral-400 truncate mt-0.5">
                                {{ modalImage.subtitle }}
                            </p>
                        </div>

                        <div class="flex items-center gap-2 shrink-0">
                            <a
                                v-if="modalImage.src"
                                :href="modalImage.src"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Buka gambar ukuran penuh"
                                class="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                </svg>
                            </a>
                            <button
                                @click="closeModal"
                                class="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition cursor-pointer"
                                aria-label="Tutup modal"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Image Display -->
                    <div class="relative flex-1 min-h-0 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/70 overflow-auto">
                        <img
                            :src="modalImage.src"
                            :alt="modalImage.title"
                            class="max-w-full max-h-[75vh] w-auto h-auto object-contain rounded-lg sm:rounded-xl shadow-lg select-none"
                        />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.animate-modal-in {
    animation: modalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes modalIn {
    from {
        opacity: 0;
        transform: scale(0.96) translateY(12px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}
</style>
