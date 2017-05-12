/**
 * Created by Think on 2017/5/5.
 */
import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import './CommentDisplayer.css';


import Auth from '../account/Auth';
import API from '../API';
import $ from 'jquery';

export default class CommentDisplayer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user_img_avator : Auth.getUserInfo().avator_url,
            //评论列表
            comment_list : [],
            input_comment : '',

            song_list_id: parseInt(this.props.match.params.song_list_id)
        };
    }

    loadComments = (cb) => {
        const URL = API.GetComments;
        $.ajax({
            url : URL,
            type : 'GET',
            headers : {
                'target' : 'api',
            },
            contentType: 'application/json',
            dataType: 'json',
            data : {
                id : this.state.song_list_id,
            },
            success : function(comments) {
                this.setState({
                    comment_list: comments
                });
            }.bind(this),
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });
    };

    handleInputComment = (event) => {
        this.setState({
            input_comment: event.target.value
        });
    };


    sendComment = () => {
        let text = this.state.input_comment;
        if(!text || text === '') {
            alert('评论不能为空喔~');
            return;
        }else {
            if(text.search(/[垃圾,傻逼,TMD,SB,你妈]/) !== -1) {
                alert('请文明用语');
                return;
            }
        }

        let comment = {
            songlist_id: this.state.song_list_id,
            content : text,
        };
        const URL = API.AddComment;
        $.ajax({
            url : URL,
            type : 'POST',
            headers : {
                'target' : 'api',
            },
            contentType: 'application/json',
            dataType: 'json',
            data : JSON.stringify(comment),
            success : function(data) {
                this.loadComments();
                // eslint-disable-next-line
                this.setState({
                    input_comment: ''
                });
            }.bind(this),
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });


    };

    componentWillMount() {
        this.loadComments();
    }

    render() {
        return (
            <div className="comment-list-border">
                <div className="create-comment">
                    <img className="avator" alt="missing" src={this.state.user_img_avator}/>
                    <textarea
                        id="input_comment"
                        className="text-field"
                        value={this.state.input_comment}
                        onInput={this.handleInputComment}
                        placeholder="请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。"
                        rows={3}
                        cols={80}
                        disabled={this.props.toLogin}
                    />
                    <RaisedButton className="button"
                                  buttonStyle={{height : '90px'}}
                                  onTouchTap={()=>{this.sendComment();}}
                                  label="发表评论"
                                  primary={true}
                                  disabled={this.props.toLogin} />
                </div>

                <div className="comment-list">
                    {this.state.comment_list.map((row, index)=>(
                        <div className="comment" key={index}>
                            <img className="comment-avator" alt="missing" src={row.avator_url}/>
                            <div className="comment-content">
                                <div className="comment-border" />
                                <div className="comment-header">
                                    <div className="comment-header-name">{row.name}</div>&nbsp;
                                    <div className="comment-header-level">lv {row.level}</div>
                                </div>
                                <div className="comment-text">
                                    {row.content}
                                </div>
                                <div className="comment-footer">
                                    #{this.state.comment_list.length - index} &nbsp;&nbsp; {row.time}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

}