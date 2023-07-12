import { Col, Row } from 'antd';
import React, { useCallback, useEffect, useRef } from 'react';
import NavbarTabs from '../menu-tabs';
import classnames from 'classnames';
import { CloseOutlined } from '@ant-design/icons';
import { SidebarProps } from '../../utils/interfaces';
import { noop } from '../../utils/helpers';
import { useJwt } from 'react-jwt';
import { AuthDataKeys } from '../../utils/constants';
import { DecodedToken } from '../../core/models/user';

export const Sidebar: React.FC<SidebarProps> = props => {
    const decodedToken = useJwt(localStorage.getItem(AuthDataKeys.ACCESS_TOKEN) || '')
        .decodedToken as DecodedToken;
    const { collapsed = false, onClose = noop, tabs = [] } = props;
    const sidebarRef = useRef<HTMLDivElement>(null);
    const clickHandler = useCallback(
        event => {
            if (sidebarRef && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                onClose();
            }
        },
        [onClose],
    );
    useEffect(() => {
        document.addEventListener('mousedown', clickHandler);
        return () => {
            document.removeEventListener('mousedown', clickHandler);
        };
    }, [clickHandler]);
    const classes = classnames('sidebar', {
        'sidebar-collapsed': collapsed,
    });
    const navbarTabs = tabs.reduce(
        (acc, { onClick = noop, tabKey, tabLabel, routePath }) =>
            Object.assign(acc, {
                [tabKey]: { text: tabLabel, onClick, routePath },
            }),
        {},
    );
    return (
        <div ref={sidebarRef} className={classes}>
            <Row className="sidebar-header" justify={'end'} align={'middle'}>
                <Col>
                    <CloseOutlined className="sidebar-cross-icon" onClick={onClose} />
                </Col>
            </Row>
            <Row className="sidebar-content">
                <Col span={24}>
                    <NavbarTabs
                        decodedToken={decodedToken}
                        vertical
                        tabs={navbarTabs}
                        onItemClick={onClose}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default Sidebar;
