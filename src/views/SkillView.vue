<script setup>
</script>

<template>
    <div class="skills-list">

        <div class="skill-category">
            <h2>Languages</h2>
            <div class="skills-grid">
                <div class="skill-item">
                    <img src="https://www.svgrepo.com/show/303600/typescript-logo.svg" alt="TypeScript Logo">
                    <p>TypeScript</p>
                </div>
                <div class="skill-item">
                    <img src="https://www.svgrepo.com/show/353631/dart.svg" alt="Dart Logo">
                    <p>Dart</p>
                </div>
                <div class="skill-item">
                    <img src="https://www.svgrepo.com/show/452091/python.svg" alt="Python Logo">
                    <p>Python</p>
                </div>
                <div class="skill-item">
                    <img src="https://www.svgrepo.com/show/508936/php02.svg" alt="PHP Logo">
                    <p>PHP</p>
                </div>
            </div>
        </div>

        <div class="skill-category">
            <h2>Frameworks</h2>
            <div class="skills-grid">
                <div class="skill-item">
                    <img src="https://www.svgrepo.com/show/330398/express.svg" alt="ExpressJS Logo">
                    <p>ExpressJS</p>
                </div>
                <div class="skill-item">
                    <img src="https://www.svgrepo.com/show/353985/laravel.svg" alt="Laravel Logo">
                    <p>Laravel</p>
                </div>
            </div>
        </div>

        <div class="skill-category">
            <h2>Libraries</h2>
            <div class="skills-grid">
                <div class="skill-item">
                    <img src="https://www.svgrepo.com/show/373776/light-prisma.svg" alt="Prisma Logo">
                    <p>Prisma</p>
                </div>
                <div class="skill-item">
                    <img src="https://www.svgrepo.com/show/373701/jest-snapshot.svg" alt="Jest Logo">
                    <p>Jest</p>
                </div>
            </div>
        </div>

        <div class="skill-category">
            <h2>Databases</h2>
            <div class="skills-grid">
                <div class="skill-item">
                    <img src="https://www.svgrepo.com/show/303251/mysql-logo.svg" alt="MySQL Logo">
                    <p>MySQL</p>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
.skills-list {
    margin-top: 40px;
}

.skill-category {
    margin-bottom: 40px;
}

.skill-category h2 {
    font-size: 18px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--text-gray);
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 25px;
}

.skill-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 15px;
    border-radius: 8px;
    transition: background-color 0.3s ease, transform 0.3s ease;
    cursor: pointer;
}

.skill-item:hover {
    background-color: #f0ebe2;
    transform: translateY(-5px);
}

/* Modifikasi CSS untuk tag <img> */
.skill-item img {
    /* Mengganti .skill-item i dengan .skill-item img */
    width: 48px;
    /* Atur lebar gambar */
    height: 48px;
    /* Atur tinggi gambar (bisa juga 'auto' untuk menjaga rasio aspek) */
    object-fit: contain;
    /* Memastikan gambar pas tanpa terpotong */
    /* Jika Anda ingin sedikit efek warna seperti ikon, bisa pakai filter */
    /* filter: grayscale(100%); */
    /* transition: filter 0.3s ease; */
}

/* Optional: Jika hover ingin mengembalikan warna */
/* .skill-item:hover img {
    filter: grayscale(0%);
} */

.skill-item p {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-gray);
    text-align: center;
}
</style>