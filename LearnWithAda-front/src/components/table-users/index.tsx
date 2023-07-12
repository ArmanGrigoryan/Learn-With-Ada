import {
    Table,
    Space,
    Typography,
    Progress,
    Button,
    Dropdown,
    Menu,
    Modal,
    PageHeader,
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
    addNotification,
    adminSelect,
    editUserRole,
    getUserPassedLessons,
    setUserLoading,
    userSelect,
} from '../../redux';
import '../table-courses/table-courses.less';
import { UserCourse, UserInterface } from '../../core/models/user';
import { RoleTypes } from '../../utils/constants';
import { useCallback, useState } from 'react';
import { ColumnsType } from 'antd/lib/table/interface';
import {
    TableItemTopics as TableItem,
    TableUsersPropsTopics as TableUsersProps,
    ColumnsTopics as Columns,
} from '../../utils/interfaces';
import { CourseData } from '../../core/models';

export default function TableUsers({ courseId, editUsers = false }: TableUsersProps) {
    const { users: allUsers } = useSelector(adminSelect);
    const { id, loading } = useSelector(userSelect);
    const users = allUsers.filter(user => user.role !== RoleTypes.ADMIN);
    const dispatch = useDispatch();
    const [userToRequest, setUserToRequest] = useState({});
    const filteredUsersByCourse = users.filter(each =>
        each.courses.some((item: CourseData) => item.id == courseId),
    );
    const { passedLessons = 0, totalLessons = 0 } =
        (users
            .find(item => item?.id === userToRequest)
            ?.courses?.find(item => item?.course === courseId) as UserCourse) || {};
    const passedPercent = Math.trunc((passedLessons * 100) / totalLessons);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = (courseId: string, key: string) => {
        setUserToRequest(key);
        dispatch(getUserPassedLessons({ userId: key, courseId }));
        setIsModalVisible(true);
    };
    const handleOk = () => {
        setIsModalVisible(false);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const onRoleChange = useCallback(
        (id: string, role: string) => {
            dispatch(setUserLoading({ id }));
            dispatch(
                editUserRole({
                    id,
                    role,
                }),
            );
        },
        [dispatch],
    );
    const onSendReminder = useCallback(
        (userId: string) => {
            dispatch(
                addNotification({
                    businessAdminId: `${id}`,
                    userId: `${userId}`,
                    courseId,
                    navigateHome: () => null,
                }),
            );
        },
        [dispatch, id, courseId],
    );
    const data = !editUsers
        ? filteredUsersByCourse.map(({ courses, id, firstName, lastName }: UserInterface) => {
              const course = courses.find(course => course?.course == courseId);
              return {
                  key: id,
                  name: `${firstName} ${lastName}`,
                  progress: course?.status,
                  reminder: id,
                  courseId,
              };
          })
        : users.map(({ id, firstName, lastName, role }) => {
              return {
                  key: id,
                  name: `${firstName} ${lastName}`,
                  editRole: role,
                  role,
              };
          });
    const columns: Columns[] = [
        {
            title: <Typography.Paragraph className="table-title">User name</Typography.Paragraph>,
            dataIndex: 'name',
            render: (text: string) => <p>{text}</p>,
            sorter: (a: TableItem, b: TableItem) => a.name.localeCompare(b.name),
        },
    ];
    if (!editUsers) {
        columns.push(
            {
                title: (
                    <Typography.Paragraph className="table-title">Progress</Typography.Paragraph>
                ),
                dataIndex: 'courseId',
                render: (courseId: string, record: TableItem) => {
                    return (
                        <Button
                            type="primary"
                            shape="round"
                            onClick={() => showModal(courseId, record.key)}
                        >
                            See progress
                        </Button>
                    );
                },
            },
            {
                title: <Typography.Paragraph className="table-title">Action</Typography.Paragraph>,
                dataIndex: 'reminder',
                render: (reminder: string) => {
                    return (
                        <Space size="middle">
                            <Button
                                shape="round"
                                type="primary"
                                onClick={() => onSendReminder(reminder)}
                            >
                                Send Reminder
                            </Button>
                        </Space>
                    );
                },
            },
        );
    }
    if (editUsers) {
        columns.push(
            {
                title: <Typography.Paragraph className="table-title">Role</Typography.Paragraph>,
                dataIndex: 'role',
                render: (text: string) => {
                    return <p>{text}</p>;
                },
                sorter: (a: TableItem, b: TableItem) => a.name.localeCompare(b.name),
            },
            {
                title: <Typography.Paragraph className="table-title">Action</Typography.Paragraph>,
                dataIndex: 'editRole',
                render: (text: string, record: TableItem) => {
                    return (
                        <Dropdown
                            overlay={
                                <Menu className="users-table-role-menu">
                                    <Menu.Item
                                        key={'business-admin'}
                                        style={{ margin: 0 }}
                                        onClick={evt => onRoleChange(record.key, evt.key)}
                                        disabled={text === 'business-admin'}
                                    >
                                        Business-admin
                                    </Menu.Item>
                                    <Menu.Item
                                        key={'user'}
                                        style={{ margin: 0 }}
                                        onClick={evt => onRoleChange(record.key, evt.key)}
                                        disabled={text === 'user'}
                                    >
                                        User
                                    </Menu.Item>
                                </Menu>
                            }
                            placement="bottomLeft"
                            arrow
                        >
                            <Button
                                type="primary"
                                loading={loading?.[record.key]}
                                icon={<EditOutlined />}
                            >
                                Change role
                            </Button>
                        </Dropdown>
                    );
                },
            },
        );
    }
    return (
        <>
            <Table
                className="table"
                columns={columns as ColumnsType<TableItem>}
                dataSource={data as TableItem[]}
                pagination={false}
                rowClassName="table-row"
            />
            <Modal
                title="Basic Modal"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <PageHeader
                    className="site-page-header"
                    title={`Passed lessons    ${passedLessons} / ${totalLessons}`}
                />
                <Progress percent={passedPercent} />
            </Modal>
        </>
    );
}
