import { Table, Space, Button, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCourse, courseSelect } from '../../redux';
import classnames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { EditFilled, DeleteFilled } from '@ant-design/icons';
import { useCallback, useState } from 'react';
import ModalConfirm from '../modal-confirm';
import { CourseData } from '../../core/models/course';
import { ColumnsType } from 'antd/lib/table';
import { TableItemTCC as TableItem } from '../../utils/interfaces';
import { AuthDataKeys, RoleTypes } from '../../utils/constants';
import '../table-courses/table-courses.less';

export default function TableCourseContent() {
    const { courses: allCourses } = useSelector(courseSelect);
    const userId = localStorage.getItem(AuthDataKeys.USER_ID);
    const role = localStorage.getItem(AuthDataKeys.ROLE);
    const courses =
        role !== RoleTypes.ADMIN
            ? allCourses.filter(each => each.createdByUserId == userId)
            : allCourses;
    const [visible, setVisible] = useState(false);
    const [course, setCourse] = useState<CourseData>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const data = courses.map(({ name, id }) => ({
        key: id,
        name,
        user: id,
        topic: id,
        courseId: id,
    }));
    const onEditTopicClick = useCallback(
        (id: string) => {
            navigate(`/course-edit/${id}`);
        },
        [navigate],
    );
    const onDeleteClick = useCallback(
        (courseId: string) => {
            const course = courses.find(({ id }) => id === courseId);
            course && setCourse(course);
            setVisible(true);
        },
        [courses],
    );
    const onDeleteCourse = useCallback(() => {
        course?.id && dispatch(deleteCourse(course.id));
        setVisible(false);
    }, [course?.id, dispatch]);
    const columns = [
        {
            title: <Typography.Paragraph className="table-title">Course name</Typography.Paragraph>,
            dataIndex: 'name',
            render: (text: string) => <p>{text}</p>,
            sorter: (a: TableItem, b: TableItem) => {
                if (a.name && b.name) {
                    return a.name.localeCompare(b.name);
                }
            },
        },
        {
            title: <Typography.Paragraph className="table-title">Add user</Typography.Paragraph>,
            dataIndex: 'user',
            render: (courseId: string) => {
                const classes = classnames({
                    [`table-action-button`]: true,
                    [`table-action-button-confirm`]: true,
                });
                return (
                    <Space size="middle">
                        <Button onClick={() => navigate(`/course/${courseId}`)} className={classes}>
                            Add User
                        </Button>
                    </Space>
                );
            },
        },
        {
            title: <Typography.Paragraph className="table-title">Add topic</Typography.Paragraph>,
            dataIndex: 'topic',
            render: (courseId: string) => {
                const classes = classnames({
                    [`table-action-button`]: true,
                    [`table-action-button-confirm`]: true,
                });
                return (
                    <Space size="middle">
                        <Button onClick={() => navigate(`/course/${courseId}`)} className={classes}>
                            Add Topic
                        </Button>
                    </Space>
                );
            },
        },
        {
            title: <Typography.Paragraph className="table-title">Actions</Typography.Paragraph>,
            dataIndex: 'courseId',
            render: (courseId: string) => {
                return (
                    <Space size="middle">
                        <EditFilled
                            className="topic-collapse-content-header-actions-button-item"
                            onClick={() => onEditTopicClick(courseId)}
                        />
                        <DeleteFilled
                            className="topic-collapse-content-header-actions-button-item"
                            onClick={() => onDeleteClick(courseId)}
                        />
                    </Space>
                );
            },
        },
    ];
    return (
        <>
            <Table
                className="table"
                columns={columns as ColumnsType<TableItem>}
                dataSource={data}
                pagination={false}
                rowClassName="table-row"
            />
            <ModalConfirm
                visible={visible}
                onCancel={setVisible}
                submitHandler={onDeleteCourse}
                name={course?.name || ''}
                type={'course'}
            />
        </>
    );
}
