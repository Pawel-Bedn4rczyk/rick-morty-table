<template>
  <div>
    <v-row class="mx-10 pl-16 py-7" align="center" no-gutters>
      <Logo />
      <v-col cols="12" lg="4" class="ml-16 pl-16 d-flex align-center">
        <v-text-field
          v-model="search"
          class="defaultFontWeight"
          label="Start typing to search..."
          :color="defaultColor"
          height="56"
          outlined
          hide-details
          append-icon="mdi-magnify"
        >
        </v-text-field>
      </v-col>
    </v-row>
    <v-divider />
    <v-row class="mx-0 pt-7">
      <v-tabs
        v-model="tabModel"
        :slider-color="defaultColor"
        :color="defaultColor"
        class="mx-10 pl-16 pb-7"
      >
        <v-tab v-for="(tab, i) in tabs" :key="i" :class="`ml-${tab.margin}`">
          {{ tab.title }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tabModel">
        <v-tab-item v-for="tab in tabs" :key="tab.title">
          <Table
            :key="tab.title"
            :searchVal="search"
            :favCharactersTab="Boolean(tabModel)"
            :characters="getcharacters"
            @favAdd="favAdd"
            @openDeleteDialog="openDeleteDialog"
          />
        </v-tab-item>
      </v-tabs-items>
    </v-row>
    <v-snackbar v-model="snackbar" :color="defaultColor">
      {{ snackbarText }}
    </v-snackbar>
    <DeleteDialog
      v-model="deleteDialog"
      v-if="deleteDialog"
      :item="itemToDelete"
      @accept="removeFav"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Logo from "@/components/Logo.vue";
import Table from "@/components/Table.vue";
import DeleteDialog from "@/components/DeleteDialog.vue";
import { DashboardTabsE } from "@/enums";
import { CharacterI } from "@/interfaces";

@Component({
  components: {
    Logo,
    Table,
    DeleteDialog,
  },
})
export default class Dashboard extends Vue {
  tabModel = 0;
  search = "";
  defaultColor = "#11B0C8";
  snackbar = false;
  snackbarText = "";
  favChars: CharacterI[] = [];
  deleteDialog = false;
  itemToDelete: CharacterI | null = null;
  tabs = [
    {
      title: DashboardTabsE.ALL,
      margin: "0",
    },
    {
      title: DashboardTabsE.FAV,
      margin: "16",
    },
  ];
  // apollo = {
  //   characters: gql`
  //     query {
  //       info {
  //         count
  //         pages
  //       }
  //       results {
  //         id
  //         name
  //         image
  //         species
  //         status
  //         type
  //       }
  //     }
  //   `,
  // };
  // characters: CharacterI[] = [
  //   {
  //     id: 50,
  //     name: "Blim Blam",
  //     status: "Alive",
  //     species: "Alien",
  //     type: "Korblock",
  //     gender: "Male",
  //     origin: {
  //       name: "unknown",
  //       url: "",
  //     },
  //     location: {
  //       name: "Earth (Replacement Dimension)",
  //       url: "https://rickandmortyapi.com/api/location/20",
  //     },
  //     image: "https://rickandmortyapi.com/api/character/avatar/50.jpeg",
  //     episode: "S01E05",
  //     url: "https://rickandmortyapi.com/api/character/50",
  //     created: "2017-11-05T11:21:43.756Z",
  //   },
  //   {
  //     id: 22,
  //     name: "Aqua Rick",
  //     status: "unknown",
  //     species: "Humanoid",
  //     type: "Fish-Person",
  //     gender: "Male",
  //     origin: {
  //       name: "unknown",
  //       url: "",
  //     },
  //     location: {
  //       name: "Citadel of Ricks",
  //       url: "https://rickandmortyapi.com/api/location/3",
  //     },
  //     image: "https://rickandmortyapi.com/api/character/avatar/22.jpeg",
  //     episode: "S01E05",
  //     url: "https://rickandmortyapi.com/api/character/22",
  //     created: "2017-11-04T22:41:07.171Z",
  //   },
  //   {
  //     id: 361,
  //     name: "Toxic Rick",
  //     status: "Dead",
  //     species: "Humanoid",
  //     type: "Rick's toxic side",
  //     gender: "Male",
  //     origin: {
  //       name: "Detoxifier",
  //       url: "https://rickandmortyapi.com/api/location/64",
  //     },
  //     location: {
  //       name: "Earth (Replacement Dimension)",
  //       url: "https://rickandmortyapi.com/api/location/20",
  //     },
  //     image: "https://rickandmortyapi.com/api/character/avatar/361.jpeg",
  //     episode: "S01E05",
  //     url: "https://rickandmortyapi.com/api/character/361",
  //     created: "2018-01-10T18:20:41.703Z",
  //   },
  //   {
  //     id: 225,
  //     name: "Michael Thompson",
  //     status: "Alive",
  //     species: "Humanoid",
  //     type: "Conjoined twin",
  //     gender: "Male",
  //     origin: {
  //       name: "unknown",
  //       url: "",
  //     },
  //     location: {
  //       name: "Interdimensional Cable",
  //       url: "https://rickandmortyapi.com/api/location/6",
  //     },
  //     image: "https://rickandmortyapi.com/api/character/avatar/225.jpeg",
  //     episode: "S01E05",
  //     url: "https://rickandmortyapi.com/api/character/225",
  //     created: "2017-12-30T15:59:31.558Z",
  //   },
  //   {
  //     id: 120,
  //     name: "Evil Summer Clone",
  //     status: "Dead",
  //     species: "Human",
  //     type: "Clone",
  //     gender: "Female",
  //     origin: {
  //       name: "unknown",
  //       url: "",
  //     },
  //     location: {
  //       name: "Earth (C-137)",
  //       url: "https://rickandmortyapi.com/api/location/1",
  //     },
  //     image: "https://rickandmortyapi.com/api/character/avatar/120.jpeg",
  //     episode: "S01E05",
  //     url: "https://rickandmortyapi.com/api/character/120",
  //     created: "2017-12-26T16:24:02.059Z",
  //   },
  // ];

  favCharItemIndex(item: CharacterI): number {
    return this.favChars.findIndex((char) => char.id === item.id);
  }

  openSnackbar(text: string): void {
    this.snackbarText = text;
    this.snackbar = true;
  }

  openDeleteDialog(item: CharacterI): void {
    this.itemToDelete = item;
    this.deleteDialog = true;
  }

  favAdd(item: CharacterI): void {
    if (item) {
      if (this.favCharItemIndex(item) > -1) {
        this.openSnackbar("This character is already on the list of favorites");
      } else {
        this.favChars.push(item);
        this.openSnackbar("Successfully added to list");
      }
    }
    this.favStorageUpdate();
  }

  removeFav(): void {
    if (this.itemToDelete) {
      let index = this.favCharItemIndex(this.itemToDelete);
      if (index > -1) {
        this.favChars.splice(index, 1);
        this.favStorageUpdate();
        this.itemToDelete = null;
        this.openSnackbar("Successfully deleted from list");
      }
    }
  }

  favStorageUpdate(): void {
    localStorage.removeItem("favChars");
    const parsedFavChars = JSON.stringify(this.favChars);
    localStorage.setItem("favChars", parsedFavChars);
  }

  setStorageData(): void {
    if (localStorage.getItem("favChars"))
      try {
        const parsedData = JSON.parse(localStorage.favChars);
        this.favChars = parsedData;
      } catch (e) {
        localStorage.removeItem("favChars");
      }
  }

  get getcharacters(): CharacterI[] {
    switch (this.tabModel) {
      case 0:
        return [];
      case 1:
        return this.favChars;
      default:
        return [];
    }
  }

  mounted(): void {
    this.setStorageData();
  }
}
</script>
