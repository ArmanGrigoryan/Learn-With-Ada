import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Row, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteLesson, lessonSelect, topicSelect } from '../../redux';
import { EditOutlined, DeleteOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { RoutePath } from '../../routes/routes';
import Media from '../../components/media';

const SingleLessonContent = () => {
    const { topicId, lessonId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading: deleteLessonLoading } = useSelector(lessonSelect);
    const [skipPage, setSkipPage] = useState(false);
    const topic = useSelector(topicSelect).topics.find(item => item.id == topicId);
    const lesson = useSelector(lessonSelect).lessons.find(item => item.id == lessonId);
    const onTakeAssessment = useCallback(
        id => {
            navigate(`/lesson-assessment/${id}`);
        },
        [navigate],
    );
    const onEditLesson = useCallback(
        id => {
            navigate(`/lesson-edit/${id}`);
        },
        [navigate],
    );
    const onDeleteLesson = useCallback(
        id => {
            setSkipPage(true);
            dispatch(deleteLesson(id));
        },
        [dispatch],
    );
    const goBack = useCallback(() => navigate(RoutePath.ROOT), [navigate]);
    useEffect(() => {
        !deleteLessonLoading && skipPage && goBack();
    }, [deleteLessonLoading, skipPage, goBack]);
    return (
        <Row>
            <Col span={14} offset={3} style={{ marginTop: '40px' }}>
                <Col
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Typography.Title level={1}>Single lesson content</Typography.Title>
                    <Button
                        size="large"
                        ghost
                        type="primary"
                        icon={<LeftOutlined />}
                        onClick={goBack}
                    >
                        Back to topics
                    </Button>
                </Col>
                <Typography.Title level={4} style={{ marginTop: '40px' }}>
                    Topic name: {topic?.name}
                </Typography.Title>
                <Typography.Title level={4}>Topic description: Unset</Typography.Title>
                <Typography.Title level={2} style={{ margin: '40px 0' }}>
                    Lesson instructions:
                </Typography.Title>
                {lesson?.instruction.instructionFile && (
                    <>
                        <Media
                            type={
                                lesson?.instruction.instructionFile.split('.').pop() === 'mp3'
                                    ? 'audio'
                                    : 'video'
                            }
                            width="400"
                        >
                            <source src={lesson?.instruction.instructionFile} />
                        </Media>
                        <br />
                        <br />
                    </>
                )}
                {lesson?.assessment?.map(item => (
                    <Typography.Text key={item.id}>
                        {item.assessmentQuestion}
                        <br />
                    </Typography.Text>
                ))}
                <>
                    <Button
                        type="primary"
                        size="large"
                        ghost
                        icon={<EditOutlined />}
                        style={{ margin: '30px 0', padding: '0 30px' }}
                        onClick={() => onEditLesson(lessonId)}
                    >
                        Edit
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        ghost
                        loading={deleteLessonLoading}
                        icon={<DeleteOutlined />}
                        style={{ margin: '30px', padding: '0 30px' }}
                        onClick={() => onDeleteLesson(lessonId)}
                    >
                        Delete
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        ghost
                        onClick={() => onTakeAssessment(lessonId)}
                        icon={<RightOutlined />}
                        className="topic-collapse-content-header-actions-buttons"
                    >
                        Take Assessment
                    </Button>
                </>
            </Col>
        </Row>
    );
};

export default SingleLessonContent;
