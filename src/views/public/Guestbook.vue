<script setup>
</script>

<template>
    <div class="guestbook-form">
        <h3>Leave a Message</h3>
        <form>
            <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" placeholder="Your name..." required>
            </div>
            <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" name="message" rows="4" placeholder="Write your message here..."
                    required></textarea>
            </div>
            <button type="submit">Post Message</button>
        </form>
    </div>

    <div class="guestbook-entries">
        <div class="entry-item">
            <div class="entry-avatar">A</div>
            <div class="entry-content">
                <div class="entry-header">
                    <span class="entry-name">Avicenna</span>
                    <span class="entry-date">Oct 14, 2025</span>
                </div>
                <p class="entry-message">Test bang</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.guestbook-form {
    margin-top: 40px;
    margin-bottom: 50px;
}

.guestbook-form h3 {
    font-size: 18px;
    margin-bottom: 20px;
    font-weight: 500;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
}

.guestbook-form button {
    background-color: var(--text-orange);
    color: #fff;
    border: none;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.guestbook-form button:hover {
    background-color: #c96d38;
}

.guestbook-entries {
    margin-top: 30px;
}

.entry-item {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
}

.entry-item:last-child {
    border-bottom: none;
    margin-bottom: 0;
}

.entry-avatar {
    flex-shrink: 0;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background-color: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 16px;
}

.entry-content {
    flex-grow: 1;
}

.entry-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.entry-name {
    font-weight: 600;
    font-size: 15px;
}

.entry-date {
    font-size: 12px;
    color: var(--text-gray);
}

.entry-message {
    font-size: 14px;
    line-height: 1.7;
    color: var(--text-gray);
}
</style>