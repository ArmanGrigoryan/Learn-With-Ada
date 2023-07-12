import React, { useState } from 'react';
import { Typography, Button, Form, Input, Col } from 'antd';
import { Link } from 'react-router-dom';
import { RoutePath } from '../../routes/routes';
import { useForm } from 'antd/es/form/Form';
import { FormNames, UserStoreDataKeys } from '../../utils/constants';
import logo from '../../assets/images/sign-in-image.png';
import './forgot-password.less';

export function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [form] = useForm();
    return (
        <Col className="forgot-container">
            <Col className="forgot-container__left">
                <Col>
                    <Typography.Title level={1}>LOGO.</Typography.Title>
                    <Col className="forgot-container__left__img">
                        <img src={logo} />
                        <Col className="forgot-container__left__img__progress">
                            <Col className="forgot-container__left__img__progress__above"></Col>
                            <Col className="forgot-container__left__img__progress__below"></Col>
                        </Col>
                    </Col>
                </Col>
            </Col>
            <Col className="forgot-container__right">
                <Col className="forgot-container__right__first">
                    <Typography.Paragraph className="forgot-container__right__first__signup">
                        <Typography.Paragraph>Not registered yet?</Typography.Paragraph>
                        <Link to={RoutePath.SIGNUP}>Sign Up</Link>
                    </Typography.Paragraph>
                </Col>
                <Col className="forgot-container__right__second">
                    <Typography.Title level={1}>Restore an access</Typography.Title>
                    <Form name={FormNames.FORGOT_PASS} className="sign-in-content-form" form={form}>
                        <Typography.Paragraph className="forgot-container__right__second__emailLabel">
                            E-mail
                        </Typography.Paragraph>
                        <Form.Item
                            className="forgot-container__right__second__email"
                            name={UserStoreDataKeys.EMAIL}
                        >
                            <Input
                                placeholder="Enter your working email"
                                required
                                value={email}
                                onChange={evt => setEmail(evt.target.value)}
                            />
                        </Form.Item>
                        <Button
                            id="submitBtn"
                            htmlType="submit"
                            disabled={email.length < 7}
                            form={FormNames.SIGN_IN}
                        >
                            Reset password
                        </Button>
                    </Form>
                </Col>
                <Col className="forgot-container__right__footer">
                    <Typography.Paragraph className="forgot-container__right__footer">
                        By signing up you agree with{' '}
                        <Typography.Link
                            className="underline"
                            href={'https://google.com'}
                            target={'_blank'}
                        >
                            Terms of Service
                        </Typography.Link>{' '}
                        and{' '}
                        <Typography.Link
                            className="underline"
                            href={'https://google.com'}
                            target={'_blank'}
                        >
                            Privacy Policy
                        </Typography.Link>
                    </Typography.Paragraph>
                </Col>
            </Col>
        </Col>
    );
}

export default ForgotPassword;
