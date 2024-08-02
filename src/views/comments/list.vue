<template>
  <b-card bg-variant="bg-white">
    <b-card-header>
      <b-card-title>لیست کامنت ها</b-card-title>
    </b-card-header>
    <b-card-body class="bg-white">
      <b-table
          :fields="fields"
          :items="commentsList"
      >

        <template #cell(action)="data">
          <b-dropdown
              size="md"
              text="عملیات"
              variant="outline-primary">

            <b-dropdown-item
                @click="showComment(data.item.id)">
            >
              <feather-icon
                  icon="EditIcon"
                  class="text-warning"
                  v-b-modal.modal-scrollable
              />
              مشاهده کامنت
            </b-dropdown-item>

            <b-dropdown-item
                @click="changeCommentStatus(data.item.id,'Accept')">
            >
              <feather-icon
                  icon="EditIcon"
                  class="text-warning"
              />
              تایید کامنت
            </b-dropdown-item>

            <b-dropdown-item
                @click="changeCommentStatus(data.item.id,'Reject')">
            >
              <feather-icon
                  icon="EditIcon"
                  class="text-warning"
              />
              رد کامنت
            </b-dropdown-item>

          </b-dropdown>
        </template>
      </b-table>
    </b-card-body>

    <!-- modal Scrolling Content inside Modal-->
    <b-modal
        id="modal-scrollable"
        scrollable
        title="Scrollable Content"
        cancel-title="Close"
        ok-title="Accept"
        cancel-variant="outline-secondary"
    >
<!--      <b-card-text-->
<!--          v-for="(content,index) in scrollContent"-->
<!--          :key="index"-->
<!--      >-->
<!--        {{ content }}-->
<!--      </b-card-text>-->
    </b-modal>

  </b-card>

</template>

<script>

import {
  BButton,
  BCard,
  BCardBody,
  BCardHeader,
  BCardTitle,
  BCol,
  BDropdown,
  BDropdownItem,
  BForm,
  BFormCheckbox,
  BFormFile,
  BFormGroup,
  BFormInput,
  BFormRadio,
  BFormText,
  BFormTextarea,
  BInputGroup,
  BInputGroupPrepend,
  BModal,
  BOverlay,
  BRow,
  BSpinner,
  BTable
} from 'bootstrap-vue'

export default {
  name: "Comments_List",

  components:{
    BTable,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BDropdownItem,
    BModal,
    BDropdown,
    BCol,
    BForm,
    BFormCheckbox,
    BFormFile,
    BFormGroup,
  },

  data(){
    return{
      onProgress: false,
      commentsList: [],
      fields: [
        {key: 'id' , label : "شناسه"},
        {key: 'post.title' , label : "نام پست"},
        {key: 'stats.value' , label : "وضعیت"},
        {key: 'creator.name' , label : "نام کاربر"},
        {key: 'created_at' , label : "تاریخ ساخت"},
        {key: 'action' , label : "عملیات"},
      ],
    }
  },

  mounted() {
    this.getComments();
  },

  methods: {
    async getComments(){
      await this.$http.get('comments/index')
          .then(({data})=>{
            this.commentsList = data.data
          })
          .catch((err)=>{})
    },

    async changeCommentStatus(id,type){
      await this.$http.post(`comments/change-status/${id}`,{
        'type' : type
      })
          .then(({data})=>{
            if(data.status)
            {
              this.$bvToast.toast('کامنت با موفقیت تعیین وضعیت شد.', {
                title: 'موفقیت',
                toaster: 'b-toaster-top-right',
                variant: 'success',
              })

              this.getComments();
            }
          })
          .catch((err)=>{})
    },

    async showComment(id){
      this.$http.get(`comments/show/${id}`)
          .then(({ data }) => {
            this.scrollContent = data.content; // assuming the content is in data.content
            this.$bvModal.show('modal-scrollable');
          })
          .catch((err) => { })
    }
  }
}


</script>
