<template>
  <b-card>
    <b-card-header header-bg-variant="info">
      <b-card-title>نوشتن پست</b-card-title>
    </b-card-header>
    <b-card-body>
      <editor
          v-model="content"
          api-key="p23ivpyb4vagnq2z1yty9cgnlz0hxawfv2s5wt4zn7a5vkdo"
          :init="{
            selector: 'textarea#open-source-plugins',
            plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion',
            editimage_cors_hosts: ['picsum.photos'],
            menubar: 'file edit view insert format tools table help',
            toolbar: 'undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl',
            autosave_ask_before_unload: true,
            autosave_interval: '30s',
            autosave_prefix: '{path}{query}-{id}-',
            autosave_restore_when_empty: false,
            autosave_retention: '2m',
            image_advtab: true,
            link_list: [
              { title: 'My page 1', value: 'https://www.tiny.cloud' },
              { title: 'My page 2', value: 'http://www.moxiecode.com' }
            ],
            image_list: [
              { title: 'My page 1', value: 'https://www.tiny.cloud' },
              { title: 'My page 2', value: 'http://www.moxiecode.com' }
            ],
            image_class_list: [
              { title: 'None', value: '' },
              { title: 'Some class', value: 'class-name' }
            ],
            importcss_append: true,
            file_picker_callback: (callback, value, meta) => {
              /* Provide file and text for the link dialog */
              if (meta.filetype === 'file') {
                callback('https://www.google.com/logos/google.jpg', { text: 'My text' });
              }

              /* Provide image and alt text for the image dialog */
              if (meta.filetype === 'image') {
                callback('https://www.google.com/logos/google.jpg', { alt: 'My alt text' });
              }

              /* Provide alternative source and posted for the media dialog */
              if (meta.filetype === 'media') {
                callback('movie.mp4', { source2: 'alt.ogg', poster: 'https://www.google.com/logos/google.jpg' });
              }
            },
            height: 600,
            image_caption: true,
            quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
            noneditable_class: 'mceNonEditable',
            toolbar_mode: 'sliding',
            contextmenu: 'link image table',
            skin: useDarkMode ? 'oxide-dark' : 'oxide',
            content_css: useDarkMode ? 'dark' : 'default',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
      }"
      />
    </b-card-body>
  </b-card>
</template>
<script>
import {
  BButton,
  BCard,
  BCardBody,
  BCardHeader, BCardTitle,
  BCol,
  BForm,
  BFormCheckbox, BFormFile,
  BFormGroup,
  BFormInput, BFormRadio, BFormText, BFormTextarea, BInputGroup, BInputGroupPrepend, BOverlay, BRow, BSpinner
} from 'bootstrap-vue'
import VSelect from 'vue-select'
import editor from '@tinymce/tinymce-vue'
export default {
  name: 'Create_Post',
  components: {
    editor,
    BOverlay,
    BFormFile,
    BFormTextarea,
    BSpinner,
    BFormText,
    BRow,
    BCardTitle,
    BCardHeader,
    BCol,
    BFormGroup,
    BForm,
    BFormCheckbox,
    VSelect,
    BCard,
    BCardBody,
    BButton,
    BFormInput,
    BInputGroup,
    BInputGroupPrepend,
    BFormRadio,
  },
  data(){
    return {
      content : '',
      onProgress: false
    }
  },
  methods: {
  }
}
</script>
