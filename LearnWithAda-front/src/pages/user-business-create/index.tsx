import React, { useCallback } from 'react';
import { Row, Col, Button, Form, Input } from 'antd';
import { FormNames } from '../../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { createBusiness, updateBusiness } from '../../redux/actions';
import { useNavigate, useParams } from 'react-router-dom';
import { RoutePath } from '../../routes/routes';
import { RootState } from '../../redux';
import { ArrowLeftOutlined } from '@ant-design/icons';

const UserBusinessCreate: React.FC = () => {
    const [formik] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const id = useParams().id;
    const { businesses, loading } = useSelector((state: RootState) => state.business);
    const business = businesses.find(item => item.id == id);
    const navigateHandler = useCallback(() => {
        navigate(RoutePath.USER_BUSINESS);
    }, [navigate]);
    const onBusinessAddUpdate = useCallback(() => {
        const fields = formik.getFieldsValue();
        fields.navigateHome = navigateHandler;
        if (id) {
            fields.action = 'rename';
            fields.id = business?.id;
            dispatch(updateBusiness(fields));
        } else {
            dispatch(createBusiness(fields));
        }
    }, [formik, dispatch, navigateHandler, id, business?.id]);
    const goBack = useCallback(() => navigate(RoutePath.USER_BUSINESS), [navigate]);
    return (
        <>
            <Row justify={'center'} style={{ margin: '40px 0' }}>
                <Col flex={'45%'}>
                    <Form
                        encType="multipart/form-data"
                        form={formik}
                        layout="vertical"
                        name={FormNames.ADD_COURSE}
                        initialValues={{
                            name: business?.name,
                            creator:
                                localStorage.getItem('firstName') +
                                ' ' +
                                localStorage.getItem('lastName'),
                        }}
                    >
                        <Row align="middle">
                            <Col span={16}>
                                <Form.Item
                                    name="name"
                                    label="Business name"
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="Enter name" />
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
                                onClick={onBusinessAddUpdate}
                                loading={loading}
                            >
                                {`${!id ? 'Add' : 'Edit'} business`}
                            </Button>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default UserBusinessCreate;
