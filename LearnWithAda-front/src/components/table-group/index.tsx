import { useCallback, useState } from 'react';
import { Table, Space, Button, Typography, Tooltip, Row, Col } from 'antd';
import type { TableProps } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { UserInterface } from '../../core/models/user';
import { adminSelect, courseSelect, groupSelect, lessonSelect } from '../../redux';
import { getTopicLessons, isGroupCourseAdded, isGroupUserAdded, noop } from '../../utils/helpers';
import classnames from 'classnames';
import { CourseData } from '../../core/models/course';
import type { ColumnsType, FilterValue } from 'antd/lib/table/interface';
import { DefaultThemeColors } from '../../utils/colors';
import { updateGroupUserCourse } from '../../redux/actions';
import { GroupTableProps, TableGroup, UpdateGroupUserCourse } from '../../utils/interfaces';
import { RoleTypes } from '../../utils/constants';

type TableItem = TableGroup & (UserInterface[] | CourseData[]);

const CurrentColumns = (isCourse: boolean, filteredInfo: Record<string, FilterValue | null>) => {
    const { lessons } = useSelector(lessonSelect);
    const columns = !isCourse
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
                      onEdit?: (action: string) => void;
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
                                  onClick={() => {
                                      (action.onEdit &&
                                          action.onEdit(!action?.isAdded ? `add` : `remove`)) ||
                                          noop();
                                  }}
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
                      action: {
                          isAdded?: boolean;
                          onEdit?: (action: string) => void;
                          loading: boolean;
                      },
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
                                      onClick={() => {
                                          (action.onEdit &&
                                              action.onEdit(!action?.isAdded ? `add` : `remove`)) ||
                                              noop();
                                      }}
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

export default function GroupTable({ group, isCourse = false }: GroupTableProps) {
    const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
    const { users: allUsers } = useSelector(adminSelect);
    const users = allUsers.filter(user => user.role !== RoleTypes.ADMIN);
    const { courses } = useSelector(courseSelect);
    const { loadCourses, loadUsers } = useSelector(groupSelect);
    const dispatch = useDispatch();
    const handleChange: TableProps<TableItem>['onChange'] = (_, filters) => {
        setFilteredInfo(filters);
    };
    const editCourse = useCallback(
        async ({ courseId, userId, action }) => {
            const id = group.id;
            const fields = {
                id,
                action,
                creator: group.creator,
                courseId,
                userId,
            } as UpdateGroupUserCourse;
            if (userId) {
                dispatch(updateGroupUserCourse(fields));
            } else {
                dispatch(updateGroupUserCourse(fields));
            }
        },
        [dispatch, group],
    );
    const data: UserInterface[] | CourseData[] = !isCourse
        ? users.map(({ id = '', firstName, lastName }: Partial<UserInterface>) => {
              const loading = loadUsers?.[id] as boolean;
              return {
                  key: id,
                  name: `${firstName?.trim() || 'test'} ${lastName?.trim() || 'user'}`,
                  action: {
                      isAdded: isGroupUserAdded(id, group),
                      loading,
                      onEdit(action: string) {
                          editCourse({ userId: id, action });
                      },
                  },
              };
          })
        : courses.map(({ id = '', name }: Partial<CourseData>) => {
              const loading = loadCourses?.[id] as boolean;
              return {
                  key: id,
                  name,
                  action: {
                      isAdded: isGroupCourseAdded(id, group),
                      loading,
                      onEdit(action: string) {
                          editCourse({ courseId: id, action });
                      },
                  },
              };
          });
    return (
        <Table
            className="table"
            columns={CurrentColumns(isCourse as boolean, filteredInfo) as ColumnsType<TableItem>}
            dataSource={data as TableItem[]}
            pagination={false}
            onChange={handleChange}
            rowClassName="table-row"
        />
    );
}
