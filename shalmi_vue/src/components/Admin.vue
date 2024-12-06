<template>
    <div>
      <h1>Admin</h1>
      <p>Email: {{ email }}</p>
      <p>Role: {{ role }}</p>
    </div>
  </template>
  
  <script>
  export default {
    props: ['email', 'role'],
  };
  </script>