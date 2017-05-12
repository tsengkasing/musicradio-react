/**
 * Created by Think on 2017/5/6.
 */
import React from 'react';
import { Redirect } from 'react-router-dom';
import LinearProgress from 'material-ui/LinearProgress';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import ActionGrade from 'material-ui/svg-icons/action/grade';

import $ from 'jquery';
import API from '../API';
import Auth from '../account/Auth';

import UserPageInfoGetter from './UserPageInfoGetter';
import './UserPage.css';

class UserPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user_info: {
                username: 'Nobody',
                id: this.props.match.params.id,
                avator_url: 'http://img.everstar.xyz/default.jpg',
                gender: 'M',
                level: 0,
                exp: 0,
                exp_max: 100,
                friends_num: 0,
                liked_songlist: 0,
                ctr_songlist: 0,
                followed: false,

                redirect: null
            },
            albums: [],
            moments: [],
            redirect: Auth.getUserInfo().id.toString() === this.props.match.params.id ?
                '/u/home' : null
        };
    }

    componentWillMount() {
        UserPageInfoGetter.getUserInfo(this.state.user_info.id, (info) => {
            this.setState({
                user_info: info
            })
        });

        UserPageInfoGetter.getSongListOfUser(this.state.user_info.id, (songlist) => {
            this.setState({
                albums: songlist
            });
        });

        UserPageInfoGetter.getUserMoments(this.state.user_info.id, (moments) => {
            this.setState({
                moments: moments
            })
        });
    }

    follow = () => {
        //如果未登录，跳转到登录页面
        if(!Auth.getLoginStatus()) {
            alert('请先登录!');
            return;
        }

        const URL = API.Follow;
        const data = {user_id : this.props.match.params.id};
        $.ajax({
            url : URL,
            type : 'POST',
            contentType: 'application/json;charset=UTF-8',
            dataType: 'json',
            headers : {
                'target' : 'api',
            },
            data : JSON.stringify(data),
            success : function() {
                let info = this.state.user_info;
                info.followed = true;
                this.setState({
                    user_info: info
                });
            }.bind(this),
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });
    };

    handleStar = (index, songlist_id) => {
        if(!Auth.getLoginStatus()) {
            alert('请先登录!');
            return;
        }

        const URL = API.LikeSongList;
        let data = {songlist_id : songlist_id};
        $.ajax({
            url : URL,
            type : 'POST',
            contentType: 'application/json',
            dataType: 'json',
            headers : {
                'target' : 'api',
            },
            data : JSON.stringify(data),
            success : function(data) {
                console.log(data);
                if(data.result) {
                    let album = this.state.albums.slice();
                    album[index].liked = true;
                    album[index].likes++;
                    this.setState({albums: album});
                }

            }.bind(this),
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });
    };

    handleRedirect = (songlist_id) => {
        this.setState({
            redirect: `/songlist/${songlist_id}`
        });
    };

    render() {
        return (
            <div className="home-layout" ref="home">
                <div className="home-private">
                    <div className="home-private-info">
                        <div className="home-private-info-general">
                            <img className="home-info-avatar" src={this.state.user_info.avator_url} alt="头像"/>
                            <div className="home-private-info-text">
                                <div>
                                    <div className="home-private-info-name">{this.state.user_info.username}</div>
                                    <div className="home-private-info-gender">
                                        {this.state.user_info.gender === 'M' ? 'Male' : 'Female'}
                                    </div>
                                    <RaisedButton label={this.state.user_info.followed ? "已关注" : "关注"}
                                                  disabled={this.state.user_info.followed} onTouchTap={this.follow}
                                                  primary={true} style={{margin: '0 32px'}}/>
                                </div>
                                <div className="level-bar">
                                    <div className="level-bar-text">
                                        <div>Lv{this.state.user_info.level}</div>
                                        <div>Lv{this.state.user_info.level + 1}</div>
                                    </div>
                                    <div>
                                        <LinearProgress mode="determinate" value={this.state.user_info.exp}
                                                        max={this.state.user_info.exp_max} />
                                    </div>
                                </div>
                                <div className="home-private-info-count-border">
                                    <div className="home-private-info-count" style={{cursor: 'default'}}>
                                        <div className="home-private-info-count-number">{this.state.user_info.ctr_songlist}</div>
                                        <div>创建歌单数</div>
                                    </div>
                                    <div className="home-private-info-count" style={{cursor: 'default'}}>
                                        <div className="home-private-info-count-number">{this.state.user_info.liked_songlist}</div>
                                        <div>喜爱歌单数</div>
                                    </div>
                                    <div className="home-private-info-count" style={{cursor: 'default'}}>
                                        <div className="home-private-info-count-number">{this.state.user_info.friends_num}</div>
                                        <div>关注好友数</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="home-recommend">
                    <div className="sub-header">
                        <span>TA的歌单({this.state.albums.length})</span>
                    </div>
                    <div>
                        {this.state.albums.map((item, index) => (
                            <Paper key={index} zDepth={2} className="billboard-item-border">
                                <div className="user-page-songlist-item">
                                    <div className="user-page-songlist-item-image"
                                         style={{background: `url(${item.img_url}) no-repeat center`, backgroundSize: 'cover'}}
                                         onTouchTap={() => this.handleRedirect(item.list_id)} />
                                    <div>
                                        <div className="billboard-item-title">
                                            <div onTouchTap={() => this.handleRedirect(item.list_id)}>{item.songlist_name}</div>
                                            <div style={{display: 'flex', flexFlow: 'row nowrap'}}>
                                                {item.liked ?
                                                    <div className="billboard-item-star-label"><div>Likes</div></div> :
                                                    <IconButton onTouchTap={() =>{this.handleStar(index, item.list_id)}}
                                                                tooltip="喜爱" touch={true} tooltipPosition="top-right">
                                                        <ActionGrade />
                                                    </IconButton>
                                                }
                                                <div className="billboard-item-star"><div>{item.likes}</div></div>
                                            </div>
                                        </div>

                                        <div className="billboard-item-author">by {item.author}</div>
                                        <div className="billboard-item-descriptioin">{item.description}</div>
                                    </div>
                                </div>
                            </Paper>
                        ))}
                    </div>
                </div>
                <div className="home-recommend">
                    <div className="sub-header">
                        <span>TA的动态</span>
                    </div>
                    <div className="home-public">
                        {this.state.moments.map((moment, index) => (
                            <div className="comment" key={index}>
                                <img className="comment-avator" alt="missing" src={moment.avator_url}/>
                                <div className="comment-content">
                                    <div className="comment-border" />
                                    <div className="comment-header">
                                        <div className="comment-header-name">{moment.username}</div>&nbsp;
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
            </div>
        );
    }

}

export default UserPage;