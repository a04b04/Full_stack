<template>
    <div class="container">
    <div class="box">
      <form @submit.prevent="handleSubmit">
        <label for="name">Event Name:</label>
        <input type="text" id="name" v-model="event.name" required />

        <label for="description">Description:</label>
        <textarea id="description" v-model="event.description" required></textarea>

        <label for="location">Location:</label>
        <input type="text" id="location" v-model="event.location" required />

        <label for="start_date">Start Date:</label>
        <input type="date" id="start_date" v-model="event.start_date" required />

        <label for="close_registration">Close Registration:</label>
        <input type="date" id="close_registration" v-model="event.close_registration" required />

        <label for="max_attendees">Max Attendees:</label>
        <input type="number" id="max_attendees" v-model="event.max_attendees" required />

        <button type="submit">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
export default{
    data() {
    return {
      event: {
        name: '',
        description: '',
        location: '',
        start_date: '',
        close_registration: '',
        max_attendees: ''
      }
    };
},
methods: {
    handleSubmit() {
      // Handle form submission logic here
      console.log('Event details:', this.event);
      alert('Event submitted!');
    }
  }
};

</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.box {
  background-color: #f9f9f9;
  padding: 40px;
  width: 400px;
  border: 2px solid #60a3d9;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.box form {
  display: flex;
  flex-direction: column;
}

.box label {
  margin-bottom: 5px;
  font-weight: bold;
}

.box input,
.box textarea {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.box button {
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #4a8bb1;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.box button:hover {
  background-color: #3a6b91;
}
</style>
