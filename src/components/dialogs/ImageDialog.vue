<template>
  <div>
    <v-dialog
      v-model="value"
      max-width="500"
      @click:outside="$emit('input', false)"
    >
      <v-card>
        <v-card-title class="dialogTitle text-center d-flex justify-center">
          {{ charName }}
        </v-card-title>
        <v-card-text>
          <v-row justify="space-around" align="center" no-gutters>
            <v-img
              :src="imageUrl"
              :alt="`${charName} image`"
              aspect-ratio
            ></v-img>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class ImageDialog extends Vue {
  @Prop() value!: boolean;
  @Prop() imageUrl!: string;
  @Prop() charName!: string;
}
</script>
