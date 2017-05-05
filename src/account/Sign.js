/**
 * Created by tsengkasing on 5/1/2017.
 */
import React from 'react';
import './Sign.css';
import SignIn from './SignIn';
import Register from './Register';

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
                <div className="background">
                    <div className="frame">
                        {this.state.page_status ? <SignIn switch={this.switchPage} />: <Register switch={this.switchPage} />}
                    </div>
                </div>

            </div>
        );
    }
}

export default Sign;