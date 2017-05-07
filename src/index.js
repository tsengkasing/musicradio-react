import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from './header/Header';
import Footer from './footer/Footer';

import Auth from './account/Auth';
import Sign from './account/Sign';
import Home from './home/Home';
import Follow from './follow/Follow';
import SongList from './songlist/SongList';
import UserPage from './userpage/UserPage';
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
                pathname: '/sign',
                state: { from: props.location }
            }}/>
        )
    )}/>
);

const NotFound = () => (
    <div className="not-found">你来到了没有音乐的荒野之地</div>
);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            toLogin: true
        };
    }

    componentWillMount() {
        this.handleRefreshStatus();
    }

    handleRefreshStatus = () => {
        let userinfo = Auth.getUserInfo();
        if(typeof userinfo === 'object') {
            this.setState({
                name: userinfo.username,
                toLogin: userinfo.toLogin
            })
        }else {
            this.setState({
                name: null,
                toLogin: true
            });
        }
    };

    render() {
        return (
            <BrowserRouter>
                <div className="layout">
                    <Header info={{name: this.state.name, toLogin: this.state.toLogin}} />
                    <MuiThemeProvider>
                        <div className="content">
                            <Switch>
                                <Route path="/sign" render={props => (
                                    <Sign {...props} success={this.handleRefreshStatus} />
                                )}/>
                                <Route path="/billboard" component={Billboard}/>
                                <Route path="/songlist/:id" component={SongListManage}/>
                                <Route path="/audio/:id" component={AudioPlayer}/>
                                <Route path="/user/:id" component={UserPage}/>
                                <PrivateRoute exact path="/" component={Home}/>
                                <PrivateRoute path="/u/home" component={Home}/>
                                <PrivateRoute path="/u/follow" component={Follow}/>
                                <PrivateRoute path="/u/songlist/:id" component={SongListManage}/>
                                <PrivateRoute exact path="/u/songlist" component={SongList}/>
                                <Route component={NotFound}/>
                            </Switch>
                        </div>
                    </MuiThemeProvider>
                    <Footer/>
                </div>
            </BrowserRouter>
        );
    }
}


ReactDOM.render(
    <App/>,
  document.getElementById('root')
);

