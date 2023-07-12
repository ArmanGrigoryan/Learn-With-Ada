import React, { useCallback } from 'react';
import { Row, Col, Typography, Button, Form, Input } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { RoutePath } from '../../routes/routes';
import { useDispatch, useSelector } from 'react-redux';
import { adminSelect, businessSelect, inviteUserToBusiness } from '../../redux';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { FormNames } from '../../utils/constants';

const UserBusinessInvite: React.FC = () => {
    const [formik] = Form.useForm();
    const id = useParams()['id'];
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const business = useSelector(businessSelect).businesses.find(each => each.id === id);
    const loading = useSelector(adminSelect).loading;
    const navigateHandler = useCallback(() => {
        navigate(RoutePath.USER_BUSINESS);
    }, [navigate]);
    const inviteHandler = useCallback(() => {
        const fields = formik.getFieldsValue();
        fields.userId = null;
        fields.businessId = id;
        fields.navigateHandler = navigateHandler;
        dispatch(inviteUserToBusiness(fields));
    }, [dispatch, formik, id, navigateHandler]);
    const goBack = useCallback(() => navigate(RoutePath.USER_BUSINESS), [navigate]);
    return (
        <Row justify={'center'} style={{ margin: '40px 0' }}>
            <Col flex={'45%'}>
                <Typography.Title level={1}>
                    {business?.name || 'Business name'} Invitation page
                </Typography.Title>
                <Form form={formik} layout="vertical" name={FormNames.BUSINESS_INVITE}>
                    <Row align="middle">
                        <Col span={16}>
                            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                                <Input placeholder="Enter email to invite" />
                            </Form.Item>
                        </Col>
                        <Col span={8} push={4}>
                            <Button
                                size="large"
                                ghost
                                type="link"
                                icon={<ArrowLeftOutlined />}
                                onClick={goBack}
                            >
                                Back
                            </Button>
                        </Col>
                    </Row>
                    <br />
                    <Row justify={'end'}>
                        <Button
                            type="primary"
                            form={FormNames.CREATE_GROUP}
                            htmlType={'submit'}
                            onClick={inviteHandler}
                            loading={loading}
                        >
                            Invite
                        </Button>
                    </Row>
                </Form>
            </Col>
        </Row>
    );
};

export default UserBusinessInvite;
