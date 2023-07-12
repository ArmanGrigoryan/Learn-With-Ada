import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Row, Col, Button, Form, Input, Select, Tag, Modal } from 'antd';
import { AuthDataKeys, FormNames, RoleTypes } from '../../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { createGroup, updateGroup } from '../../redux/actions/group.actions';
import { useNavigate, useParams } from 'react-router-dom';
import { RoutePath } from '../../routes/routes';
import { adminSelect, businessSelect, courseSelect, groupSelect } from '../../redux';
import GroupTable from '../../components/table-group';
import { DefaultThemeColors } from '../../utils/colors';
import { GroupData } from '../../core/models/group';
import { ArrowLeftOutlined } from '@ant-design/icons';
import BusinessesList from '../../components/business-list';

const tagRender = (props: CustomTagProps) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };
    return (
        <Tag
            color={value}
            onMouseDown={onPreventMouseDown}
            closable={closable}
            onClose={onClose}
            style={{ marginRight: 3, backgroundColor: DefaultThemeColors.buttonBackColor }}
        >
            {label}
        </Tag>
    );
};

const UserGroupCreate: React.FC = () => {
    const [formik] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const id = useParams().id;
    const loadUserObj = useMemo(() => ({}), []);
    const loadCourseObj = useMemo(() => ({}), []);
    const [userIds, setUserIds] = useState<string[]>([]);
    const [courseIds, setCourseIds] = useState<string[]>([]);
    const [businessId, setBusinessId] = useState<string>('');
    const { businesses } = useSelector(businessSelect);
    const { groups, loading } = useSelector(groupSelect);
    const group = groups.find(item => item.id == id);
    const navigateHandler = useCallback(() => {
        navigate(RoutePath.USER_GROUP);
    }, [navigate]);
    const onGroupAddUpdate = useCallback(() => {
        const fields = formik.getFieldsValue();
        fields.creator = localStorage.getItem(AuthDataKeys.USER_ID);
        fields.navigateHome = navigateHandler;
        fields.businessId = businessId;
        if (!businessId) return;
        if (id) {
            fields.action = 'rename';
            fields.id = group?.id;
            dispatch(updateGroup(fields));
        } else {
            fields.userIds = userIds;
            fields.courseIds = courseIds;
            dispatch(createGroup(fields));
        }
    }, [formik, dispatch, navigateHandler, userIds, courseIds, id, group?.id, businessId]);
    const allUsers = useSelector(adminSelect).users.filter(user => user.role !== RoleTypes.ADMIN);
    const { courses } = useSelector(courseSelect);
    const courseOptions = courses.reduce((res, course) => {
        const courseName = course.name as string;
        res.push({ value: courseName });
        return res;
    }, [] as Array<{ value: string }>);
    const userOptions = allUsers.reduce((res, user) => {
        const userName = user.firstName + ' ' + user.lastName;
        res.push({ value: userName });
        return res;
    }, [] as Array<{ value: string }>);
    const selectUsersHandler = (values: Array<string>) => {
        const users = allUsers.filter(user =>
            values.includes(user.firstName + ' ' + user.lastName),
        );
        setUserIds(users.map(user => user.id));
    };
    const selectCoursesHandler = (values: Array<string>) => {
        const newCourses = courses.filter(course => values.includes(course.name as string));
        setCourseIds(newCourses.map(newCourse => newCourse.id as string));
    };
    const [isCoursesModalVisible, setIsCoursesModalVisible] = useState(false);
    const [isUsersModalVisible, setIsUsersModalVisible] = useState(false);
    const showCoursesModal = () => {
        setIsCoursesModalVisible(true);
    };
    const showUsersModal = () => {
        setIsUsersModalVisible(true);
    };
    const handleOk = () => {
        isCoursesModalVisible && setIsCoursesModalVisible(false);
        isUsersModalVisible && setIsUsersModalVisible(false);
    };
    const goBack = useCallback(() => navigate(RoutePath.USER_GROUP), [navigate]);
    const onBusinessSelect = useCallback(
        name => {
            const id = businesses.find(each => each.name === name)?.id;
            setBusinessId(id as string);
        },
        [businesses],
    );
    useEffect(() => {
        setBusinessId(group?.businessId as string);
    }, [group?.businessId]);
    const backButton = (
        <Col span={8} push={4}>
            <Button size="large" ghost type="link" icon={<ArrowLeftOutlined />} onClick={goBack}>
                Back
            </Button>
        </Col>
    );
    return (
        <>
            <Row justify={'center'} style={{ margin: '40px 0' }}>
                <Col flex={'45%'}>
                    <Form
                        encType="multipart/form-data"
                        form={formik}
                        layout="vertical"
                        name={FormNames.ADD_COURSE}
                        initialValues={{
                            name: group?.name,
                            creator:
                                localStorage.getItem('firstName') +
                                ' ' +
                                localStorage.getItem('lastName'),
                        }}
                    >
                        {!id && (
                            <Row align="middle">
                                <Col span={16}>
                                    <Form.Item
                                        label="Business"
                                        name="businessId"
                                        rules={[{ required: true }]}
                                    >
                                        <BusinessesList
                                            selected={group?.businessId as string}
                                            onBusinessSelect={onBusinessSelect}
                                        />
                                    </Form.Item>
                                </Col>
                                {backButton}
                            </Row>
                        )}
                        <Row align="middle">
                            <Col span={id ? 16 : 24}>
                                <Form.Item
                                    name="name"
                                    label="Group name"
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="Enter name" />
                                </Form.Item>
                            </Col>
                            {id && backButton}
                        </Row>
                        {!id ? (
                            <>
                                <Form.Item name="userIds" label="Add users">
                                    <Select
                                        mode="multiple"
                                        showArrow
                                        tagRender={tagRender}
                                        defaultValue={[]}
                                        style={{ width: '100%' }}
                                        options={userOptions}
                                        onChange={selectUsersHandler}
                                    />
                                </Form.Item>
                                <Form.Item name="courseIds" label="Add courses">
                                    <Select
                                        mode="multiple"
                                        showArrow
                                        tagRender={tagRender}
                                        defaultValue={[]}
                                        style={{ width: '100%' }}
                                        options={courseOptions}
                                        onChange={selectCoursesHandler}
                                    />
                                </Form.Item>
                            </>
                        ) : (
                            <>
                                <Row justify="space-between">
                                    <Button type="primary" onClick={showCoursesModal}>
                                        Add courses
                                    </Button>
                                    <Button type="primary" onClick={showUsersModal}>
                                        Add users
                                    </Button>
                                </Row>
                                <Modal
                                    title="Basic Modal"
                                    visible={isCoursesModalVisible}
                                    onOk={handleOk}
                                    onCancel={handleOk}
                                >
                                    <GroupTable
                                        isCourse
                                        group={group as GroupData}
                                        loadObj={loadCourseObj}
                                    />
                                </Modal>
                                <Modal
                                    title="Basic Modal"
                                    visible={isUsersModalVisible}
                                    onOk={handleOk}
                                    onCancel={handleOk}
                                >
                                    <GroupTable group={group as GroupData} loadObj={loadUserObj} />
                                </Modal>
                                <br />
                            </>
                        )}
                        <Row justify={'end'}>
                            <Button
                                type="primary"
                                form={FormNames.CREATE_GROUP}
                                htmlType={'submit'}
                                onClick={onGroupAddUpdate}
                                loading={loading}
                            >
                                {`${!id ? 'Add' : 'Edit'} group`}
                            </Button>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default UserGroupCreate;
