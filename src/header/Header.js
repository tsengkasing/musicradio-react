/**
 * Created by tsengkasing on 5/1/2017.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from './logo.png';
import $ from 'jquery';
import API from '../API';
import Auth from '../account/Auth';


class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: null,
            toLogin: true
        }
    }

    componentWillMount() {
        let userinfo = Auth.getUserInfo();
        if(typeof userinfo === 'object') {
            this.setState({
                name: userinfo.username,
                toLogin: userinfo.toLogin
            })
        }
    }

    signOut = () => {
        const URL = API.SignOut;
        $.ajax({
            url : URL,
            type : 'GET',
            async : false,
            contentType: 'application/json',
            headers : {
                'target' : 'api',
            },
            success : function() {
                Auth.clearUserInfo();
            },
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });
        window.location.reload();
    };

    render() {
        return (
            <div className="header">
                <div className="logo">
                    <img id="logo" src={logo} alt="logo" />
                    <p>Music Radio</p>
                </div>
                <div className="menu">
                    <div className="menu-item"><Link className="link" to="/page/billboard">热门</Link></div>
                    {this.state.toLogin ? null : <div className="menu-item"><Link className="link" to="/page/u/songlist">歌单管理</Link></div>}
                    {this.state.toLogin ? null : <div className="menu-item"><Link className="link" to="/page/u/follow">关注</Link></div>}
                    <div className="menu-item">{this.state.name ? <Link className="link" to="/page/u/home">{this.state.name}</Link> : <Link className="link" to="/page/sign">登录/注册</Link>}</div>
                    {this.state.toLogin ? null : <div className="menu-item" onClick={this.signOut}>注销</div>}
                </div>
            </div>
        );
    }
}

export default Header;