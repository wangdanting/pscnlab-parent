import './style.css';
import React from 'react';
import { Md5 } from 'utils';
import { Common } from 'common';

const randomColorList = [
    {
        name: 1,
        color: 'rgb(80, 193, 233)',
    }, {
        name: 2,
        color: 'rgb(255, 190, 26)',
    }, {
        name: 3,
        color: 'rgb(228, 38, 146)',
    }, {
        name: 4,
        color: 'rgb(169, 109, 243)',
    }, {
        name: 5,
        color: 'rgb(253, 117, 80)',
    }, {
        name: 6,
        color: 'rgb(103, 197, 12)',
    }, {
        name: 7,
        color: 'rgb(80, 193, 233)',
    }, {
        name: 8,
        color: 'rgb(103, 197, 12)',
    },
];

class UserDefaultImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const imageUrl = this.props.imageUrl;
        if (imageUrl) {
            return <img style={{display: (imageUrl ? 'inline-block' : 'none')}} src={imageUrl} className="admin-user-avatar" alt="用户头像"/>;
        } else {
            const userInfo = Common.getCurrentUser();

            if (!userInfo) {
                Common.goToLogin('用户默认头像，用户信息不存在');
            }

            let userNameFirstChar = '';
            if (userInfo && userInfo.userName) {
                userNameFirstChar = userInfo.userName.charAt(0);
            }

            let hashFirstNumber = 0;
            if (!userInfo.hashFirstNumber) {
                const hash = Md5(userInfo.userName);
                const hashFirst = hash.substring(0, 1);
                hashFirstNumber = parseInt(hashFirst, 16) % 8;
                userInfo.hashFirstNumber = hashFirstNumber;
                Common.setCurrentUser(userInfo);
            } else {
                hashFirstNumber = userInfo.hashFirstNumber;
            }

            return <span className="admin-user-section admin-user-no-image-content admin-user-no-image-char" style={{backgroundColor: randomColorList[hashFirstNumber].color}}>{userNameFirstChar}</span>;
        }
    }
}

export default UserDefaultImage;
