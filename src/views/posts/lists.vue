<template>
  <div>
    <b-card>
      <b-card-header header-bg-variant="info">
        <b-card-title>لیست پست ها</b-card-title>
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

            <template #cell(categories)="data">
              <b-badge v-for="(category, index) in data.value" :key="index" variant="success" class="mr-1">{{ category.name }}</b-badge>
            </template>

            <template #cell(action)="data">
              <b-dropdown
                  size="sm"
                  text="عملیات"
                  variant="outline-primary"
              >
                <b-dropdown-item
                    :to="{name: 'Post_Edit' , params:{id: data.item.id}}">
                  <feather-icon
                      icon="EditIcon"
                      class="text-warning"
                  />
                  ویرایش پست
                </b-dropdown-item>
                <b-dropdown-item
                    :to="{name: 'Artist_Edit' , params:{id: data.item.id}}">
                  <feather-icon
                      icon="CheckIcon"
                      class="text-success"
                  />
                  نمایش پست
                </b-dropdown-item>
                <b-dropdown-item
                    :to="{name: 'Artist_Edit' , params:{id: data.item.id}}">
                  <feather-icon
                      icon="DeleteIcon"
                      class="text-danger"
                  />
                  حذف پست
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
  name: 'Post_List',
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
        { key: 'title', label: 'موضوع' },
        { key: 'creator.name', label: 'سازنده' },
        { key: 'categories', label: 'دسته بندی ها' },
        { key: 'created_at', label: 'تاریخ ساخت' },
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
    getPostsList() {
      this.$http.get(`blog-post/index?perPage=${this.perPage}&page=${this.currentPage}`)
          .then(({data}) => {
            if (data.status){
              this.items = data.data
              this.currentPage = data.meta.current_page
              this.perPage = data.meta.per_page
              this.totalRows = data.meta.total
            }else{
              this.$bvToast.toast('دریافت لیست چرخش ها با خطا مواجه شد' ,{
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
    this.getPostsList();
  },
  watch: {
    'currentPage'(newVal, oldVal){
      if (newVal != oldVal){
        this.getPostsList();
      }
    }
  }
}
</script>
