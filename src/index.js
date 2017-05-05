import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Redirect} from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from './header/Header';
import Footer from './footer/Footer';

import Auth from './account/Auth';
import Sign from './account/Sign';
import Home from './home/Home';
import Follow from './follow/Follow';
import SongList from './songlist/SongList';
import SongListManage from './songlist/songlistmanage/SongListManage';
import Billboard from './billboard/Billboard';
import AudioPlayer from './audioplayer/AudioPlayer';

import './index.css';

injectTapEventPlugin();

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        Auth.getLoginStatus() ? (
            <Component {...props}/>
        ) : (
            <Redirect to={{
                pathname: '/page/sign',
                state: { from: props.location }
            }}/>
        )
    )}/>
);

ReactDOM.render(
    <BrowserRouter>
        <div className="layout">
            <Header/>
            <MuiThemeProvider>
                <div className="content">
                    <switch>
                        <Route path="/page/sign" component={Sign}/>
                        <Route path="/page/billboard" component={Billboard}/>
                        <Route path="/page/songlist/:id" component={SongListManage}/>
                        <Route path="/page/audio/:id" component={AudioPlayer}/>
                        <PrivateRoute exact path="/" component={Home}/>
                        <PrivateRoute path="/page/u/home" component={Home}/>
                        <PrivateRoute path="/page/u/follow" component={Follow}/>
                        <PrivateRoute path="/page/u/songlist/:id" component={SongListManage}/>
                        <PrivateRoute exact path="/page/u/songlist" component={SongList}/>
                    </switch>
                </div>
            </MuiThemeProvider>
            <Footer/>
        </div>
    </BrowserRouter>
  ,
  document.getElementById('root')
);

