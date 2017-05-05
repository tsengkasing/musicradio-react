/**
 * Created by Think on 2017/5/4.
 */
import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';

import API from '../../API';
import './SongListInfoModifyDialog.css';

// import 'jquery-form';
// import $ from 'jquery';

class SongListInfoModifyDialog extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            open: false,
            song_list_id: -1,
            song_list_name: '',
            description: '',
            image_url: '',
            img_id: -1,
            imageImportWay: false,
            error_text: null,
            wait: false
        }
    }

    handleOpen = (songlist) => {
        if(!songlist || (typeof songlist) !== 'object') return;
        this.setState({
            open: true,
            song_list_id: songlist.list_id,
            song_list_name: songlist.songlist_name,
            description: songlist.description,
            img_id: songlist.img_id
        });
    };

    handleClose = () => {
        this.setState({
            open: false,
            wait: false
        });
    };

    handleSubmit = () => {
        if(this.state.song_list_name === "") {
            this.setState({error_text: "This field is required"});
            return;
        }else
            this.setState({error_text: null});

        this.setState({
            wait: true
        });

        // const form = $('#ModifySongListInfoSubmit').ajaxSubmit({
        //     beforeSubmit: (arr, $form, options) => {
        //         console.log(arr);
        //     },
        //     filtering: function(el, index) {
        //         if ( el.type !== 'file' || el.value !== '' ) {
        //             return el;
        //         }else {
        //             let _el = el;
        //             _el.value = null;
        //             return _el;
        //         }
        //     }
        // });
        // const xhr = form.data('jqxhr');
        //
        // xhr.done((data) => {
        //     if(data && data.result)
        //         console.log('create list \nname :' + this.state.song_list_name + '\ndescription : ' + this.state.description );
        //     this.handleClose();
        //     this.props.success();
        // });

        this.refs.submit.click();
        setTimeout(()=>{
            this.props.success();
            this.handleClose();
        }, 3000);
    };

    inputName = (event) => {
        this.setState({
            song_list_name : event.target.value,
            error_text: null
        });
    };

    inputDescription = (event) => {
        this.setState({description : event.target.value});
    };

    inputImageUrl = (event) => {
        this.setState({image_url : event.target.value});
    };

    handleToggle = () => {
        this.setState({imageImportWay : !this.state.imageImportWay});
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
                    title="修改歌单信息"
                    actions={actions}
                    modal={true}
                    open={this.state.open}
                >
                    <div style={{textAlign: 'center', display: this.state.wait ? 'block' : 'none'}} >
                        <CircularProgress />
                    </div>

                    <Toggle
                        label="外链URL地址/上传本地图片"
                        defaultToggled={false}
                        style={{marginTop: 8}}
                        onToggle={this.handleToggle}
                    />
                    <form id="ModifySongListInfoSubmit" name="changelist" action={API.ChangeList} method="post" encType="multipart/form-data" target="uploadFrame">
                        <TextField
                            type="text"
                            name="songlist_name"
                            floatingLabelText="song list name"
                            value={this.state.song_list_name}
                            onChange={this.inputName}
                            errorText={this.state.error_text}
                        /><br />
                        <TextField
                            name="description"
                            type="text"
                            hintText="description"
                            floatingLabelText="Description"
                            multiLine={true}
                            rows={1}
                            rowsMax={6}
                            value={this.state.description}
                            onChange={this.inputDescription}
                            style={{width:'100%'}}
                        />

                        <input type="number" defaultValue={this.state.song_list_id} className="hidden" name="songlist_id" />
                        <input type="number" defaultValue={this.state.img_id} name="image_id" className="hidden" />
                        <TextField
                            style={{display : this.state.imageImportWay ? 'none' : 'block'}}
                            name="image_url"
                            type="text"
                            hintText="image_url"
                            floatingLabelText="image_url"
                            value={this.state.image_url}
                            onChange={this.inputImageUrl}
                        />
                        <FlatButton label="Choose an Image" labelPosition="before" style={{display : this.state.imageImportWay ? 'block' : 'none'}}>
                            <input type="file" name="image_file" className="image" />
                        </FlatButton>
                        <input type="submit" ref="submit" className="hidden"/>
                    </form>
                </Dialog>
                <iframe name="uploadFrame" className="hidden"/>
            </div>
        );
    }
}

export default SongListInfoModifyDialog;