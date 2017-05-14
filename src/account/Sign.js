/**
 * Created by tsengkasing on 5/1/2017.
 */
import React from 'react';
import './Sign.css';
import SignIn from './SignIn';
import Register from './Register';

import bg from './sign.jpg';

class Sign extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            page_status: true
        };
    }

    switchPage = () => {
        const status = this.state.page_status;
        this.setState({
            page_status: !status
        })
    } ;

    render () {
        return (
            <div className="main">
                <div className="background" style={{ background: `url(${bg}) center`}}>
                    <div className="frame" style={{height: this.state.page_status ? 350 : 560}}>
                        {this.state.page_status ? <SignIn success={this.props.success} switch={this.switchPage} />: <Register switch={this.switchPage} />}
                    </div>
                </div>

            </div>
        );
    }
}

export default Sign;