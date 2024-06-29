<template>
  <section>
    <b-modal
      ref="notifiaction-modal"
      id="notifiaction-modal"
      no-close-on-backdrop
      no-close-on-esc
      hide-header-close
      ok-only
      ok-title="متوجه شدم"
      centered
      size="lg"
    >
      <div v-if="notification">
        <p><strong>عنوان پیام:</strong> {{ notification.title }}</p>
        <p><strong>متن پیام:</strong> {{ notification.text }}</p>
        <img :src="notification.media.image" v-if="notification.media && notification.media.image" style="max-width: 100%;">
        <video :src="notification.media.video" v-if="notification.media && notification.media.video" style="max-width: 100%;" controls></video>
        <audio :src="notification.media.voice" v-if="notification.media && notification.media.voice" style="max-width: 100%;" controls></audio>
        <p>
          <b-link
            v-if="notification.media && notification.media.file"
            :href="notification.media.file"
            class="mr-1"
          >
            <b-button variant="success">دریافت فایل</b-button>
          </b-link>
          <b-link
            v-if="notification.link && notification.link"
            :href="notification.link"
            target="_blank"
          >
            <b-button variant="info">مشاهده لینک</b-button>
          </b-link>
        </p>
      </div>
    </b-modal>
    <b-nav-item-dropdown
      class="dropdown-notification mr-25"
      menu-class="dropdown-menu-media"
      right
    >
      <template #button-content>
        <feather-icon
          :badge="notifications.length"
          badge-classes="bg-danger"
          class="text-body"
          icon="BellIcon"
          size="21"
        />
      </template>

      <!-- Header -->
      <li class="dropdown-menu-header">
        <div class="dropdown-header d-flex">
          <h4 class="notification-title mb-0 mr-auto">
            اعلانات
          </h4>
          <b-badge
            pill
            variant="light-primary"
          >
            {{notifications.length}} پیام جدید
          </b-badge>
        </div>
      </li>

      <!-- Notifications -->
      <vue-perfect-scrollbar
        :settings="perfectScrollbarSettings"
        class="scrollable-container media-list scroll-area"
        tagname="li"
      >
        <!-- Account Notification -->
        <b-link v-for="notification in notifications" :key="notification._id"
          @click="openNotification(notification._id)"
        >
          <b-media>
            <template #aside>
              <b-avatar
                size="32"
                :variant="notification.periority === 0 ? 'light-danger' : (notification.periority === 1 ? 'light-warning' : 'light-info')"
              >
                <img :src="notification.media.icon" v-if=" notification.media && notification.media.icon">
                <feather-icon icon="InfoIcon" v-if="!notification.media || !notification.media.icon"/>
              </b-avatar>
            </template>
            <p class="media-heading">
              <span class="font-weight-bolder">
                {{notification.title}}
              </span>
            </p>
            <small class="notification-text">{{ notification.text }}</small>
          </b-media>
        </b-link>

        <p class="notification-text p-1 text-center" v-if="notifications.length == 0">پیامی جدید ندارید</p>

      </vue-perfect-scrollbar>

      <!-- Cart Footer -->

    </b-nav-item-dropdown>
  </section>
</template>

<script>
import {
  BNavItemDropdown, BBadge, BMedia, BLink, BAvatar, BButton, BFormCheckbox,
  BModal,
} from 'bootstrap-vue'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import Ripple from 'vue-ripple-directive'

export default {
  components: {
    BNavItemDropdown,
    BBadge,
    BMedia,
    BLink,
    BAvatar,
    VuePerfectScrollbar,
    BButton,
    BFormCheckbox,
    BModal,
  },
  directives:{
    Ripple
  },
  data() {
    return {
      notifications: [],
      perfectScrollbarSettings: {
        maxScrollbarLength: 60,
        wheelPropagation: false,
      },
      notification: null,
    }
  },
  mounted(){
  },
  methods: {
  },
}
</script>

<style>

</style>
