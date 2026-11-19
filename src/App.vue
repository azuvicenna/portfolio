<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import AppHeader from './components/AppHeader.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import SkillsSection from './components/SkillsSection.vue'
import ExperienceSection from './components/ExperienceSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import CertificatesSection from './components/CertificatesSection.vue'
import ContactSection from './components/ContactSection.vue'
import AppFooter from './components/AppFooter.vue'
import ImageModal from './components/ImageModal.vue'

let sectionObserver: IntersectionObserver | undefined

onMounted(() => {
  sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          sectionObserver?.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px',
    }
  )

  const targets = document.querySelectorAll('section > div > *')
  targets.forEach((el) => {
    el.classList.add('section-animate')
    sectionObserver?.observe(el)
  })
})

onBeforeUnmount(() => {
  sectionObserver?.disconnect()
})
</script>

<template>
  <AppHeader />
  <main>
    <HeroSection />
    <AboutSection />
    <SkillsSection />
    <ExperienceSection />
    <ProjectsSection />
    <CertificatesSection />
    <ContactSection />
  </main>
  <AppFooter />
  <ImageModal />
</template>