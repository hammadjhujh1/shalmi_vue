<template>
    <div>
      <h1>Manager</h1>
      <p>Email: {{ email }}</p>
      <p>Role: {{ role }}</p>
    </div>
  </template>
  
  <script>
  export default {
    props: ['email', 'role'],
  };
  </script>