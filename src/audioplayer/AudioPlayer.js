/**
 * Created by Think on 2017/5/5.
 */
import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import Danmaku from 'danmaku';
import CommentDisplayer from '../commentdisplayer/CommentDisplayer';
import AudioVisualizer from './AudioVisualizer';

import $ from 'jquery';
import API from '../API';
import './AudioPlayer.css';

class AudioPlayer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            song_id: this.props.match.params.id,
            //音频信息
            audio_title : '',
            audio_date : '',

            audio_played_times : '0',

            //制作者信息
            producer_img_avator : 'http://img.everstar.xyz/default.jpg',
            producer_name : 'Nobody',
            producer_description : '这个up主啥也没写',

            //输入的弹幕
            input_value : '',
            input_error : null,

            //弹幕库实例
            danmaku : null,

            audio_visualizer : null,

            //检测播放时间的定时器
            timer : 0,
        }
    }

    onPlayingProgress = () => {
        let value = this.refs.audio_player.currentTime;
        console.log(value);
        let timer = setTimeout(this.onPlayingProgress, 1000);
        this.setState({
            timer : timer
        });
    };

    setupDanmaku = () => {
        let danmaku = new Danmaku();
        danmaku.init({
            container: document.getElementById('graph-container'),
            audio: document.getElementById('audio_player'),
            comments: [],
            // engine: 'canvas',
            // speed : 144
        });
        this.setState({danmaku : danmaku});

        // setInterval(()=>this.sendDanmaku('233'), 1000);
        // setInterval(()=>this.sendDanmaku('233'), 2050);
        // setInterval(()=>this.sendDanmaku('233'), 3400);
    };

    sendDanmaku = (text) => {
        if(!text || text === '') {
            this.setState({
                input_error : '弹幕不能为空喔~'
            });
            return;
        }
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
            // time: 233.3,

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
        this.state.danmaku.emit(comment);
        this.setState({input_value : ''});
    };

    loadMusicInfo = (cb) => {
        // const URL = API.SongToPlay;
        // $.ajax({
        //     url : URL,
        //     type : 'GET',
        //     headers : {
        //         'target' : 'api',
        //     },
        //     contentType: 'application/json',
        //     data : {
        //         song_id : this.state.song_id
        //     },
        //     success : function(data) {
        //                 cb(info);
        //     }.bind(this),
        //     error : function(xhr, textStatus) {
        //         console.log(xhr.status + '\n' + textStatus + '\n');
        //     }
        // });

        let info = {
            audio_title : '✿神的随波逐流✿笑容元气通通有，四舍五入一米九~',
            audio_date : '2017-03-21 00:20',
            audio_played_times : '2.33万',

            audio_src: '//opbbo3bxc.bkt.clouddn.com/Taylor%20Swift%20-%20Shake%20It%20Off.mp3',

            //制作者信息
            producer_img_avator : 'http://img.everstar.xyz/everstar.jpg',
            producer_name : '小星星',
            producer_description : '写写代码，想想人生'
        };

        cb(info);
    };


    componentDidMount() {
        this.setupDanmaku();
        this.setState({
            audio_visualizer: new AudioVisualizer('audio-player', 'canvas')
        });

        this.loadMusicInfo((info) => {
            this.setState(info);
        });
    }

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
                    {/*<img src="http://novastar.everstar.xyz/files/Avator_homula.jpg" alt="music radio" className="logo" />*/}
                {/*</div>*/}
                <div className="audio-content">
                    <div className="title-card">
                        <div className="audio-title">
                            <div className="audio-title-left">
                                <p style={{fontSize : '18px'}}>{this.state.audio_title}</p>
                                <div className="audio-info">发布时间: {this.state.audio_date} &nbsp;&nbsp; 播放量: {this.state.audio_played_times}</div>
                            </div>
                            <div className="audio-title-right">
                                <img className="producer-avator" alt="Avator missing!" src={this.state.producer_img_avator}/>
                                <div className="producer-info">
                                    <div className="title">{this.state.producer_name}</div>
                                    <div className="description">{this.state.producer_description}</div>
                                    <div className="fans">粉丝: {1024}</div>
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
                                //onPlaying={()=>{this.onPlayingProgress();}}
                                   onPause={()=>{if(this.state.timer) clearTimeout(this.state.timer);}}
                                   onEnded={()=>{if(this.state.timer) clearTimeout(this.state.timer);}}
                                   preload="auto" controls>
                                贵浏览器不支持Audio标签，垃圾滚粗
                            </audio>
                        </div>
                        <div className="create-danmaku">
                            <TextField
                                className="text-field"
                                hintText="发送弹幕~(๑•̀ㅁ•́๑)✧"
                                errorText={this.state.input_error}
                                fullWidth={true}
                                value={this.state.input_value}
                                onChange={this.handleInputChange}
                            />
                            <RaisedButton className="button"
                                          onTouchTap={()=>{this.sendDanmaku(this.state.input_value);}}
                                          label="发送" primary={true} />
                        </div>
                    </div>

                    <CommentDisplayer/>


                </div>
            </div>
        );
    }
}

export default AudioPlayer;