/**
 * Created by tsengkasing on 5/1/2017.
 */
import React from 'react';
import $ from 'jquery';
import API from '../API';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import SignDialog from "./SignDialog";

const style = {
    center : {
        textAlign: 'center'
    },
    radioButtonGroup: {
        width: '50%',
        textAlign : 'center',
        margin : '0 auto',
        marginBottom: '16px'
    }
};

class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username : null,
            password : null,

            error_username : null,
            error_password : null,

            sex : 'M',
        }
    }

    selectSex = (event) => {
        this.setState({sex : event.target.value});
    };


    // 注册
    onSignUp = () => {

        if(this.state.error_username !== null) return;
        if(this.state.error_password !== null) return;

        const URL = API.SignUp;
        let data = {
            username : this.state.username,
            password : this.state.password,
            gender : this.state.sex
        };
        console.log(data);
        $.ajax({
            url : URL,
            type : 'POST',
            headers : {
                'target' : 'api',
            },
            contentType: 'application/json;charset=UTF-8',
            data : JSON.stringify(data),
            dataType:'json',
            success : function(data, textStatus, jqXHR) {
                if(data.result) {
                    this.refs.dialog.setContent('Sign Up success!', 'You can sign in now.');
                    this.refs.dialog.handleOpen(false);
                    this.handleChange(0);
                }
            }.bind(this),
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });
    };

    //检查用户名是否存在
    checkUsernameNotExist = (event) => {
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
                        this.setState({error_username: 'This username is already used!'});
                    else
                        this.setState({error_username: null});
                }.bind(this),
                error : function(xhr, textStatus) {
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

    };

    render () {
        return (
                <div style={style.center}>

                    <h3 className="">Music Radio</h3>
                    <p className="">给世人 展示 你的音乐</p>

                    <TextField hintText="username"
                               floatingLabelText="username"
                               type="text"
                               id="signup"
                               errorText={this.state.error_username}
                               onBlur={this.checkUsernameNotExist}
                               onChange={this.inputUsername}/>
                    <br/>
                    <TextField hintText="password"
                               floatingLabelText="password"
                               type="password"
                               errorText={this.state.error_password}
                               onChange={this.inputPassword}/>
                    <br/><br/>
                    <RadioButtonGroup name="sex" valueSelected={this.state.sex} onChange={this.selectSex} style={style.radioButtonGroup}>
                        <RadioButton
                            value="M"
                            label="Male"
                        />
                        <RadioButton
                            value="F"
                            label="Female"
                        />
                    </RadioButtonGroup>

                    <RaisedButton label="Register"
                                  primary={true}
                                  onClick={this.onSignUp}/>

                    <br/>
                    <RaisedButton label="Goto Sign In"
                                  secondary={true}
                                  style={{marginTop: '8px'}}
                                  onClick={this.props.switch}/>

                    <SignDialog ref="dialog" onPress={this.redirectPage}/>
                </div>

        );
    }
}

export default Register;