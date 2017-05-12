/**
 * Created by Think on 2017/5/12.
 */
import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import API from '../../API';
import $ from 'jquery';
import 'jquery-form';

class AvatarUpload extends React.Component {
    state = {
        open: false,
    };

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    handleSubmit = () => {
        const form = $('#ChangeAvator').ajaxSubmit();
        const xhr = form.data('jqxhr');

        xhr.done(() => {
            this.handleClose();
            this.props.success();
        });
    };

    render() {
        const actions = [
            <FlatButton
                label="取消"
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="确定"
                primary={true}
                onTouchTap={this.handleSubmit}
            />,
        ];

        return (
            <div>
                <Dialog
                    title="Upload a Avator"
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
                    <form id="ChangeAvator" method="post" encType="multipart/form-data" action={API.Avatar} target="uploadFrame">
                        <RaisedButton primary={true} label="选择一个头像" labelPosition="before">
                            <input type="file" className="image-input" name="image_file" />
                        </RaisedButton>
                    </form>
                </Dialog>
                <iframe name="uploadFrame" className="hidden"/>
            </div>
        );
    }
}

export default AvatarUpload;