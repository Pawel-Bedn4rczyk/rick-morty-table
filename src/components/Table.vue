<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="characters"
      :items-per-page="20"
      :search="searchVal"
      :page.sync="paginationFav.page"
      mobile-breakpoint="916"
      hide-default-footer
      item-key="id"
      sort-by="id"
      @page-count="favCharactersTab ? (paginationFav.pageCount = $event) : ''"
    >
      <template v-slot:[`item.image`]="{ item }">
        <div
          :style="`padding:${mobile ? '10px 0 10px 0' : '10px 0 10px 90px'}`"
        >
          <v-img
            height="68"
            width="43"
            :src="item.image"
            alt="Character image"
          />
        </div>
      </template>
      <template v-slot:[`item.gender`]="{ item }">
        <div style="white-space: nowrap">
          <v-icon id="genderIcon" class="mr-1">
            {{ getGenderIcon(item.gender) }}
          </v-icon>
          {{ item.gender }}
        </div>
      </template>
      <template v-slot:[`item.fav`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              :outlined="!favCharactersTab"
              :width="favBtnSize"
              :height="favBtnSize"
              depressed
              color="#11b0c8"
              v-on="on"
              fab
              dark
              @click="handleAction(item)"
            >
              <v-icon dark>mdi-star</v-icon>
            </v-btn>
          </template>
          <span>{{ tooltipText }}</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <div
      class="text-center pt-7 d-flex justify-center justify-md-start"
      :style="`padding-left:${mobile ? '0' : '94px'}`"
    >
      <v-pagination
        v-if="!favCharactersTab"
        v-model="pagination.page"
        :length="pagination.pageCount"
        :total-visible="mobile ? '4' : '8'"
        color="#11B0C8"
        @input="handlePageChange"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
      ></v-pagination>
      <v-pagination
        v-else
        v-model="paginationFav.page"
        :length="paginationFav.pageCount"
        :total-visible="mobile ? '4' : '8'"
        color="#11B0C8"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
      ></v-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";
import { GenderE } from "@/enums";
import { CharacterI } from "@/interfaces";
import Pagination from "@/mixins/pagination";
import { DataTableHeader } from "vuetify";

@Component({
  mixins: [Pagination],
})
export default class Table extends Mixins(Vue, Pagination) {
  @Prop() favCharactersTab!: boolean;
  @Prop() searchVal?: string;
  @Prop() characters!: CharacterI[];
  @Prop() mobile!: boolean;

  addToFav(item?: CharacterI): void {
    this.$emit("favAdd", item);
  }

  handlePageChange(page: number): void {
    this.$emit("changePage", page);
  }

  deleteFromFav(item: CharacterI): void {
    this.$emit("openDeleteDialog", item);
  }

  handleAction(item: CharacterI): void {
    if (this.favCharactersTab) {
      return this.deleteFromFav(item);
    } else return this.addToFav(item);
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

  get tooltipText(): string {
    if (this.favCharactersTab) return "Remove from favorites";
    else return "Add to favorites";
  }

  get headers(): DataTableHeader[] {
    return [
      {
        text: "Photo",
        align: "start",
        sortable: false,
        value: "image",
        class: this.mobile ? "" : "tableLeftInd",
      },
      { text: "Character ID", value: "id" },
      { text: "Name", value: "name" },
      { text: "Gender", value: "gender" },
      { text: "Species", value: "species" },
      { text: "Last Episode", value: "episode" },
      {
        text: "Add To Favorites",
        value: "fav",
        sortable: false,
        width: "30%",
      },
    ];
  }

  get favBtnSize(): string {
    return this.mobile ? "35" : "43";
  }
}
</script>
<style scoped>
#genderIcon {
  color: #a9b1bd !important;
}
</style>
