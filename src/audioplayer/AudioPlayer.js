/**
 * Created by Think on 2017/5/5.
 */
import React from 'react';
import { Redirect } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import Danmaku from 'danmaku';
import CommentDisplayer from '../commentdisplayer/CommentDisplayer';
import AudioVisualizer from './AudioVisualizer';

import $ from 'jquery';
import API from '../API';
import Auth from '../account/Auth';
import UserPageInfoGetter from '../userpage/UserPageInfoGetter';
import './AudioPlayer.css';

class AudioPlayer extends React.Component {

    constructor(props) {
        super(props);
        window._ws = null;
        //弹幕库实例
        window._danmaku = null;

        let info = Auth.getUserInfo();
        let toLogin = true, user_id = -1;
        if(info && typeof info === 'object' && !info.toLogin) {
            toLogin = false;
            user_id = info.id;
        }

        this.state = {
            song_id: this.props.match.params.id,
            //音频信息
            audio_title : '',
            audio_date : '',

            audio_played_times : '0',

            //制作者信息
            producer_id: -1,
            producer_img_avator : 'http://img.everstar.xyz/default.jpg',
            producer_name : 'Nobody',
            producer_description : '这个up主啥也没写',

            //输入的弹幕
            input_value : '',
            input_error : null,

            audio_visualizer : null,

            //检测播放时间的定时器
            timer : 0,

            toLogin: toLogin,
            ws_url: `${API.DanmakuWebSocket}/danmu?id=${this.props.match.params.id}&user=${user_id}`,

            redirect: null
        };
    }

    onPlayingProgress = () => {
        // let value = this.refs.audio_player.currentTime;
        // let timer = setTimeout(this.onPlayingProgress, 1000);
        // this.setState({
        //     timer : timer
        // });
    };

    setupDanmaku = (comments) => {
        let danmaku = new Danmaku();
        danmaku.init({
            container: document.getElementById('graph-container'),
            audio: document.getElementById('audio-player'),
            comments: comments,
            // engine: 'canvas',
            // speed : 144
        });
        window._danmaku = danmaku;
    };

    sendDanmaku = () => {
        let text = this.state.input_value;
        if(!text || text === '') {
            this.setState({
                input_error : '弹幕不能为空喔~'
            });
            return;
        }

        this.setState({input_value : ''});

        //发送给Server
        if (window._ws) {
            let seconds = parseInt(this.refs.audio_player.currentTime, 10);
            text = `${text}|${seconds}`;
            // console.log('Sent: ' + text);
            window._ws.send(text);
        } else {
            alert('connection not established, please connect.');
        }
    };

    createDanmaku = (text, current_time) => {
        // 初始化 API 中的 comments 选项即为下述 comment 对象的数组。
        let comment = {
            text: text,

            // 在使用 DOM 引擎时，如果 `html` 设为 `true`，`text`将被解析为 HTML。
            // 为了防止 XSS 攻击，永远不要直接传入用户的输入。
            // 默认为 `false`。
            html: false,

            // 默认为 rtl（从右到左），支持 ltr、rtl、top、bottom。
            mode: 'rtl',

            // 弹幕显示的时间，单位为秒。
            // 在使用视频或音频模式时，如果未设置，会默认为音视频的当前时间；实时模式不需要设置。
            time: current_time,

            // 在使用 DOM 引擎时，Danmaku 会为每一条弹幕创建一个 <div> 节点，
            // 以下 CSS 样式会直接设置到 div.style 上
            style: {
                fontSize: '20px',
                color: '#fff',
                border: '1px solid #337ab7',
                textShadow: '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000'
            },

            // 在使用 canvas 引擎时，类似于 CanvasRenderingContext2D 对象，以下属性作为默认
            // canvasStyle: {
            //     // Chrome 中最小字号为 12px
            //     font: '20px Microsoft YaHei',
            //     textAlign: 'start',
            //     // 注意 bottom 是默认的
            //     textBaseline: 'bottom',
            //     direction: 'inherit',
            //     fillStyle: '#fff',
            //     // 如果 strokeStyle 未设置，不会有描边效果
            //     strokeStyle: '#000',
            //     // 效果相当于描边的宽度
            //     lineWidth: 2.0,
            //     shadowBlur: 0,
            //     shadowColor: '#000',
            //     shadowOffsetX: 0,
            //     shadowOffsetY: 0,
            //     filter: 'none',
            //     globalAlpha: 1.0
            // }
        };
        window._danmaku.emit(comment);
    };

    loadMusicInfo = (cb) => {
        const URL = API.SongToPlay;
        $.ajax({
            url : URL,
            type : 'GET',
            headers : {
                'target' : 'api',
            },
            contentType: 'application/json',
            data : {
                id : this.state.song_id
            },
            success : function(data) {
                UserPageInfoGetter.getUserInfo(data.producer_id, (info) => {
                    Object.assign(data, {
                        audio_date: typeof data.audio_date === 'number' ? new Date(data.audio_date).toLocaleString() : data.audio_date,
                        producer_name: info.username,
                        producer_img_avator: info.avator_url,
                        producer_description: `MusicRadio第${data.producer_id}位用户`,
                        producer_follows: info.friends_num
                    });
                    cb(data);
                });
            },
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });
    };

    createWebSocket = () => {
        if ('WebSocket' in window) {
            window._ws = new WebSocket(this.state.ws_url); //ws://localhost:8080/myHandler
        }// } else if ('MozWebSocket' in window) {
        //     this.ws = new MozWebSocket(this.state.ws_url);
        // } else {
        //     this.ws = new SockJS(this.state.ws_url);
        // }

        window._ws.onopen = () => {
            // console.log('Info: connection opened.');
        };
        window._ws.onmessage = (event) => {
            // console.log('Received: ' + event.data);
            this.createDanmaku(event.data);
        };
        window._ws.onclose = (event) => {
            // console.log('Info: connection closed.');
        };
    };

    loadHistoryDanmaku = () => {
        const URL = API.GetHistoryDanMu;
        return new Promise((resolve, reject) => {
            $.ajax({
                url : URL,
                type : 'GET',
                headers : {
                    'target' : 'api',
                },
                contentType: 'application/json',
                dataType: 'json',
                data : {
                    id : this.state.song_id,
                },
                success : function(data) {
                    if(!(data instanceof Array)) reject();
                    let comments = [];
                    for(let danmu of data) {
                        comments.push({
                            text: danmu.content,
                            time: danmu.local_time,
                            style: {
                                fontSize: '20px',
                                color: '#fff',
                                border: '1px solid #337ab7',
                                textShadow: '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000'
                            }
                        })
                    }
                    resolve(comments);
                },
                error : function(xhr, textStatus) {
                    console.log(xhr.status + '\n' + textStatus + '\n');
                }
            });
        });
    };

    componentDidMount() {
        this.createWebSocket();
        this.loadHistoryDanmaku().then((comments) => {
            this.setupDanmaku(comments);
        });

        this.setState({
            audio_visualizer: new AudioVisualizer('audio-player', 'canvas')
        });

        this.loadMusicInfo((info) => {
            this.setState(info);
        });
    }

    componentWillUnmount() {
        window._danmaku.destroy();
        window._ws.close();
    }

    redirectToUserPage = () => {
        if(this.state.toLogin) {alert('登录之后才能查看up主信息~~~');}
        else this.setState({redirect: `/user/${this.state.producer_id}`});
    };

    handleInputChange = (event) => {
        this.setState({
            input_value : event.target.value,
            input_error : null
        });
    };


    render() {
        return (
            <div className="audio">
                {/*<div className="audio-header">*/}
                    {/*<img src="https://novastar.everstar.xyz/files/Avator_homula.jpg" alt="music radio" className="logo" />*/}
                {/*</div>*/}
                <div className="audio-content">
                    <div className="title-card">
                        <div className="audio-title">
                            <div className="audio-title-left">
                                <p style={{fontSize : '18px', margin: '0 0 16px'}}>{this.state.audio_title}</p>
                                <div className="audio-info">发布时间: {this.state.audio_date} &nbsp;&nbsp; 播放量: {this.state.audio_played_times}</div>
                            </div>
                            <div className="audio-title-right">
                                <img className="producer-avator" alt="Avator missing!" src={this.state.producer_img_avator}
                                     onClick={this.redirectToUserPage}/>
                                <div className="producer-info">
                                    <div className="title" onClick={this.redirectToUserPage}>
                                        {this.state.producer_name}</div>
                                    <div className="description">{this.state.producer_description}</div>
                                    <div className="fans">粉丝: {this.state.producer_follows}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="audio-container">
                        <div id="graph-container">
                            <canvas id='canvas' width="1024" height="360" style={{position : 'absolute'}}/>
                        </div>
                        <div className="audio-control">
                            <audio src={this.state.audio_src}
                                   crossOrigin="anonymous"
                                   ref="audio_player"
                                   id="audio-player"
                                   // onPlaying={()=>{this.onPlayingProgress();}}
                                   onPause={()=>{if(this.state.timer) clearTimeout(this.state.timer);}}
                                   onEnded={()=>{if(this.state.timer) clearTimeout(this.state.timer);}}
                                   preload="auto" controls>
                                贵浏览器不支持Audio标签，垃圾滚粗
                            </audio>
                        </div>
                        <div className="create-danmaku" onKeyUp={(event) => {if(event.keyCode === 13 && !this.state.toLogin) this.sendDanmaku()}}>
                            <TextField
                                className="text-field"
                                hintText={this.state.toLogin ? "登录之后才能发送弹幕喔~" : "发送弹幕~(๑•̀ㅁ•́๑)✧"}
                                errorText={this.state.input_error}
                                fullWidth={true}
                                value={this.state.input_value}
                                onChange={this.handleInputChange}
                                disabled={this.state.toLogin}
                            />
                            <RaisedButton className="button"
                                          onTouchTap={()=>this.sendDanmaku()}
                                          label="发送" primary={true} disabled={this.state.toLogin} />
                        </div>
                    </div>
                    {this.props.match.params.song_list_id && !this.state.toLogin ? <CommentDisplayer {...this.props} toLogin={this.state.toLogin} /> : null}
                </div>
                {this.state.redirect ? <Redirect to={this.state.redirect}/> : null}
            </div>
        );
    }
}

export default AudioPlayer;