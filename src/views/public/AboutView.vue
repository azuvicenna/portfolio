<script setup>
</script>

<template>
    <div class="about">
        <div class="title-name">
            <h2>Atyla A. Al Harits</h2>
            <h3>Backend Developer | Information System Student</h3>
        </div>

        <p>
            As a <strong>Backend Developer</strong> and an Information Systems undergraduate, I specialize in building scalable
            server-side solutions with a tech stack including TypeScript, ExpressJS, Laravel, and MySQL.
        </p>
        <p>
            I have a great passion for technology and am actively developing my competencies in Mobile Development
            (Flutter) and Machine Learning. I am looking for an opportunity to contribute my technical expertise to
            innovative and impactful projects.
        </p>
        <p>
            Let's connect through <a href="https://www.linkedin.com/in/atyla-azfa-al-harits/" target="_blank">LinkedIn</a>, we
            can
            share insights, innovative ideas and valuable collaboration opportunities!
        </p>
    </div>
</template>

<style scoped>
.title-name {
    margin-top: 20px;
    margin-bottom: 20px;
}

.title-name h2 {
    font-size: 36px;
    font-weight: 600;
    color: var(--text-orange);
    margin-bottom: 5px;
}

.title-name h3 {
    font-size: 13px;
    font-weight: 400;
    color: #888;
    letter-spacing: 2px;
    text-transform: uppercase;
}

.about p {
    font-size: 14px;
    line-height: 1.8;
    margin-bottom: 25px;
    color: var(--text-gray);
    font-weight: 400;
    max-width: 700px;
}

.about p strong {
    font-weight: 600;
    color: var(--text-dark);
}

.about p a {
    color: var(--text-orange);
    text-decoration: none;
    font-weight: 600;
}

.about p a:hover {
    text-decoration: underline;
}
</style>