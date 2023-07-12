import { Row, Col, Typography, Grid, PageHeader, Button, Descriptions } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BaseLayer, { DefaultThemeShadow } from '../../core/base-layer';
import {
    addRevalidate,
    getNotifications,
    editNotification,
    courseSelect,
    notificationSelect,
} from '../../redux';
import { NotificationData } from '../../core/models/notification';

const NotificationContent: React.FC = () => {
    const [skip, setSkip] = useState(1);
    const { Title } = Typography;
    const screen = Grid.useBreakpoint();
    const dispatch = useDispatch();
    const { newNotifications, count } = useSelector(notificationSelect);
    const [notes, setNotes] = useState<NotificationData[]>([]);
    const { courses } = useSelector(courseSelect);
    const showMore = () => {
        const ids = newNotifications.map(note => note.id);
        ids && dispatch(editNotification(ids));
        ids && dispatch(getNotifications({ skip, isNew: 'true' }));
        setSkip(skip + 1);
    };
    useEffect(() => {
        dispatch(addRevalidate(true));
        return () => {
            const ids = newNotifications.map(note => note.id);
            ids && dispatch(editNotification(ids));
        };
    }, [dispatch, newNotifications]);
    useEffect(() => {
        setNotes(newNotifications);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        setNotes(prev => [...prev, ...newNotifications]);
    }, [newNotifications]);
    return (
        <>
            <Row justify={'center'}>
                <Col className="courses-content">
                    <Typography.Title level={3} className="courses-content-header-text">
                        <b>Notifications</b>
                    </Typography.Title>
                </Col>
            </Row>
            <Row justify="center">
                <Col
                    flex={
                        screen.xl
                            ? '50%'
                            : screen.lg
                            ? '50%'
                            : screen.md
                            ? '50%'
                            : screen.sm
                            ? '50%'
                            : screen.xs
                            ? '50%'
                            : '80%'
                    }
                >
                    <BaseLayer shadow={DefaultThemeShadow.shadow3} style={{ textAlign: 'right' }}>
                        <>
                            {notes?.length > 0 &&
                                notes.map(({ courseId, date, id }, idx) => {
                                    const courseName = courses.find(
                                        ({ id }) => courseId === id,
                                    )?.name;
                                    return (
                                        <div key={id}>
                                            <PageHeader
                                                className="site-page-header"
                                                title={`Course name:  ${courseName}`}
                                                extra={[<Title level={4}>{date as string}</Title>]}
                                            >
                                                N. {idx + 1}
                                                <Descriptions size="small" column={3}>
                                                    <Descriptions.Item label="">
                                                        Please, complete your course!
                                                    </Descriptions.Item>
                                                </Descriptions>
                                                <hr />
                                            </PageHeader>
                                        </div>
                                    );
                                })}
                        </>
                        <Button
                            style={{ margin: '10px 20px' }}
                            type="primary"
                            ghost
                            disabled={notes?.length === count}
                            onClick={showMore}
                            size="large"
                        >
                            Show more
                        </Button>
                    </BaseLayer>
                </Col>
            </Row>
        </>
    );
};

export default NotificationContent;
