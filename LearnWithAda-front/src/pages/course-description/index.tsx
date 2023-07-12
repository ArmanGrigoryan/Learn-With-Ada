import { Button, Col, Grid, Row, Typography } from 'antd';
import React, { useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import BaseLayer, { DefaultThemeShadow } from '../../core/base-layer';
import TableUsers from '../../components/table-users';
import { useJwt } from 'react-jwt';
import { AuthDataKeys, RoleTypes } from '../../utils/constants';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { RoutePath } from '../../routes/routes';
import { DecodedToken } from '../../core/models/user';

const Course: React.FC = () => {
    const decodedToken = useJwt(localStorage.getItem(AuthDataKeys.ACCESS_TOKEN) || '')
        .decodedToken as DecodedToken;
    const screen = Grid.useBreakpoint();
    const location = useLocation();
    const navigate = useNavigate();
    const { courseId } = useParams();
    const { name } = location?.state as { name: string };
    const layout = screen.xl
        ? '60%'
        : screen.lg
        ? '60%'
        : screen.md
        ? '60%'
        : screen.sm
        ? '60%'
        : screen.xs
        ? '60%'
        : '100%';
    const onClickBack = useCallback(() => {
        navigate(RoutePath.DASHBOARD);
    }, [navigate]);
    if (decodedToken?.role === RoleTypes.USER) {
        return (
            <Row justify={'center'}>
                <Col className="topics-content">
                    <Typography.Title level={2} className="topics-content-header-text">
                        <b>No info to be shown</b>
                    </Typography.Title>
                </Col>
            </Row>
        );
    }
    return (
        <>
            <Row justify={'center'}>
                <Col className="topics-content">
                    <Typography.Title level={3} className="topics-content-header-text">
                        <b>{name}</b>
                    </Typography.Title>
                </Col>
            </Row>
            <Row justify={'center'}>
                <Col flex={layout}>
                    <Row>
                        <Col>
                            <Button
                                size={'large'}
                                icon={<ArrowLeftOutlined color={'green'} />}
                                onClick={onClickBack}
                                style={{ marginBottom: '20px' }}
                            ></Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            {decodedToken?.role !== RoleTypes.USER && (
                <Row justify="center">
                    <Col flex={layout}>
                        <BaseLayer
                            shadow={DefaultThemeShadow.shadow3}
                            className="courses-content-tabs"
                        >
                            {courseId && <TableUsers courseId={courseId} />}
                        </BaseLayer>
                    </Col>
                </Row>
            )}
        </>
    );
};
export default Course;
