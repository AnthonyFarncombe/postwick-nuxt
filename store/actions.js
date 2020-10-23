const actions = {
  async loadAuthUser(context) {
    if (localStorage.getItem('jwtToken')) {
      this.$axios.setToken(localStorage.getItem('jwtToken'), 'bearer')
    }
    const authUser = await this.$axios.$get('auth/me')
    context.commit('setAuthUser', authUser)
    return authUser
  },
  async login(_context, payload) {
    const response = await this.$axios.$post('auth/login', payload)
    localStorage.setItem('jwtToken', response.jwtToken)
    localStorage.setItem('refreshToken', response.refreshToken)
  },
  logout(context) {
    localStorage.removeItem('jwtToken')
    localStorage.removeItem('refreshToken')
    this.$axios.setToken(null, 'bearer')
    context.commit('setAuthUser', null)
  },
  setHmiPin(_context, { userId, pin }) {
    // eslint-disable-next-line no-console
    console.log(userId, pin)
  },
  setVariableValue(_context, payload) {
    this.$socket.setVariableValue(payload)
  },
  saveSchedule(_context, schedule) {
    this.$socket.saveSchedule(schedule)
  },
  deleteSchedule(_context, id) {
    this.$socket.deleteSchedule(id)
  },
}

export default actions
