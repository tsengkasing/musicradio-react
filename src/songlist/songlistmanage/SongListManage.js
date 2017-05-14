/**
 * Created by Think on 2017/5/4.
 */
import React from 'react';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
    TableFooter
} from 'material-ui/Table';
import { Redirect } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import LinearProgress from 'material-ui/LinearProgress';
import IconButton from 'material-ui/IconButton';
import AvPlayCircleOutline from 'material-ui/svg-icons/av/play-circle-outline';

import SongListInfoGetter from '../SongListInfoGetter';
import SongUpload from './songupload/SongUpload';
import SignDialog from "../../account/SignDialog";
import Auth from '../../account/Auth';
import './SongListManage.css';

class SongListManage extends React.Component {

    constructor(props) {
        super(props);
        window.__songselected = 'none';

        this.state = {
            song_list_id: this.props.match.params.id,
            song_list_info : {},
            songs: [],
            is_owner: this.recognizeIsOwner(),
            wait: false,
            redirect: null
        };
    }

    //判断是否是自己创建的歌单
    recognizeIsOwner = () => {
        let info = Auth.getUserInfo(), list = null;
        if(info) {
            list = info.own_song_list_ids;
        }
        return list && list.includes(parseInt(this.props.match.params.id, 10));
    };

    loadSongs = () => {
        this.setState({wait: true});
        SongListInfoGetter.getSongsOfSongList(this.state.song_list_id, (songs) => {
            this.setState({
                songs: songs,
                wait: false
            })
        })
    };

    componentWillMount() {
        SongListInfoGetter.getSongListInfo(this.state.song_list_id, (info) => {
            this.setState({
                song_list_info: info
            });
        });

        this.loadSongs();
    }

    formatDuration(duration) {
        return (duration / 60000).toFixed(0) + '分' + ((duration / 1000) % 60).toFixed(0) + '秒';
    }

    handleSelectSongs = (selectedRows) => {
        window.__songselected = selectedRows;
    };

    handleRemoveSong = () => {
        let selected = window.__songselected;
        if((typeof selected) === 'string' && selected === 'all') {
            this.refs.dialog.setContent('不可以不可以不可以', '不能删除全部歌曲喔');
            this.refs.dialog.handleOpen(false);
        }else if(((typeof selected) === 'string' && selected === 'none') ||
            (selected instanceof Array && selected.length === 0)) {
            this.refs.dialog.setContent('不可以不可以不可以', '没有选中任何歌曲');
            this.refs.dialog.handleOpen(false);
        }else {
            let tasks = [];
            for(let index of window.__songselected) {
                tasks.push(SongListInfoGetter.removeSong(parseInt(this.state.song_list_id, 10), this.state.songs[index].song_id));
            }
            Promise.all(tasks).then(() => {
                this.refs.dialog.setContent('操作成功', '选中的歌曲都删掉啦');
                this.refs.dialog.handleOpen(true);
            });
        }
    };

    handleRedirect = (song_id) => {
        this.setState({
            redirect: `/audio/${this.state.song_list_id}/${song_id}`
        });
    };

    render() {
        return (
            <div className="song-list-manage-outside-border">
                <div className="song-list-manage-item">
                    <div className="song-list-item-image"
                         style={{background: `url(${this.state.song_list_info.img_url}) no-repeat center`}}/>
                    <div className="song-list-item-title">
                        <div style={{margin: '10px 0'}}>
                            {this.state.song_list_info.songlist_name}
                            <span className="song-list-manage-item-author"> —— by {this.state.song_list_info.author}</span>
                        </div>
                        <div style={{display: 'flex', flexFlow: 'row nowrap'}}>
                            <div className="song-list-item-star-label"><div>Likes</div></div>
                            <div className="song-list-item-star"><div>{this.state.song_list_info.likes}</div></div>
                        </div>
                    </div>
                </div>
                <div className="song-list-manage-sub-header">
                    <span>歌曲列表</span>
                </div>
                <div>
                    <Table multiSelectable={true} onRowSelection={this.handleSelectSongs}>
                        <TableHeader displaySelectAll={this.state.is_owner} adjustForCheckbox={this.state.is_owner}>
                            <TableRow>
                                <TableHeaderColumn style={{width: '50%'}}>歌曲名称</TableHeaderColumn>
                                <TableHeaderColumn>艺术家</TableHeaderColumn>
                                <TableHeaderColumn style={{width: '10%'}} >时长</TableHeaderColumn>
                                <TableHeaderColumn style={{width: '8%', textAlign: 'right'}}>播放</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={this.state.is_owner}>
                            {this.state.songs.map((item, index) => (
                                <TableRow key={index}>
                                    <TableRowColumn style={{width: '50%'}}>{item.song_name}</TableRowColumn>
                                    <TableRowColumn>{item.artists}</TableRowColumn>
                                    <TableRowColumn style={{width: '10%'}} >{this.formatDuration(item.duration)}</TableRowColumn>
                                    <TableRowColumn style={{width: '8%', textAlign: 'right'}} >
                                        <IconButton tooltip="Play" touch={true} tooltipPosition="top-left" onTouchTap={() => this.handleRedirect(item.song_id)}>
                                            <AvPlayCircleOutline/>
                                        </IconButton>
                                    </TableRowColumn>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter adjustForCheckbox={false}>
                            <TableRow>
                                <TableRowColumn style={{paddingLeft: 12, verticalAlign: 'middle'}}>
                                    {this.state.is_owner ? <FlatButton label="删除选中歌曲" primary={true} onTouchTap={this.handleRemoveSong}/> : null }
                                    {this.state.is_owner ? <FlatButton label="上传歌曲" onTouchTap={() => this.refs.uploadSong.handleOpen(this.state.song_list_id)} primary={true} /> : null }
                                </TableRowColumn>
                            </TableRow>
                        </TableFooter>
                    </Table>
                    {this.state.wait ? <LinearProgress mode="indeterminate" /> : null}
                </div>
                {this.state.redirect ? <Redirect to={this.state.redirect}/> : null}
                <SongUpload ref="uploadSong" success={this.loadSongs}/>
                <SignDialog ref="dialog" onPress={this.loadSongs}/>
            </div>
        );
    }
}
export default SongListManage;