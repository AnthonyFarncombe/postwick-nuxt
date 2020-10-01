export default async function ({ store, route, error, redirect }) {
  if (store.state.authUser) {
    // Get required role from page
    const role = route.meta[0].role

    // If the page does not specify a role then no further checks required
    if (!role) return

    // If the user has the required role then no further checks required
    if (store.state.authUser.roles.includes(role)) return

    // If we've got this far then show the error page as the user is not authorized to view this page
    return error({
      statusCode: 401,
      message: 'Sorry, you are not authorized to view this page',
    })
  }

  try {
    await store.dispatch('loadAuthUser')
  } catch (err) {
    redirect('/auth/login?redirect=' + encodeURI(route.fullPath))
  }
}
