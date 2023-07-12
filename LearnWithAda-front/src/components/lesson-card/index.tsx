import React, { useCallback } from 'react';
import { Card, Grid, Row, Skeleton, Typography } from 'antd';
import { EditFilled, DeleteFilled } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import Meta from 'antd/lib/card/Meta';
import { useDispatch } from 'react-redux';
import { deleteLesson } from '../../redux';
import { LessonsCardProps } from '../../utils/interfaces';

const LessonsCard: React.FC<LessonsCardProps> = ({ lesson }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const { instruction, id: _id } = lesson;
    const onEditClick = useCallback(
        id => {
            navigate(`/lesson-edit/${id}`);
        },
        [navigate],
    );
    const onLessonClick = useCallback(
        lessonId => {
            navigate(`/topic/${id}/lesson/${lessonId}`);
        },
        [id, navigate],
    );
    const onDeleteLesson = useCallback(
        (id: string) => {
            dispatch(deleteLesson(id));
        },
        [dispatch],
    );
    const screens = Grid.useBreakpoint();
    return (
        <>
            <Card
                actions={[
                    <Row justify="space-around" color="green">
                        <EditFilled
                            onClick={() => onEditClick(_id)}
                            key="edit"
                            className="topic-collapse-content-item-card-actions"
                        />
                        {_id && (
                            <DeleteFilled
                                key="delete"
                                onClick={() => onDeleteLesson(_id)}
                                className="topic-collapse-content-item-card-actions"
                            />
                        )}
                    </Row>,
                ]}
            >
                <Skeleton loading={false} active>
                    <Meta
                        title={
                            <Typography.Title
                                style={{ cursor: 'pointer', textAlign: 'center' }}
                                level={screens.xl ? 3 : screens.xs ? 4 : 4}
                                onClick={() => onLessonClick(_id)}
                            >
                                {instruction[0]?.instruction}
                            </Typography.Title>
                        }
                    />
                </Skeleton>
            </Card>
        </>
    );
};

export default LessonsCard;
