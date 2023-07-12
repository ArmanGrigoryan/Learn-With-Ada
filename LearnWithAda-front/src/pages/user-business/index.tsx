import React, { useCallback } from 'react';
import { Row, Col, Typography, Button, Descriptions, PageHeader } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from '../../routes/routes';
import { useDispatch, useSelector } from 'react-redux';
import { adminSelect, businessSelect, deleteBusiness, setMemberLoading } from '../../redux';
import { EditOutlined, DeleteOutlined, EllipsisOutlined, UserOutlined } from '@ant-design/icons';

const UserBusiness: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { businesses, loadUsers } = useSelector(businessSelect);
    const { users } = useSelector(adminSelect);
    const clickHandler = useCallback(() => {
        navigate(RoutePath.USER_BUSINESS_CREATE);
    }, [navigate]);
    const updateHandler = useCallback(
        id => {
            navigate(`${RoutePath.USER_BUSINESS_CREATE}/${id}`);
        },
        [navigate],
    );
    const deleteHandler = useCallback(
        id => {
            dispatch(setMemberLoading({ id: id }));
            dispatch(deleteBusiness(id));
        },
        [dispatch],
    );
    const inviteHandler = useCallback(
        id => {
            navigate(`${id}/invite`);
        },
        [navigate],
    );
    const navigateHandler = useCallback(
        id => {
            navigate(`${id}/info`);
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
                        <b>Your businesses</b>
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
                    {businesses.length > 0 ? (
                        businesses.map(each => {
                            const dupUserNames = [] as Array<string>;
                            each.members &&
                                each.members.forEach(item => {
                                    const user = users.find(user => user.id === item.userId);
                                    const firstName = user?.firstName.trim() || 'Invited';
                                    const lastName = user?.lastName.trim() || 'user';
                                    dupUserNames.push(firstName + ' ' + lastName);
                                });
                            const userNames = Array.from(new Set(dupUserNames));
                            return (
                                <PageHeader
                                    className="site-page-header"
                                    onBack={() => window.history.back()}
                                    title={each.name}
                                    extra={[
                                        <Button
                                            key="2"
                                            icon={<EditOutlined />}
                                            onClick={() => updateHandler(each.id)}
                                        >
                                            Update
                                        </Button>,
                                        <Button
                                            key="1"
                                            type="primary"
                                            icon={<DeleteOutlined />}
                                            loading={loadUsers[each.id]}
                                            onClick={() => deleteHandler(each.id)}
                                        >
                                            Delete
                                        </Button>,
                                        <Button
                                            key="3"
                                            icon={<UserOutlined />}
                                            onClick={() => inviteHandler(each.id)}
                                        >
                                            Invite
                                        </Button>,
                                        <Button
                                            key="4"
                                            type="primary"
                                            icon={<EllipsisOutlined />}
                                            onClick={() => navigateHandler(each.id)}
                                        >
                                            More
                                        </Button>,
                                    ]}
                                    key={each.id}
                                >
                                    <Descriptions size="middle">
                                        <Descriptions.Item label="More info">
                                            Some description
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Invited users">
                                            {userNames.length > 0 ? userNames.join(', ') : 'None'}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </PageHeader>
                            );
                        })
                    ) : (
                        <Row justify="center" style={{ marginTop: '30px' }}>
                            <Col>
                                <Typography.Title level={3}>No businesses yet!</Typography.Title>
                            </Col>
                        </Row>
                    )}
                </Col>
            </Row>
        </>
    );
};

export default UserBusiness;
