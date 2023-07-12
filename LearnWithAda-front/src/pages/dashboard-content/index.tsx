import React, { useCallback, useMemo } from 'react';
import {
    Card,
    Col,
    Menu,
    Row,
    Skeleton,
    Typography,
    Input,
    Rate,
    Dropdown,
    Space,
    Button,
    Tooltip,
} from 'antd';
import './dashboard-content.less';
import { DownOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { getCourses, courseSelect } from '../../redux';
import { useNavigate } from 'react-router-dom';
import Meta from 'antd/lib/card/Meta';
const menuItems = [
    {
        key: 'most populate',
        label: 'Most populate',
    },
    {
        key: 'nighest rated',
        label: 'Highest rated',
    },
    {
        key: 'newest',
        label: 'Newest',
    },
];
const delayedTimeOfOnChange = 1000;
const SideBar: React.FC = () => {
    const navigate = useNavigate();
    const { courses } = useSelector(courseSelect);
    const dispatch = useDispatch();
    const onDetailsClick = useCallback(
        (id: string, name: string) => {
            navigate(`/single-course/${id}`, { state: { name } });
        },
        [navigate],
    );
    const onSort = useCallback(
        ({ key }) => {
            dispatch(getCourses(`?sort=${key}`));
        },
        [dispatch],
    );
    const debouncedChangeHandler = useMemo(
        () =>
            debounce(e => dispatch(getCourses(`?search=${e.target.value}`)), delayedTimeOfOnChange),
        [dispatch],
    );
    return (
        <>
            <Row justify={'start'}>
                <Col span={6}>
                    <Input onChange={debouncedChangeHandler} placeholder={'Type to search'} />
                </Col>
                <Col>
                    <Dropdown
                        overlay={
                            <Menu className="dashboard-menu">
                                {menuItems.map(({ key, label }) => (
                                    <Menu.Item key={key} onClick={onSort}>
                                        {label}
                                    </Menu.Item>
                                ))}
                            </Menu>
                        }
                    >
                        <a onClick={e => e.preventDefault()}>
                            <Space style={{ marginLeft: '10px' }}>
                                Sort by
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                </Col>
            </Row>
            <Row justify={'center'}>
                <Col>
                    <Typography.Title level={3} className="topics-content-header-text">
                        <b> Courses to get you started</b>
                    </Typography.Title>
                </Col>
            </Row>
            <Row gutter={80} justify={'center'}>
                {courses.length > 0 &&
                    courses.map(({ id, name, price, currentPrice, description, logo }) => {
                        const isCurrPrice = Boolean(currentPrice) && currentPrice != 0;
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
                                            <Row justify={'center'} color="green">
                                                <Button
                                                    type="link"
                                                    ghost
                                                    onClick={() =>
                                                        id && name && onDetailsClick(id, name)
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
                                            style={{ paddingBottom: '0px', background: 'red' }}
                                        >
                                            <Meta
                                                title={name}
                                                description={
                                                    <>
                                                        <Row
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                            }}
                                                        >
                                                            <Rate
                                                                allowHalf
                                                                defaultValue={2.5}
                                                                style={{
                                                                    fontSize: '17px',
                                                                }}
                                                            />
                                                            <Typography.Text
                                                                style={{ fontSize: '25px' }}
                                                                type="danger"
                                                            >
                                                                {isCurrPrice ? currentPrice : price}
                                                                $
                                                            </Typography.Text>
                                                        </Row>
                                                        {
                                                            <Row
                                                                justify="end"
                                                                style={{
                                                                    textAlign: 'right',
                                                                    position: 'absolute',
                                                                    right: '20px',
                                                                }}
                                                            >
                                                                <Typography.Text
                                                                    delete={isCurrPrice}
                                                                    style={{
                                                                        fontSize: '13px',
                                                                        marginRight: '10px',
                                                                    }}
                                                                >
                                                                    {isCurrPrice
                                                                        ? price + '$'
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
                    })}
            </Row>
        </>
    );
};
export default SideBar;
