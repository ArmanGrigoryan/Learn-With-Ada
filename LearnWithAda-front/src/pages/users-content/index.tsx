import { Col, Grid, Row } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import BaseLayer, { DefaultThemeShadow } from '../../core/base-layer';
import TableUsers from '../../components/table-users';
import { useJwt } from 'react-jwt';
import { AuthDataKeys } from '../../utils/constants';
import './user-content.less';
import { DecodedToken } from '../../core/models/user';

const Users: React.FC = () => {
    const decodedToken = useJwt(localStorage.getItem(AuthDataKeys.ACCESS_TOKEN) || '')
        .decodedToken as DecodedToken;
    const screen = Grid.useBreakpoint();
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
    const { courseId } = useParams();
    return (
        <>
            {decodedToken?.role !== 'user' && (
                <Row justify="center">
                    <Col flex={layout}>
                        <BaseLayer
                            shadow={DefaultThemeShadow.shadow3}
                            className="courses-content-tabs"
                        >
                            {<TableUsers courseId={courseId} editUsers />}
                        </BaseLayer>
                    </Col>
                </Row>
            )}
        </>
    );
};
export default Users;
