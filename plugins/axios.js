export default function ({ $axios, redirect }) {
  $axios.onResponseError((err) => {
    const originalRequest = err.config

    if (
      err &&
      err.response &&
      err.response.status === 401 &&
      originalRequest.url !== 'auth/refresh'
    ) {
      const jwtToken = localStorage.getItem('jwtToken')
      const refreshToken = localStorage.getItem('refreshToken')

      return $axios
        .$post('auth/refresh', {
          jwtToken,
          refreshToken,
        })
        .then((response) => {
          localStorage.setItem('jwtToken', response.jwtToken)
          localStorage.setItem('refreshToken', response.refreshToken)

          $axios.setToken(response.jwtToken, 'bearer')

          originalRequest.headers.Authorization = `bearer ${response.jwtToken}`

          return $axios(originalRequest)
        })
        .catch((err) => {
          if (err && err.response.status === 401) {
            localStorage.removeItem('jwtToken')
            localStorage.removeItem('refreshToken')
            return redirect('/auth/login')
          } else {
            return err
          }
        })
    }
  })
}
