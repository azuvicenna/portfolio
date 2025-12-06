<script setup>
defineProps({
  imageUrl: {
    type: String,
    default: 'makima.png'
  }
})
</script>

<template>
  <div class="profile-section">
    <div 
      class="profile-image-container" 
      :style="{ backgroundImage: `url(${imageUrl})` }"
      aria-label="Foto Profil"
    >
      </div>
  </div>
</template>

<style scoped>
.profile-section {
  padding: 30px 30px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.profile-image-container {
  width: 280px;
  height: 280px;
  
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  
  border-bottom-left-radius: 70px;
  border-bottom: 40px solid var(--border-color);
}
</style>