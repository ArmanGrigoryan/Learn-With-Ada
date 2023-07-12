import React, { Ref, useCallback, useEffect, useRef, useState } from 'react';
import { Radio, Typography, Button, Form, Input, Select, InputRef } from 'antd';
import { AssessmentAnswerTypes, FormNames } from '../../utils/constants';
import { useNavigate, useParams } from 'react-router-dom';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { addLesson, editLesson, lessonSelect, topicSelect } from '../../redux';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'antd/lib/form/Form';
import { RoutePath } from '../../routes/routes';
import TopicList from '../../components/topics-list';
import {
    AnswerChoice,
    AnswerChoiceDataKeys,
    LessonDataKeys,
    LessonGet,
} from '../../core/models/lesson';

const LessonEditContent: React.FC = () => {
    const inputRef = useRef<HTMLInputElement & { input: HTMLInputElement }>();
    const { id } = useParams();
    const { lessons, loading } = useSelector(lessonSelect);
    const { topics } = useSelector(topicSelect);
    const lesson = id ? lessons.find((lesson: LessonGet) => lesson.id == id) : null;
    const onTopicSelect = useCallback(
        value => {
            const id = topics.find(topic => topic.name === value)?.id;
            id && setTopicId(id);
        },
        [topics],
    );
    const [topicId, setTopicId] = useState(lesson?.topicId ? lesson.topicId : '');
    const [form] = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        form.resetFields();
    }, [form]);
    const initialLesson = {
        instruction: lesson?.instruction?.instruction,
        assessmentQuestion: lesson?.assessment?.[0]?.assessmentQuestion,
        // assessmentAnswerType: lesson && getLessonAnswerType(lesson)?.assessmentAnswerType,
        answerChoices: lesson?.answerChoices,
    };
    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
    };
    const navigateHome = useCallback(() => {
        navigate(RoutePath.ROOT);
    }, [navigate]);
    const onLessonSubmit = useCallback(() => {
        let values = form.getFieldsValue();
        const file = inputRef?.current?.input?.files?.[0];
        values.navigateHome = navigateHome;
        if (lesson) {
            values = { ...lesson, ...values };
            values.instructionFile = !values.instructionFile
                ? lesson.instruction.instructionFile
                : file?.name;
        } else {
            values.topicId = topicId;
            values.file = file;
            values.instructionFile = file?.name;
        }
        if (id) {
            values.id = id;
            dispatch(editLesson(values));
        } else {
            dispatch(addLesson(values));
        }
    }, [dispatch, form, id, lesson, navigateHome, topicId]);
    return (
        <>
            <Typography.Title level={2} style={{ textAlign: 'center', margin: '32px' }}>
                {id ? 'Edit lesson' : 'Add Lesson'}
            </Typography.Title>
            <Form
                validateTrigger="onSubmit"
                onFinish={onLessonSubmit}
                initialValues={id ? initialLesson : {}}
                {...layout}
                layout="horizontal"
                form={form}
                name={FormNames.ADD_LESSON}
            >
                <>
                    <Form.Item label="Topic" name="topic" required>
                        <TopicList selected={lesson?.topicId} onTopicSelect={onTopicSelect} />
                    </Form.Item>
                    <Form.Item
                        name={LessonDataKeys.INSTRUCTION}
                        label="Instruction"
                        rules={[
                            {
                                required: true,
                                message: 'Instruction is required.',
                            },
                        ]}
                    >
                        <Input type="text" name="Instruction" />
                    </Form.Item>
                    <Form.Item name={'instructionFile'} label="Instruction file">
                        <Input
                            ref={inputRef as Ref<InputRef>}
                            type="file"
                            required={false}
                            name="Instruction file"
                            accept=".mp4,.mp3"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Assessment question"
                        name={LessonDataKeys.ASSESSMENT_QUESTION}
                        rules={[
                            {
                                required: true,
                                message: 'Assessment question is required.',
                            },
                        ]}
                    >
                        <Input placeholder="Assessment question" />
                    </Form.Item>
                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => {
                            return (
                                prevValues?.assessmentAnswerType !==
                                currentValues?.assessmentAnswerType
                            );
                        }}
                    >
                        {({ getFieldsValue }) => {
                            const selected: AssessmentAnswerTypes =
                                getFieldsValue()?.assessmentAnswerType;
                            return (
                                <>
                                    {!selected && (
                                        <Form.Item
                                            label="Assessment answer type"
                                            name={LessonDataKeys.ASSESSMENT_ANSWER_TYPE}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Assessment answer type is required.',
                                                },
                                            ]}
                                        >
                                            <Select
                                                placeholder="Select assessment answer type"
                                                bordered
                                                virtual={false}
                                            >
                                                <Select.Option value={AssessmentAnswerTypes.SIMPLE}>
                                                    {AssessmentAnswerTypes.SIMPLE}
                                                </Select.Option>
                                                <Select.Option
                                                    value={AssessmentAnswerTypes.MULTI_CHOICE}
                                                >
                                                    {AssessmentAnswerTypes.MULTI_CHOICE}
                                                </Select.Option>
                                                <Select.Option
                                                    value={AssessmentAnswerTypes.SINGLE_CHOICE}
                                                >
                                                    {AssessmentAnswerTypes.SINGLE_CHOICE}
                                                </Select.Option>
                                            </Select>
                                        </Form.Item>
                                    )}
                                    {selected &&
                                        (selected === AssessmentAnswerTypes.MULTI_CHOICE ||
                                            selected === AssessmentAnswerTypes.SINGLE_CHOICE) && (
                                            <Form.List
                                                rules={[
                                                    {
                                                        validator: async (_, answerChoices) => {
                                                            if (!answerChoices) {
                                                                return Promise.reject(
                                                                    new Error(
                                                                        'Please, add choices!',
                                                                    ),
                                                                );
                                                            }
                                                            if (
                                                                answerChoices &&
                                                                answerChoices?.length &&
                                                                answerChoices?.length < 2
                                                            ) {
                                                                return Promise.reject(
                                                                    new Error(
                                                                        'At least 2 answerChoices',
                                                                    ),
                                                                );
                                                            }
                                                            if (
                                                                answerChoices &&
                                                                answerChoices?.length &&
                                                                answerChoices?.length > 5
                                                            ) {
                                                                return Promise.reject(
                                                                    new Error(
                                                                        'Maximum 5 answerChoices',
                                                                    ),
                                                                );
                                                            }
                                                            const isValid = answerChoices?.filter(
                                                                ({ isCorrect }: AnswerChoice) =>
                                                                    isCorrect === true,
                                                            );
                                                            if (
                                                                answerChoices &&
                                                                answerChoices?.length &&
                                                                isValid?.length === 0
                                                            ) {
                                                                return Promise.reject(
                                                                    new Error(
                                                                        'Answer choices must contain at least one correct choice',
                                                                    ),
                                                                );
                                                            }
                                                            if (
                                                                selected ===
                                                                    AssessmentAnswerTypes.SINGLE_CHOICE &&
                                                                isValid?.length > 1
                                                            ) {
                                                                return Promise.reject(
                                                                    new Error(
                                                                        'Your answer type is single-correct.Choose one correct choice.',
                                                                    ),
                                                                );
                                                            }
                                                            if (
                                                                selected ===
                                                                    AssessmentAnswerTypes.SINGLE_CHOICE ||
                                                                selected ===
                                                                    AssessmentAnswerTypes.MULTI_CHOICE
                                                            ) {
                                                                const choices = answerChoices.map(
                                                                    ({
                                                                        answerChoice,
                                                                    }: AnswerChoice) =>
                                                                        answerChoice,
                                                                );
                                                                const duplicates = choices.filter(
                                                                    (
                                                                        item: AnswerChoice,
                                                                        index: string,
                                                                    ) =>
                                                                        choices.indexOf(item) !==
                                                                        index,
                                                                );
                                                                return (
                                                                    duplicates.length > 0 &&
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
                                                name={LessonDataKeys.ANSWER_CHOICES}
                                            >
                                                {(answerChoices, { add, remove }, { errors }) => {
                                                    return (
                                                        <div>
                                                            {answerChoices.map(
                                                                ({ key, ...answerChoice }) => {
                                                                    return (
                                                                        <React.Fragment key={key}>
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
                                                                                        value={true}
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
                                                                                    type={'dashed'}
                                                                                    onClick={() => {
                                                                                        remove(
                                                                                            answerChoice.name,
                                                                                        );
                                                                                    }}
                                                                                    icon={
                                                                                        <MinusCircleOutlined />
                                                                                    }
                                                                                >
                                                                                    Remove Choice
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
                                                                    type={'primary'}
                                                                    onClick={() => {
                                                                        add();
                                                                    }}
                                                                >
                                                                    <PlusOutlined />
                                                                    Add Choice
                                                                </Button>
                                                                <Form.ErrorList errors={errors} />
                                                            </Form.Item>
                                                        </div>
                                                    );
                                                }}
                                            </Form.List>
                                        )}
                                    {selected && selected === AssessmentAnswerTypes.SIMPLE && (
                                        <Form.Item
                                            label="Assessment answer"
                                            name={LessonDataKeys.SIMPLE_ANSWER}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Assessment answer is required.',
                                                },
                                            ]}
                                        >
                                            <Radio.Group>
                                                <Radio value={true}>True</Radio>
                                                <Radio value={false}>False</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    )}
                                </>
                            );
                        }}
                    </Form.Item>
                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 16 }}>
                        <Button
                            loading={loading}
                            type={'primary'}
                            style={{ padding: '0 48px' }}
                            htmlType={'submit'}
                            form={FormNames.ADD_LESSON}
                        >
                            {!id ? 'Save' : 'Edit'}
                        </Button>
                    </Form.Item>
                </>
            </Form>
        </>
    );
};
export default LessonEditContent;
