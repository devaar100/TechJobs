import fire from '../fire.js';

export const login = () => {
    const provider = new fire.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    fire.auth().signInWithPopup(provider)
        .then(res => console.log(res.user))
        .catch(err => console.log(err))
}

export const logout = () => {
    fire.auth().signOut()
        .then(res => console.log('logout successful'))
        .catch(err => console.log(err))
}
