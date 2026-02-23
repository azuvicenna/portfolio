import { createRouter, createWebHistory } from "vue-router";
import { supabase } from "@/config/supabase";

import MainLayout from "@/layout/MainLayout.vue";
import AdminLayout from "@/layout/AdminLayout.vue";
import BlogDetailLayout from "@/layout/BlogDetailLayout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || "/"),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/auth/LoginView.vue"),
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
          component: () => import("@/views/public/AboutView.vue"),
          meta: {
            title: "About",
            header: "About",
          },
        },
        {
          path: "experiences",
          name: "experiences",
          component: () => import("@/views/public/ExperienceView.vue"),
          meta: {
            title: "Experiences",
            header: "Experiences",
          },
        },
        {
          path: "educations",
          name: "educations",
          component: () => import("@/views/public/EducationView.vue"),
          meta: {
            title: "Educations",
            header: "Educations",
          },
        },
        {
          path: "skills",
          name: "skills",
          component: () => import("@/views/public/SkillView.vue"),
          meta: {
            title: "Skills",
            header: "Skills",
          },
        },
        {
          path: "projects",
          name: "projects",
          component: () => import("@/views/public/ProjectView.vue"),
          meta: {
            title: "Projects",
            header: "Projects",
          },
        },
        {
          path: "blogs",
          name: "blogs",
          component: () => import("@/views/public/BlogView.vue"),
          meta: {
            title: "Blogs",
            header: "Blogs",
          },
        },
        {
          path: "guestbook",
          name: "guestbook",
          component: () => import("@/views/public/Guestbook.vue"),
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
          component: () => import("@/views/admin/AdminDashboardView.vue"),
          meta: {
            title: "Dashboard",
          },
        },
        {
          path: "about",
          name: "admin-about",
          component: () => import("@/views/admin/AdminAboutView.vue"),
          meta: {
            title: "Edit Profile",
          },
        },
        {
          path: "experiences",
          name: "admin-experiences",
          component: () => import("@/views/admin/AdminExperienceView.vue"),
          meta: {
            title: "Experiences",
          },
        },
        {
          path: "educations",
          name: "admin-educations",
          component: () => import("@/views/admin/AdminEducationView.vue"),
          meta: {
            title: "Educations",
          },
        },
        {
          path: "skills",
          name: "admin-skills",
          component: () => import("@/views/admin/AdminSkillView.vue"),
          meta: {
            title: "Skills",
          },
        },
        {
          path: "projects",
          name: "admin-projects",
          component: () => import("@/views/admin/AdminProjectView.vue"),
          meta: {
            title: "Projects",
          },
        },
        {
          path: "blogs",
          name: "admin-blogs",
          component: () => import("@/views/admin/AdminBlogView.vue"),
          meta: {
            title: "Blogs",
          },
        },
        {
          path: "guestbook",
          name: "admin-guestbook",
          component: () => import("@/views/admin/AdminGuestbookView.vue"),
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
          component: () => import("@/views/public/BlogDetailView.vue"),
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
          component: () => import("@/views/public/ProjectDetailView.vue"),
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

  if (to.meta.requiresAuth && !session) {
    return next("/login");
  }

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
