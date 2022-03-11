export default function ({ store, redirect }) {
    if (store.state.users.user === null || store.state.users.user === undefined) return redirect("/login");
}