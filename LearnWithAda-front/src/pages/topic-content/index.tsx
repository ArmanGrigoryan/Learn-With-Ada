import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Radio, Typography, Button, Form, Input, Select, Row, Col } from 'antd';
import { AssessmentAnswerTypes, FormNames } from '../../utils/constants';
import { useNavigate, useParams } from 'react-router-dom';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { getTopicLessons } from '../../utils/helpers';
import {
    addTopic,
    clearErrorText,
    courseSelect,
    editTopic,
    lessonSelect,
    topicSelect,
} from '../../redux';
import { useDispatch, useSelector } from 'react-redux';
import { TopicDataKeys } from '../../core/models/topic';
import { useForm } from 'antd/lib/form/Form';
import { RoutePath } from '../../routes/routes';
import {
    AnswerChoice,
    AnswerChoiceDataKeys,
    LessonDataKeys,
    LessonGet,
} from '../../core/models/lesson';
import './topic-content.less';

const TopicContent = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [form] = useForm();
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const { topics, error } = useSelector(topicSelect);
    const { courses } = useSelector(courseSelect);
    const { lessons } = useSelector(lessonSelect);
    const navigate = useNavigate();
    const topicLessons = useMemo(() => {
        return id ? getTopicLessons(id, lessons) : [];
    }, [id, lessons]);
    useEffect(() => {
        return () => {
            dispatch(clearErrorText());
            setSelectedCourse(courses[0]?.id as string);
        };
    }, [courses, dispatch]);
    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
    };
    const navigateHome = useCallback(() => {
        navigate(RoutePath.ROOT);
    }, [navigate]);
    const onTopicSubmit = useCallback(
        values => {
            values.lessons?.forEach((item: LessonGet) => {
                const fileName = item.instructionFile?.split('\\').pop();
                item.instructionFile = fileName;
                const newInstruction = {
                    instruction: item.instruction,
                    instructionFile: '1',
                };
                item.instruction = newInstruction;
            });
            values.courseId = selectedCourse || courses?.[0]?.id;

            values.navigateHome = navigateHome;
            if (id) {
                values.id = id;
                dispatch(editTopic(values));
            } else {
                dispatch(addTopic(values));
            }
        },
        [courses, dispatch, id, navigateHome, selectedCourse],
    );
    useEffect(() => {
        form.resetFields();
    }, [form]);
    let assessmentAnswerType = '';
    const initialLessons = topicLessons.map(({ id, instruction, assessment }) => {
        const isMulti: boolean[] = [];
        let isSimple = true;
        assessment[0]?.answerChoices?.forEach(({ answerChoice, isCorrect }) => {
            isMulti.push(isCorrect);
            if (typeof answerChoice !== 'boolean') {
                isSimple = false;
            }
        });
        const type = isMulti
            .filter((item, index) => isMulti.indexOf(item) !== index)
            .includes(true);
        assessmentAnswerType =
            (isSimple && AssessmentAnswerTypes.SIMPLE) ||
            (type ? AssessmentAnswerTypes.MULTI_CHOICE : AssessmentAnswerTypes.SINGLE_CHOICE);
        return {
            id,
            assessmentQuestion: assessment[0]?.assessmentQuestion,
            instruction: instruction[0]?.instruction,
            answerChoices: assessment[0]?.answerChoices,
            assessmentAnswerType,
        };
    });
    return (
        <>
            <Row>
                <Typography.Title level={2} className="title">
                    {id ? 'Edit' : 'Add'} Topic
                </Typography.Title>
            </Row>
            <Row>
                <Col flex={'100%'}>
                    <Form
                        onFinish={onTopicSubmit}
                        validateTrigger="onSubmit"
                        initialValues={
                            id
                                ? {
                                      [TopicDataKeys.NAME]: topics.find(each => each.id == id)
                                          ?.name,
                                      [TopicDataKeys.LESSONS]: initialLessons,
                                      [TopicDataKeys.COURSE_ID]: courses[0]?.id as string,
                                  }
                                : {}
                        }
                        {...layout}
                        layout="horizontal"
                        form={form}
                        name={FormNames.ADD_TOPIC}
                    >
                        <Form.Item name={TopicDataKeys.COURSE_ID} label="Course name">
                            <Select
                                showArrow
                                defaultValue={courses?.[0]?.name}
                                style={{ width: '100%' }}
                                onChange={value => setSelectedCourse(value as string)}
                            >
                                {courses.map(each => {
                                    return (
                                        <Select.Option value={each.id} key={each.id}>
                                            {each.name}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name={TopicDataKeys.NAME}
                            label="Topic name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Topic is required.',
                                },
                            ]}
                            extra={
                                <Typography.Paragraph style={{ color: 'red' }}>
                                    {error &&
                                        `Topic with name ${form.getFieldValue(
                                            'name',
                                        )} already exists`}
                                </Typography.Paragraph>
                            }
                        >
                            <Input placeholder="Topic" status={error ? 'error' : ''} />
                        </Form.Item>
                        <Form.List name={TopicDataKeys.LESSONS}>
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => {
                                        return (
                                            <React.Fragment key={key}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, LessonDataKeys.INSTRUCTION]}
                                                    label="Instruction"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Instruction is required.',
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="Instruction" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    label="Assessment question"
                                                    name={[
                                                        name,
                                                        LessonDataKeys.ASSESSMENT_QUESTION,
                                                    ]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                'Assessment question is required.',
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="Assessment question" />
                                                </Form.Item>
                                                <Form.Item
                                                    noStyle
                                                    shouldUpdate={() => {
                                                        return true;
                                                    }}
                                                >
                                                    {({ getFieldsValue }) => {
                                                        const selected =
                                                            getFieldsValue()?.lessons?.[name]
                                                                ?.assessmentAnswerType;
                                                        return (
                                                            <>
                                                                {!selected && (
                                                                    <Form.Item
                                                                        {...restField}
                                                                        label="Assessment answer type"
                                                                        name={[
                                                                            name,
                                                                            LessonDataKeys.ASSESSMENT_ANSWER_TYPE,
                                                                        ]}
                                                                        rules={[
                                                                            {
                                                                                required: true,
                                                                                message:
                                                                                    'Assessment answer type is required.',
                                                                            },
                                                                        ]}
                                                                    >
                                                                        <Select
                                                                            placeholder={
                                                                                'Select assessment answer type'
                                                                            }
                                                                            bordered
                                                                        >
                                                                            <Select.Option
                                                                                value={
                                                                                    AssessmentAnswerTypes.SIMPLE
                                                                                }
                                                                            >
                                                                                {
                                                                                    AssessmentAnswerTypes.SIMPLE
                                                                                }
                                                                            </Select.Option>
                                                                            <Select.Option
                                                                                value={
                                                                                    AssessmentAnswerTypes.MULTI_CHOICE
                                                                                }
                                                                            >
                                                                                {
                                                                                    AssessmentAnswerTypes.MULTI_CHOICE
                                                                                }
                                                                            </Select.Option>
                                                                            <Select.Option
                                                                                value={
                                                                                    AssessmentAnswerTypes.SINGLE_CHOICE
                                                                                }
                                                                            >
                                                                                {
                                                                                    AssessmentAnswerTypes.SINGLE_CHOICE
                                                                                }
                                                                            </Select.Option>
                                                                        </Select>
                                                                    </Form.Item>
                                                                )}
                                                                {selected &&
                                                                    (selected ===
                                                                        AssessmentAnswerTypes.MULTI_CHOICE ||
                                                                        selected ===
                                                                            AssessmentAnswerTypes.SINGLE_CHOICE) && (
                                                                        <Form.List
                                                                            name={[
                                                                                name,
                                                                                LessonDataKeys.ANSWER_CHOICES,
                                                                            ]}
                                                                            rules={[
                                                                                {
                                                                                    validator:
                                                                                        async (
                                                                                            _,
                                                                                            answerChoices,
                                                                                        ) => {
                                                                                            if (
                                                                                                !answerChoices
                                                                                            ) {
                                                                                                return Promise.reject(
                                                                                                    new Error(
                                                                                                        'Please, add choices.',
                                                                                                    ),
                                                                                                );
                                                                                            }
                                                                                            if (
                                                                                                answerChoices &&
                                                                                                answerChoices?.length &&
                                                                                                answerChoices?.length <
                                                                                                    2
                                                                                            ) {
                                                                                                return Promise.reject(
                                                                                                    new Error(
                                                                                                        'At least 2 answerChoices!',
                                                                                                    ),
                                                                                                );
                                                                                            }
                                                                                            if (
                                                                                                answerChoices &&
                                                                                                answerChoices?.length &&
                                                                                                answerChoices?.length >
                                                                                                    5
                                                                                            ) {
                                                                                                return Promise.reject(
                                                                                                    new Error(
                                                                                                        'Maximum 5 answerChoices!',
                                                                                                    ),
                                                                                                );
                                                                                            }
                                                                                            const isValid =
                                                                                                answerChoices?.filter(
                                                                                                    ({
                                                                                                        isCorrect,
                                                                                                    }: AnswerChoice) =>
                                                                                                        isCorrect ===
                                                                                                        true,
                                                                                                );
                                                                                            if (
                                                                                                answerChoices &&
                                                                                                answerChoices?.length &&
                                                                                                isValid?.length ===
                                                                                                    0
                                                                                            ) {
                                                                                                return Promise.reject(
                                                                                                    new Error(
                                                                                                        'Answer choices must contain at least one correct choice!',
                                                                                                    ),
                                                                                                );
                                                                                            }
                                                                                            if (
                                                                                                selected ===
                                                                                                    AssessmentAnswerTypes.SINGLE_CHOICE &&
                                                                                                isValid?.length >
                                                                                                    1
                                                                                            ) {
                                                                                                return Promise.reject(
                                                                                                    new Error(
                                                                                                        'Your answer type is single-correct.Choose one correct choice!',
                                                                                                    ),
                                                                                                );
                                                                                            }
                                                                                            if (
                                                                                                selected ===
                                                                                                    AssessmentAnswerTypes.SINGLE_CHOICE ||
                                                                                                selected ===
                                                                                                    AssessmentAnswerTypes.MULTI_CHOICE
                                                                                            ) {
                                                                                                const choices =
                                                                                                    answerChoices.map(
                                                                                                        ({
                                                                                                            answerChoice,
                                                                                                        }: AnswerChoice) =>
                                                                                                            answerChoice,
                                                                                                    );
                                                                                                const duplicates =
                                                                                                    choices.filter(
                                                                                                        (
                                                                                                            item: AnswerChoice,
                                                                                                            index: string,
                                                                                                        ) =>
                                                                                                            choices.indexOf(
                                                                                                                item,
                                                                                                            ) !==
                                                                                                            index,
                                                                                                    );
                                                                                                return (
                                                                                                    duplicates.length >
                                                                                                        0 &&
                                                                                                    Promise.reject(
                                                                                                        new Error(
                                                                                                            'Please, enter unique choices.',
                                                                                                        ),
                                                                                                    )
                                                                                                );
                                                                                            }
                                                                                        },
                                                                                },
                                                                            ]}
                                                                        >
                                                                            {(
                                                                                answerChoices,
                                                                                { add, remove },
                                                                                { errors },
                                                                            ) => {
                                                                                return (
                                                                                    <div>
                                                                                        {answerChoices.map(
                                                                                            ({
                                                                                                key: answerChoiceKey,
                                                                                                ...answerChoice
                                                                                            }) => {
                                                                                                return (
                                                                                                    <React.Fragment
                                                                                                        key={
                                                                                                            answerChoiceKey
                                                                                                        }
                                                                                                    >
                                                                                                        <Form.Item
                                                                                                            labelCol={{
                                                                                                                span: 4,
                                                                                                            }}
                                                                                                            wrapperCol={{
                                                                                                                span: 14,
                                                                                                            }}
                                                                                                            {...answerChoice}
                                                                                                            name={[
                                                                                                                answerChoice.name,
                                                                                                                AnswerChoiceDataKeys.ANSWER_CHOICE,
                                                                                                            ]}
                                                                                                            label="Assessment answer choice"
                                                                                                            rules={[
                                                                                                                {
                                                                                                                    required:
                                                                                                                        true,
                                                                                                                    message:
                                                                                                                        'Assessment answer choice is required.',
                                                                                                                },
                                                                                                            ]}
                                                                                                        >
                                                                                                            <Input placeholder="Assessment answer choice" />
                                                                                                        </Form.Item>
                                                                                                        <Form.Item
                                                                                                            labelCol={{
                                                                                                                span: 4,
                                                                                                            }}
                                                                                                            wrapperCol={{
                                                                                                                span: 14,
                                                                                                            }}
                                                                                                            {...answerChoice}
                                                                                                            name={[
                                                                                                                answerChoice.name,
                                                                                                                AnswerChoiceDataKeys.IS_CORRECT,
                                                                                                            ]}
                                                                                                            label="Is Correct"
                                                                                                            rules={[
                                                                                                                {
                                                                                                                    required:
                                                                                                                        true,
                                                                                                                    message:
                                                                                                                        'Assessment answer isCorrect is required.',
                                                                                                                },
                                                                                                            ]}
                                                                                                        >
                                                                                                            <Radio.Group>
                                                                                                                <Radio.Button
                                                                                                                    value={
                                                                                                                        true
                                                                                                                    }
                                                                                                                >
                                                                                                                    True
                                                                                                                </Radio.Button>
                                                                                                                <Radio.Button
                                                                                                                    value={
                                                                                                                        false
                                                                                                                    }
                                                                                                                >
                                                                                                                    False
                                                                                                                </Radio.Button>
                                                                                                            </Radio.Group>
                                                                                                        </Form.Item>
                                                                                                        <Form.Item
                                                                                                            wrapperCol={{
                                                                                                                ...layout.wrapperCol,
                                                                                                                offset: 15,
                                                                                                            }}
                                                                                                        >
                                                                                                            <Button
                                                                                                                style={{
                                                                                                                    borderRadius:
                                                                                                                        '8px',
                                                                                                                }}
                                                                                                                type={
                                                                                                                    'dashed'
                                                                                                                }
                                                                                                                onClick={() => {
                                                                                                                    remove(
                                                                                                                        answerChoice.name,
                                                                                                                    );
                                                                                                                }}
                                                                                                                icon={
                                                                                                                    <MinusCircleOutlined />
                                                                                                                }
                                                                                                            >
                                                                                                                Remove
                                                                                                                Choice
                                                                                                            </Button>
                                                                                                        </Form.Item>
                                                                                                    </React.Fragment>
                                                                                                );
                                                                                            },
                                                                                        )}
                                                                                        <Form.Item
                                                                                            wrapperCol={{
                                                                                                ...layout.wrapperCol,
                                                                                                offset: 4,
                                                                                            }}
                                                                                        >
                                                                                            <Button
                                                                                                style={{
                                                                                                    borderRadius:
                                                                                                        '8px',
                                                                                                }}
                                                                                                type={
                                                                                                    'primary'
                                                                                                }
                                                                                                onClick={() => {
                                                                                                    add();
                                                                                                }}
                                                                                            >
                                                                                                <PlusOutlined />
                                                                                                Add
                                                                                                Choice
                                                                                            </Button>
                                                                                            <Form.ErrorList
                                                                                                errors={
                                                                                                    errors
                                                                                                }
                                                                                            />
                                                                                        </Form.Item>
                                                                                    </div>
                                                                                );
                                                                            }}
                                                                        </Form.List>
                                                                    )}
                                                                {selected &&
                                                                    selected ===
                                                                        AssessmentAnswerTypes.SIMPLE && (
                                                                        <Form.Item
                                                                            {...restField}
                                                                            label="Assessment answer"
                                                                            name={[
                                                                                name,
                                                                                LessonDataKeys.SIMPLE_ANSWER,
                                                                            ]}
                                                                            rules={[
                                                                                {
                                                                                    required: true,
                                                                                    message:
                                                                                        'Assessment answer is required.',
                                                                                },
                                                                            ]}
                                                                        >
                                                                            <Radio.Group>
                                                                                <Radio value={true}>
                                                                                    True
                                                                                </Radio>
                                                                                <Radio
                                                                                    value={false}
                                                                                >
                                                                                    False
                                                                                </Radio>
                                                                            </Radio.Group>
                                                                        </Form.Item>
                                                                    )}
                                                            </>
                                                        );
                                                    }}
                                                </Form.Item>
                                                <Form.Item
                                                    wrapperCol={{
                                                        ...layout.wrapperCol,
                                                        offset: 15,
                                                    }}
                                                >
                                                    <Button
                                                        style={{ borderRadius: '8px' }}
                                                        type={'dashed'}
                                                        onClick={() => {
                                                            remove(name);
                                                        }}
                                                        icon={<MinusCircleOutlined />}
                                                    >
                                                        Remove Lesson
                                                    </Button>
                                                </Form.Item>
                                            </React.Fragment>
                                        );
                                    })}
                                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
                                        <Button
                                            style={{ borderRadius: '8px' }}
                                            type="dashed"
                                            onClick={() => {
                                                add();
                                            }}
                                            icon={<PlusOutlined />}
                                        >
                                            Add lesson
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 16 }}>
                            <Button
                                type={'primary'}
                                style={{ padding: '0 48px', borderRadius: '8px' }}
                                htmlType={'submit'}
                                form={FormNames.ADD_TOPIC}
                            >
                                {!id ? 'Save' : 'Edit'}
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </>
    );
};
export default TopicContent;
