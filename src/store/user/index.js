export default {
  namespaced: true,
  state: {
    token: null,
    data: null
  },
  getters: {},
  mutations: {
    UPDATE_USER_TOKEN(state, token) {
      state.token = token
    },
    UPDATE_USER_DATA(state, data) {
      state.data = data
    },
  },
  actions: {},
}
