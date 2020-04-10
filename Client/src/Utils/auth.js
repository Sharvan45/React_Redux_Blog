import auth0 from 'auth0-js';
import history from './history';
import { setTimeout } from 'timers';

export default class Auth {
    auth0 = new auth0.WebAuth({
        domain: 'sharvantest.auth0.com',
        clientID: 'n3KpVxq1FcsKCgaDaVJklBSk6yzyx7A6',
        redirectUri: 'http://localhost:3000/callback',
        responseType: 'token id_token',
        scope: 'openid profile email'
    })

    userProfile = {};

    login = () => {
        this.auth0.authorize();
    }

    handleAuth = () => {
        this.auth0.parseHash((err, authResult) => {
            if (authResult) {
                localStorage.setItem('access_token', authResult.accessToken);
                localStorage.setItem('id_token', authResult.idToken);
                let expiresAt = JSON.stringify((authResult.expiresIn * 1000 + new Date().getTime()));
                localStorage.setItem('expiresAt', expiresAt);
                this.getProfile();
                setTimeout(() => { history.replace('/authcheck') }, 2000);
            } else {
                console.log(err)
            }
        });
    }

    logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expiresAt');
        setTimeout(() => { history.replace('/authcheck') }, 200);
    }

    getAccessToken = () => {
        if (localStorage.getItem('access_token')) {
            const access_token = localStorage.getItem('access_token');
            return access_token
        } else {
            return null;
        }
    }

    getProfile = () => {
        let access_token = this.getAccessToken();
        if (access_token) {
            this.auth0.client.userInfo(access_token, (err, profile) => {
                if (profile) {
                    this.userProfile = { profile }
                }
            })
        }
    }
    isAuthenticated = () => {
        let expiresAt = JSON.parse(localStorage.getItem('expiresAt'));
        return new Date().getTime() < expiresAt;
    }
}