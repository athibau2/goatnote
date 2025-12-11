export default async function ({ store, redirect }) {
    await store.dispatch('users/getSupabaseUser')
    if (store.state.users.supabaseUser == null || store.state.users.supabaseUser == undefined) {
        return redirect("/login");
    } else {
        const user = store.state.users.supabaseUser;
        let res = await store.dispatch('users/getUser', { email: user.email })
    }
}