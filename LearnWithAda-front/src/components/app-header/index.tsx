import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './app-header.less';
import { flushSync } from 'react-dom';
import { Button, Col, Dropdown, Grid, Row, Layout, Badge, List, Typography } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { noop } from '../../utils/helpers';
import classnames from 'classnames';
import NavbarTabs from '../menu-tabs';
import Profile from '../profile';
import { BellOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
    editNotification,
    AppDispatch,
    getNewNotifications,
    courseSelect,
    notificationSelect,
} from '../../redux';
import { NotificationData } from '../../core/models/notification';
import { RoutePath } from '../../routes/routes';
import { useNavigate } from 'react-router-dom';
import { DecodedToken } from '../../core/models/user';
import { AppHeaderProps } from '../../utils/interfaces';

const { Header } = Layout;
const AppHeader: React.FC<AppHeaderProps> = props => {
    const {
        onBurgerClick = noop,
        onLogOutClick = noop,
        mode = 'only-logo',
        userName = '',
        tabs = [],
        activeUnderlined = false,
        clickable = true,
        decodedToken = {} as DecodedToken,
    } = props;
    const navigate = useNavigate();
    const [skip, setSkip] = useState(1);
    const { newNotifications, newNotificationsCount } = useSelector(notificationSelect);
    const [count, setCount] = useState<number>(0);
    const { courses } = useSelector(courseSelect);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [notificationVisible, setNotificationVisible] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);
    const dropdownNotificationRef = useRef<HTMLDivElement>(null);
    const dropdownButtonRef = useRef<HTMLDivElement>(null);
    const screens = Grid.useBreakpoint();
    const dispatch = useDispatch<AppDispatch>();
    const getNotification = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(getNewNotifications({ skip }));
        setSkip(skip + 1);
    };
    const navbarTabs = useMemo(
        () =>
            tabs.reduce(
                (acc, { onClick = noop, tabKey, tabLabel, routePath }) =>
                    Object.assign(acc, {
                        [tabKey]: { text: tabLabel, onClick, routePath },
                    }),
                {},
            ),
        [tabs],
    );
    const onAllNotificationsClick = useCallback(() => {
        flushSync(() => {
            setNotificationVisible(false);
            setCount(0);
        });
        navigate(RoutePath.USER_NOTIFICATIONS);
    }, [navigate]);
    const handleClick = useCallback(
        (evt: Event) => {
            if (overlayRef?.current?.contains(evt.target as HTMLButtonElement)) {
                onLogOutClick();
            }
            if (
                (evt.target as HTMLButtonElement).closest('.ant-badge') ||
                (evt.target as HTMLButtonElement).closest(
                    '.app-header-dropdown-notification-overlay',
                )
            ) {
                setNotificationVisible(true);
            } else {
                setNotificationVisible(false);
                if (newNotifications?.length && notificationVisible) {
                    const ids = newNotifications.map(note => note.id);
                    ids && dispatch(editNotification(ids));
                }
            }
        },
        [newNotifications, notificationVisible, dispatch, onLogOutClick],
    );
    useEffect(() => {
        setCount(newNotificationsCount);
    }, [newNotificationsCount]);
    useEffect(() => {
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [handleClick]);
    const handleEvent = useCallback((evt: React.MouseEvent) => evt.stopPropagation(), []);
    const onClick: React.MouseEventHandler<HTMLDivElement> = useCallback(() => {
        if (!clickable) {
            return;
        }
        setOverlayVisible(!overlayVisible);
    }, [clickable, overlayVisible]);
    const classes = classnames({
        'app-header': true,
        [`app-header-${mode}`]: true,
    });
    const screenOptions = {
        span: !screens.xl ? 12 : !screens.lg ? 1 : !screens.md ? 12 : !screens.sm ? 1 : 14,
        offset: !screens.xl ? 10 : !screens.lg ? 20 : !screens.md ? 5 : !screens.sm ? 10 : 0,
    };
    return (
        <Header className={classes}>
            <Row justify={'end'} style={{ height: '100%' }}>
                {!screens.xs ? (
                    <Col
                        {...screenOptions}
                        style={{ marginLeft: '5%' }}
                        className="app-header-navbar"
                    >
                        <NavbarTabs
                            decodedToken={decodedToken}
                            tabs={navbarTabs}
                            activeUnderlined={activeUnderlined}
                            mode={'horizontal'}
                        />
                    </Col>
                ) : (
                    <Col span={15} offset={3} className="app-header-burger">
                        <MenuOutlined onClick={onBurgerClick} />
                    </Col>
                )}
                <Col
                    className="parent"
                    style={screens.xl ? { marginLeft: '0' } : { marginLeft: 0 }}
                    span={1}
                >
                    <Dropdown
                        trigger={['click']}
                        placement="bottomRight"
                        visible={notificationVisible}
                        overlay={
                            <div
                                ref={dropdownNotificationRef}
                                className="app-header-dropdown-notification-overlay"
                            >
                                <List
                                    header={
                                        <>
                                            <span onClick={handleEvent}>Notifications</span>{' '}
                                        </>
                                    }
                                    footer={
                                        <>
                                            <Button
                                                onClick={getNotification}
                                                type="link"
                                                disabled={
                                                    !newNotificationsCount ||
                                                    newNotificationsCount ===
                                                        newNotifications?.length
                                                }
                                            >
                                                See more
                                            </Button>
                                            <Button onClick={onAllNotificationsClick} type="link">
                                                See all
                                            </Button>
                                        </>
                                    }
                                    bordered
                                    dataSource={newNotifications?.length ? newNotifications : []}
                                    renderItem={
                                        newNotifications?.length
                                            ? (item: NotificationData) =>
                                                  item ? (
                                                      <List.Item
                                                          key={item?.id}
                                                          onClick={handleEvent}
                                                      >
                                                          <Typography.Text>
                                                              <b>
                                                                  {
                                                                      courses?.find(
                                                                          ({ id }) =>
                                                                              id === item?.courseId,
                                                                      )?.name
                                                                  }
                                                              </b>
                                                          </Typography.Text>
                                                          <br /> Please, complete your course!
                                                      </List.Item>
                                                  ) : (
                                                      <>There is no notification</>
                                                  )
                                            : undefined
                                    }
                                />
                            </div>
                        }
                    >
                        <Badge count={count ? count : ''} size="default">
                            <BellOutlined ref={notificationRef} style={{ fontSize: '20px' }} />
                        </Badge>
                    </Dropdown>
                </Col>
                <Col span={2} style={{ display: 'flex', marginRight: '22px', maxWidth: '20%' }}>
                    <Dropdown
                        className={'navbar-profile'}
                        placement="bottomRight"
                        overlay={
                            <div>
                                <Button ref={overlayRef}>Log Out</Button>
                            </div>
                        }
                    >
                        <div className={classes} onClick={onClick} ref={dropdownButtonRef}>
                            <Profile userName={userName} clickable />
                        </div>
                    </Dropdown>
                </Col>
            </Row>
        </Header>
    );
};

export default AppHeader;
