import React, { useCallback, useEffect, useState } from 'react';
import './navbar-tabs.less';
import { useNavigate, useLocation } from 'react-router-dom';
import { RoutePath } from '../../routes/routes';
import { Location } from 'history';
import { Menu } from 'antd';
import { isPermitted, noop } from '../../utils/helpers';
import { DecodedToken } from '../../core/models/user';
import { NavbarProps } from '../../utils/interfaces';
import { RoleTypes } from '../../utils/constants';

const { SubMenu } = Menu;
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const parseInitialKey = (location: Location, tabs: any) => {
    const initialKeyMatchResult = location.pathname.match(/^\/([\w]+)\/?.*/);
    if (initialKeyMatchResult && initialKeyMatchResult[0].includes('create')) return 'admin';
    return initialKeyMatchResult ? initialKeyMatchResult[1] : Object.keys(tabs)[0];
};

const NavbarTabs: React.FC<NavbarProps> = props => {
    const {
        tabs = {},
        onItemClick,
        mode = 'inline',
        onLogOutClick = noop,
        decodedToken = {} as DecodedToken,
    } = props;
    const location = useLocation();
    const [currentSelectedTab, setCurrentSelectedTab] = useState(parseInitialKey(location, tabs));
    const navigate = useNavigate();
    const role = decodedToken?.role;
    useEffect(() => {
        setCurrentSelectedTab(parseInitialKey(location, tabs));
    }, [location, tabs]);
    const onMenuItemClick = useCallback(
        ({ key }) => {
            const permission = isPermitted(key, role);
            navigate(permission ? `/${key}` : RoutePath.DASHBOARD);
            setCurrentSelectedTab(key);
            onItemClick && onItemClick();
        },
        [navigate, onItemClick, role],
    );
    if (Object.keys(tabs).length === 0) {
        return null;
    }
    return (
        <Menu
            className="navbar-tabs"
            mode={mode}
            theme={mode === 'horizontal' ? 'light' : 'dark'}
            selectedKeys={[currentSelectedTab]}
        >
            {Object.entries(tabs).map(([key, { text }]) => {
                return text && isPermitted(key, role) ? (
                    <Menu.Item key={key} onClick={text ? onMenuItemClick : noop}>
                        {text}
                    </Menu.Item>
                ) : null;
            })}
            {role !== RoleTypes.USER && role !== RoleTypes.BUSINESS_ADMIN && (
                <>
                    <SubMenu key="admin" title="Admin">
                        {Object.entries(tabs).map(([key, { text, routePath }]) => {
                            const subMenuText =
                                !text && isPermitted(key, role) && routePath?.includes('create')
                                    ? routePath.split('/')[1]
                                    : '';
                            return subMenuText ? (
                                <Menu.Item key={key} onClick={onMenuItemClick}>
                                    {subMenuText[0].toUpperCase() +
                                        subMenuText.substr(1, subMenuText.length)}
                                </Menu.Item>
                            ) : null;
                        })}
                    </SubMenu>
                    <SubMenu key="account" title="Account">
                        <Menu.Item onClick={onLogOutClick}>Sign out</Menu.Item>
                    </SubMenu>
                </>
            )}
        </Menu>
    );
};

export default NavbarTabs;
