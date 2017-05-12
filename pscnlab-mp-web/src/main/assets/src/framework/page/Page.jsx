import './style.less';
import '../../page/style.css'; // 定制特定样式
import React from 'react';
import { Spin, QueueAnim } from 'antd';
import { Link } from 'react-router';
import { getCurrentSidebarMenu } from '../SidebarMenu';
import { currentPosition } from '../../common/common.jsx';
import Settings from '../settings/Settings';
import PubSubMsg from '../common/pubsubmsg';

class Page extends React.Component {
    state = {
        pageHeader: '',
        showPageAnimate: Settings.pageAnimate(),
    };

    static defaultProps = {
        loading: false,
        animConfig: [
            {opacity: [1, 0], translateY: [0, 50]},
            {opacity: [1, 0], translateY: [0, -50]},
        ],
    };

    getPageHeaderDateByMenu(isSystemMenu) {
        let currentMenu = getCurrentSidebarMenu('', isSystemMenu);
        let parentText = currentMenu ? currentMenu.parentText : [];
        let title = currentMenu ? currentMenu.text : '';
        let breadcrumbItems = [];

        for (let i = 0; i < parentText.length; i++) {
            breadcrumbItems.push({text: parentText[i]});
        }

        breadcrumbItems.push({text: title});

        return {
            title,
            breadcrumbItems,
        };
    }

    setPageHeader(isSystemMenu) {
        let pageHeaderJsx = '';
        let pageHeaderDate = null;
        let title = '';
        if (!this.props.header || this.props.header === 'auto') {
            pageHeaderDate = this.getPageHeaderDateByMenu(isSystemMenu);
            if (pageHeaderDate) {
                title = pageHeaderDate.title;
            }
        } else {
            title = this.props.header.title;
        }

        if (typeof title === 'object') {
            let headerTitleItem = [];
            for (let i = 0; i < title.length; i++) {
                let item = title[i];
                let key = `page-title-item${i}`;
                headerTitleItem.push(
                    item.path ? (
                        <span key={key}><Link to={item.path}>{item.text}</Link> <i style={{color: '#999'}}> > </i></span>
                    ) : (
                        <span key={key}>{item.text}</span>
                    )
                );
            }
            title = headerTitleItem;
        }

        pageHeaderJsx = (
            <div className="admin-page-header">
                <h1 className="admin-page-header-title">
                    {title}
                </h1>
            </div>
        );

        this.setState({
            pageHeader: pageHeaderJsx,
        });
    }


    componentDidMount() {
        PubSubMsg.subscribe('set-header-breadcrumb', (isSystemMenu) => {
            this.setPageHeader(isSystemMenu);
        });
        this.setPageHeader();
    }

    componentWillUnmount() {
        if (this.hideLoading) {
            this.hideLoading();
        }

        PubSubMsg.unsubscribe('set-header-breadcrumb');
    }

    render() {
        let pageChildren = (
            <Spin class="admin-spin" spining={this.props.loading}>
                {this.state.pageHeader}
                {this.props.children}
            </Spin>
        );

        if (this.state.showPageAnimate) {
            pageChildren = (
                <QueueAnim animConfig={this.props.animConfig} delay={100}>
                    <div key="queue-anim-item1" className="deal-transition-fixed-bug">
                        {pageChildren}
                    </div>
                </QueueAnim>
            );
        }
        let adminPageContentStyle = {};
        if (!this.props.header) {
            adminPageContentStyle.paddingTop = 0;
        }

        return (
            <div className={"admin-page"}>
                <div className={currentPosition.isStore() ? 'admin-page-content' : 'admin-page-content admin-page-content-merchant'}>
                    {pageChildren}
                </div>
            </div>
        );
    }
}

export default Page;
