export default function(Model, url, queries = {}) {
  return {
    state: () => ({
      list: []
    }),
    getters: {
      list(state) {
        return state.list
      }
    },
    mutations: {
      set_list(state, { list }) {
        state.list = list
      },
      create_item(state, { item }) {
        state.list.push(item)
      },
      update_item(state, { item }) {
        state.list = state.list.map((value) => {
          if(value._id == item._id) {
            return item
          }
          return value
        })
      },
      remove_item(state, { id }) {
        state.list = state.list.filter((value) => {
          return value._id !== id
        })
      }
    },
    actions: {
      readAll({ commit }) {
        return new Promise(async (resolve, reject) => {
          const data = await this.$axios.$get(`${url}?${queries['readAll']}`)
          const list = data.map((value) => (new Model(value)))
          commit('set_list', { list })
          resolve()
        })
      },
      read({ }, { id }) {
        return new Promise(async (resolve, reject) => {
          const data = await this.$axios.$get(`${url}/${id}?${queries['read']}`)
          const item = new Model(data)
          resolve(item)
        })
      },
      create({ commit }, { new_item }) {
        return new Promise(async (resolve, reject) => {
          const data = await this.$axios.$post(`${url}?${queries['create']}`, new_item)
          const item = new Model(data)
          const data_for_list = await this.$axios.$get(`${url}/${item._id}?${queries['readAll']}`)
          const item_for_list = new Model(data_for_list)
          commit('create_item', { item: item_for_list })
          resolve(item)
        })
      },
      update({ commit }, { updated_item }) {
        return new Promise(async (resolve, reject) => {
          const data = await this.$axios.$put(`${url}/${updated_item._id}?${queries['update']}`, updated_item)
          const item = new Model(data)
          const data_for_list = await this.$axios.$get(`${url}/${item._id}?${queries['readAll']}`)
          const item_for_list = new Model(data_for_list)
          commit('update_item', { item: item_for_list })
          resolve(item)
        })
      },
      remove({ commit, axios }, { id }) {
        return new Promise(async (resolve, reject) => {
          await this.$axios.$delete(`${url}/${id}?${queries['remove']}`)
          commit('remove_item', { id })
          resolve()
        })
      }
    }
  }
}