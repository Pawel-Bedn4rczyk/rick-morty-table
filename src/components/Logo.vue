<template>
  <div>
    <v-img
      height="70"
      width="240"
      src="@/assets/rmLogo.png"
      alt="Rick & Morty Logo"
    ></v-img>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Logo extends Vue {}
</script>
<style scoped></style>
