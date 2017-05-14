/**
 * Created by Think on 2017/5/5.
 */
import React from 'react';
import FlatButton from 'material-ui/FlatButton';
// import TextField from 'material-ui/TextField';
import Chip from 'material-ui/Chip';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';

import API from '../../../API';
import $ from 'jquery';
import 'jquery-form';

import './SongUpload.css';

const styles = {
    imageInput: {
        cursor: 'pointer',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        width: '100%',
        opacity: 0,
    },
    checkbox : {
        marginBottom : 16,
        float :'left',
        width : 200,
    }
};

const language_items = [
    <MenuItem value={'zh-cn'} key={0} primaryText={'华语'} />,
    <MenuItem value={'en-us'} key={1} primaryText={'英语'} />,
    <MenuItem value={'ja-jp'} key={2} primaryText={'日语'} />,
    <MenuItem value={'fr-fr'} key={3} primaryText={'法语'} />,
    <MenuItem value={'ko-kr'} key={4} primaryText={'韩语'} />,
];

class SongUpload extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            songlist_id : null,

            language : '',
            styles_binary : '000000000000000000000',
            styles_array : ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0',
                '0', '0', '0', '0', '0', '0', '0', '0', '0'],
            styles_source : [false, false, false, false, false, false, false, false, false, false, false, false,
                false, false, false, false, false, false, false, false, false],

            file_name: '',

            song_name : '',
            song_artists : '',

            error_text_name : null,
            error_text_artists : null,
            error_text_language : null,
        }
    }

    handleOpen = (songlist_id) => {
        this.setState({
            open: true,
            songlist_id: songlist_id
        });
    };

    handleClose = () => {
        this.setState({open: false});
    };

    handleSubmit = () => {
        if(this.checkValidation()) return;
        // $('#uploadLocalSong').click();

        const form = $('#Uploadsong').ajaxSubmit();
        const xhr = form.data('jqxhr');

        xhr.done((data) => {
            if(data && data.result) {
                this.handleClose();
                this.props.success();
            }
        });

    };

    GetSongDetail = () => {
        const URL = API.SongInfo;
        $.ajax({
            url : URL,
            async : false,
            type : 'GET',
            headers : {
                target : 'api'
            },
            data : {
                id : this.state.song_netease_id,
            },
            success : function(data) {
                this.setState({
                    mp3Url : data.mp3Url,
                    song_artists : data.song_artists,
                    song_name : data.song_name,
                });
            }.bind(this),
            error : function(xhr, textStatus) {
                console.log(xhr.status + '\n' + textStatus + '\n');
            }
        });
    };

    checkValidation = () => {
        let flag = false;
        // let error_song_name = null, error_song_artists = null;
        let error_language = null;
        if(this.state.file_name === '') {
            // error_song_name = '必须选择上传文件';
            flag = true;
        }
        // if(this.state.song_name === '') {
        //     error_song_name = '名称不能为空';
        //     flag = true;
        // }
        // if(this.state.song_artists === '') {
        //     error_song_artists = '艺术家不能为空';
        //     flag = true;
        // }
        if(this.state.language === '') {
            error_language = '语言不能为空';
            flag = true;
        }
        this.setState({
            // error_text_name: error_song_name,
            // error_text_artists: error_song_artists,
            error_text_language: error_language
        });
        return flag;
    };

    handleSelectFile = (event) => {
        let path = event.target.value;
        let idx = path.lastIndexOf('\\');
        this.setState({
            file_name: path.slice(idx + 1)
        });
    };

    handleInputSongName = (event) => {
        this.setState({
            song_name: event.target.value
        });
    };

    handleInputSongArtists = (event) => {
        this.setState({
            song_artists: event.target.value
        });
    };

    handleChangeLanguage = (event, index, value) => {
        this.setState({language : value});
    };

    handleChangeStyle = (event, isInputChecked) => {
        let checked = this.state.styles_source;
        let style = this.state.styles_array;
        let position = parseInt(event.target.id, 10);
        checked[position] = isInputChecked;
        style[position] = isInputChecked ? '1' : '0';
        this.setState({
            styles_source : checked,
            styles_array : style,
            styles_binary: style.join(''),
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
                label="上传"
                primary={true}
                onTouchTap={this.handleSubmit}
            />,
        ];

        return (
            <div>
                <Dialog
                    title="上传歌曲"
                    actions={actions}
                    modal={true}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                    autoScrollBodyContent={true}
                >
                    <form id="Uploadsong" method="post" encType="multipart/form-data" action={API.AddSongFromUpload} target="uploadSongFrame">
                        <div className="upload-layout">
                            <div className="pick-song">
                                <RaisedButton primary={true} label="选择歌曲" labelPosition="before">
                                    <input
                                        style={styles.imageInput}
                                        name="song_file"
                                        type="file"
                                        onChange={this.handleSelectFile}
                                    />
                                </RaisedButton>
                                <Chip>
                                    {this.state.file_name}
                                </Chip>
                            </div>
                            <div className="upload-song-info">
                                {/*<TextField*/}
                                    {/*floatingLabelText="歌曲名称"*/}
                                    {/*value={this.state.song_name}*/}
                                    {/*onChange={this.handleInputSongName}*/}
                                    {/*errorText={this.state.error_text_name}*/}
                                    {/*fullWidth={true}*/}
                                {/*/><br />*/}
                                <div className="upload-song-info-second">
                                    {/*<TextField*/}
                                        {/*floatingLabelText="歌曲艺术家"*/}
                                        {/*value={this.state.song_artists}*/}
                                        {/*onChange={this.handleInputSongArtists}*/}
                                        {/*errorText={this.state.error_text_artists}*/}
                                    {/*/>*/}
                                    <SelectField
                                        name="language"
                                        value={this.state.language}
                                        onChange={this.handleChangeLanguage}
                                        floatingLabelText="语言"
                                        maxHeight={200}
                                        errorText={this.state.error_text_language}
                                    >
                                        {language_items}
                                    </SelectField>
                                </div>

                            </div>

                        </div>

                        <br/>

                        <input type="hidden" name="songlist_id" value={this.state.songlist_id}/>
                        <input type="hidden" name="language" value={this.state.language}/>
                        <input type="hidden" name="styles" value={this.state.styles_binary}/>
                        <input type="submit" value="upload" id="uploadLocalSong" style={{visibility : 'collapse'}}/>
                    </form>

                    <div className="upload-song-sub-header">
                        <span>歌曲类型</span>
                    </div>
                    <div>
                        <Checkbox label="流行" checked={this.state.styles_source[0]} id="0" style={styles.checkbox} onCheck={this.handleChangeStyle}/>
                        <Checkbox label="摇滚" checked={this.state.styles_source[1]} id="1" style={styles.checkbox} onCheck={this.handleChangeStyle}/>
                        <Checkbox label="民谣" checked={this.state.styles_source[2]} id="2" style={styles.checkbox} onCheck={this.handleChangeStyle}/>
                        <Checkbox label="电子" checked={this.state.styles_source[3]} id="3" style={styles.checkbox} onCheck={this.handleChangeStyle}/>
                        <Checkbox label="舞曲" checked={this.state.styles_source[4]} id="4" style={styles.checkbox} onCheck={this.handleChangeStyle}/>
                        <Checkbox label="说唱" checked={this.state.styles_source[5]} id="5" style={styles.checkbox} onCheck={this.handleChangeStyle}/>
                        <Checkbox label="轻音乐" checked={this.state.styles_source[6]} id="6" style={styles.checkbox} onCheck={this.handleChangeStyle}/>
                        <Checkbox label="爵士" checked={this.state.styles_source[7]} id="7" style={styles.checkbox} onCheck={this.handleChangeStyle}/>
                        <Checkbox label="乡村" checked={this.state.styles_source[8]} id="8" style={styles.checkbox} onCheck={this.handleChangeStyle}/>
                        <Checkbox label="古典" checked={this.state.styles_source[9]} id="9" style={styles.checkbox} onCheck={this.handleChangeStyle}/>
                        <Checkbox label="民族" checked={this.state.styles_source[10]} id="10" style={styles.checkbox} onCheck={this.handleChangeStyle}/>
                        <Checkbox label="英伦" checked={this.state.styles_source[11]} id="11" style={styles.checkbox} onCheck={this.handleChangeStyle}/>
                        <Checkbox label="金属" checked={this.state.styles_source[12]} id="12" style={styles.checkbox} onCheck={this.handleChangeStyle}/>
                        <Checkbox label="朋克" checked={this.state.styles_source[13]} id="13" style={styles.checkbox} onCheck={this.handleChangeStyle}/>
                        <Checkbox label="蓝调" checked={this.state.styles_source[14]} id="14" style={styles.checkbox} onCheck={this.handleChangeStyle}/>
                        <Checkbox label="雷鬼" checked={this.state.styles_source[15]} id="15" style={styles.checkbox} onCheck={this.handleChangeStyle}/>
                        <Checkbox label="古风" checked={this.state.styles_source[16]} id="16" style={styles.checkbox} onCheck={this.handleChangeStyle}/>
                        <Checkbox label="另类/独立" checked={this.state.styles_source[17]} id="17" style={styles.checkbox} onCheck={this.handleChangeStyle}/>
                        <Checkbox label="世界音乐" checked={this.state.styles_source[18]} id="18" style={styles.checkbox} onCheck={this.handleChangeStyle}/>
                        <Checkbox label="拉丁" checked={this.state.styles_source[19]} id="19" style={styles.checkbox} onCheck={this.handleChangeStyle}/>
                        <Checkbox label="R&B/Soul" checked={this.state.styles_source[20]} id="20" style={styles.checkbox} onCheck={this.handleChangeStyle}/>
                    </div>
                </Dialog>
                <iframe name="uploadSongFrame" style={{display: 'none'}}/>
            </div>
        );
    }
}

export default SongUpload;