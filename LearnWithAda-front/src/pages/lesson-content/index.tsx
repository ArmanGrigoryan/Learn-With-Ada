import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Col, Grid, Row, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { lessonSelect, topicSelect } from '../../redux';
import { ArrowLeftOutlined } from '@ant-design/icons';
import BaseLayer from '../../core/base-layer';
import { useNavigate, useParams } from 'react-router-dom';
import { DefaultThemeShadow } from '../../core/base-layer';
import { getTopicLessons } from '../../utils/helpers';
import { RoutePath } from '../../routes/routes';
import LessonsCard from '../../components/lesson-card';

const LessonsContent = () => {
    const [topic, setTopic] = useState<string>('');
    const navigate = useNavigate();
    const { id } = useParams();
    const { lessons } = useSelector(lessonSelect);
    const { topics } = useSelector(topicSelect);
    const screen = Grid.useBreakpoint();
    const topicLessons = useMemo(() => {
        return id ? getTopicLessons(id, lessons) : [];
    }, [lessons, id]);
    const onAddLessonClick = useCallback(() => {
        navigate(RoutePath.LESSON_CREATE);
    }, [navigate]);
    useEffect(() => {
        const topic = topics.find(topic => topic.id === id);
        topic && setTopic(topic.name);
    }, [id, topics]);
    const onClickBack = useCallback(() => {
        navigate(RoutePath.ROOT);
    }, [navigate]);
    const layout = screen.xl
        ? '60%'
        : screen.lg
        ? '60%'
        : screen.md
        ? '60%'
        : screen.sm
        ? '60%'
        : screen.xs
        ? '60%'
        : '100%';
    return (
        <>
            <Row justify={'center'}>
                <Col className="courses-content">
                    <Typography.Title level={3} className="courses-content-header-text">
                        {topic}
                    </Typography.Title>
                </Col>
            </Row>
            <Row justify={'center'}>
                <Col flex={layout}>
                    <Row justify={'space-between'}>
                        <Col>
                            <Button
                                size={'large'}
                                icon={<ArrowLeftOutlined color={'green'} />}
                                onClick={onClickBack}
                            ></Button>
                        </Col>
                        <Col>
                            <Button type="primary" onClick={onAddLessonClick}>
                                Add Lesson
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row justify="center">
                {topicLessons?.length > 0 ? (
                    topicLessons.map(lesson => {
                        return (
                            <Col key={lesson.id} flex={layout} style={{ width: layout }}>
                                <BaseLayer
                                    className="topic-collapse"
                                    shadow={DefaultThemeShadow.shadow1}
                                >
                                    <LessonsCard lesson={lesson} />
                                </BaseLayer>
                            </Col>
                        );
                    })
                ) : (
                    <Col>
                        <Typography.Title level={5}>There is no lesson yet!</Typography.Title>
                    </Col>
                )}
            </Row>
        </>
    );
};

export default LessonsContent;
