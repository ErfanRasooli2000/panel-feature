<template>
  <div>
    <b-card>
      <b-card-header header-bg-variant="info">
        <b-card-title>لیست آلبوم ها</b-card-title>
      </b-card-header>
      <b-card-body
          class="bg-white"
      >
        <div>
          <b-table
              :fields="fields"
              :items="items"
              class="text-center"
              responsive="sm"
          >
            <template #cell(action)="data">
              <b-dropdown
                  size="sm"
                  text="عملیات"
                  variant="outline-primary"
              >
                <b-dropdown-item
                    :to="{name: 'Album_Edit' , params:{id: data.item.id}}">
                  <feather-icon
                      icon="EditIcon"
                      class="text-danger"
                  />
                  ویرایش آلبوم
                </b-dropdown-item>
              </b-dropdown>
            </template>
          </b-table>
        </div>
        <b-pagination class="mt-2"
                      v-model="currentPage"
                      :total-rows="totalRows"
                      :per-page="perPage"
        />
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import {
  BTable,
  BProgress,
  BBadge,
  BCardHeader,
  BCardTitle,
  BCardBody,
  BDropdown,
  BButton,
  BDropdownItem, BSpinner, BModal,
  BAlert, BPagination,
} from 'bootstrap-vue'

export default {
  name: 'Albums_List',
  components: {
    BPagination,
    BModal,
    BSpinner,
    BDropdownItem,
    BButton,
    BDropdown,
    BCardBody,
    BCardTitle,
    BCardHeader,
    BTable,
    BProgress,
    BBadge,
    BAlert,
  },
  data() {
    return {
      fields: [
        { key: 'id', label: 'شناسه' },
        { key: 'name_fa', label: 'نام فارسی' },
        { key: 'name_en', label: 'نام انگلیسی' },
        { key: 'action', label: 'عملیات' },
      ],
      items: [],
      onProgress: false,
      totalRows: null,
      perPage: 15,
      currentPage: 1
    }
  },
  methods: {
    getAlbumsList() {
      this.$http.get(`albums/list?perPage=${this.perPage}&page=${this.currentPage}`)
          .then(({data}) => {
            if (data.status){
              this.items = data.data
              this.currentPage = data.meta.current_page
              this.perPage = data.meta.per_page
              this.totalRows = data.meta.total
            }else{
              this.$bvToast.toast('دریافت لیست آلبوم ها با خطا مواجه شد' ,{
                title: 'خطا در دریافت اطلاعات',
                toaster: 'b-toaster-top-right',
                variant: 'danger'
              })
            }
          })
          .catch(()=>{})
    },
  },
  mounted() {
    this.getAlbumsList();
  },
  watch: {
    'currentPage'(newVal, oldVal){
      if (newVal != oldVal){
        this.getAlbumsList();
      }
    }
  }
}
</script>
