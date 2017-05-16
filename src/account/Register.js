/**
 * Created by tsengkasing on 5/1/2017.
 */
import React from 'react';
import $ from 'jquery';
import API from '../API';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import DatePicker from 'material-ui/DatePicker';
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
        let _current_date = new Date();
        this.state = {
            username : null,
            password : null,
            email: null,
            birth_date: _current_date,

            error_username : null,
            error_password : null,
            error_email: null,

            sex : 'M',
            max_date: _current_date
        }
    }


    // 注册
    onSignUp = () => {

        if(this.state.error_username !== null) return;
        if(this.state.error_password !== null) return;
        if(this.state.error_email !== null) return;

        const URL = API.SignUp;
        let data = {
            email: this.state.email,
            username : this.state.username,
            password : this.state.password,
            gender : this.state.sex,
            birthday: this.state.birth_date.toLocaleDateString()
        };
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
                    this.refs.dialog.handleOpen(true);
                }
            }.bind(this),
            error : function(xhr, textStatus) {
                this.refs.dialog.setContent(xhr.statusText, 'Please wait a minute.');
                this.refs.dialog.handleOpen(false);
                console.log(xhr.status + '\n' + textStatus + '\n');
            }.bind(this)
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
                    this.refs.dialog.setContent(xhr.statusText, 'Please wait a minute.');
                    this.refs.dialog.handleOpen(false);
                    console.log(xhr.status + '\n' + textStatus + '\n');
                }.bind(this)
            });
        }
    };

    checkEmailValidation = (event) => {
        if(!(/^[a-zA-Z0-9_.]+@[a-zA-Z0-9-]+[.a-zA-Z]+$/.test(event.target.value)))
            this.setState({
                error_email: 'Email is invalid'
            })
    };

    inputEmail = (event) => {
        this.setState({
            email: event.target.value,
            error_email: null
        });
    };

    inputUsername = (event) => {
        this.setState({
            username: event.target.value,
            error_username: null
        });
    };

    inputPassword = (event) => {
        this.setState({
            password: event.target.value,
            error_password: null
        });
    };

    handleChangeDate = (event, date) => {
        this.setState({
            birth_date: date
        })
    };

    selectSex = (event) => {
        this.setState({sex : event.target.value});
    };

    redirectPage = () => {
        this.props.switch();
    };

    render () {
        return (
                <div style={style.center}>

                    <h3 className="">Music Radio</h3>
                    <p className="">给世人 展示 你的音乐</p>

                    <TextField hintText="email"
                               floatingLabelText="email"
                               type="email"
                               onBlur={this.checkEmailValidation}
                               errorText={this.state.error_email}
                               onChange={this.inputEmail}/>
                    <br/>

                    <TextField hintText="username"
                               floatingLabelText="username"
                               type="text"
                               errorText={this.state.error_username}
                               onBlur={this.checkUsernameNotExist}
                               onChange={this.inputUsername}/>
                    <br/>
                    <TextField hintText="password"
                               floatingLabelText="password"
                               type="password"
                               errorText={this.state.error_password}
                               onChange={this.inputPassword}/>
                    <br/>
                    <DatePicker
                        onChange={this.handleChangeDate}
                        autoOk={true}
                        floatingLabelText="BirthDay"
                        defaultDate={this.state.max_date}
                        maxDate={this.state.max_date}
                    /><br/>
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