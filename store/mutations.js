const mutations = {
  setAuthUser(state, authUser) {
    state.authUser = authUser
  },
  setHmiActive(state, active) {
    state.hmiActive = active
  },
  setConnectionState(state, connected) {
    state.connected = connected
  },
  setVariables(state, variables) {
    state.variables = variables
  },
  setVariableValue(state, payload) {
    const variable = state.variables.find((v) => v.name === payload.name)
    if (variable) variable.value = payload.value
  },
  setSchedules(state, schedules) {
    state.schedules = schedules
  },
}

export default mutations
