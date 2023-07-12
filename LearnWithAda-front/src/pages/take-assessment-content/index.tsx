import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Radio, Row, Typography, Carousel, Checkbox, Grid } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { lessonSelect, userSelect } from '../../redux';
import BaseContent from '../../core/base-content';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { getLessonAnswerType } from '../../utils/helpers';
import { LessonGet } from '../../core/models/lesson';
import { AssessmentAnswerTypes, FormNames } from '../../utils/constants';
import BaseLayer, { DefaultThemeShadow } from '../../core/base-layer';
import { CarouselRef } from 'antd/lib/carousel';
import './take-assessment-content.less';
import { useForm } from 'antd/lib/form/Form';
import { createAssessmentResult } from '../../redux/actions/assessmentResult.actions';
import { RoutePath } from '../../routes/routes';

const TakeAssessmentContent: React.FC = () => {
    const [form] = useForm();
    const { id } = useParams();
    const dispatch = useDispatch();
    const screens = Grid.useBreakpoint();
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const [assessmentResult, setAssessmentResult] = useState<any>({});
    const [lesson, setLesson] = useState<LessonGet>();
    const [current, setCurrent] = useState<number>(0);
    const { id: userId } = useSelector(userSelect);
    const { lessons } = useSelector(lessonSelect);
    const onChange = useCallback(key => {
        setCurrent(key);
    }, []);
    const slider = useRef<CarouselRef>(null);
    const navigate = useNavigate();
    useEffect(() => {
        if (id) {
            const lesson = lessons.find(({ id }) => id === id);
            if (lesson?.assessment?.[0]?.assessmentQuestion) {
                setLesson(lesson);
            }
        }
    }, [id, lessons]);
    const onArrowClick = useCallback(
        (type: string) => {
            if (type === 'next') {
                const values = form.getFieldsValue();
                setAssessmentResult({ ...assessmentResult, ...values });
                return slider.current?.next();
            } else if (type === 'previous') {
                return slider.current?.prev();
            }
            return;
        },
        [assessmentResult, form],
    );
    const navigateHome = useCallback(() => {
        navigate(RoutePath.USER_TOPICS);
    }, [navigate]);
    const onSubmit = useCallback(async () => {
        if (assessmentResult) {
            const results = {
                userId,
                lessonId: Number(id),
                answerChoices: assessmentResult,
            };
            const values = { ...results, navigateHome };
            dispatch(createAssessmentResult(values));
        }
    }, [assessmentResult, dispatch, id, userId, navigateHome]);

    const onOptionChange = useCallback(async () => {
        const values = form.getFieldsValue();
        const news = { ...assessmentResult, ...values };
        setAssessmentResult(news);
    }, [assessmentResult, form]);
    return (
        <>
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
                    {lesson?.assessment?.[0]?.assessmentQuestion ? (
                        <BaseLayer className="topic-collapse" shadow={DefaultThemeShadow.shadow1}>
                            <Row gutter={[0, 60]}>
                                <BaseContent
                                    headContent={
                                        <Col>
                                            <Row>
                                                <Typography.Title level={2}>
                                                    Test your{' '}
                                                    {lesson?.assessment?.[0]?.assessmentQuestion}
                                                </Typography.Title>
                                            </Row>
                                        </Col>
                                    }
                                >
                                    <Carousel
                                        ref={slider}
                                        dots={false}
                                        afterChange={onChange}
                                        className="lesson-content-carousel"
                                        style={{ width: '480px' }}
                                    >
                                        {lesson?.assessment?.[0]?.assessmentQuestion && (
                                            <div key={lesson?.assessment?.[0]?.assessmentQuestion}>
                                                <Col>
                                                    <Typography.Title level={5}>
                                                        {
                                                            lesson?.assessment?.[0]
                                                                ?.assessmentQuestion
                                                        }
                                                    </Typography.Title>
                                                </Col>
                                                <Col>
                                                    <Typography.Title level={2}>
                                                        {
                                                            lesson?.assessment?.[0]
                                                                ?.assessmentQuestion
                                                        }
                                                    </Typography.Title>
                                                </Col>
                                            </div>
                                        )}
                                    </Carousel>
                                    <Col style={{ marginTop: 40, marginLeft: 920 }}>
                                        <Form
                                            name={FormNames.TAKE_ASSESSMENT}
                                            form={form}
                                            onChange={onOptionChange}
                                        >
                                            <React.Fragment
                                                key={lesson?.assessment?.[0]?.assessmentQuestion}
                                            >
                                                {getLessonAnswerType(lesson)
                                                    ?.assessmentAnswerType !==
                                                    AssessmentAnswerTypes.MULTI_CHOICE && (
                                                    <Form.Item
                                                        name={
                                                            lesson?.assessment?.[0]
                                                                ?.assessmentQuestion
                                                        }
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Answer is required.',
                                                            },
                                                        ]}
                                                    >
                                                        <Radio.Group>
                                                            {lesson?.assessment?.[0]?.answerChoices
                                                                ?.length > 0 &&
                                                                lesson?.assessment?.[0]?.answerChoices?.map(
                                                                    ({ answerChoice }, i) => (
                                                                        <Radio
                                                                            value={answerChoice}
                                                                            key={i}
                                                                        >
                                                                            {answerChoice}
                                                                        </Radio>
                                                                    ),
                                                                )}
                                                        </Radio.Group>
                                                    </Form.Item>
                                                )}
                                                {getLessonAnswerType(lesson)
                                                    ?.assessmentAnswerType ===
                                                    AssessmentAnswerTypes.MULTI_CHOICE && (
                                                    <Form.Item
                                                        name={lesson?.id}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message:
                                                                    'Assessment answer is required.',
                                                            },
                                                        ]}
                                                    >
                                                        <Checkbox.Group>
                                                            <Row justify={'center'}>
                                                                <Col span={18}>
                                                                    {lesson?.assessment?.[0]
                                                                        ?.answerChoices.length >
                                                                        0 &&
                                                                        lesson?.assessment?.[0]?.answerChoices?.map(
                                                                            (
                                                                                { answerChoice },
                                                                                i,
                                                                            ) => {
                                                                                return (
                                                                                    <Checkbox
                                                                                        value={
                                                                                            answerChoice
                                                                                        }
                                                                                        key={i}
                                                                                    >
                                                                                        {
                                                                                            answerChoice
                                                                                        }
                                                                                    </Checkbox>
                                                                                );
                                                                            },
                                                                        )}
                                                                </Col>
                                                            </Row>
                                                        </Checkbox.Group>
                                                    </Form.Item>
                                                )}
                                            </React.Fragment>
                                        </Form>
                                    </Col>
                                    <Row justify="end" align={'middle'}>
                                        <>Previous</>
                                        <Button
                                            onClick={() => onArrowClick('previous')}
                                            size="large"
                                            type="link"
                                            disabled={current === 0}
                                            className="topic-collapse-content-item-card-actions"
                                        >
                                            <LeftOutlined />
                                        </Button>
                                        <Button
                                            onClick={() => onArrowClick('next')}
                                            size="large"
                                            type="link"
                                            disabled={current === lesson?.instruction?.length}
                                            className="topic-collapse-content-item-card-actions"
                                        >
                                            <RightOutlined />
                                        </Button>
                                        <>Next</>
                                    </Row>
                                    <Row justify={'end'}>
                                        <Button
                                            type="primary"
                                            size="large"
                                            htmlType="submit"
                                            disabled={
                                                !Object.values(assessmentResult).find(
                                                    res => typeof res !== 'undefined',
                                                )
                                            }
                                            form={FormNames.TAKE_ASSESSMENT}
                                            onClick={onSubmit}
                                        >
                                            Finish
                                        </Button>
                                    </Row>
                                </BaseContent>
                            </Row>
                        </BaseLayer>
                    ) : (
                        <Row justify="center">
                            <Col span={6}>
                                <Typography.Title level={5}>
                                    Lesson has no questions yet!
                                </Typography.Title>
                            </Col>
                        </Row>
                    )}
                </Col>
            </Row>
        </>
    );
};

export default TakeAssessmentContent;
