import { Table, Space, Button, Typography } from 'antd';
import { useCallback } from 'react';
import type { ColumnsType } from 'antd/lib/table/interface';
import { useNavigate } from 'react-router-dom';
import {
    CourseTablePropsTL as CourseTableProps,
    TableItemTL as TableItem,
} from '../../utils/interfaces';
import { ArrowRightOutlined } from '@ant-design/icons';
import { AuthDataKeys } from '../../utils/constants';

const CurrentColumns = () => {
    const navigate = useNavigate();
    const onTakeAssessment = useCallback(
        id => {
            navigate(`/lesson-assessment/${id}`);
        },
        [navigate],
    );
    const onInfoClick = useCallback(
        (lessonId, topicId) => {
            navigate(`/topic/${topicId}/lesson/${lessonId}`);
        },
        [navigate],
    );
    const columns = [
        {
            title: <Typography.Paragraph className="table-title">Name</Typography.Paragraph>,
            dataIndex: 'name',
            render: (text: string) => <p>{text}</p>,
            sorter: (a: TableItem, b: TableItem) => a?.name?.localeCompare(b?.name as string),
        },
        {
            title: <Typography.Paragraph className="table-title">Action</Typography.Paragraph>,
            dataIndex: 'action',
            render: (action: string) => {
                return (
                    <Space size="middle">
                        <Button
                            type="primary"
                            style={{ borderRadius: '8px' }}
                            onClick={() => onTakeAssessment(action)}
                        >
                            Take assessment
                        </Button>
                    </Space>
                );
            },
        },
        {
            title: <Typography.Paragraph className="table-title">Info</Typography.Paragraph>,
            dataIndex: 'info',
            render: (action: string, record: TableItem) => {
                return (
                    <Space size="middle">
                        <Button
                            type="primary"
                            ghost
                            style={{ borderRadius: '8px' }}
                            onClick={() => onInfoClick(record.key, record.topicId)}
                        >
                            More <ArrowRightOutlined />
                        </Button>
                    </Space>
                );
            },
        },
    ];
    return columns;
};

export default ({ lessons }: CourseTableProps) => {
    const data = lessons?.map(({ id, topicId, createdByUserId }) => {
        const userId = localStorage.getItem(AuthDataKeys.USER_ID);
        const isOwn = createdByUserId === userId;
        return {
            key: id,
            name: 'Sample name',
            action: id,
            topicId: topicId as string,
            isOwn: isOwn as boolean,
        };
    });
    return (
        <Table
            className="table"
            columns={CurrentColumns() as ColumnsType<TableItem>}
            dataSource={data}
            pagination={false}
            rowClassName="table-row"
        />
    );
};
