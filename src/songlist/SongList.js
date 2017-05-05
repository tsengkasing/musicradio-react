/**
 * Created by Think on 2017/5/4.
 */
import React from 'react';
import { Redirect } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import SongListInfoGetter from './SongListInfoGetter';

import './SongList.css';
import SongListInfoModifyDialog from './songlistinfomodifydialog/SongListInfoModifyDialog';
import SongListCreateDialog from './songlistcreatedialog/SongListCreateDialog';


class SongList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            song_list: [],
            redirect: null,
            wait: false
        }
    }

    loadSongList = () => {
        this.setState({wait: true});
        SongListInfoGetter.getAllSongListOwned((song_list) => {
            this.setState({
                song_list: song_list,
                wait: false
            })
        });
    };

    componentWillMount() {
        this.loadSongList();
    }

    handleModifyInfo = (songlist) => {
        this.refs.songListInfoModifyDialog.handleOpen(songlist);
    };

    handleCreateSongList = () => {
        this.refs.songListCreateDialog.handleOpen();
    };

    handleDeleteSongList = (songlist_id) => {
        SongListInfoGetter.deleteSongList(songlist_id, () => {
            this.loadSongList();
        });
    };

    handleRedirect = (songlist_id) => {
        this.setState({
            redirect: `/page/u/songlist/${songlist_id}`
        });
    };

    render() {
        return (
            <div className="outside-border">
                <div className="sub-header">
                    <span>所有歌单</span>
                </div>
                <div style={{textAlign: 'center', margin: 16}}>
                {this.state.wait ? <CircularProgress size={60} thickness={5} /> :
                <FlatButton label="添加歌单" primary={true} fullWidth={true} labelStyle={{fontSize: 16}} onTouchTap={this.handleCreateSongList} />}
                </div>
                <div className="song-list">
                    {this.state.song_list.map((item, index) => (
                        <Paper key={index} zDepth={2} className="song-list-item-border">
                            <div className="song-list-item">
                                <div className="song-list-item-image" style={{background: `url(${item.img_url}) no-repeat center`}}
                                     onTouchTap={() => {this.handleRedirect(item.list_id)}} />
                                <div className="song-list-item-title">
                                    <div>{item.songlist_name}</div>
                                    <div style={{display: 'flex', flexFlow: 'row nowrap'}}>
                                        <div className="song-list-item-star-label"><div>Likes</div></div>
                                        <div className="song-list-item-star"><div>{item.likes}</div></div>
                                    </div>
                                </div>
                                <div className="song-list-item-description">{item.description}</div>
                                <div className="song-list-item-modify">
                                    <FlatButton label="查看歌曲" secondary={true} onTouchTap={() => {this.handleRedirect(item.list_id)}} />
                                    <FlatButton label="修改信息" secondary={true} onTouchTap={() => {this.handleModifyInfo(item)}} />
                                    <FlatButton label="删除歌单" secondary={true} onTouchTap={() => {this.handleDeleteSongList(item.list_id)}} />
                                </div>
                            </div>
                        </Paper>
                    ))}
                </div>
                <SongListInfoModifyDialog ref="songListInfoModifyDialog" success={this.loadSongList}/>
                <SongListCreateDialog ref="songListCreateDialog" success={this.loadSongList}/>
                {this.state.redirect ? <Redirect to={this.state.redirect}/> : null}
            </div>
        );
    }
}
export default SongList;