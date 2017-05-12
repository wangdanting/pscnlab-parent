import './app.less';
import React, { Component } from 'react';
import HeaderBar from '../header/Header';
import Sidebar from '../sidebar/Sidebar';
import PubSubMsg from '../common/pubsubmsg';
import Container from '../container/Container';
import Audio from '../audio/Audio';
import GlobalNotification from '../notification/GlobalNotification';
import { Common } from 'common';

class App extends Component {
    componentDidMount() {
        PubSubMsg.subscribe('setPushState', (value) => {
            if (value) {
                this.props.history.pushState(null, value);
            } else {
                this.props.history.pushState(null, Common.getFirstDefaultUrl());
            }
        });
    }

    render() {
        return (
            <div>
                <HeaderBar/>
                <Sidebar/>
                <Container>
                    {this.props.children}
                </Container>
                <Audio />
                <GlobalNotification/>
            </div>
        );
    }
}

export default App;
