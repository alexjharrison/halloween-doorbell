const axios = require('axios')

export interface Store {
  isSomeoneThere: boolean
  volumeThreshold: number
}

export const state: () => Store = () => ({
  isSomeoneThere: false,
  volumeThreshold: 100,
})

export const mutations = {
  setIsSomeoneThere(state: Store, val: boolean) {
    state.isSomeoneThere = val
    axios.post('/api', state)
  },
  setVolumeThreshold(state: Store, val: number) {
    state.volumeThreshold = val
    axios.post('/api', state)
  },
  updateStore(state: Store, newStore: Store) {
    state.isSomeoneThere = newStore.isSomeoneThere
    state.volumeThreshold = newStore.volumeThreshold
  },
}

export const actions = {
  dingDong({ commit }: any) {
    commit('setIsSomeoneThere', true)

    const coolDownSeconds = 30
    setTimeout(() => {
      commit('setIsSomeoneThere', false)
    }, coolDownSeconds * 1000)
  },
}
