import React, { useCallback } from 'react';
import CourseTable from '../../components/table-courses';
import { Button, Col, Grid, Row, Tabs, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import BaseLayer, { DefaultThemeShadow } from '../../core/base-layer';
import './single-course-content.less';
import { courseSelect } from '../../redux';
import { useSelector } from 'react-redux';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { RoutePath } from '../../routes/routes';

const { TabPane } = Tabs;
const SingleCourseContent = () => {
    const { id } = useParams();
    const course = useSelector(courseSelect).courses.find(item => item.id == id);
    const navigate = useNavigate();
    const screen = Grid.useBreakpoint();
    const onClickBack = useCallback(() => {
        navigate(RoutePath.COURSE);
    }, [navigate]);
    const layout = screen.xl
        ? '60%'
        : screen.lg
        ? '60%'
        : screen.md
        ? '80%'
        : screen.sm
        ? '80%'
        : '100%';
    return (
        <>
            <Row justify={'center'}>
                <Col className="courses-content">
                    <Typography.Title level={3} className="courses-content-header-text">
                        <b>{course?.name}</b>
                    </Typography.Title>
                </Col>
            </Row>
            <Row justify={'center'}>
                <Col flex={layout}>
                    <Row align="top">
                        <Col>
                            <Button
                                size={'large'}
                                icon={<ArrowLeftOutlined color={'green'} />}
                                onClick={onClickBack}
                            ></Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row justify="center">
                <Col flex={layout}>
                    <BaseLayer shadow={DefaultThemeShadow.shadow3} className="courses-content-tabs">
                        <Tabs tabPosition={'top'}>
                            <TabPane tab="Add user" key="user">
                                <CourseTable courseId={id as string} />
                            </TabPane>
                            <TabPane tab="Add topic" key="topic">
                                <CourseTable courseId={id as string} isTopic />
                            </TabPane>
                        </Tabs>
                    </BaseLayer>
                </Col>
            </Row>
        </>
    );
};
export default SingleCourseContent;
