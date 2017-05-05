/**
 * Created by tsengkasing on 5/1/2017.
 */
const STORE = 'MUSICRADIO';

class Auth {

    static getUserInfo() {
        //从sessionStorage获取用户信息
        let userinfo = window.sessionStorage.getItem(STORE);
        if(userinfo) {
            try {
                userinfo = JSON.parse(userinfo);
                if(userinfo.username) {
                    userinfo.toLogin = false;
                    return userinfo;
                }
            }catch (e) {
                console.error('user information parse error');
            }
        }
        //用户信息不存在或者解析错误
        let username = window.localStorage.getItem(STORE);
        if (username) return {username: username, toLogin: true};
        return '';
    }

    static getLoginStatus() {
        let info = Auth.getUserInfo();
        return info && typeof info === 'object' && !info.toLogin;
        // if(info) {
        //     if(typeof info === 'object' && !info.toLogin) {
        //         return true;
        //     }
        // }
        // return false;
    }

    static storeUserInfo(info) {
        window.sessionStorage.setItem(STORE, JSON.stringify(info));
        window.localStorage.setItem(STORE, info.username);
    }

    static clearUserInfo() {
        window.sessionStorage.removeItem(STORE);
        window.localStorage.removeItem(STORE);
    }

}

export default Auth;