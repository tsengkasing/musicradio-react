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
import IconButton from 'material-ui/IconButton';
import LinearProgress from 'material-ui/LinearProgress';
import AvPlayCircleOutline from 'material-ui/svg-icons/av/play-circle-outline';

import SongListInfoGetter from '../SongListInfoGetter';
import SongUpload from './songupload/SongUpload';
import './SongListManage.css';

class SongListManage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            song_list_id: this.props.match.params.id,
            songs: [],
            is_owner: this.props.match.url.startsWith('/page/u'),
            wait: false,
            redirect: null
        };
    }

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
        this.loadSongs();
    }

    formatDuration(duration) {
        return (duration / 60000).toFixed(0) + '分' + ((duration / 1000) % 60).toFixed(0) + '秒';
    }

    handleRedirect = (song_id) => {
        this.setState({
            redirect: `/page/audio/${song_id}`
        });
    };

    render() {
        return (
            <div className="outside-border">
                <div className="sub-header">
                    <span>歌曲列表</span>
                </div>
                <div>
                    <Table multiSelectable={true}>
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
                                    {this.state.is_owner ? <FlatButton label="删除选中歌曲" primary={true} /> : null }
                                    {this.state.is_owner ? <FlatButton label="上传歌曲" onTouchTap={() => this.refs.uploadSong.handleOpen()} primary={true} /> : null }
                                </TableRowColumn>
                            </TableRow>
                        </TableFooter>
                    </Table>
                    {this.state.wait ? <LinearProgress mode="indeterminate" /> : null}
                </div>
                {this.state.redirect ? <Redirect to={this.state.redirect}/> : null}
                <SongUpload ref="uploadSong" success={this.loadSongs}/>
            </div>
        );
    }
}
export default SongListManage;