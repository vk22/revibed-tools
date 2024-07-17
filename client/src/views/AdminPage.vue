<template>
  <div class="mb-6">
    <router-link :to="`/`">Index Page</router-link>
  </div>
  <AdminLogs />
  <UsersList />
</template>

<script setup>
  import AdminLogs from '@/components/AdminLogs.vue'
  import UsersList from '@/components/UsersList.vue'
</script>
