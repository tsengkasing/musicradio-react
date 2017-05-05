/**
 * Created by Think on 2017/5/4.
 */
import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import SongListInfoGetter from '../SongListInfoGetter';

class SongListCreateDialog extends React.Component {
    state = {
        open: false,
        songlist_name : "",
        description : "",
        error_text : null,
    };

    handleOpen = () => {
        this.setState({
            open: true
        });
    };

    handleClose = () => {
        this.setState({open: false});
    };

    handleSubmit = () => {
        if(this.state.songlist_name === "") {
            this.setState({error_text: "This field is required"});
            return;
        }else
            this.setState({error_text: null});
        let songlist_info = {
            songlist_name: this.state.songlist_name,
            description: this.state.description,
        };
        SongListInfoGetter.createSongList(songlist_info, () => {
            console.log('createlist \nname :' + this.state.songlist_name + '\ndescription : ' + this.state.description );
            this.handleClose();
            this.props.success();
        });

    };

    inputName = (event) => {
        this.setState({
            songlist_name : event.target.value,
            error_text: null
        });
    };

    inputDescription = (event) => {
        this.setState({description : event.target.value});
    };

    render() {
        const actions = [
            <FlatButton
                label="取消"
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="提交"
                primary={true}
                onTouchTap={this.handleSubmit}
            />,
        ];

        return (
            <div>
                <Dialog
                    title="创建一个歌单"
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
                    <TextField
                        hintText="Song List Name"
                        floatingLabelText="song list name"
                        value={this.state.songlist_name}
                        onChange={this.inputName}
                        errorText={this.state.error_text}
                    /><br />
                    <TextField
                        hintText="description"
                        floatingLabelText="Description"
                        multiLine={true}
                        rows={1}
                        rowsMax={2}
                        value={this.state.description}
                        onChange={this.inputDescription}
                    />
                </Dialog>
            </div>
        );
    }
}

export default SongListCreateDialog;