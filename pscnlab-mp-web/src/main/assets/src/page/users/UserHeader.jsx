import React from 'react';

class UserHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loading: false};
    }

    render() {
        const userHeaderTitle = this.props.userHeaderTitle;
        return (
            <header className="user-header">
                <span className="meicanyun-logo-font" style={{fontSize: 32}}>人格与社会认知神经科学实验室</span>
                <div className="user-header-title">
                    <span className="user-header-title-content">
                        {userHeaderTitle}
                    </span>
                </div>
            </header>
        );
    }
}

export default UserHeader;

