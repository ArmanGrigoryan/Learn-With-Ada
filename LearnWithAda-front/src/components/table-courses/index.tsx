import { Table, Space, Button, Typography, Tooltip, Row, Col } from 'antd';
import type { TableProps } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { UserInterface } from '../../core/models/user';
import {
    adminSelect,
    courseSelect,
    lessonSelect,
    onAddTopicEnableLoading,
    onAddUserEnableLoading,
    topicSelect,
    updateCourseAddUserTopic,
} from '../../redux';
import { getTopicLessons, isTopicAdded, isUserInvited, noop } from '../../utils/helpers';
import classnames from 'classnames';
import './table-courses.less';
import { useCallback, useState } from 'react';
import { CourseData } from '../../core/models/course';
import { TopicData } from '../../core/models/topic';
import type { ColumnsType, FilterValue } from 'antd/lib/table/interface';
import { DefaultThemeColors } from '../../utils/colors';
import { CourseTableProps, TableItemTC } from '../../utils/interfaces';
import { AuthDataKeys, RoleTypes } from '../../utils/constants';

type TableItem = TableItemTC & { dataSource: UserInterface[] | TopicData[] };

const CurrentColumns = (isTopic: boolean, filteredInfo: Record<string, FilterValue | null>) => {
    const { lessons } = useSelector(lessonSelect);
    const columns = !isTopic
        ? [
              {
                  title: <Typography.Paragraph className="table-title">Name</Typography.Paragraph>,
                  dataIndex: 'name',
                  render: (text: string) => <p>{text}</p>,
                  sorter: (a: TableItem, b: TableItem) => a.name.localeCompare(b.name),
                  filters: [
                      {
                          text: 'Invited',
                          value: true,
                      },
                  ],
                  filteredValue: filteredInfo.name || null,
                  onFilter: (value: string, record: TableItem) => record.action.isAdded,
              },
              {
                  title: (
                      <Typography.Paragraph className="table-title">Action</Typography.Paragraph>
                  ),
                  dataIndex: 'action',
                  render: (action: {
                      isAdded?: boolean;
                      onEdit?: () => void;
                      loading: boolean;
                  }) => {
                      const classes = classnames({
                          [`table-action-button`]: true,
                          [`table-action-button-${!action?.isAdded ? 'confirm' : 'cancel'}`]: true,
                      });
                      return (
                          <Space size="middle">
                              <Button
                                  loading={action?.loading}
                                  className={classes}
                                  onClick={action?.onEdit || noop}
                              >
                                  {!action?.isAdded ? `Invite` : `Remove`}
                              </Button>
                          </Space>
                      );
                  },
              },
          ]
        : [
              {
                  title: <Typography.Paragraph className="table-title">Name</Typography.Paragraph>,
                  dataIndex: 'name',
                  render: (text: string) => <p>{text}</p>,
                  sorter: (a: TableItem, b: TableItem) => a.name.localeCompare(b.name),
                  filters: [
                      {
                          text: 'Added',
                          value: true,
                      },
                  ],
                  filteredValue: filteredInfo.name || null,
                  onFilter: (value: string, record: TableItem) => record.action.isAdded,
              },
              {
                  title: (
                      <Typography.Paragraph className="table-title">Action</Typography.Paragraph>
                  ),
                  dataIndex: 'action',
                  render: (
                      action: { isAdded?: boolean; onEdit?: () => void; loading: boolean },
                      record: TableItem,
                  ) => {
                      const classes = classnames({
                          [`table-action-button`]: true,
                          [`table-action-button-${!action?.isAdded ? 'confirm' : 'cancel'}`]: true,
                      });
                      return (
                          <Space size="middle">
                              <Tooltip
                                  overlay={
                                      <>
                                          <Typography.Title level={5}>Lessons</Typography.Title>
                                          <Row gutter={16}>
                                              {record.key &&
                                              getTopicLessons(record.key, lessons)?.length ? (
                                                  getTopicLessons(record.key, lessons).map(
                                                      ({ instruction, id }) => (
                                                          <Col key={id}>
                                                              <Typography.Paragraph
                                                                  style={{
                                                                      color: DefaultThemeColors.white,
                                                                  }}
                                                              >
                                                                  {instruction[0]?.instruction}
                                                              </Typography.Paragraph>
                                                          </Col>
                                                      ),
                                                  )
                                              ) : (
                                                  <Col>
                                                      <Typography.Paragraph
                                                          style={{
                                                              color: DefaultThemeColors.white,
                                                          }}
                                                      >
                                                          No lessons
                                                      </Typography.Paragraph>
                                                  </Col>
                                              )}
                                          </Row>
                                      </>
                                  }
                                  overlayClassName=""
                                  placement="right"
                              >
                                  <Button
                                      loading={action?.loading}
                                      className={classes}
                                      onClick={action.onEdit || noop}
                                  >
                                      {!action?.isAdded ? `Add` : `Remove`}
                                  </Button>
                              </Tooltip>
                          </Space>
                      );
                  },
              },
          ];
    return columns;
};

export default function TableCourses({ courseId = '', isTopic = false }: CourseTableProps) {
    const dispatch = useDispatch();
    const userId = localStorage.getItem(AuthDataKeys.USER_ID);
    const role = localStorage.getItem(AuthDataKeys.ROLE);
    const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
    const { users: allUsers } = useSelector(adminSelect);
    const adminId = allUsers.find(user => user.role === RoleTypes.ADMIN)?.id;
    let users = allUsers.filter(user => user.role !== RoleTypes.ADMIN);
    const { courses, loadUsers, loadTopics } = useSelector(courseSelect);
    let { topics } = useSelector(topicSelect);
    if (role !== RoleTypes.ADMIN) {
        topics = topics.filter(each => each.createdByUserId == userId);
        users = [];
    }
    const course = courses.find(course => course.id == courseId);
    const handleChange: TableProps<TableItem>['onChange'] = (_, filters) => {
        setFilteredInfo(filters);
    };
    const editCourse = useCallback(
        (courseData: CourseData, type: boolean, userId: string, topicId: string) => {
            const action = type ? 'add' : 'remove';
            userId
                ? dispatch(onAddUserEnableLoading({ courseId: courseData.id, userId }))
                : dispatch(onAddTopicEnableLoading({ courseId: courseData.id, topicId }));
            dispatch(updateCourseAddUserTopic({ ...courseData, action, adminId }));
        },
        [dispatch, adminId],
    );
    const data: Partial<TableItem>[] = !isTopic
        ? users.map(({ id = '', firstName, lastName }: Partial<UserInterface>) => {
              const loading: boolean = loadUsers?.[id];
              const isAdded = isUserInvited(id, course);
              return {
                  key: id,
                  name: `${firstName} ${lastName}` as string,
                  action: {
                      isAdded,
                      loading,
                      onEdit() {
                          editCourse({ userIds: id, id: courseId }, !isAdded, id as string, '');
                      },
                  },
              };
          })
        : topics.map(({ id = '', name }: Partial<TopicData>) => {
              const loading = loadTopics?.[id];
              const isAdded = isTopicAdded(id, course);
              return {
                  key: id,
                  name: name as string,
                  action: {
                      isAdded,
                      loading,
                      onEdit() {
                          editCourse({ topicIds: id, id: courseId }, !isAdded, '', id);
                      },
                  },
              };
          });
    return (
        <Table
            className="table"
            columns={CurrentColumns(isTopic, filteredInfo) as ColumnsType<TableItem>}
            dataSource={data as TableItem[]}
            pagination={false}
            onChange={handleChange}
            rowClassName="table-row"
        />
    );
}
