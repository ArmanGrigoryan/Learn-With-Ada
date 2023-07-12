import React from 'react';
import { Row, Col, Typography, Grid, Button } from 'antd';
import CourseContentTable from '../../components/table-course-content';
import BaseLayer, { DefaultThemeShadow } from '../../core/base-layer';
import { RoutePath } from '../../routes/routes';
import { FolderAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './course-content.less';

const CourseContent: React.FC = () => {
    const screen = Grid.useBreakpoint();
    const navigate = useNavigate();
    return (
        <>
            <Row justify={'center'}>
                <Col className="courses-content">
                    <Typography.Title level={3} className="courses-content-header-text">
                        <Typography.Paragraph onClick={() => navigate(RoutePath.COURSE_CREATE)}>
                            <b>Courses</b>
                            <Button
                                type="default"
                                icon={<FolderAddOutlined />}
                                style={{ margin: '0 50px', padding: '0 25px' }}
                            >
                                Add
                            </Button>
                        </Typography.Paragraph>
                    </Typography.Title>
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
                            ? '60%'
                            : screen.sm
                            ? '60%'
                            : screen.xs
                            ? '60%'
                            : '100%'
                    }
                >
                    <BaseLayer shadow={DefaultThemeShadow.shadow3}>
                        <CourseContentTable />
                    </BaseLayer>
                </Col>
            </Row>
        </>
    );
};

export default CourseContent;
