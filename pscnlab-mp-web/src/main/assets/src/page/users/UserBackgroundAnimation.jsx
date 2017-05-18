import './UserBackgroundAnimation.css';
import React from 'react';

const windowWidth = 1024;
const windowheight = 768;
const showRatio = 2;
let ratio = 1;
const renderFrames = 60; // Animation Frames per second (FPS)

const getPixelRatio = (context) => {
    const backingStore = context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio || 1;

    return (window.devicePixelRatio || 1) / backingStore;
};

/**
 * Request the browsers animation frame API
 * to get a solid framerate
 */
const requestAnimFrame = (() => {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / renderFrames);
        };
});

let domList = [
    {
        positionX: 90 * showRatio,
        positionY: 190 * showRatio,
        radius: 10 * showRatio,
        color: 'rgb(37, 60, 127)',
    }, {
        positionX: 45 * showRatio,
        positionY: 70 * showRatio,
        radius: 4 * showRatio,
        color: 'rgb(18, 41, 111)',
    }, {
        positionX: 140 * showRatio,
        positionY: 50 * showRatio,
        radius: 6 * showRatio,
        color: 'rgb(44, 63, 121)',
    }, {
        positionX: 20 * showRatio,
        positionY: 250 * showRatio,
        radius: 3 * showRatio,
        color: 'rgb(21, 42, 107)',
    }, {
        positionX: 115 * showRatio,
        positionY: 350 * showRatio,
        radius: 3 * showRatio,
        color: 'rgb(18, 42, 106)',
    }, {
        positionX: 135 * showRatio,
        positionY: 260 * showRatio,
        radius: 8 * showRatio,
        color: 'rgb(50, 71, 128)',
    }, {
        positionX: 180 * showRatio,
        positionY: 360 * showRatio,
        radius: 4 * showRatio,
        color: 'rgb(28, 52, 116)',
    }, {
        positionX: 390 * showRatio,
        positionY: 300 * showRatio,
        radius: 9 * showRatio,
        color: 'rgb(50, 72, 130)',
    }, {
        positionX: 420 * showRatio,
        positionY: 260 * showRatio,
        radius: 6 * showRatio,
        color: 'rgb(71, 87, 146)',
    }, {
        positionX: 450 * showRatio,
        positionY: 290 * showRatio,
        radius: 3 * showRatio,
        color: 'rgb(45, 67, 124)',
    }, {
        positionX: 400 * showRatio,
        positionY: 150 * showRatio,
        radius: 7 * showRatio,
        color: 'rgb(55, 74, 130)',
    }, {
        positionX: 480 * showRatio,
        positionY: 110 * showRatio,
        radius: 4 * showRatio,
        color: 'rgb(23, 45, 105)',
    }, {
        positionX: 490 * showRatio,
        positionY: 240 * showRatio,
        radius: 2 * showRatio,
        color: 'rgb(44, 64, 125)',
    }, {
        positionX: 370 * showRatio,
        positionY: 100 * showRatio,
        radius: 4 * showRatio,
        color: 'rgb(27, 48, 113)',
    },
];

const domLineList = [
    {
        startDom: 0,
        endDom: 1,
        color: 'rgb(7, 29, 105)',
    }, {
        startDom: 0,
        endDom: 2,
        color: 'rgb(13, 35, 110)',
    }, {
        startDom: 1,
        endDom: 2,
        color: 'rgb(5, 27, 100)',
    }, {
        startDom: 0,
        endDom: 3,
        color: 'rgb(8, 31, 103)',
    }, {
        startDom: 0,
        endDom: 4,
        color: 'rgb(21, 46, 112)',
    }, {
        startDom: 2,
        endDom: 4,
        color: 'rgb(12, 38, 112)',
    }, {
        startDom: 5,
        endDom: 6,
        color: 'rgb(9, 35, 109)',
    }, {
        startDom: 0,
        endDom: 7,
        color: 'rgb(11, 37, 112)',
    }, {
        startDom: 7,
        endDom: 8,
        color: 'rgb(16, 43, 114)',
    }, {
        startDom: 2,
        endDom: 7,
        color: 'rgb(8, 36, 108)',
    }, {
        startDom: 2,
        endDom: 8,
        color: 'rgb(10, 42, 112)',
    }, {
        startDom: 10,
        endDom: 8,
        color: 'rgb(13, 40, 111)',
    }, {
        startDom: 10,
        endDom: 2,
        color: 'rgb(19, 41, 106)',
    }, {
        startDom: 10,
        endDom: 6,
        color: 'rgb(14, 37, 107)',
    }, {
        startDom: 11,
        endDom: 6,
        color: 'rgb(25, 48, 118)',
    }, {
        startDom: 11,
        endDom: 9,
        color: 'rgb(11, 34, 104)',
    }, {
        startDom: 8,
        endDom: 12,
        color: 'rgb(9, 32, 102)',
    }, {
        startDom: 7,
        endDom: 12,
        color: 'rgb(5, 27, 100)',
    }, {
        startDom: 10,
        endDom: 13,
        color: 'rgb(9, 32, 102)',
    },
];

class UserBackgroundAnimation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    initCanvas(ctx) {
        if (document.getElementById('canvas').getContext) {
            ctx.clearRect(0, 0, windowWidth, windowheight);

            domList.forEach((domListItem) => {
                ctx.fillStyle = domListItem.color;
                ctx.moveTo(0, 0);
                const circle = new Path2D();
                /*
                 * arc(x,y,起始弧度,终止弧度,bool);
                 * x,y就是圆心
                 * bool:true,代表顺时针。
                 * false,代表逆时针画
                 */
                circle.arc(domListItem.positionX * ratio, domListItem.positionY * ratio, domListItem.radius * ratio, 0, 2 * Math.PI);
                ctx.fill(circle);

                ctx.fillStyle = 'rgb(1, 27, 104)';
                const circle2 = new Path2D();
                circle2.arc(domListItem.positionX * ratio, domListItem.positionY * ratio, domListItem.radius * (3 / 4) * ratio, 0, 2 * Math.PI);

                ctx.fill(circle2);

                ctx.fillStyle = domListItem.color;
                const circle3 = new Path2D();
                circle3.arc(domListItem.positionX * ratio, domListItem.positionY * ratio, domListItem.radius * (1 / 2) * ratio, 0, 2 * Math.PI);

                ctx.fill(circle3);
            });

            domLineList.forEach((domLineItem) => {
                let currentValue = domList[domLineItem.endDom];
                let previousValue = domList[domLineItem.startDom];
                let color = domLineItem.color;

                let angleRatio = (currentValue.positionY - previousValue.positionY) / (currentValue.positionX - previousValue.positionX);
                let directionValueY = currentValue.positionY - previousValue.positionY > 0 ? 1 : -1;
                let directionValueX = currentValue.positionX - previousValue.positionX > 0 || currentValue.positionX - previousValue.positionX === 0 ? 1 : -1;

                ctx.lineWidth = 2 / ratio;
                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.moveTo(previousValue.positionX + directionValueX * 1 / 2 * (Math.cos(Math.atan(angleRatio)) * previousValue.radius * 2), previousValue.positionY + directionValueX * 1 / 2 * (Math.sin(Math.atan(angleRatio)) * previousValue.radius * 2));
                ctx.lineTo(currentValue.positionX - directionValueX * 1 / 2 * (Math.cos(Math.atan(angleRatio)) * currentValue.radius * 2), currentValue.positionY - directionValueX * 1 / 2 * (Math.sin(Math.atan(angleRatio)) * currentValue.radius * 2));
                ctx.stroke();
            });
        }
    }

    componentDidMount() {
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');

        canvas.width = windowWidth;
        canvas.height = windowheight;

        ratio = getPixelRatio(ctx);

        domList.forEach((value) => {
            value.positionX = value.positionX / ratio;
            value.positionY = value.positionY / ratio;
            value.radius = value.radius / ratio;
        });

        const that = this;
        that.initCanvas(ctx);
        const setTimeoutMove = () => {
            setTimeout(() => {
                domList.forEach((value) => {
                    if (Math.random() > 0.499999999) {
                        const randomDirection = (Math.random() > 0.499999999) ? 1 : -1;
                        // const randomDirection = 1;

                        value.positionX = (value.positionX - (1 / 2) * randomDirection);
                        value.positionY = (value.positionY + (1 / 2) * randomDirection);
                    }
                });
                that.initCanvas(ctx);
                setTimeoutMove();
            }, 3000);
        };
        setTimeoutMove();
    }

    render() {
        return (
            <canvas width="1024" height="768" className="canvas-container" id="canvas">

            </canvas>
        );
    }
}

export default UserBackgroundAnimation;
