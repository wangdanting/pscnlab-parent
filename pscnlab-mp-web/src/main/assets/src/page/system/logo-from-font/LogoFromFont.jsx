import './style.css';
import 'component/logo-font/style.css';
import React from 'react';

class LogoFromFont extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loading: false};
    }

    render() {
        const logoFontContent = this.props.logoFont || CONTEXT.MERCHANT.platformName;

        return <span className="logo-from-font meicanyun-logo-font">{logoFontContent}</span>;
    }
}

export default LogoFromFont;
