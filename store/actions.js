const actions = {
  async loadAuthUser(context) {
    if (localStorage.getItem('jwtToken')) {
      this.$axios.setToken(localStorage.getItem('jwtToken'), 'bearer')
    }
    const authUser = await this.$axios.$get('auth/me')
    context.commit('setAuthUser', authUser)
  },
  async login(_context, payload) {
    try {
      const response = await this.$axios.$post('auth/authenticate', payload)
      localStorage.setItem('jwtToken', response.jwtToken)
      localStorage.setItem('refreshToken', response.refreshToken)
    } catch (err) {}
  },
  logout(context) {
    localStorage.removeItem('jwtToken')
    localStorage.removeItem('refreshToken')
    context.commit('setAuthUser', null)
  },
}

export default actions
