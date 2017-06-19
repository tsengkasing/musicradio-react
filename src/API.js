/**
 * Created by tsengkasing on 5/1/2017.
 */

let URL = '/api';

//后端API
class API {

    static title = 'Music Radio';

    // static DanmakuWebSocket = 'ws://60.205.217.210:8080/MusicBubble/';
    static DanmakuWebSocket = 'ws://happyfarmer-oray.vicp.io:8088/';

    //账户
    static SignIn = URL + '/signin';//success
    static SignUp = URL + '/signup';//success
    static SignOut = URL + '/signout';
    static Account = URL + '/account';//success
    static Avatar = URL + '/update';

    static OwnSongList = URL + '/songlistown';

    //喜爱/点赞
    static LikeSongList = URL + '/likesonglist';//success
    static LikeSong = URL + '/likesong';//success

    //歌单
    static HotList = URL + '/hotlist';//success
    static SongList = URL + '/songlist';//自己success  他人success

    //歌曲
    static GetSongsOfSongList = URL + '/songlist/one';//success

    //歌单管理
    static NewList = URL + '/newlist';//success
    static DeleteList = URL + '/deletelist';//success
    static ChangeList = URL + '/changelist';//success
    static RemoveSong = URL + '/removesong';//success
    static ChangeSongImage = URL + '/changesong';//success
    static AddSongFromNetEase = URL + '/addsong/netease';//网易云success
    static AddSongFromLike = URL + '/addsong/songlist';//deprecated
    static AddSongFromUpload = URL + '/addsong/upload';//success

    static GetSongListInfo = URL + '/songlistinfo';

    //社交
    static Info = URL + '/info';//自己success 他人success
    static Following = URL + '/follow';//success
    static Follow = URL + '/follow';//success  关注多次？？？

    static Moment = URL + '/moment';//success

    static GetComments = URL + '/comment';//success
    static AddComment = URL + '/addcomment';//success

    //推荐
    static RecommendUser = URL + '/recommendUser';//success
    static RecommendSong = URL + '/recommendSong';//success

    //音乐
    static SongInfo = URL + '/song';//success
    static SearchhSong = URL + '/search';//success

    static SongToPlay = URL + '/play';

    static LocalSongInfo = URL + '/song';//success

    static ImageInfo = URL + '/img';//success

    static GetHistoryDanMu = URL + '/danmu';
}

export default API;