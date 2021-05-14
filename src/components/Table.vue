<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="characters"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      @page-count="pageCount = $event"
      item-key="id"
      :search="searchVal"
    >
      <template v-slot:body="{ items }">
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>
              <v-img
                height="68"
                width="43"
                :src="item.image"
                alt="Character image"
              />
            </td>
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>
              <v-icon id="genderIcon" class="mr-1">
                {{ getGenderIcon(item.gender) }}
              </v-icon>
              {{ item.gender }}
            </td>
            <td>{{ item.species }}</td>
            <td>{{ item.episode }}</td>
            <td>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    @click="handleAction(item)"
                    depressed
                    :outlined="!favCharactersTab"
                    width="43"
                    height="43"
                    color="#11b0c8"
                    v-on="on"
                    fab
                    dark
                  >
                    <v-icon dark>mdi-star</v-icon>
                  </v-btn>
                </template>
                <span>{{ tooltipText }}</span>
              </v-tooltip>
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
    <div
      class="text-center pt-7 d-flex justify-start"
      style="padding-left: 94px"
    >
      <v-pagination
        v-model="page"
        :length="pageCount"
        total-visible="8"
        color="#11B0C8"
        class="text-red"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
      ></v-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { DashboardTabsE, GenderE } from "@/enums";
import { CharacterI } from "@/interfaces";
import { DataTableHeader } from "vuetify";

@Component
export default class Table extends Vue {
  @Prop() searchVal?: string;
  @Prop() characters!: CharacterI[];
  @Prop() favCharactersTab!: boolean;

  page = 1;
  pageCount = 0;
  itemsPerPage = 8;
  DashboardTabsEnum = DashboardTabsE;
  headers: DataTableHeader[] = [
    {
      text: "Photo",
      align: "start",
      sortable: false,
      value: "image",
      class: "tableLeftInd",
    },
    { text: "Character ID", value: "id" },
    { text: "Name", value: "name" },
    { text: "Gender", value: "gender" },
    { text: "Species", value: "species" },
    { text: "Last Episode", value: "episode" },
    {
      text: "Add To Favorites",
      value: "url",
      sortable: false,
      class: "tableRightInd",
    },
  ];

  addToFav(item?: CharacterI): void {
    this.$emit("favAdd", item);
  }

  deleteFromFav(item: CharacterI): void {
    this.$emit("openDeleteDialog", item);
  }

  getGenderIcon(gender: GenderE): string {
    switch (gender) {
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

  handleAction(item: CharacterI): void {
    if (this.favCharactersTab) {
      return this.deleteFromFav(item);
    } else return this.addToFav(item);
  }

  get tooltipText(): string {
    if (this.favCharactersTab) return "Remove from favorites";
    else return "Add to favorites";
  }
}
</script>
<style scoped>
#genderIcon {
  color: #a9b1bd !important;
}
</style>
