import './style.css';
import React, {Component} from 'react';
import {Tooltip, Icon} from 'antd';
import classNames from 'classnames';
import PubSub from '../common/pubsubmsg.js';

class GlobalNotification extends Component {
    state = {
        show: false,
        notificationIsMax: true,
        iconDirection: 'up',
        iconTitle: '最小化',
        isLoading: false,
        pullIntervalTime: 15 * 1000,
        title: '',
        content: '',
        options: [],
    };

    changeContentTimeout = 0;

    componentDidMount() {
        PubSub.subscribeAcceptOldMsg('show-global-notification', 'show-global-notification', (options) => {
            console.log(options, 999900);

            this.setState({
                options,
            });

            const {changeContent, intervalTime} = options;
            if (this.changeContentTimeout) {
                clearInterval(this.changeContentTimeout);
            }
            changeContent((data) => {
                const title = data.title;
                const content = data.content;
                this.setState({
                    title,
                    content,
                });
            });
            this.changeContentTimeout = setInterval(() => {
                changeContent((data) => {
                    const title = data.title;
                    const content = data.content;
                    this.setState({
                        title,
                        content,
                    });
                });
            }, intervalTime || this.state.pullIntervalTime);

            this.setState({
                show: true,
            });
        });

        PubSub.subscribeAcceptOldMsg('hide-global-notification', 'hide-global-notification', () => {
            if (this.changeContentTimeout) {
                clearInterval(this.changeContentTimeout);
            }
            this.setState({
                show: false,
            });
        });
    }

    minNotification = () => {
        if (this.state.iconDirection === 'up') {
            this.state.iconDirection = 'down';
            this.state.iconTitle = '最小化';
        } else {
            this.state.iconDirection = 'up';
            this.state.iconTitle = '最大化';
        }

        this.setState({
            notificationIsMax: !this.state.notificationIsMax,
            iconDirection: this.state.iconDirection,
            iconTitle: this.state.iconTitle,
        });
    }

    render() {
        const {
            show,
            title,
            content,
            iconTitle,
            iconDirection,
            notificationIsMax,
            } = this.state;
        const notificationContainerClass = classNames({
            'notification-container-max': true,
            'notification-container-min': notificationIsMax,
        });

        const notificationHeaderClass = classNames({
            'notification-header-max': true,
            'notification-header-min': notificationIsMax,
        });

        const notificationHeaderTitleClass = classNames({
            'notification-header-title-max': true,
            'notification-header-title-min': notificationIsMax,
        });
        return (
            <div className={notificationContainerClass} style={{display: show ? 'block' : 'none'}}>
                <div
                    className={notificationHeaderClass}
                    onClick={this.minNotification}
                >
                    <span
                        className={notificationHeaderTitleClass}
                        style={{display: 'block'}}
                    >
                        {notificationIsMax ? title : '任务提醒'}
                    </span>
                    <Tooltip placement="topRight" title={iconTitle}>
                        <Icon type={iconDirection} style={{marginRight: 12, color: '#fff'}}/>
                    </Tooltip>
                </div>
                <div className="notification-content">
                    {content}
                </div>
            </div>
        );
    }
}

export default GlobalNotification;
