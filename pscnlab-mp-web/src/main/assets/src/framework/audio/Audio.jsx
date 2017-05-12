import './style.less';
import React from 'react';
import { notification, Button } from 'antd';
import PubSub from '../common/pubsubmsg.js';
import newOrderAudio from './newOrder.mp3';
import refund from './refund.wav';
import refundReview from './refundReview.wav';

let isTouch = false;
class Audio extends React.Component {
    state = {
        audioSrc: newOrderAudio,
        delayTime: 0,
    };

    loadAudioSrc = () => {
        isTouch = true;
        this.refs.audioControls.load();
    };

    notTouch = () => {
        if (!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) && !isTouch) {
            notification.config({
                top: 80,
            });

            const key = `open${Date.now()}`;

            const btnClick = function () {
                // to hide notification box
                notification.close(key);
            };

            const btn = (
                <Button type="primary" onClick={btnClick}>
                    我知道了
                </Button>
            );

            const args = {
                message: '语音提醒已经开启',
                description: '当前系统会提供一些声音来提醒你.',
                duration: 0,
                btn,
                key,
            };
            notification.open(args);
        }
    };

    componentDidMount() {
        PubSub.subscribe('tipAudio', 'tipAudio', (type) => {
            let audioSrc = newOrderAudio;
            if (type === 'refund') { // 退款提示
                audioSrc = refund;
            }
            if (type === 'refund-review') { // 退款审核提示
                audioSrc = refundReview;
            }
            this.tipAudio(audioSrc);
        });

        document.addEventListener('touchstart', this.loadAudioSrc, false);

        this.refs.audioControls.addEventListener('play', function() {
            // 当 audio 能够播放后, 移除这个事件
            document.removeEventListener('touchstart', this.loadAudioSrc, false);
        }, false);


        setTimeout(() => {
            this.notTouch();
        }, 5000);

        // setTimeout(() => {
        //     this.tipAudio();
        // }, 20000);
    }

    tipAudio(audioSrc = newOrderAudio, delayTime = 0) {
        this.setState({
            audioSrc,
            delayTime,
        });

        this.refs.audioControls.play();
    }

    render() {
        const {audioSrc} = this.state;
        return (
            <div>
                <audio ref="audioControls" style={{display: 'none'}} src={audioSrc} controls="controls">
                </audio>
            </div>
        );
    }
}

export default Audio;
