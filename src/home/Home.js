/**
 * Created by tsengkasing on 5/1/2017.
 */
import React from 'react';
import { Redirect } from 'react-router-dom';
import LinearProgress from 'material-ui/LinearProgress';
import IconButton from 'material-ui/IconButton';
import AvPlayCircleOutline from 'material-ui/svg-icons/av/play-circle-outline';

import AvatarUpload from './avatarupload/AvatarUpload';
import HomeInfoGetter from './HomeInfoGetter';
import './Home.css';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user_info: {
                username: 'Nobody',
                id: -1,
                avator_url: 'http://img.everstar.xyz/default.jpg',
                gender: 'M',
                level: 0,
                exp: 0,
                exp_max: 100,
                friends_num: 0,
                liked_songlist: 0,
                ctr_songlist: 0,
            },
            recommend_song_list: [],
            recommend_user_list: [],
            moments: [],
            redirect: null
        }
    }

    loadUserInfo = () => {
        HomeInfoGetter.getUserInfo((user_info) => {
            if(this.refs.home)
                this.setState({user_info: user_info});
        });
    };

    componentWillMount() {
        this.loadUserInfo();

        HomeInfoGetter.getRecommendSongs((detail_list) => {
            if(this.refs.home)
                this.setState({recommend_song_list : detail_list});
        });

        HomeInfoGetter.getRecommendUsers((detail_list) => {
            if(this.refs.home)
                this.setState({recommend_user_list : detail_list});
        });

        HomeInfoGetter.getMoments((moments) => {
            if(this.refs.home)
                this.setState({moments : moments});
        });


    }

    handleRedirect = (type, target) => {
        let path;
        switch(type) {
            case 0:
                path = '/songlist';break;
            case 1:
                path = '/u/follow';break;
            case 2:
                path = `/user/${target}`;break;
            case 3:
                path = `/audio/${target}`;break;
            default:break;
        }
        this.setState({
            redirect: path
        });
    };

    render () {
        return (
            <div className="home-layout" ref="home">
                <div className="home-private">
                    <div className="home-private-info">
                        <div className="home-private-info-general">
                            <img className="home-info-avatar" src={this.state.user_info.avator_url} alt="头像"
                                 onClick={()=>this.refs.avatarUploadDialog.handleOpen()}/>
                            <div className="home-private-info-text">
                                <div>
                                <div className="home-private-info-name">{this.state.user_info.username}</div>
                                <div className="home-private-info-gender">{this.state.user_info.gender === 'M' ? 'Male' : 'Female'}</div>
                                </div>
                                <div className="level-bar">
                                    <div className="level-bar-text">
                                        <div>Lv{this.state.user_info.level}</div>
                                        <div>Lv{this.state.user_info.level + 1}</div>
                                    </div>
                                    <div>
                                        <LinearProgress mode="determinate" value={this.state.user_info.exp} max={this.state.user_info.exp_max} />
                                    </div>
                                </div>
                                <div className="home-private-info-count-border">
                                    <div className="home-private-info-count" onTouchTap={() => this.handleRedirect(0)}>
                                        <div className="home-private-info-count-number">{this.state.user_info.ctr_songlist}</div>
                                        <div>创建歌单数</div>
                                    </div>
                                    <div className="home-private-info-count" style={{cursor: 'default'}}>
                                        <div className="home-private-info-count-number">{this.state.user_info.liked_songlist}</div>
                                        <div>喜爱歌单数</div>
                                    </div>
                                    <div className="home-private-info-count" onTouchTap={() => this.handleRedirect(1)}>
                                        <div className="home-private-info-count-number">{this.state.user_info.friends_num}</div>
                                        <div>关注好友数</div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="home-recommend">
                        <div className="sub-header">
                            <span>推荐用户</span>
                        </div>
                        <div className="home-private-recommend" style={{margin: '0 8px'}}>
                            {this.state.recommend_user_list.map((user, index)=>(
                                <div className="recommend-user-item" key={index} onTouchTap={() => this.handleRedirect(2, user.id)}>
                                    <img className="home-info-avatar" src={user.avator_url} alt="头像" />
                                    <div className="recommend-user-item-info">
                                        <div>{user.username}</div><br/>
                                        <div className="list-item-seperated" style={{margin: 2}}>
                                            <div>创建歌单数</div><div>{user.ctr_songlist}</div>
                                        </div>
                                        <div className="list-item-seperated" style={{margin: 2}}>
                                            <div>喜爱歌单数</div><div>{user.liked_songlist}</div>
                                        </div>
                                        <div className="list-item-seperated" style={{margin: 2}}>
                                            <div>关注好友数</div><div>{user.friends_num}</div>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="home-recommend">
                    <div className="sub-header">
                        <span>推荐歌曲</span>
                    </div>
                    <div className="home-private-recommend" style={{margin: '0 8px'}}>
                        {this.state.recommend_song_list.map((item, index)=>(
                            <div key={index} className="list-item-seperated">
                                <div className="recommend-list-item-layout">
                                    <IconButton className="recommend-list-item-button-play" tooltip="Play" touch={true} tooltipPosition="top-left" onTouchTap={() => this.handleRedirect(3, item.song_id)} style={{padding: 0, height: 'auto'}}>
                                        <AvPlayCircleOutline/>
                                    </IconButton>
                                    <span><span>{index + 1}. </span>{item.audio_title}</span>
                                </div>
                                <div>{item.artists}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="home-recommend">
                    <div className="sub-header">
                        <span>关注好友活动</span>
                    </div>
                    <div className="home-public">
                        {this.state.moments.map((moment, index) => (
                            <div className="comment" key={index}>
                                <img className="comment-avator" alt="missing" src={moment.avator_url} onClick={() => this.handleRedirect(2, moment.id)}/>
                                <div className="comment-content">
                                    <div className="comment-border" />
                                    <div className="comment-header">
                                        <div className="comment-header-name" onClick={() => this.handleRedirect(2, moment.id)}>{moment.username}</div>&nbsp;
                                    </div>
                                    <div className="comment-text">
                                        <span style={{color: 'rgb(0,188,212)'}}>{moment.type}</span>&nbsp;{moment.songlist_name}
                                    </div>
                                    <div className="comment-footer">
                                        #{index + 1} &nbsp;&nbsp; {moment.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {this.state.redirect ? <Redirect to={this.state.redirect}/> : null}
                <AvatarUpload ref="avatarUploadDialog" success={this.loadUserInfo} />
            </div>
        );
    }
}
export default Home;