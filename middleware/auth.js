export default function ({ store, redirect }) {
    console.log(store.state)
    if (store.state.users.user === null || store.state.users.user === undefined) {
        return redirect("/login");
    }
}