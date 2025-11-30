<script setup>
</script>

<template>
    <div class="experience-list">

        <div class="experience-item">
            <h3>Web Developer</h3>
            <div class="experience-meta">
                <span class="company">Diskominfo | Tasikmalaya</span>
                <span class="date">Sep 2025 - Now</span>
            </div>
            <ul class="experience-description">
                <li>Developed the SIMGos web application from conception to deployment.</li>
                <li>Designed and implemented comprehensive reports for public health centers and hospitals using
                    Jaspersoft Studio and complex SQL queries.</li>
                <li>Executed data cleaning and preparation processes using Google Sheets, and imported the sanitized
                    data into the database with Navicat.</li>
            </ul>
        </div>

        <div class="experience-item">
            <h3>Freelance Web Developer</h3>
            <div class="experience-meta">
                <span class="company">Self-Employed | Tasikmalaya</span>
                <span class="date">Oct 2024 - Aug 2025</span>
            </div>
            <ul class="experience-description">
                <li>
                    Developed a digital community platform for Serang Village to foster resident interaction and
                    streamline information sharing.
                </li>
                <li>
                    Engineered an integrated application for Kaputihan Village, featuring a Geographic Information
                    System (GIS) and a digital marketplace to promote local MSMEs.
                </li>
            </ul>
        </div>

        <div class="experience-item">
            <h3>Student Intern</h3>
            <div class="experience-meta">
                <span class="company">Mutiara Digital Printing | Banjar</span>
                <span class="date">Feb 2022 - Apr 2022</span>
            </div>
            <ul class="experience-description">
                <li>
                    Engineered a custom e-commerce platform for a printing services business, built upon the Codeigniter
                    4 framework.
                </li>
            </ul>
        </div>

    </div>
</template>

<style scoped>
.experience-list {
    margin-top: 40px;
}

.experience-item {
    margin-bottom: 35px;
    padding-bottom: 25px;
    border-bottom: 1px solid #eee;
}

.experience-item:last-child {
    border-bottom: none;
    margin-bottom: 0;
}

.experience-item h3 {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-orange);
    margin-bottom: 5px;
}

.experience-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    font-size: 14px;
    color: var(--text-gray);
}

.experience-meta .company {
    font-weight: 500;
}

.experience-description {
    font-size: 14px;
    line-height: 1.8;
    color: var(--text-gray);
    padding-left: 20px;
    list-style: disc;
}
</style>