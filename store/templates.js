export const state = function() {
  return {
    templates: {}
  }
}

export const getters = {
  template: (state) => (filename) => {
    return state.templates[filename]
  }
}
    
export const mutations = {
  set_template(state, { filename, template }) {
    state.templates[filename] = template
  }
}

export const actions = {
  download({ state, commit }, { filename }) {
    return new Promise(async (resolve, reject) => {
      const { data } = await this.$axios.get("/"+filename, {
        responseType: "arraybuffer"
      })
      let template = data
      commit('set_template', { filename, template })
      resolve()
    })
  }
}