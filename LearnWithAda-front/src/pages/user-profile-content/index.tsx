import { Button, Card, Col, Grid, Rate, Row, Skeleton, Tooltip, Typography } from 'antd';
import Meta from 'antd/lib/card/Meta';
import React, { useCallback, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FolderAddOutlined } from '@ant-design/icons';
import { getNewNotifications, courseSelect } from '../../redux';
import { RoutePath } from '../../routes/routes';
import { DecodedToken } from '../../core/models/user';
import { AuthDataKeys, RoleTypes } from '../../utils/constants';
import { useJwt } from 'react-jwt';

const UserProfileContent: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { courses } = useSelector(courseSelect);
    useEffect(() => {
        dispatch(getNewNotifications());
    }, [dispatch]);
    const onDetailsClick = useCallback(
        (id: string, name: string, createdByUserId: string) => {
            const userId = localStorage.getItem(AuthDataKeys.USER_ID);
            if (userId == createdByUserId) navigate(`/single-course/${id}`, { state: { name } });
        },
        [navigate],
    );
    const screen = Grid.useBreakpoint();
    const decodedToken = useJwt(localStorage.getItem(AuthDataKeys.ACCESS_TOKEN) || '')
        .decodedToken as DecodedToken;
    return (
        <>
            {decodedToken?.role !== RoleTypes.USER && (
                <Row justify="start">
                    <Col className="topics-content" offset={8} span={8}>
                        <Typography.Title
                            level={1}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'bottom',
                                marginTop: '50px',
                            }}
                        >
                            <Typography.Paragraph>
                                <b>Add Course</b>
                                <Button
                                    type="default"
                                    icon={<FolderAddOutlined />}
                                    onClick={() => navigate(RoutePath.COURSE_CREATE)}
                                    style={{ margin: '0 50px', padding: '0 25px' }}
                                >
                                    Add
                                </Button>
                            </Typography.Paragraph>
                        </Typography.Title>
                    </Col>
                </Row>
            )}
            {courses?.length > 0 ? (
                <>
                    <Row justify={'center'}>
                        <Col className="courses-content">
                            <Typography.Title level={3} style={{ paddingBottom: '40px' }}>
                                <b>Courses</b>
                            </Typography.Title>
                        </Col>
                    </Row>
                    <Row justify="center">
                        <Col
                            flex={
                                screen.xl
                                    ? '80%'
                                    : screen.lg
                                    ? '80%'
                                    : screen.md
                                    ? '60%'
                                    : screen.sm
                                    ? '60%'
                                    : screen.xs
                                    ? '60%'
                                    : '100%'
                            }
                        >
                            <Row gutter={80} justify={'center'}>
                                {courses.length > 0 &&
                                    courses.map(
                                        ({
                                            id,
                                            name,
                                            price,
                                            currentPrice,
                                            description,
                                            logo,
                                            createdByUserId,
                                        }) => {
                                            const isCurrPrice =
                                                Boolean(currentPrice) && currentPrice != 0;
                                            return (
                                                <Tooltip
                                                    title={description || 'Some description'}
                                                    arrowPointAtCenter
                                                    key={id}
                                                >
                                                    <Col>
                                                        <Card
                                                            key={id}
                                                            hoverable
                                                            style={{
                                                                width: 240,
                                                                margin: 16,
                                                            }}
                                                            cover={
                                                                <img
                                                                    alt="Education-online-training-courses-image"
                                                                    src={logo}
                                                                    width={250}
                                                                    height={250}
                                                                />
                                                            }
                                                            actions={[
                                                                <Row
                                                                    justify={'center'}
                                                                    color="green"
                                                                >
                                                                    <Button
                                                                        type="link"
                                                                        ghost
                                                                        onClick={() =>
                                                                            onDetailsClick(
                                                                                id as string,
                                                                                name as string,
                                                                                createdByUserId as string,
                                                                            )
                                                                        }
                                                                    >
                                                                        More info...
                                                                    </Button>
                                                                    <Button
                                                                        style={{
                                                                            display: 'inline-flex',
                                                                            alignItems: 'center',
                                                                            padding: '20px',
                                                                            marginLeft: '10px',
                                                                            fontSize: '22px',
                                                                        }}
                                                                        shape="round"
                                                                        type="primary"
                                                                        ghost
                                                                    >
                                                                        Buy
                                                                    </Button>
                                                                </Row>,
                                                            ]}
                                                        >
                                                            <Skeleton
                                                                loading={false}
                                                                active
                                                                style={{
                                                                    paddingBottom: '0px',
                                                                    background: 'red',
                                                                }}
                                                            >
                                                                <Meta
                                                                    title={name}
                                                                    description={
                                                                        <>
                                                                            <Row
                                                                                style={{
                                                                                    display: 'flex',
                                                                                    justifyContent:
                                                                                        'space-between',
                                                                                    alignItems:
                                                                                        'center',
                                                                                }}
                                                                            >
                                                                                <Rate
                                                                                    allowHalf
                                                                                    defaultValue={
                                                                                        2.5
                                                                                    }
                                                                                    style={{
                                                                                        fontSize:
                                                                                            '17px',
                                                                                    }}
                                                                                />
                                                                                <Typography.Text
                                                                                    style={{
                                                                                        fontSize:
                                                                                            '25px',
                                                                                    }}
                                                                                    type="danger"
                                                                                >
                                                                                    {isCurrPrice
                                                                                        ? currentPrice
                                                                                        : price}
                                                                                    $
                                                                                </Typography.Text>
                                                                            </Row>
                                                                            {
                                                                                <Row
                                                                                    justify="end"
                                                                                    style={{
                                                                                        textAlign:
                                                                                            'right',
                                                                                        position:
                                                                                            'absolute',
                                                                                        right: '20px',
                                                                                    }}
                                                                                >
                                                                                    <Typography.Text
                                                                                        delete={
                                                                                            isCurrPrice
                                                                                        }
                                                                                        style={{
                                                                                            fontSize:
                                                                                                '13px',
                                                                                            marginRight:
                                                                                                '10px',
                                                                                        }}
                                                                                    >
                                                                                        {isCurrPrice
                                                                                            ? price +
                                                                                              '$'
                                                                                            : null}
                                                                                    </Typography.Text>
                                                                                </Row>
                                                                            }
                                                                        </>
                                                                    }
                                                                />
                                                            </Skeleton>
                                                        </Card>
                                                    </Col>
                                                </Tooltip>
                                            );
                                        },
                                    )}
                            </Row>
                        </Col>
                    </Row>
                </>
            ) : (
                <Row justify="center" style={{ marginTop: '30px' }}>
                    <Col>
                        <Typography.Title level={3}>You have no courses yet!</Typography.Title>
                    </Col>
                </Row>
            )}
        </>
    );
};

export default memo(UserProfileContent);
