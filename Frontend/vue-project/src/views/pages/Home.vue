<template>
  <div>
    <h1>Welcome to Site</h1>
    <div class="events-grid">
      <div class="event-box" v-for="post in posts" :key="post.event_id">
        <h2>{{ post.name }}</h2>
        <p>{{ post.description }}</p>
        <p><strong>Location:</strong> {{ post.location }}</p>
        <p><strong>Start Date:</strong> {{ new Date(post.start_date).toLocaleDateString() }}</p>
        <p><strong>Close Registration:</strong> {{ new Date(post.close_registration).toLocaleDateString() }}</p>
        <p><strong>Max Attendees:</strong> {{ post.max_attendees }}</p>
      </div>
    </div>
    <div v-if="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { getService } from "../../services/get.service";

export default {
  data() {
    return {
      posts: [],
      error: null,
    };
  },
  mounted() {
    getService.getEvents()
      .then(events => {
        this.posts = events;
      })
      .catch(error => {
        this.error = "Failed to load events";
        console.error(error);
      });
  }
};
</script>

<style scoped>
.events-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;
}

.event-box {
  background-color: #f9f9f9;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.event-box h2 {
  margin-top: 0;
}

.event-box p {
  margin: 5px 0;
}
</style>

//