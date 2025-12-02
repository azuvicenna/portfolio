import { createRouter, createWebHistory } from "vue-router";

import MainLayout from "@/layout/MainLayout.vue";
import AdminLayout from "@/layout/AdminLayout.vue";

import LoginView from "@/views/auth/LoginView.vue";

import AboutView from "@/views/public/AboutView.vue";
import ExperienceView from "@/views/public/ExperienceView.vue";
import EducationView from "@/views/public/EducationView.vue";
import SkillView from "@/views/public/SkillView.vue";
import ProjectView from "@/views/public/ProjectView.vue";
import BlogView from "@/views/public/BlogView.vue";
import Guestbook from "@/views/public/Guestbook.vue";

import AdminDashboardView from "@/views/admin/AdminDashboardView.vue";
import AdminAboutView from "@/views/admin/AdminAboutView.vue";
import AdminExperienceView from "@/views/admin/AdminExperienceView.vue";
import AdminEducationView from "@/views/admin/AdminEducationView.vue";
import AdminSkillView from "@/views/admin/AdminSkillView.vue";
import AdminProjectView from "@/views/admin/AdminProjectView.vue";
import AdminBlogView from "@/views/admin/AdminBlogView.vue";
import AdminGuestbookView from "@/views/admin/AdminGuestbookView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || "/"),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: {
        title: "Login",
      },
    },
    {
      path: "/",
      component: MainLayout,
      children: [
        {
          path: "",
          name: "about",
          component: AboutView,
          meta: {
            title: "About",
            header: "About",
          },
        },
        {
          path: "experiences",
          name: "experiences",
          component: ExperienceView,
          meta: {
            title: "Experiences",
            header: "Experiences",
          },
        },
        {
          path: "educations",
          name: "educations",
          component: EducationView,
          meta: {
            title: "Educations",
            header: "Educations",
          },
        },
        {
          path: "skills",
          name: "skills",
          component: SkillView,
          meta: {
            title: "Skills",
            header: "Skills",
          },
        },
        {
          path: "projects",
          name: "projects",
          component: ProjectView,
          meta: {
            title: "Projects",
            header: "Projects",
          },
        },
        {
          path: "blogs",
          name: "blogs",
          component: BlogView,
          meta: {
            title: "Blogs",
            header: "Blogs",
          },
        },
        {
          path: "guestbook",
          name: "guestbook",
          component: Guestbook,
          meta: {
            title: "Guestbook",
            header: "Guestbook",
          },
        },
      ],
    },
    {
      path: "/admin",
      component: AdminLayout,
      children: [
        {
          path: "dashboard",
          name: "admin-dashboard",
          component: AdminDashboardView,
          meta: {
            title: "Dashboard",
          },
        },
        {
          path: "about",
          name: "admin-about",
          component: AdminAboutView,
          meta: {
            title: "Edit Profile",
          },
        },
        {
          path: "experiences",
          name: "admin-experiences",
          component: AdminExperienceView,
          meta: {
            title: "Experiences",
          },
        },
        {
          path: "educations",
          name: "admin-educations",
          component: AdminEducationView,
          meta: {
            title: "Educations",
          },
        },
        {
          path: "skills",
          name: "admin-skills",
          component: AdminSkillView,
          meta: {
            title: "Skills",
          },
        },
        {
          path: "projects",
          name: "admin-projects",
          component: AdminProjectView,
          meta: {
            title: "Projects",
          },
        },
        {
          path: "blogs",
          name: "admin-blogs",
          component: AdminBlogView,
          meta: {
            title: "Blogs",
          },
        },
        {
          path: "guestbook",
          name: "admin-guestbook",
          component: AdminGuestbookView,
          meta: { title: "Guestbook" },
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title + " - My Portfolio" || "My Portfolio";

  next();
});

export default router;
