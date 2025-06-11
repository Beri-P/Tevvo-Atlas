<template>
    <div class="country-detail">
      <h1>Country Detail Page</h1>
      <p>Country code: {{ code }}</p>
      <p>This component will show detailed country information.</p>
      
      <router-link to="/countries" class="back-btn">
        ← Back to Countries
      </router-link>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    code: {
      type: String,
      required: true
    }
  })
  </script>
  
  <style scoped>
  .country-detail {
    padding: 2rem;
    text-align: center;
  }
  
  .back-btn {
    display: inline-block;
    margin-top: 2rem;
    padding: 0.5rem 1rem;
    background: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 6px;
    transition: background-color 0.3s ease;
  }
  
  .back-btn:hover {
    background: #0056b3;
  }
  </style>