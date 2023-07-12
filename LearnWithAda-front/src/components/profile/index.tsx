import React from 'react';
import { Avatar, Grid, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { ProfileProps } from '../../utils/interfaces';
import classnames from 'classnames';
import './profile.less';

const defaultUserName = 'Unauthorized';

export const Profile: React.FC<ProfileProps> = props => {
    const { userName = defaultUserName, clickable = false } = props;
    const screens = Grid.useBreakpoint();
    const classes = classnames({
        profile: true,
        'profile-clickable': clickable,
    });
    return (
        <div className={classes}>
            {screens.xl && screens.xxl && (
                <Typography.Paragraph className="profile-user-name">
                    {userName}
                </Typography.Paragraph>
            )}
            <Avatar icon={<UserOutlined />} className="profile-avatar" />
        </div>
    );
};

export default Profile;
