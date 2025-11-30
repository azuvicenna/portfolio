<script setup>
</script>

<template>
    <div class="education-list">
        <div class="education-item">
            <h3>Bachelor of Science in Information Systems</h3>
            <div class="education-meta">
                <span class="institution">Bina Sarana Informatika University, Tasikmalaya</span>
                <span class="date">2023 - Present (Expected 2027)</span>
            </div>
            <ul class="education-description">
                <li>Current GPA: 3.6 / 4.0</li>
                <li>Relevant Coursework: Web & Mobile Programming, Database Design, Information Systems Design, and Machine
                    Learning.</li>
            </ul>
        </div>

        <div class="education-item">
            <h3>Vocational High School Diploma in Software Engineering</h3>
            <div class="education-meta">
                <span class="institution">SMK Negeri 3 Banjar, Banjar</span>
                <span class="date">2020 - 2023</span>
            </div>
            <ul class="education-description">
                <li>Graduated with high marks, achieving an overall average score of 85/100.</li>
                <li>Achieved an 'A' grade on the Vocational Competency Examination for the software engineering major.
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.education-list {
    margin-top: 40px;
}

.education-item {
    margin-bottom: 35px;
    padding-bottom: 25px;
    border-bottom: 1px solid #eee;
}

.education-item:last-child {
    border-bottom: none;
    margin-bottom: 0;
}

.education-item h3 {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-orange);
    margin-bottom: 5px;
}

.education-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    font-size: 14px;
    color: var(--text-gray);
}

.education-meta .institution {
    font-weight: 500;
}

.education-description {
    font-size: 14px;
    line-height: 1.8;
    color: var(--text-gray);
    padding-left: 20px;
}
</style>