import io from 'socket.io-client'

export default function ({ store }, inject) {
  const socket = io(
    process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3011',
    { autoConnect: false }
  )

  store.watch(
    (state) => state.hmiActive,
    (active) => {
      if (active) {
        socket.connect()
      } else {
        socket.disconnect()
      }
    }
  )

  socket.on('connect', () => {
    // eslint-disable-next-line no-console
    console.log('socket.io connected')

    Promise.all([
      new Promise((resolve) =>
        socket.emit('getVariables', {}, (variables) => {
          store.commit('setVariables', variables)
          resolve()
        })
      ),
      new Promise((resolve) =>
        socket.emit('getSchedules', {}, (schedules) => {
          store.commit('setSchedules', schedules)
          resolve()
        })
      ),
    ]).then(() => {
      store.commit('setConnectionState', true)
      // eslint-disable-next-line no-console
      console.log('Variables loaded')
    })
  })

  socket.on('variableValueUpdated', (variable) =>
    store.commit('setVariableValue', variable)
  )

  socket.on('schedulesUpdated', (schedules) =>
    store.commit('setSchedules', schedules)
  )

  socket.on('disconnect', () => {
    // eslint-disable-next-line no-console
    console.log('socket.io disconnected')
    store.commit('setConnectionState', false)
  })

  inject('socket', {
    socket,
    setVariableValue({ name, value }) {
      if (!socket.connected) return
      socket.emit('setVariableValue', { name, value })
    },
    saveSchedule(schedule) {
      if (!socket.connected) return
      socket.emit('saveSchedule', schedule)
    },
    deleteSchedule(id) {
      if (!socket.connected) return
      socket.emit('deleteSchedule', id)
    },
  })
}
