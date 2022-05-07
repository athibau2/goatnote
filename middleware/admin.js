export default function ({ store, redirect }) {
    if (!store.state.users.userData.isadmin) {
        alert('You do not have permission to access this page');
        return redirect('/')
    }
}