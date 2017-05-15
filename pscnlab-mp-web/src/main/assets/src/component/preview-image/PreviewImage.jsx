import './style.less';
import React from 'react';
import IconFont from '../icon-font/IconFont';


class PreviewImage extends React.Component {
    state = {
        isMousePressed: false,
        showPreviewImage: false,
        previewWidth: 300,
        top: 300,
        left: 0,
        mouseX: 0,
        mouseY: 0,
        rotationDeg: 0,
        iconStyleIndex: 0,
    };

    clientWidth;

    clientHeight;

    static defaultProps = {
        imgSize: '@50h_70w_1e_1c',
        src: 'http://www.gbtags.com/gb/laitu/400x200&text=默认图片/dd4814/ffffff',
    };

    static propTypes = {
        noImgSize: React.PropTypes.bool,
        src: React.PropTypes.string.isRequired,
    };

    componentDidMount() {
        this.clientWidth = document.documentElement.clientWidth;
        this.clientHeight = document.documentElement.clientHeight;
    }

    handlePreviewMouseDown = (e) => {
        let clientX = e.clientX;
        let clientY = e.clientY;
        this.setState({
            isMousePressed: true,
            mouseX: clientX,
            mouseY: clientY,
        });
    };

    handlePreviewMouseMove = (e) => {
        const isMousePressed = this.state.isMousePressed;
        if (!isMousePressed) {
            return false;
        }
        const event = this.getEvent(e);
        const oldMouseX = this.state.mouseX;
        const oldMouseY = this.state.mouseY;
        const newMouseX = event.clientX;
        const newMouseY = event.clientY;
        const moveX = newMouseX - oldMouseX;
        const moveY = newMouseY - oldMouseY;
        const oldTop = this.state.top;
        const oldLeft = this.state.left;
        const newLeft = oldLeft + moveX;
        const newTop = oldTop + moveY;
        this.setState({
            top: newTop,
            left: newLeft,
            mouseX: newMouseX,
            mouseY: newMouseY,
        });
    };

    handlePreviewMouseUp = () => {
        this.setState({
            isMousePressed: false,
        });
    };

    getEvent = (e) => {
        return e || window.event;
    };

    handleShowPreview = () => {
        this.setState({
            previewWidth: this.clientWidth * 0.2,
            showPreviewImage: true,
            left: (this.clientWidth * 0.8) / 2,
        });
    };

    handleClosePreview = () => {
        this.setState({
            showPreviewImage: false,
        });
    };

    handleRotateLeftPreview = () => {
        let iconStyleIndex = this.state.iconStyleIndex;
        let newIndex = iconStyleIndex - 1;
        if (newIndex < 0) {
            newIndex = 3;
        }
        this.setState({
            rotationDeg: this.state.rotationDeg - 90,
            iconStyleIndex: newIndex,
        });
    };

    handleRotateRightPreview = () => {
        let iconStyleIndex = this.state.iconStyleIndex;
        let newIndex = iconStyleIndex + 1;
        if (newIndex > 3) {
            newIndex = 0;
        }
        this.setState({
            rotationDeg: this.state.rotationDeg + 90,
            iconStyleIndex: newIndex,
        });
    };

    render() {
        let {src, imgSize, noImgSize, children} = this.props;
        if (noImgSize) {
            imgSize = '';
        }
        let img = (
            children || <img
                {...this.props}
                src={src + imgSize}
                alt=""
            />
        );
        let previewContentStyle = {
            top: this.state.top,
            left: this.state.left,
            width: this.state.previewWidth,
            transform: `rotate(${this.state.rotationDeg}deg)`,
        };
        return (
            <div className="preview-image">
                <div className="thumbnail-wrap" onClick={this.handleShowPreview}>{img}</div>
                <div className="preview-wrap" style={{display: this.state.showPreviewImage ? 'block' : 'none'}}>
                    <div className="preview-mask" onClick={this.handleClosePreview}></div>
                    <div
                        className={`preview-content preview-rotation-${this.state.iconStyleIndex}`}
                        style={previewContentStyle}
                        onMouseMove={this.handlePreviewMouseMove}
                        onMouseUp={this.handlePreviewMouseUp}
                        onMouseDown={this.handlePreviewMouseDown}
                    >
                        <img className="preview-image" src={src} alt=""/>
                        <div className="preview-overlay"></div>
                        <div className="preview-operation-bar">
                            <IconFont type="zuoxuanzhuan" onClick={this.handleRotateLeftPreview}/>
                            <IconFont type="youxuanzhuan" onClick={this.handleRotateRightPreview}/>
                            <IconFont type="guanbi" onClick={this.handleClosePreview}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default PreviewImage;
