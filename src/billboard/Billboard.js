/**
 * Created by tsengkasing on 5/3/2017.
 */
import React from 'react';
import { Redirect } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import $ from 'jquery';
import API from '../API';

import './Billboard.css';


class Billboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            albums: [],
            redirect: null
        }
    }

    handleStar = (index, songlist_id) => {
        console.log('like!');
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

    loadData = () => {
        const URL = API.HotList;
        $.ajax({
            url : URL,
            type : 'GET',
            headers : {
                'target' : 'api',
            },
            contentType: 'application/json;charset=UTF-8',
            dataType:'json',
            data : {
                num : 11
            },
            success : function(data) {
                if(this.refs.billboard)
                    this.setState({albums : data})
            }.bind(this),
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });
    };

    componentWillMount() {
        this.loadData();
    }

    handleRedirect = (songlist_id) => {
        this.setState({
            redirect: `/page/u/songlist/${songlist_id}`
        });
    };

    render() {
        return (
            <div className="billboard-outside-border" ref="billboard">
                <div className="billboard-sub-header">
                    <span>排行榜</span>
                </div>
                <div className="billboard">
                    {this.state.albums.map((item, index)=>(
                        <Paper key={index} zDepth={2} className="billboard-item-border">
                            <div className="billboard-item">
                                <div className="billboard-item-image" style={{background: `url(${item.img_url}) no-repeat center`, backgroundSize: 'cover'}} onTouchTap={() => this.handleRedirect(item.list_id)} />
                                <div>
                                    <div className="billboard-item-title">
                                        <div onTouchTap={() => this.handleRedirect(item.list_id)}><span className="billboard-item-order">{index + 1}</span>&nbsp;&nbsp;{item.songlist_name}</div>
                                        <div style={{display: 'flex', flexFlow: 'row nowrap'}}>
                                            {item.liked ?
                                                <div className="billboard-item-star-label"><div>Likes</div></div> :
                                                <IconButton onTouchTap={() =>{this.handleStar(index, item.list_id)}} tooltip="喜爱" touch={true} tooltipPosition="top-right">
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
                {this.state.redirect ? <Redirect to={this.state.redirect}/> : null}
            </div>
        );
    }
}

export default Billboard;