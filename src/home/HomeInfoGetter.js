/**
 * Created by tsengkasing on 5/1/2017.
 */
import $ from 'jquery';
import API from '../API';
import Auth from '../account/Auth';

class HomeInfoGetter {
    static getSongInfo(song_id) {
        return new Promise((resolve) => {
            const URL = API.SongToPlay;
            $.ajax({
                url : URL,
                type : 'GET',
                contentType: 'application/json;charset=UTF-8',
                dataType: 'json',
                headers : {
                    'target' : 'api',
                },
                data : {
                    id : song_id,
                },
                success : function(data) {
                    resolve(data);
                },
                error : function(xhr, textStatus) {
                    console.log('[ERROR] Parse Song Info Error');
                    resolve(null);
                    console.log(xhr.status + '\n' + textStatus + '\n');
                }
            });
        });
    };

    static getRecommendSongs(cb) {
        const URL = API.RecommendSong;
        $.ajax({
            url : URL,
            type : 'GET',
            contentType: 'application/json;charset=UTF-8',
            dataType: 'json',
            headers : {
                'target' : 'api',
            },
            data : {
                data : 1,
            },
            success : function(data) {
                let promise_detail_list = [];
                for(let i = 0; i < data.length; i++) {
                    promise_detail_list.push(HomeInfoGetter.getSongInfo(data[i]));
                }
                Promise.all(promise_detail_list).then((detail_list) => {
                    cb(detail_list);
                }).catch(()=>{
                    console.error('[ERROR]Song Info Lost.');
                });
            },
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });
    };


    static getRecommendUserInfo(user_id) {
        return new Promise((resolve) => {
            const URL = API.Info;
            $.ajax({
                url : URL,
                type : 'GET',
                contentType: 'application/json;charset=UTF-8',
                dataType: 'json',
                headers : {
                    'target' : 'api',
                },
                data : {
                    id : user_id,
                },
                success : function(data) {
                    resolve(data);
                },
                error : function(xhr, textStatus) {
                    console.log(xhr.status + '\n' + textStatus + '\n');
                }
            });
        });
    };

    static getRecommendUsers(cb) {
        const URL = API.RecommendUser;
        $.ajax({
            url : URL,
            type : 'GET',
            contentType: 'application/json;charset=UTF-8',
            dataType: 'json',
            headers : {
                'target' : 'api',
            },
            data : {
                data : 1,
            },
            success : function(data) {
                let promise_detail_list = [];
                for(let i = 0; i < data.length; i++) {
                    promise_detail_list.push(HomeInfoGetter.getRecommendUserInfo(data[i]));
                }
                Promise.all(promise_detail_list).then((detail_list) => {
                    cb(detail_list.filter(user => !!user.avator_url));
                });
            },
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });
    };

    static getMoments(cb) {
        const URL = API.Moment;
        $.ajax({
            url : URL,
            type : 'POST',
            contentType: 'application/json;charset=UTF-8',
            dataType: 'json',
            headers : {
                'target' : 'api',
            },
            success : function(data) {
                cb(data);
            },
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });
    };

    //获取用户信息
    static getUserInfo(cb) {
        const URL = API.Info;
        $.ajax({
            url : URL,
            type : 'POST',
            contentType: 'application/json',
            headers : {
                'target' : 'api',
            },
            success : function(data, textStatus, jqXHR) {
                let info = Auth.getUserInfo();
                Object.assign(info, data);
                Auth.storeUserInfo(info);
                HomeInfoGetter.storeUserOwnSongListId();
                cb(data);
            },
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });
    };

    static storeUserOwnSongListId() {
        const URL = API.OwnSongList;
        $.ajax({
            url : URL,
            type : 'GET',
            contentType: 'application/json',
            headers : {
                'target' : 'api',
            },
            success : function(data, textStatus, jqXHR) {
                let info = Auth.getUserInfo();
                Object.assign(info, {
                    own_song_list_ids: data
                });
                Auth.storeUserInfo(info);
            },
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });
    }
}

export default HomeInfoGetter;