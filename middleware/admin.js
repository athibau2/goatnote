export default async function ({ store, redirect }) {
    await store.dispatch('users/getSupabaseUser')
    if (!store.state.users.userData.isadmin) {
        await store.commit('users/setAlert', {
            color: 'error',
            icon: '$error',
            text: 'You do not have permission to access this page'
        })
        return redirect('/')
    }
}