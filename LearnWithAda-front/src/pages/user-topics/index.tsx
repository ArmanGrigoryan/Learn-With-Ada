import { Grid, Row, Col, Typography } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import Topics from '../../components/topics';
import BaseLayer, { DefaultThemeShadow } from '../../core/base-layer';
import { topicSelect, userSelect } from '../../redux';

const UserTopics: React.FC = () => {
    const { topics } = useSelector(topicSelect);
    const screen = Grid.useBreakpoint();
    const { id } = useSelector(userSelect);
    return (
        <>
            <Row justify={'center'}>
                <Col className="topics-content">
                    <Typography.Title level={3} className="topics-content-header-text">
                        <b>Your topics</b>
                    </Typography.Title>
                </Col>
            </Row>
            <Row justify={'center'}></Row>
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
                        <Row justify={'center'} gutter={[20, 40]}>
                            <Topics topics={topics} topicId={id} editable />
                        </Row>
                    </BaseLayer>
                </Col>
            </Row>
        </>
    );
};

export default UserTopics;
