export default async function (context) {
  if (context.store.state.authUser) {
    // Get required role from page
    const role = context.route.meta[0].role

    // If the page does not specify a role then no further checks required
    if (!role) return

    // If the user has the required role then no further checks required
    if (context.store.state.authUser.roles.includes(role)) return

    // If we've got this far then show the error page as the user is not authorized to view this page
    return context.error({
      statusCode: 401,
      message: 'Sorry, you are not authorized to view this page',
    })
  }

  try {
    await context.store.dispatch('loadAuthUser')
  } catch (err) {
    context.redirect('/auth/login')
  }
}
