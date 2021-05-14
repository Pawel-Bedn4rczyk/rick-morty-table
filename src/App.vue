<template>
  <v-app>
    <v-main>
      <Dashboard />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Dashboard from "@/components/Dashboard.vue";

@Component({
  components: { Dashboard },
})
export default class App extends Vue {}
</script>
