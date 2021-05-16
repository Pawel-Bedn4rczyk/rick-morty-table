import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Pagination extends Vue {
  @Prop() pageCounter!: number;
  @Prop() currentPage!: number;

  pagination = {
    page: this.currentPage,
    pageCount: this.pageCounter,
  };
  paginationFav = {
    page: 1,
    pageCount: 0,
  };
}
