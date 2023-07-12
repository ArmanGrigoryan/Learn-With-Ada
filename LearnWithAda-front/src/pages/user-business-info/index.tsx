import { Table, Typography, Button, Dropdown, Menu, Row, Col, Grid } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
    addBusinessMemberToCourse,
    adminSelect,
    businessSelect,
    changeBusinessMemberStatus,
    courseSelect,
    getUsers,
    setMemberLoading,
    userSelect,
} from '../../redux';
import { RoleTypes } from '../../utils/constants';
import { useCallback, useEffect } from 'react';
import { ColumnsType } from 'antd/lib/table/interface';
import {
    TableItemBusinessMembers as TableItem,
    ColumnsTopics as Columns,
} from '../../utils/interfaces';
import { useNavigate, useParams } from 'react-router-dom';
import { RoutePath } from '../../routes/routes';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { UserInterface } from '../../core/models/user';

export default function UserBusinessInfo() {
    const navigate = useNavigate();
    const { id: businessId } = useParams();
    const { businesses, loadUsers } = useSelector(businessSelect);
    const business = businesses.find(each => each.id == businessId);
    const { courses } = useSelector(courseSelect);
    const { users: allUsers } = useSelector(adminSelect);
    const users = allUsers.filter(user => user.role !== RoleTypes.ADMIN);
    const revalidate = useSelector(userSelect).revalidate;
    const dispatch = useDispatch();
    useEffect(() => {
        if (revalidate) {
            dispatch(getUsers());
        }
    }, [revalidate, dispatch]);
    const onStatusChange = useCallback(
        (id, status, newStatus) => {
            if (status == newStatus) return;
            dispatch(setMemberLoading({ id }));
            dispatch(
                changeBusinessMemberStatus({
                    businessId: businessId as string,
                    memberId: id,
                    status: newStatus,
                }),
            );
        },
        [dispatch, businessId],
    );
    const screen = Grid.useBreakpoint();
    const layout = screen.xl
        ? '65%'
        : screen.lg
        ? '60%'
        : screen.md
        ? '60%'
        : screen.sm
        ? '60%'
        : screen.xs
        ? '60%'
        : '100%';
    const data = business?.members?.map(each => {
        const user = users.find(user => user.id == each.userId);
        const firstName = user?.firstName.trim() || 'Invited';
        const lastName = user?.lastName.trim() || 'user';
        const name = firstName + ' ' + lastName;
        return {
            key: each.userId,
            name,
            editStatus: each.status,
            status: each.status,
        };
    });

    const addUserToCourse = useCallback(
        (courseId, record, users) => {
            const ext = users.find((each: UserInterface) => each.id == record.key);
            if (ext) return;
            const data = {
                memberId: record.key as string,
                courseId,
            };
            dispatch(addBusinessMemberToCourse(data));
        },
        [dispatch],
    );

    const columns: Columns[] = [
        {
            title: <Typography.Paragraph className="table-title">Member name</Typography.Paragraph>,
            dataIndex: 'name',
            render: (text: string) => <p>{text}</p>,
            sorter: (a: TableItem, b: TableItem) => a.name.localeCompare(b.name),
        },
        {
            title: <Typography.Paragraph className="table-title">Status</Typography.Paragraph>,
            dataIndex: 'status',
            render: (text: string) => {
                return <p>{text}</p>;
            },
            sorter: (a: TableItem, b: TableItem) => a.name.localeCompare(b.name),
        },
        {
            title: <Typography.Paragraph className="table-title">Action</Typography.Paragraph>,
            dataIndex: 'editStatus',
            render: (text: string, record: TableItem) => {
                return (
                    <Dropdown
                        disabled={record.status === 'invited'}
                        overlay={
                            <Menu>
                                <Menu.Item
                                    key={'active'}
                                    style={{ margin: 0 }}
                                    onClick={evt =>
                                        onStatusChange(record.key, record.status, evt.key)
                                    }
                                >
                                    Active
                                </Menu.Item>
                                <Menu.Item
                                    key={'inactive'}
                                    style={{ margin: 0 }}
                                    onClick={evt =>
                                        onStatusChange(record.key, record.status, evt.key)
                                    }
                                >
                                    Inactive
                                </Menu.Item>
                            </Menu>
                        }
                        placement="bottomLeft"
                        arrow
                    >
                        <Button
                            type="primary"
                            loading={loadUsers?.[record.key]}
                            icon={<EditOutlined />}
                        >
                            Change status
                        </Button>
                    </Dropdown>
                );
            },
        },
        {
            title: <Typography.Paragraph className="table-title">Join course</Typography.Paragraph>,
            dataIndex: 'course',
            render: (text: string, record: TableItem) => {
                return (
                    <Dropdown
                        placement="bottomLeft"
                        arrow
                        disabled={record.status === 'invited'}
                        overlay={
                            <Menu className="users-table-role-menu">
                                {courses.map(({ name, id, userIds = [] }) => {
                                    return (
                                        <Menu.Item
                                            key={id}
                                            style={{ margin: 0 }}
                                            onClick={evt =>
                                                addUserToCourse(evt.key, record, userIds)
                                            }
                                        >
                                            <Row justify="space-between">{name}</Row>
                                        </Menu.Item>
                                    );
                                })}
                            </Menu>
                        }
                    >
                        <Button type="primary" icon={<EditOutlined />}>
                            Add to course
                        </Button>
                    </Dropdown>
                );
            },
            sorter: (a: TableItem, b: TableItem) => a.name.localeCompare(b.name),
        },
    ];
    const goBack = useCallback(() => navigate(RoutePath.USER_BUSINESS), [navigate]);
    return (
        <Row justify="center">
            <Col flex={layout} style={{ marginTop: '60px' }}>
                <Col offset={1}>
                    <Row justify="space-between">
                        <Typography.Title level={1}>
                            {business?.name} business members table
                        </Typography.Title>

                        <Button
                            size="large"
                            ghost
                            type="link"
                            icon={<ArrowLeftOutlined />}
                            onClick={goBack}
                        >
                            Back
                        </Button>
                    </Row>
                </Col>
                <Table
                    className="table"
                    columns={columns as ColumnsType<TableItem>}
                    dataSource={data as TableItem[]}
                    pagination={false}
                    rowClassName="table-row"
                />
            </Col>
        </Row>
    );
}
