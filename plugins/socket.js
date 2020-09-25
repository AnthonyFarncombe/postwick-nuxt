import io from 'socket.io-client'

export default function ({ store }) {
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

    store.commit('setConnectionState', true)

    socket.emit('getVariables', {}, (variables) =>
      store.commit('setVariables', variables)
    )

    socket.emit('getSchedules', {}, (schedules) =>
      store.commit('setSchedules', schedules)
    )
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
}
