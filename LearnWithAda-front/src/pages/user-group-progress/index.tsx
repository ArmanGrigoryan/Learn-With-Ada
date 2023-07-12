import React from 'react';
import {
    Table,
    Typography,
    Progress,
    Button,
    Modal,
    PageHeader,
    Col,
    Row,
    Statistic,
    Divider,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
    adminSelect,
    courseSelect,
    getUserPassedLessons,
    getUsers,
    groupSelect,
    userSelect,
} from '../../redux';
import { UserCourse, UserInterface } from '../../core/models/user';
import { useCallback, useState, useEffect } from 'react';
import { ColumnsType } from 'antd/lib/table/interface';
import { getGroupProgress } from '../../redux/actions/group.actions';
import {
    ColumnsUGP as Columns,
    CourseDataExtendedUGP as CourseDataExtended,
    GroupCreateData,
    TableItemUGP as TableItem,
    TableUsersPropsUGP as TableUsersProps,
} from '../../utils/interfaces';
import { useParams } from 'react-router-dom';

export default function UserGroupProgress({ singleCourse }: TableUsersProps) {
    const { groupId } = useParams();
    const { groups, loading, totalProgress } = useSelector(groupSelect);
    const group = groups.find(each => each.id == groupId) as GroupCreateData;
    const { users, loading: progressLoading } = useSelector(adminSelect);
    const courses = useSelector(courseSelect).courses;
    const groupUsers = [] as Array<UserInterface>;
    const groupCourses = [] as Array<CourseDataExtended>;
    group?.userIds?.forEach(each => {
        const user = users.find(item => item.id == each) as UserInterface;
        groupUsers.push(user);
    });
    group?.courseIds?.forEach(each => {
        const course = courses.find(item => item.id == each) as CourseDataExtended;
        groupCourses.push(course);
    });
    const idsForIteration = [] as Array<string>;
    const data = [] as Array<TableItem>;
    if (groupUsers.length > 0) {
        groupUsers?.forEach((user: UserInterface) => {
            groupCourses?.forEach(each => {
                const key = user?.id || Math.random();
                data.push({
                    id: user?.id,
                    key: key + (each?.id as string),
                    name: `${user?.firstName} ${user?.lastName}`,
                    progress: each?.status,
                    reminder: user?.id,
                    courseId: each?.id,
                    courseName: each?.name,
                });
            });
        });
    }
    const dispatch = useDispatch();
    const { revalidate } = useSelector(userSelect);
    const [userToRequest, setUserToRequest] = useState({});
    const { passedLessons = 0, totalLessons = 0 } =
        (users
            .find(item => item?.id === userToRequest)
            ?.courses?.find(item => item?.course === singleCourse) as UserCourse) || {};
    const passedPercent = Math.trunc((passedLessons * 100) / totalLessons);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isTotalModalVisible, setIsTotalModalVisible] = useState(false);
    const handleOk = () => {
        setIsModalVisible(false);
    };
    const handleCancel = () => {
        setIsTotalModalVisible(false);
    };
    users.map(({ id, firstName, lastName, role }) => {
        return {
            key: id,
            name: `${firstName} ${lastName}`,
            editRole: role,
            role,
        };
    });

    const showModal = async (courseId: string, key: string) => {
        setUserToRequest(key);
        await dispatch(getUserPassedLessons({ userId: key, courseId }));
        setIsModalVisible(true);
    };

    const getProgress = useCallback(
        async id => {
            await dispatch(getGroupProgress(id));
            setIsTotalModalVisible(true);
        },
        [dispatch],
    );

    const columns: Columns[] = [
        {
            title: <Typography.Paragraph className="table-title">User name</Typography.Paragraph>,
            dataIndex: 'name',
            render: (text: string) => <p>{text}</p>,
            sorter: (a: TableItem, b: TableItem) => a.name.localeCompare(b.name),
        },
        {
            title: <Typography.Paragraph className="table-title">Progress</Typography.Paragraph>,
            dataIndex: 'courseId',
            render: (courseId: string, record: TableItem) => {
                return (
                    <Button
                        type="primary"
                        shape="round"
                        loading={progressLoading}
                        onClick={() => showModal(courseId, record.id)}
                    >
                        See progress
                    </Button>
                );
            },
        },
        {
            title: <Typography.Paragraph className="table-title">Course name</Typography.Paragraph>,
            dataIndex: 'courseName',
            render: (text: string) => <p>{text}</p>,
            sorter: (a: TableItem, b: TableItem) => a.name.localeCompare(b.name),
        },
    ];

    useEffect(() => {
        if (revalidate) {
            dispatch(getUsers());
        }
    }, [revalidate, dispatch]);
    return (
        <>
            <Row justify="start">
                <Col flex={'75%'} offset={2}>
                    <Row justify="start">
                        <Col
                            offset={1}
                            style={{
                                marginTop: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-around',
                                width: '100%',
                            }}
                        >
                            <Typography.Title level={1}>
                                <b>{group?.name} progress table</b>
                            </Typography.Title>

                            <Button
                                type="primary"
                                shape="round"
                                onClick={() => getProgress(group?.id)}
                                style={{ padding: '0 25px' }}
                                loading={loading}
                            >
                                See total
                            </Button>
                        </Col>
                    </Row>
                    <Table
                        className="table"
                        columns={columns as ColumnsType<TableItem>}
                        dataSource={data}
                        pagination={false}
                        rowClassName="table-row"
                        key={Math.random()}
                    />
                    <Modal
                        title="User statistics"
                        visible={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleOk}
                    >
                        <PageHeader
                            className="site-page-header"
                            title={`Passed lessons    ${passedLessons} / ${totalLessons}`}
                        />
                        <Progress percent={passedPercent} />
                    </Modal>
                    <Modal
                        title="Total statistics"
                        visible={isTotalModalVisible}
                        onOk={handleCancel}
                        onCancel={handleCancel}
                    >
                        {totalProgress.length > 0 ? (
                            totalProgress.map(each => {
                                const started: number =
                                    each.progress === 'not started' ? each.userCount : 0;
                                const inProgress: number =
                                    each.progress === 'in progress' ? each.userCount : 0;
                                const completed: number =
                                    each.progress === 'completed' ? each.userCount : 0;
                                const courseName = groupCourses?.find(
                                    item => item.id == each.courseId,
                                )?.name;
                                idsForIteration.push(each.courseId);
                                return (
                                    <React.Fragment key={Math.random()}>
                                        {idsForIteration.includes(each.courseId) ? (
                                            <PageHeader
                                                className="site-page-header"
                                                title={`${courseName} course statistics`}
                                            />
                                        ) : (
                                            ''
                                        )}
                                        <Row justify="space-around">
                                            <Statistic title="Not started" value={started} />
                                            <Statistic title="In progress" value={inProgress} />
                                            <Statistic title="Completed" value={completed} />
                                            <Statistic title="Total users" value={each.maxCount} />
                                        </Row>
                                        <Divider />
                                    </React.Fragment>
                                );
                            })
                        ) : (
                            <h1>No progress yet!</h1>
                        )}
                    </Modal>
                </Col>
            </Row>
        </>
    );
}
