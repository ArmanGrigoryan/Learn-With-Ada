import { Grid, Row, Col, Typography, Descriptions, PageHeader } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BaseLayer, { DefaultThemeShadow } from '../../core/base-layer';
import { getUserInvitedBusinesses, userSelect } from '../../redux';

const UserInvitedBusinesses: React.FC = () => {
    const { businesses } = useSelector(userSelect);
    const screen = Grid.useBreakpoint();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getUserInvitedBusinesses());
    }, [dispatch]);
    return (
        <>
            <Row justify={'center'}>
                <Col className="topics-content">
                    <Typography.Title level={2} className="topics-content-header-text">
                        <b>Invited businesses</b>
                    </Typography.Title>
                </Col>
            </Row>
            <Row justify={'center'}></Row>
            <Row justify="center">
                <Col
                    flex={
                        screen.xl
                            ? '50%'
                            : screen.lg
                            ? '60%'
                            : screen.md
                            ? '80%'
                            : screen.sm
                            ? '80%'
                            : '100%'
                    }
                >
                    <BaseLayer shadow={DefaultThemeShadow.shadow3} className="courses-content-tabs">
                        <Row justify={'space-around'}>
                            {businesses.length > 0 ? (
                                businesses.map(each => {
                                    return (
                                        <PageHeader
                                            className="site-page-header"
                                            title={`Business name: ${each?.name}`}
                                            style={{ justifyContent: 'space-between' }}
                                            key={each?.id}
                                        >
                                            <Descriptions size="middle">
                                                <Descriptions.Item label="Description" span={2}>
                                                    Some description of business
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Inviter" span={2}>
                                                    {each?.inviter}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Members count">
                                                    {each?.membersCount}
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </PageHeader>
                                    );
                                })
                            ) : (
                                <Typography.Paragraph className="topics-content-header-text">
                                    No available businesses
                                </Typography.Paragraph>
                            )}
                        </Row>
                    </BaseLayer>
                </Col>
            </Row>
        </>
    );
};

export default UserInvitedBusinesses;
