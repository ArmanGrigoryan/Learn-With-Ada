import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, Col, Collapse, Row, Skeleton, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { deleteLesson, deleteTopic, lessonSelect } from '../../redux';
import { TopicData } from '../../core/models/topic';
import { EditFilled, DeleteFilled, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Meta from 'antd/lib/card/Meta';
import { getTopicName } from '../../utils/helpers';
import ModalConfirm from '../modal-confirm';
import { useJwt } from 'react-jwt';
import { AuthDataKeys, RoleTypes } from '../../utils/constants';
import { DecodedToken } from '../../core/models/user';
import { TopicsPropsTopics as TopicsProps } from '../../utils/interfaces';

const Topics: React.FC<TopicsProps> = ({ topics = [], editable = false }) => {
    const navigate = useNavigate();
    const decodedToken = useJwt(localStorage.getItem(AuthDataKeys.ACCESS_TOKEN) || '')
        .decodedToken as DecodedToken;
    const [visible, setVisible] = useState(false);
    const [topicToDelete, setTopicToDelete] = useState('');
    const [lessonToDelete, setLessonToDelete] = useState('');
    const { loading: deleteLessonLoading } = useSelector(lessonSelect);
    const dispatch = useDispatch();
    const onEditTopicClick = useCallback(
        id => {
            navigate(`/topic-edit/${id}`);
        },
        [navigate],
    );
    useEffect(() => {
        !deleteLessonLoading && setVisible(deleteLessonLoading);
    }, [deleteLessonLoading]);
    const onTakeAssessment = useCallback(
        id => {
            navigate(`/lesson-assessment/${id}`);
        },
        [navigate],
    );
    const onDetailsClick = useCallback(
        (topicId, lessonId) => {
            navigate(`/topic/${topicId}/lesson/${lessonId}`);
        },
        [navigate],
    );
    const onEditLessonClick = useCallback(
        id => {
            navigate(`/lesson-edit/${id}`);
        },
        [navigate],
    );
    const onTopicDeleteClick = useCallback(id => {
        setLessonToDelete('');
        setTopicToDelete(id);
        setVisible(true);
    }, []);
    const onDeleteLessonClick = useCallback(id => {
        setTopicToDelete('');
        setLessonToDelete(id);
        setVisible(true);
    }, []);
    const onDeleteTopic = useCallback(() => {
        dispatch(deleteTopic(topicToDelete));
        setVisible(false);
    }, [topicToDelete, dispatch]);
    const onDeleteLesson = useCallback(() => {
        dispatch(deleteLesson(lessonToDelete));
    }, [lessonToDelete, dispatch]);
    return (
        <>
            {topics?.length > 0 ? (
                <Collapse ghost expandIconPosition={'left'} className="topic-collapse-content">
                    {topics?.length > 0 &&
                        topics?.map(({ name, id, lessons }: TopicData) => {
                            return (
                                <Collapse.Panel
                                    header={
                                        <Row className="topic-collapse-content-header">
                                            <Typography.Title level={4}>{name}</Typography.Title>
                                            <div className="topic-collapse-content-header-actions">
                                                <div className="topic-collapse-content-header-actions-buttons">
                                                    <Button
                                                        style={{ borderRadius: '8px' }}
                                                        type="primary"
                                                        onClick={() => onEditTopicClick(id)}
                                                        className="topic-collapse-content-header-actions-buttons"
                                                    >
                                                        <EditFilled className="topic-collapse-content-header-actions-button-item" />
                                                    </Button>
                                                    <Button
                                                        style={{ borderRadius: '8px' }}
                                                        onClick={() => onTopicDeleteClick(id)}
                                                        type="primary"
                                                        className="topic-collapse-content-header-actions-buttons"
                                                    >
                                                        <DeleteFilled className="topic-collapse-content-header-actions-button-item" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Row>
                                    }
                                    className="topic-collapse-content-item"
                                    key={id}
                                >
                                    <Row>
                                        {lessons.length > 0 &&
                                            id &&
                                            lessons?.map(
                                                ({
                                                    id: lessonId,
                                                    instruction,
                                                    createdByUserId: lessonCreator,
                                                }) => {
                                                    return (
                                                        <Card
                                                            key={lessonId}
                                                            hoverable
                                                            style={{
                                                                width: 240,
                                                                margin: 16,
                                                            }}
                                                            actions={[
                                                                <Row
                                                                    justify={
                                                                        lessonCreator !== id &&
                                                                        decodedToken?.role !==
                                                                            RoleTypes.ADMIN
                                                                            ? 'center'
                                                                            : 'space-around'
                                                                    }
                                                                    color="green"
                                                                >
                                                                    {(lessonCreator === id ||
                                                                        decodedToken?.role ===
                                                                            RoleTypes.ADMIN) && (
                                                                        <>
                                                                            <EditFilled
                                                                                onClick={() =>
                                                                                    onEditLessonClick(
                                                                                        lessonId,
                                                                                    )
                                                                                }
                                                                                key="edit"
                                                                                className="topic-collapse-content-item-card-actions"
                                                                            />
                                                                            <DeleteFilled
                                                                                onClick={() =>
                                                                                    onDeleteLessonClick(
                                                                                        lessonId,
                                                                                    )
                                                                                }
                                                                                key="delete"
                                                                                className="topic-collapse-content-item-card-actions"
                                                                            />
                                                                        </>
                                                                    )}
                                                                    {!editable && (
                                                                        <Button
                                                                            type="primary"
                                                                            ghost
                                                                            key="ellipsis"
                                                                            onClick={() =>
                                                                                onDetailsClick(
                                                                                    id,
                                                                                    lessonId,
                                                                                )
                                                                            }
                                                                        >
                                                                            View
                                                                        </Button>
                                                                    )}
                                                                    {editable && (
                                                                        <Button
                                                                            style={{
                                                                                borderRadius: '8px',
                                                                            }}
                                                                            type="primary"
                                                                            onClick={() =>
                                                                                onTakeAssessment(
                                                                                    lessonId,
                                                                                )
                                                                            }
                                                                            className="topic-collapse-content-header-actions-buttons"
                                                                        >
                                                                            Take Assessment
                                                                        </Button>
                                                                    )}
                                                                </Row>,
                                                            ]}
                                                        >
                                                            <Skeleton loading={false} active>
                                                                <Meta
                                                                    title={
                                                                        <Row justify="center">
                                                                            <Col>
                                                                                {typeof instruction?.instruction ===
                                                                                'string'
                                                                                    ? instruction?.instruction
                                                                                    : instruction?.instruction}
                                                                                <Button
                                                                                    type="default"
                                                                                    icon={
                                                                                        decodedToken?.role !==
                                                                                            RoleTypes.ADMIN && (
                                                                                            <RightOutlined />
                                                                                        )
                                                                                    }
                                                                                    style={{
                                                                                        marginLeft:
                                                                                            '15px',
                                                                                    }}
                                                                                    onClick={() =>
                                                                                        onDetailsClick(
                                                                                            id,
                                                                                            lessonId,
                                                                                        )
                                                                                    }
                                                                                ></Button>
                                                                            </Col>
                                                                        </Row>
                                                                    }
                                                                />
                                                            </Skeleton>
                                                        </Card>
                                                    );
                                                },
                                            )}
                                    </Row>
                                </Collapse.Panel>
                            );
                        })}
                </Collapse>
            ) : (
                <>No topics yet!</>
            )}
            <ModalConfirm
                name={topicToDelete && getTopicName(topicToDelete, topics)}
                visible={visible}
                onCancel={setVisible}
                type={(topicToDelete && 'topic') || (lessonToDelete && 'lesson')}
                submitHandler={topicToDelete ? onDeleteTopic : onDeleteLesson}
            />
        </>
    );
};

export default Topics;
