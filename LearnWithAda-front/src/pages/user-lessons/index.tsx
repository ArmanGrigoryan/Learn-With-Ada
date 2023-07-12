import { Row, Col, Typography, Grid, Button } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import TableLessons from '../../components/table-lessons';
import BaseLayer, { DefaultThemeShadow } from '../../core/base-layer';
import { LessonGet } from '../../core/models/lesson';
import { lessonSelect } from '../../redux';
import { RoutePath } from '../../routes/routes';
import { FolderAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const UserLessons: React.FC = () => {
    const navigate = useNavigate();
    const screens = Grid.useBreakpoint();
    const userLessons = useSelector(lessonSelect).lessons as LessonGet[];
    return (
        <>
            <Row justify="start">
                <Col className="topics-content" offset={8} span={8}>
                    <Typography.Title
                        level={1}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            margin: '50px 0',
                        }}
                    >
                        <Typography.Paragraph onClick={() => navigate(RoutePath.LESSON_CREATE)}>
                            <b>Add Lesson</b>
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
                        screens.xl
                            ? '60%'
                            : screens.lg
                            ? '60%'
                            : screens.md
                            ? '80%'
                            : screens.sm
                            ? '80%'
                            : '100%'
                    }
                >
                    {userLessons.length > 0 ? (
                        <BaseLayer
                            shadow={DefaultThemeShadow.shadow3}
                            className="courses-content-tabs"
                        >
                            <TableLessons lessons={userLessons} />
                        </BaseLayer>
                    ) : (
                        <Row justify="center" style={{ marginTop: '30px' }}>
                            <Col>
                                <Typography.Title level={3}>
                                    You have no lessons yet!
                                </Typography.Title>
                            </Col>
                        </Row>
                    )}
                </Col>
            </Row>
        </>
    );
};

export default UserLessons;
