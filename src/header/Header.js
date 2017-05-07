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
                window.location.reload();
            },
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });
    };

    render() {
        return (
            <div className="header">
                <div className="logo">
                    <img id="logo" src={logo} alt="logo" />
                    <p>Music Radio</p>
                </div>
                <div className="menu">
                    <div className="menu-item"><Link className="link" to="/billboard">热门</Link></div>
                    {this.props.info.toLogin ? null : <div className="menu-item"><Link className="link" to="/u/songlist">歌单管理</Link></div>}
                    {this.props.info.toLogin ? null : <div className="menu-item"><Link className="link" to="/u/follow">关注</Link></div>}
                    <div className="menu-item">{this.props.info.name ? <Link className="link" to="/u/home">{this.props.info.name}</Link> : <Link className="link" to="/sign">登录/注册</Link>}</div>
                    {this.props.info.toLogin ? null : <div style={{cursor: 'pointer'}} className="menu-item" onClick={this.signOut}>注销</div>}
                </div>
            </div>
        );
    }
}

export default Header;