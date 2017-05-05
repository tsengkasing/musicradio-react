/**
 * Created by tsengkasing on 5/1/2017.
 */
import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class SignDialog extends React.Component {

    state = {
        open: false,
        title : "Sign Success!",
        description : "Press OK to redirect to Home.",
        redirect : false,
    };

    handleOpen = (redirect) => {
        this.setState({
            open: true,
            redirect : redirect,
        });
    };

    handleClose = () => {
        this.setState({open: false});
        if(this.props.onPress && this.state.redirect) {
            this.props.onPress();
        }
    };

    setContent = (title, description) => {
        this.setState({
            title : title,
            description : description
        });
    };

    render() {
        const actions = [
            <FlatButton
                label="OK"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.handleClose}
            />,
        ];

        return (
            <div>
                <Dialog
                    title={this.state.title}
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
                    {this.state.description}
                </Dialog>
            </div>
        );
    }
}