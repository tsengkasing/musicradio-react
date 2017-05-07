/**
 * Created by Think on 2017/5/4.
 */
import React from 'react';
import { Redirect } from 'react-router-dom';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import ActionInfo from 'material-ui/svg-icons/action/info';
import './Follow.css';
import $ from 'jquery';
import API from '../API';

class Follow extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            following_list: [],
            redirect: null
        };
    }

    loadData = () => {
        const URL = API.Following;
        $.ajax({
            url : URL,
            type : 'GET',
            contentType: 'application/json',
            dataType: 'json',
            headers : {
                'target' : 'api',
            },
            success : function(data) {
                this.setState({
                    following_list: data
                });
            }.bind(this),
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });
    };

    visitUser = (user_id) => {
        this.setState({
            redirect: `/user/${user_id}`
        });
    };

    componentWillMount() {
        this.loadData();
    }

    render () {
        return (
            <div className="follow-outside-border">
                <div className="follow-sub-header">
                    <span>关注列表</span>
                </div>
                <List>
                    {this.state.following_list.map((item, index) => (
                        <ListItem key={index}
                                  onTouchTap={()=>this.visitUser(item.id)}
                            primaryText={item.username}
                            leftAvatar={<Avatar src={item.avator_url} />}
                            rightIcon={<ActionInfo />}
                        />
                    ))}

                </List>
                {this.state.redirect ? <Redirect to={this.state.redirect}/> : null}
            </div>
        );
    }
}

export default Follow;