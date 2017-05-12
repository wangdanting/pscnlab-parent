import './style.less';
import React from 'react';
import PubSubMsg from '../common/pubsubmsg';
import Settings from '../settings/Settings';
class Container extends React.Component {
    state = {
        hidden: false,
        collapseSidebar: Settings.collapseSidebar(),
    };

    componentDidMount() {
        PubSubMsg.subscribeAcceptOldMsg('switch-sidebar', (data) => {
            this.setState({
                collapseSidebar: data,
            });
        });

        PubSubMsg.subscribeAcceptOldMsg('sidebar-menu', (data) => {
            if (data.menu && data.menu.length > 0) {
                this.setState({
                    hidden: false,
                });
            } else {
                this.setState({
                    hidden: true,
                });
            }
        });
    }

    render() {
        let paddingLeft = 0;
        if (!this.state.hidden) {
            if (this.state.collapseSidebar) {
                paddingLeft = 60;
            } else {
                paddingLeft = 210;
            }
        }
        let style = {
            paddingLeft,
        };
        return (
            <div className="admin-container " style={style}>{this.props.children}</div>
        );
    }
}
export default Container;
