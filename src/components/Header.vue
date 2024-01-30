<template>
  <header>
    <v-card color="grey-lighten-4" flat height="100px" rounded="0">
      <v-toolbar density="compact">
        <v-toolbar-title>Grupo A</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
    </v-card>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Header',
});
</script>

<style scoped>
/* Estilos específicos do componente Header */
/* header {
  background-color: #333;
  color: white;
  padding: 10px;
  text-align: center;
} */
</style>
