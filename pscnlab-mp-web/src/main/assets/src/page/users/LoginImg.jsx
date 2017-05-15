import './login-image.css';
import React from 'react';

class LoginImg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }

    componentDidMount() {
        const that = this;
        setTimeout(() => {
            that.setState({
                isLoaded: true
            });
        }, 200);
    }

    render() {
        return (
            <div className="img-drift">
                <div className="round round-order"></div>
                <div className="roundi roundi-order"></div>
                <div className="round round-dish"></div>
                <div className="roundi roundi-dish"></div>
                <div className="round round-market"></div>
                <div className="roundi roundi-market"></div>
                <div className={this.state.isLoaded ? 'word word-order word-order-animate' : 'word word-order'}>
                    <span>成员管理</span>
                </div>
                <div className={this.state.isLoaded ? 'word word-dish word-dish-animate' : 'word word-dish'}>
                    <span>项目管理</span>
                </div>
                <div className={this.state.isLoaded ? 'word word-market word-market-animate' : 'word word-market'}>
                    <span>桌位管理</span>
                </div>
            </div>
        );
    }
}

export default LoginImg;
