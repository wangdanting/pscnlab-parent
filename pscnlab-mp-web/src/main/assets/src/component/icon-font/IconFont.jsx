import './iconfont.css';
import React from 'react';

class IconFont extends React.Component {
    state = {};
    static defaultProps = {};
    static propTypes = {};

    componentWillMount() {
    }

    render() {
        let className = ['icon', 'iconfont', `icon-${this.props.type}`].join(' ');
        if (this.props.className) {
            className = `${className} ${this.props.className}`;
        }
        return <i {...this.props} className={className}/>;
    }
}
export default IconFont;

