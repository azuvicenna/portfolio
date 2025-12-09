import { createRouter, createWebHistory } from "vue-router";
import { supabase } from "@/config/supabase";

import MainLayout from "@/layout/MainLayout.vue";
import AdminLayout from "@/layout/AdminLayout.vue";
import BlogDetailLayout from "@/layout/BlogDetailLayout.vue";

import LoginView from "@/views/auth/LoginView.vue";

import AboutView from "@/views/public/AboutView.vue";
import ExperienceView from "@/views/public/ExperienceView.vue";
import EducationView from "@/views/public/EducationView.vue";
import SkillView from "@/views/public/SkillView.vue";
import ProjectView from "@/views/public/ProjectView.vue";
import ProjectDetailView from "@/views/public/ProjectDetailView.vue";
import BlogView from "@/views/public/BlogView.vue";
import BlogDetailView from "@/views/public/BlogDetailView.vue";
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
      meta: {
        requiresAuth: true, // Wajib Login
        requiresAdmin: true, // Wajib Admin
      },
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
    {
      path: "/blogs/:slug",
      component: BlogDetailLayout,
      children: [
        {
          path: "",
          name: "blog-detail",
          component: BlogDetailView,
          meta: { title: "Article" },
        },
      ],
    },
    {
      path: "/projects/:slug",
      component: BlogDetailLayout,
      children: [
        {
          path: "",
          name: "project-detail",
          component: ProjectDetailView,
          meta: { title: "Project Showcase" },
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title + " - My Portfolio" || "My Portfolio";

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // ---------------------------------------------------------
  // KASUS A: User SUDAH Login tapi iseng buka halaman /login
  // ---------------------------------------------------------
  if (to.path === "/login" && session) {
    const { data: userData } = await supabase
      .from("visitors")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (userData?.role === "admin") {
      return next("/admin/dashboard");
    } else {
      return next("/");
    }
  }

  // ---------------------------------------------------------
  // KASUS B: Rute Wajib Login (requiresAuth)
  // ---------------------------------------------------------
  if (to.meta.requiresAuth && !session) {
    return next("/login");
  }

  // ---------------------------------------------------------
  // KASUS C: Rute Khusus Admin (requiresAdmin)
  // ---------------------------------------------------------
  if (to.meta.requiresAdmin) {
    const { data: userData, error } = await supabase
      .from("visitors")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (error || userData?.role !== "admin") {
      return next("/");
    }
  }

  next();
});

export default router;
