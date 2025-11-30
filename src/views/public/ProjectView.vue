<script setup>
</script>

<template>
    <div class="projects-list">

        <div class="project-category">
            <h2>Web Development</h2>
            <div class="projects-grid">
                <div class="project-item">
                    <div class="project-image">
                        <img src="https://i.pinimg.com/736x/63/69/08/636908b58c8bd1ec2903f7da5ea31000.jpg" alt="Gambar">
                    </div>
                    <div class="project-content">
                        <h3>Not Added Yet</h3>
                        <p class="project-tech"><strong>Tools:</strong> None</p>
                        <p class="project-description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam a, officiis ipsum deserunt inventore iusto.</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="project-category">
            <h2>Mobile Development</h2>
            <div class="projects-grid">
                <div class="project-item">
                    <div class="project-image">
                        <img src="https://i.pinimg.com/736x/63/69/08/636908b58c8bd1ec2903f7da5ea31000.jpg" alt="Gambar">
                    </div>
                    <div class="project-content">
                        <h3>Not Added Yet</h3>
                        <p class="project-tech"><strong>Tools:</strong> None</p>
                        <p class="project-description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam a, officiis ipsum deserunt inventore iusto.</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="project-category">
            <h2>Machine Learning</h2>
            <div class="projects-grid">
                <div class="project-item">
                    <div class="project-image">
                        <img src="https://i.pinimg.com/736x/63/69/08/636908b58c8bd1ec2903f7da5ea31000.jpg" alt="Gambar">
                    </div>
                    <div class="project-content">
                        <h3>Not Added Yet</h3>
                        <p class="project-tech"><strong>Tools:</strong> None</p>
                        <p class="project-description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam a, officiis ipsum deserunt inventore iusto.</p>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
.projects-list {
    margin-top: 40px;
}

.project-category {
    margin-bottom: 50px;
}

.project-category h2 {
    font-size: 18px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--text-gray);
    margin-bottom: 25px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
}

.project-item {
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.project-image img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    display: block;
}

.project-content {
    padding: 20px;
}

.project-item h3 {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-orange);
    margin-bottom: 10px;
}

.project-tech {
    font-size: 12px;
    color: var(--text-gray);
    margin-bottom: 15px;
    font-weight: 500;
}

.project-description {
    font-size: 13px;
    line-height: 1.7;
    color: var(--text-gray);
}
</style>