/**
 * Created by tsengkasing on 5/1/2017.
 */
import React from 'react';
import './Footer.css';

class Footer extends React.Component {

    render() {
        let _if = window.location.pathname === '/sign';
        return (
            <footer>
                <div className="footer">
                    <p>© 2017 Music Radio</p>
                    <p><a className="contact" href="mailto:i@tsengkasing.me">联系我们</a></p>
                </div>
            </footer>
        );
    }
}


export default Footer;