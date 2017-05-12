/**
 * Created by Think on 2017/5/4.
 */
import $ from 'jquery';
import API from '../API';

class SongListInfoGetter {
    static getAllSongListOwned(cb) {
        const URL = API.SongList;
        $.ajax({
            url : URL,
            type : 'POST',
            headers : {
                'target' : 'api',
            },
            contentType: 'application/json;charset=UTF-8',
            dataType:'json',
            success : function(data) {
                cb(data);
            },
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });
    }

    static createSongList(songlist_info, cb) {
        const URL = API.NewList;

        $.ajax({
            url : URL,
            type : 'POST',
            data : JSON.stringify(songlist_info),
            contentType: 'application/json;charset=UTF-8',
            headers : {
                'target' : 'api',
            },
            success : function(data) {
                cb();
            },
            error : function(xhr, textStatus) {
                alert('fail');
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });
    }

    static deleteSongList(songlist_id, cb) {
        const URL = API.DeleteList;
        let data = {id : songlist_id};
        $.ajax({
            url : URL,
            type : 'POST',
            headers : {
                'target' : 'api',
            },
            contentType: 'application/json;charset=UTF-8',
            dataType:'json',
            data : JSON.stringify(data),
            success : function(data) {
                if(data) {
                    alert('删除成功');
                    cb();
                }
            },
            error : function(xhr, textStatus) {
                alert('Fail');
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });
    };

    static getSongsOfSongList(songlist_id, cb) {
        const URL = API.GetSongsOfSongList;
        $.ajax({
            url : URL,
            type : 'GET',
            headers : {
                'target' : 'api',
            },
            contentType: 'application/json',
            dataType: 'json',
            data : {
                id : songlist_id,
            },
            success : function(data) {
                cb(data);
            },
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });
    };

    static getSongListInfo(songlist_id, cb) {
        const URL = API.GetSongListInfo;
        $.ajax({
            url : URL,
            type : 'GET',
            headers : {
                'target' : 'api',
            },
            contentType: 'application/json',
            dataType: 'json',
            data : {
                id: songlist_id,
            },
            success : function(data) {
                cb(data);
            },
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });
    }

    static removeSong(songlist_id, song_id) {
        const URL = API.RemoveSong;
        const postData = {
            songlist_id : songlist_id,
            song_id: song_id
        };
        return new Promise((resolve, reject) => {
            $.ajax({
                url : URL,
                type : 'POST',
                headers : {
                    'target' : 'api',
                },
                contentType: 'application/json',
                dataType: 'json',
                data : JSON.stringify(postData),
                success : function(data) {
                    if(data && data.result)
                        resolve();
                    else
                        reject();
                },
                error : function(xhr, textStatus) {
                    reject();
                    console.log(xhr.status + '\n' + textStatus + '\n');
                }
            });
        });
    }
}

export default SongListInfoGetter;