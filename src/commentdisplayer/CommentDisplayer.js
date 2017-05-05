/**
 * Created by Think on 2017/5/5.
 */
import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import './CommentDisplayer.css';

const comments = [
    {
        name : '小星星',
        img_url : 'http://img.everstar.xyz/everstar.jpg',
        id : '00001',
        level : '3',
        content : '希望自己能更加努力。',
        time : '2017-03-21 22:34',
        order : 5
    },
    {
        name : 'Rabbit Lee',
        img_url : 'http://img.everstar.xyz/rabbit.jpg',
        id : '00002',
        level : '3',
        content : '很强',
        time : '2017-03-22 12:56',
        order : 4
    },
    {
        name : 'happyFarmer',
        img_url : 'http://img.everstar.xyz/happyfarmergo.jpg',
        id : '00003',
        level : '2',
        content : '超厉害',
        time : '2017-03-23 13:44',
        order : 3
    },
    {
        name : 'Novemser',
        img_url : 'http://img.everstar.xyz/novemser.jpg',
        id : '00004',
        level : '4',
        content : '0评论1点赞惨案',
        time : '2017-03-23 09:04',
        order : 2
    },
    {
        name : 'Huo Long',
        img_url : 'http://img.everstar.xyz/huolong.jpg',
        id : '00005',
        level : '3',
        content : '。。。。。',
        time : '2017-03-23 18:06',
        order : 1
    }
];

export default class CommentDisplayer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user_img_avator : 'http://img.everstar.xyz/default.jpg',
            //评论列表
            comment_list : [],
            input_comment : null,
            order : 6
        };
    }


    sendComment = (text) => {
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
            name : '刘看山',
            img_url : 'http://img.everstar.xyz/default.jpg',
            id : '00008',
            level : '1',
            content : text,
            time : new Date().toLocaleString(),
            order : this.state.order++
        };
        let comments = [comment].concat(this.state.comment_list);
        this.setState({
            comment_list : comments
        });
        // eslint-disable-next-line
        this.state.input_comment.value = '';
    };

    componentWillMount() {
        this.setState({
            input_comment : document.getElementById('input_comment'),
            comment_list: comments
        });
    }

    render() {
        return (
            <div className="comment-list-border">
                <div className="create-comment">
                    <img className="avator" alt="missing" src={this.state.user_img_avator}/>
                    <textarea
                        id="input_comment"
                        className="text-field"
                        placeholder="请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。"
                        rows={3}
                        cols={80}
                    />
                    <RaisedButton className="button"
                                  buttonStyle={{height : '90px'}}
                                  onTouchTap={()=>{this.sendComment(this.state.input_comment.value);}}
                                  label="发表评论"
                                  primary={true} />
                </div>

                <div className="comment-list">
                    {this.state.comment_list.map((row, index)=>(
                        <div className="comment" key={index}>
                            <img className="comment-avator" alt="missing" src={row.img_url}/>
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
                                    #{row.order} &nbsp;&nbsp; {row.time}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

}