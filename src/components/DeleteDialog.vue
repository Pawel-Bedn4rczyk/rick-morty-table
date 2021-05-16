<template>
  <div>
    <v-dialog v-model="value" persistent max-width="700">
      <v-card>
        <v-card-title class="title text-center d-flex justify-center">
          Are you sure you want to remove this character from the list?
        </v-card-title>
        <v-card-text>
          <v-row justify="space-around" align="center" no-gutters>
            <v-img
              max-width="250"
              :src="item.image"
              alt="Character image"
            ></v-img>
            <v-list>
              <v-list-item v-for="(obj, i) in itemData" :key="i">
                <v-list-item-icon>
                  <v-icon color="#11b0c8"> {{ obj.icon }} </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="title">
                    {{ item[obj.key] }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions class="d-flex justify-md-end justify-center">
          <v-btn color="#a9b1bd" text @click="closeDialog"> Cancel</v-btn>
          <v-btn color="#11b0c8" text @click="deleteItem"> Delete </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { CharacterI } from "@/interfaces";
import { GenderE } from "@/enums";

@Component
export default class DeleteDialog extends Vue {
  @Prop() value!: boolean;
  @Prop() item!: CharacterI;

  closeDialog(): void {
    this.$emit("input", false);
  }

  deleteItem(): void {
    this.$emit("accept");
    this.closeDialog();
  }

  get getGenderIcon(): string {
    switch (this.item.gender) {
      case GenderE.MALE:
        return "mdi-gender-male";
      case GenderE.FEMALE:
        return "mdi-gender-female";
      case GenderE.GENDERLESS:
        return "mdi-close";
      default:
        return "mdi-minus";
    }
  }

  get itemData(): Array<{ key: string; icon: string }> {
    return [
      {
        key: "id",
        icon: "mdi-identifier",
      },
      {
        key: "name",
        icon: "mdi-account",
      },
      {
        key: "gender",
        icon: this.getGenderIcon,
      },
      {
        key: "species",
        icon: "mdi-human",
      },
      {
        key: "episode",
        icon: "mdi-video-vintage",
      },
    ];
  }
}
</script>
<style scoped>
.title {
  font-size: 16px !important;
  color: #a9b1bd;
}
</style>
