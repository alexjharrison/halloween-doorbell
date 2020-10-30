interface Store {
  isSomeoneThere: boolean
  volumeThreshold: number
}

export const store: () => Store = () => ({
  isSomeoneThere: false,
  volumeThreshold: 40,
})

export const mutations = {
  setIsSomeoneThere(state: Store, val: boolean) {
    state.isSomeoneThere = val
  },
}

export const actions = {
  dingDong({ commit }: any) {
    commit('setIsSomeoneThere', true)

    const coolDownSeconds = 10
    setTimeout(() => {
      commit('setIsSomeoneThere', false)
    }, coolDownSeconds * 1000)
  },
}
