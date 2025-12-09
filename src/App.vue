<script setup>
import { ref, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { supabase } from '@/config/supabase';
import { Loader2 } from 'lucide-vue-next';

const isAuthReady = ref(false);

onMounted(async () => {
  await supabase.auth.getSession();

  isAuthReady.value = true;
});
</script>

<template>
  <div v-if="!isAuthReady" class="global-loader">
    <div class="loader-content">
      <Loader2 class="animate-spin text-orange-400" :size="48" />
      <p>Initializing...</p>
    </div>
  </div>

  <RouterView v-else v-slot="{ Component, route }">
    <component :is="Component" :header="route.meta.header" />
  </RouterView>
</template>

<style>
.global-loader {
  position: fixed;
  inset: 0;
  background-color: #FDFBF5;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loader-content {
  text-align: center;
  color: #555;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
}

.loader-content p {
  margin-top: 15px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.animate-spin {
  animation: spin 1s linear infinite;
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