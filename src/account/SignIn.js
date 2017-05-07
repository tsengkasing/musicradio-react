/**
 * Created by tsengkasing on 5/1/2017.
 */
import React from 'react';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';
import API from '../API';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import SignDialog from "./SignDialog";
import Auth from './Auth';

const style = {
    center : {
        textAlign: 'center'
    }
};

class SignIn extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username : null,
            password : null,

            error_username : null,
            error_password : null,

            redirect: null
        }
    }

    // 登录
    onSignIn = () => {

        if(this.state.error_username !== null) return;
        if(this.state.error_password !== null) return;

        /*
         * 为了测试而存在
         */
        if(this.state.username === 'test'){
            //登录信息保存到本地
            this.refs.dialog.setContent('Sign in Success!', 'Press OK to redirect to Home.');
            this.refs.dialog.handleOpen(true);

            Auth.storeUserInfo({ username : 'test', password : ''});
            return;
        }


        const request_data ={ username : this.state.username, password : this.state.password };
        const URL = API.SignIn;
        $.ajax({
            url : URL,
            type : 'POST',
            headers : {
                'target' : 'api',
            },
            contentType: 'application/json;charset=UTF-8',
            data : JSON.stringify(request_data),
            success : function(data, textStatus, jqXHR) {
                if(data.result){
                    this.refs.dialog.setContent('Sign in Success!', 'Press OK to redirect to Home.');
                    this.refs.dialog.handleOpen(true);

                    Auth.storeUserInfo(request_data);
                }
            }.bind(this),
            error : function(xhr, textStatus) {
                if(xhr.status === 500) {
                    alert('Internal Server Error\nPlease wait a minute.');
                }else {
                    this.setState({error_password: 'password not matched'});
                }
                console.log(xhr.status + '\n' + textStatus + '\n');
            }.bind(this)
        });
    };

    //检查用户名是否存在
    checkUsernameExist = (event) => {
        //如果用户名为空
        if (event.target.value === '') {
            this.setState({error_username: 'This field is required'});
        }else {
            const URL = API.Account;
            $.ajax({
                url : URL,
                type : 'GET',
                headers : {
                    'target' : 'api',
                },
                contentType: 'application/json',
                data : {
                    id : this.state.username
                },
                success : function(data, textStatus, jqXHR) {
                    if(data.result)
                        this.setState({error_username: null});
                    else
                        this.setState({error_username: 'Username not existed'});
                }.bind(this),
                error : function(xhr, textStatus) {
                    if(xhr.status === 500) {
                        alert('Internal Server Error\nPlease wait a minute.');
                    }
                    console.log(xhr.status + '\n' + textStatus + '\n');
                }
            });
        }
    };

    inputUsername = (event) => {
        this.setState({
            username : event.target.value,
            error_username : null
        });
    };

    inputPassword = (event) => {
        this.setState({
            password : event.target.value,
            error_password : null
        });
    };

    redirectPage = () => {
        this.props.success();
        this.setState({
            redirect: '/u/home'
        });
    };

    render () {
        return (
            <div style={style.center}>

                <h3 className="">Music Radio</h3>
                <p className="">与世人 分享 你的音乐</p>

                <TextField hintText="username"
                           floatingLabelText="username"
                           type="text"
                           errorText={this.state.error_username}
                           onBlur={this.checkUsernameExist}
                           onChange={this.inputUsername}/>
                <br/>
                <TextField hintText="password"
                           floatingLabelText="password"
                           type="password"
                           errorText={this.state.error_password}
                           onChange={this.inputPassword}/>
                <br/><br/>

                <RaisedButton label="Sign In"
                              primary={true}
                              onClick={this.onSignIn}/>

                <br/>
                <RaisedButton label="Goto Register"
                              secondary={true}
                              style={{marginTop: '8px'}}
                              onClick={this.props.switch}/>

                <SignDialog ref="dialog" onPress={this.redirectPage}/>
                {this.state.redirect ? <Redirect to={this.state.redirect}/> : null}
            </div>
        );
    }
}

export default SignIn;