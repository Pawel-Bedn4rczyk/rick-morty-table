<template>
  <div>
    <v-row
      class="mx-md-10 pl-md-16 py-7"
      justify="center"
      justify-md="start"
      align="center"
      no-gutters
    >
      <Logo />
      <v-col
        cols="10"
        md="5"
        lg="4"
        xl="3"
        class="ml-2 ml-md-16 pt-5 pt-md-0 pl-md-16 d-flex justify-center"
      >
        <v-text-field
          v-model="search"
          :color="defaultColor"
          class="defaultFontWeight"
          label="Start typing to search..."
          height="56"
          outlined
          hide-details
          append-icon="mdi-magnify"
        >
        </v-text-field>
      </v-col>
    </v-row>
    <v-divider />
    <v-row v-if="checkCharacterArrays" class="mx-0 py-10">
      <v-tabs
        v-model="tabModel"
        :slider-color="defaultColor"
        :color="defaultColor"
        :grow="$vuetify.breakpoint.smAndDown"
        class="mx-2 mx-md-10 pl-md-16 pb-7"
      >
        <v-tab
          v-for="(tab, i) in tabs"
          :key="i"
          :class="bpMdAndUp ? 'tabMargin' : ''"
        >
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
            :pageCounter="pagination.pageCounter"
            :currentPage="pagination.currentPage"
            :mobile="!bpMdAndUp"
            @changePage="setCharacters"
            @favAdd="favAdd"
            @openDeleteDialog="openDeleteDialog"
          />
        </v-tab-item>
      </v-tabs-items>
    </v-row>
    <v-row justify="center" align="center" class="ma-0 mt-16" v-else>
      <v-progress-circular
        size="80"
        indeterminate
        :color="defaultColor"
      ></v-progress-circular>
    </v-row>

    <v-snackbar v-model="snackbar.model" :color="defaultColor">
      {{ snackbar.text }}
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
import { Component, Vue, Watch } from "vue-property-decorator";
import Logo from "@/components/Logo.vue";
import Table from "@/components/Table.vue";
import DeleteDialog from "@/components/DeleteDialog.vue";
import { DashboardTabsE } from "@/enums";
import { CharacterI } from "@/interfaces";
import axios from "axios";

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
  deleteDialog = false;
  itemToDelete: CharacterI | null = null;
  charactersModified: CharacterI[] = [];
  allCharacters: CharacterI[] = [];
  favChars: CharacterI[] = [];

  snackbar = {
    model: false,
    text: "",
  };

  pagination = {
    pageCounter: 0,
    currentPage: 1,
  };

  tabs = [
    {
      title: DashboardTabsE.ALL,
    },
    {
      title: DashboardTabsE.FAV,
    },
  ];

  favCharItemIndex(item: CharacterI): number {
    return this.favChars.findIndex((char) => char.id === item.id);
  }

  openSnackbar(text: string): void {
    this.snackbar.text = text;
    this.snackbar.model = true;
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

  async setCharacters(page = 1): Promise<void> {
    this.allCharacters = [];
    this.charactersModified = [];
    await axios
      .get(`https://rickandmortyapi.com/api/character/?page=${page}`)
      .then((response) => {
        this.pagination.pageCounter = response.data.info.pages;
        this.pagination.currentPage = page;
        this.allCharacters = response.data.results;
      })
      .catch((error: Error) => console.error(error));
  }

  prepareData(): void {
    this.allCharacters.map((el: CharacterI) => {
      const lastUrl = this.getLastEpisodeUrl(el.episode);
      this.getEpisodeByChar(el, lastUrl);
    });
  }

  async getEpisodeByChar(item: CharacterI, lastUrl: string): Promise<void> {
    let episode = "";
    let itemCopy: CharacterI = { ...item };
    const slashIndex = lastUrl.lastIndexOf("/");
    const episodeId = lastUrl.substring(slashIndex + 1);
    await axios
      .get(`https://rickandmortyapi.com/api/episode/${Number(episodeId)}`)
      .then((resp) => (episode = resp.data.episode))
      .catch((error: Error) => console.error(error));

    if (episode) {
      itemCopy.episode = episode;
      this.charactersModified.push(itemCopy);
    }
  }

  getLastEpisodeUrl(episodes: string | string[]): string {
    let allEpisodes = episodes;
    return allEpisodes[allEpisodes.length - 1];
  }

  get getcharacters(): CharacterI[] {
    switch (this.tabModel) {
      case 0:
        return this.charactersModified;
      case 1:
        return this.favChars;
      default:
        return [];
    }
  }

  get checkCharacterArrays(): boolean {
    return this.charactersModified.length === this.allCharacters.length;
  }

  get bpMdAndUp(): boolean {
    return this.$vuetify.breakpoint.mdAndUp;
  }

  @Watch("allCharacters")
  onAllCharactersChange(): void {
    this.prepareData();
  }

  mounted(): void {
    this.setCharacters();
    this.setStorageData();
  }
}
</script>
<style scoped>
.tabMargin:nth-child(3) {
  margin-left: 70px;
}
</style>
