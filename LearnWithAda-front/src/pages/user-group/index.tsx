import React, { useCallback, useState } from 'react';
import { Row, Col, Typography, Button, Descriptions, PageHeader, Modal } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from '../../routes/routes';
import { useDispatch, useSelector } from 'react-redux';
import { adminSelect, courseSelect } from '../../redux';
import { EditOutlined, DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';
import { deleteGroup } from '../../redux/actions/group.actions';
import { groupSelect, setGroupLoading } from '../../redux/store/reducers/group';
import Progress from 'antd/es/progress';

const UserGroup: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const clickHandler = useCallback(() => {
        navigate(RoutePath.USER_GROUP_CREATE);
    }, [navigate]);
    const { groups, loadGroups } = useSelector(groupSelect);
    const { courses } = useSelector(courseSelect);
    const users = useSelector(adminSelect).users;
    const handleOk = () => {
        setIsModalVisible(false);
    };
    const deleteHandler = useCallback(
        id => {
            dispatch(setGroupLoading(id));
            dispatch(deleteGroup(id));
        },
        [dispatch],
    );
    const updateHandler = useCallback(
        id => {
            navigate(`${RoutePath.USER_GROUP_CREATE}/${id}`);
        },
        [navigate],
    );
    const navigateToProgress = useCallback(
        id => {
            navigate(`/group-progress/${id}`);
        },
        [navigate],
    );
    return (
        <>
            <Row justify="start">
                <Col className="topics-content" offset={5} span={12}>
                    <Typography.Title
                        level={1}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            margin: '50px 0',
                        }}
                    >
                        <b>Your groups</b>
                        <Button
                            type="default"
                            icon={<UserAddOutlined />}
                            onClick={clickHandler}
                            style={{ margin: '0 50px', padding: '0 25px' }}
                        >
                            Add
                        </Button>
                    </Typography.Title>
                </Col>
            </Row>
            <Row justify="start"></Row>
            <Row justify="start">
                <Col offset={4} span={15}>
                    {groups?.map(group => {
                        const groupCourses = [] as Array<string>;
                        const groupUsers = [] as Array<string>;
                        group.courseIds?.forEach(course => {
                            const ext = courses.find(each => each.id === course);
                            if (ext) groupCourses.push(ext.name as string);
                        });
                        group.userIds?.forEach(user => {
                            const ext = users.find(each => each.id === user);
                            if (ext) groupUsers.push(`${ext.firstName} ${ext.lastName}`);
                        });
                        const user = users.find(user => user.id === group.creator);
                        return (
                            <PageHeader
                                className="site-page-header"
                                onBack={() => window.history.back()}
                                title={group.name}
                                extra={[
                                    <Button
                                        key="2"
                                        icon={<EditOutlined />}
                                        onClick={() => updateHandler(group.id)}
                                    >
                                        Update
                                    </Button>,
                                    <Button
                                        key="1"
                                        type="primary"
                                        icon={<DeleteOutlined />}
                                        loading={loadGroups[group.id]}
                                        onClick={() => deleteHandler(group.id)}
                                    >
                                        Delete
                                    </Button>,
                                    <Button
                                        key="3"
                                        icon={<EllipsisOutlined />}
                                        onClick={() => navigateToProgress(group.id)}
                                    >
                                        More
                                    </Button>,
                                ]}
                                key={group.id}
                            >
                                <Descriptions size="small" column={3}>
                                    <Descriptions.Item label="Created">
                                        {user?.firstName + ' ' + user?.lastName}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Courses">
                                        {groupCourses.length > 0 ? groupCourses.join(', ') : 'none'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Users">
                                        {groupUsers.length > 0 ? groupUsers.join(', ') : 'none'}
                                    </Descriptions.Item>
                                </Descriptions>
                            </PageHeader>
                        );
                    })}
                </Col>
            </Row>
            <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleOk}>
                <PageHeader className="site-page-header" title={`Passed lessons    3 / 10`} />
                <Progress percent={50} />
            </Modal>
        </>
    );
};

export default UserGroup;
