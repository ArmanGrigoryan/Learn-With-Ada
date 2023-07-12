import React, { useCallback } from 'react';
import { Button, Col, Grid, Row, Tabs, Typography } from 'antd';
import { useSelector } from 'react-redux';
import {  topicSelect } from '../../redux';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from '../../routes/routes';
import Topics from '../../components/topics';
import BaseLayer, { DefaultThemeShadow } from '../../core/base-layer';
import { DecodedToken } from '../../core/models/user';
import { AuthDataKeys, RoleTypes } from '../../utils/constants';
import { useJwt } from 'react-jwt';
import './home-content.less';

const { TabPane } = Tabs;
const HomeContent: React.FC = () => {
    const decodedToken = useJwt(localStorage.getItem(AuthDataKeys.ACCESS_TOKEN) || '')
        .decodedToken as DecodedToken;
    const navigate = useNavigate();
    const screen = Grid.useBreakpoint();
    const { topics } = useSelector(topicSelect);
    const id = localStorage.getItem(AuthDataKeys.USER_ID) as string;
    const userOwnTopics = topics?.filter(topic => topic.createdByUserId == id);
    const onAddTopic = useCallback(() => {
        navigate(RoutePath.TOPIC_CREATE);
    }, [navigate]);
    return (
        <>
            <Row justify={'center'}>
                <Col className="topics-content">
                    <Typography.Title level={3} className="topics-content-header-text">
                        <b>Topics</b>
                    </Typography.Title>
                </Col>
            </Row>
            <Row justify={'center'}>
                <Col
                    flex={
                        screen.xl
                            ? '60%'
                            : screen.lg
                            ? '60%'
                            : screen.md
                            ? '80%'
                            : screen.sm
                            ? '80%'
                            : '100%'
                    }
                >
                    <Button
                        type="primary"
                        onClick={onAddTopic}
                        className="topics-content-add-topic-button"
                    >
                        Add Topic
                    </Button>
                </Col>
            </Row>
            <Row justify="center">
                <Col
                    flex={
                        screen.xl
                            ? '60%'
                            : screen.lg
                            ? '60%'
                            : screen.md
                            ? '80%'
                            : screen.sm
                            ? '80%'
                            : '100%'
                    }
                >
                    <BaseLayer shadow={DefaultThemeShadow.shadow3} className="courses-content-tabs">
                        <Tabs tabPosition={'top'} style={{ padding: '14px' }}>
                            {decodedToken?.role === RoleTypes.ADMIN && (
                                <TabPane tab="All topics" key="1">
                                    <Row justify={'center'} gutter={[20, 40]}>
                                        <Topics topics={topics} topicId={id} />
                                    </Row>
                                </TabPane>
                            )}
                            <TabPane tab="My topics" key="2">
                                <Row justify={'center'} gutter={[20, 40]}>
                                    <Topics topics={userOwnTopics} />
                                </Row>
                            </TabPane>
                        </Tabs>
                    </BaseLayer>
                </Col>
            </Row>
        </>
    );
};

export default HomeContent;
