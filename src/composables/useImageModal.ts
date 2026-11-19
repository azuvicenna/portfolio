import { ref } from 'vue'

interface ModalImageState {
    src: string
    title: string
    subtitle?: string
}

const isOpen = ref(false)
const modalImage = ref<ModalImageState>({
    src: '',
    title: '',
    subtitle: '',
})

export function useImageModal() {
    const openModal = (src: string, title: string, subtitle?: string) => {
        modalImage.value = { src, title, subtitle }
        isOpen.value = true
        if (typeof document !== 'undefined') {
            document.body.style.overflow = 'hidden'
        }
    }

    const closeModal = () => {
        isOpen.value = false
        if (typeof document !== 'undefined') {
            document.body.style.overflow = ''
        }
    }

    return {
        isOpen,
        modalImage,
        openModal,
        closeModal,
    }
}
