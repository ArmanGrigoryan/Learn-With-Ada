import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { unauthorizedPages, authorizedPages, RoutePath } from './routes/routes';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignInContent from './pages/sign-in-content';
import { useInit } from './redux/hooks';
import { Grid, Layout } from 'antd';
import moment from 'moment';
import { signOut, getNotification, AppDispatch, userSelect } from './redux';
import { useDispatch, useSelector } from 'react-redux';
import NavbarTabs from './components/menu-tabs';
import AppHeader from './components/app-header';
import Sidebar from './components/sidebar';
import UserProfileContent from './pages/user-profile-content';
import { isPermitted } from './utils/helpers';
import { io } from 'socket.io-client';
import { RoleTypes } from './utils/constants';
import './App.less';

const { Sider, Content } = Layout;
const App: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [isSidebarShown, setIsSidebarShown] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const { firstName, lastName } = useSelector(userSelect);
    const { authorized, decodedToken } = useInit();
    const onLogOutClick = useCallback(() => {
        dispatch(signOut());
    }, [dispatch]);
    const tabs = authorizedPages.map(({ key, label, path }) => ({
        tabKey: key,
        tabLabel: label,
        routePath: path,
    }));
    const { md } = Grid.useBreakpoint();
    const navbarTabs = useMemo(
        () =>
            tabs.reduce(
                (acc, { tabKey, tabLabel, routePath }) =>
                    Object.assign(acc, {
                        [tabKey]: { text: tabLabel, routePath },
                    }),
                {},
            ),
        [tabs],
    );
    const onSidebarOpen = useCallback(() => {
        setIsSidebarShown(true);
    }, []);
    const onSidebarClose = useCallback(() => {
        setIsSidebarShown(false);
    }, []);
    useEffect(() => {
        if (authorized) {
            const newSocket = io(process.env.REACT_APP_API_HOST as string);
            newSocket.on('getNotification', data => {
                dispatch(
                    getNotification({
                        ...data,
                        date: moment().format('YYYY-MM-DD HH:mm').toString(),
                    }),
                );
            });
            return () => {
                newSocket.disconnect();
            };
        }
    }, [dispatch, authorized]);
    if (decodedToken?.role === RoleTypes.ADMIN) {
        return (
            <Layout className="dashboard">
                {authorized && (
                    <Sider
                        trigger={null}
                        collapsed={collapsed}
                        onCollapse={value => setCollapsed(value)}
                        collapsible
                        className="dashboard-sidebar"
                    >
                        <NavbarTabs
                            tabs={navbarTabs}
                            onLogOutClick={onLogOutClick}
                            decodedToken={decodedToken}
                        />
                    </Sider>
                )}
                <Layout>
                    <Content
                        className="dashboard-content"
                        style={{
                            padding: 40,
                            minHeight: 800,
                        }}
                    >
                        <Routes>
                            {authorized
                                ? authorizedPages.map(({ path, content, key }) =>
                                      isPermitted(key, decodedToken?.role) ? (
                                          <React.Fragment key={key}>
                                              <Route path={path} element={content} />
                                              <Route
                                                  path="*"
                                                  element={<Navigate to={RoutePath.DASHBOARD} />}
                                              />
                                          </React.Fragment>
                                      ) : (
                                          <Route element={<Navigate to={RoutePath.DASHBOARD} />} />
                                      ),
                                  )
                                : unauthorizedPages.map(({ path, content, key }) => (
                                      <React.Fragment key={key}>
                                          <Route path={path} element={content} />
                                          <Route path="*" element={<SignInContent />} />
                                      </React.Fragment>
                                  ))}
                        </Routes>
                    </Content>
                </Layout>
            </Layout>
        );
    }
    return (
        <>
            <Layout>
                {authorized && (
                    <AppHeader
                        decodedToken={decodedToken}
                        onLogOutClick={onLogOutClick}
                        clickable
                        mode="navbar-tabs"
                        onBurgerClick={onSidebarOpen}
                        userName={`${firstName} ${lastName}`}
                        tabs={tabs}
                    />
                )}
                {authorized && !md && isSidebarShown && (
                    <Sidebar
                        collapsed={!isSidebarShown}
                        onClose={onSidebarClose}
                        userName={`${firstName} ${lastName}`}
                        onLogOutClick={onLogOutClick}
                        tabs={tabs}
                    />
                )}
                <Routes>
                    {authorized
                        ? authorizedPages.map(({ path, content, key }) => {
                              return isPermitted(key, decodedToken?.role) ? (
                                  <React.Fragment key={key}>
                                      <Route path={path} element={content} />
                                      <Route path="*" element={<UserProfileContent />} />
                                  </React.Fragment>
                              ) : (
                                  <Route element={<Navigate to={RoutePath.COURSE} />} />
                              );
                          })
                        : unauthorizedPages.map(({ path, content, key }) => (
                              <React.Fragment key={key}>
                                  <Route path={path} element={content} />
                                  <Route path="*" element={<SignInContent />} />
                              </React.Fragment>
                          ))}
                </Routes>
            </Layout>
        </>
    );
};

export default App;
