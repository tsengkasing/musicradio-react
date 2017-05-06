/**
 * Created by Think on 2017/5/6.
 */
import $ from 'jquery';
import API from '../API';

class UserPageInfoGetter {

    //获取用户信息
    static getUserInfo(user_id, cb) {
        const URL = API.Info;
        $.ajax({
            url : URL,
            type : 'GET',
            contentType: 'application/json',
            dataType: 'json',
            headers : {
                'target' : 'api',
            },
            data : {
                id : user_id
            },
            success : function(data, textStatus, jqXHR) {
                cb(data);
            },
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });
    };

    static getSongListOfUser(user_id, cb) {
        const URL = API.SongList;
        $.ajax({
            url : URL,
            type : 'GET',
            data : {
                id : user_id
            },
            headers : {
                target : 'api'
            },
            success : function(data, textStatus, jqXHR) {
                cb(data);
            },
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });
    };

    static getUserMoments(user_id, cb) {
        const URL = API.Moment;
        $.ajax({
            url : URL,
            type : 'GET',
            contentType: 'application/json;charset=UTF-8',
            dataType: 'json',
            headers : {
                'target' : 'api',
            },
            data : {
                id : user_id
            },
            success : function(data, textStatus, jqXHR) {
                cb(data);
            },
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });
    };
}

export default UserPageInfoGetter;