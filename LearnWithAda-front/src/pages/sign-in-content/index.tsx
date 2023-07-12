import React, { useEffect, useState } from 'react';
import { Typography, Button, Form, Input, Col } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import Password from 'antd/es/input/Password';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RoutePath } from '../../routes/routes';
import { useForm } from 'antd/es/form/Form';
import { FormNames, UserStoreDataKeys } from '../../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { authSelect, clearEmailError, clearPasswordError } from '../../redux/store/reducers/auth';
import { getUrlParams } from '../../utils/helpers';
import logo from '../../assets/images/sign-in-image.png';
import './sign-in-content.less';
import { DefaultThemeColors } from '../../utils/colors';

export function SignInContent() {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form] = useForm();
    const passwordErrorText = useSelector(authSelect).passwordErrorText;
    if (location.search.indexOf('item') > -1) {
        const { item, status } = getUrlParams(location.search);
        sessionStorage.setItem(UserStoreDataKeys.INVITED, item);
        if (status === 'signup') navigate(RoutePath.SIGNUP + `/${item}?status=${status}`);
    }
    useEffect(() => {
        return () => {
            dispatch(clearEmailError());
            dispatch(clearPasswordError());
        };
    }, [dispatch]);
    return (
        <Col className="sign-in-container">
            <Col className="sign-in-container__left">
                <Col>
                    <Typography.Title level={1}>LOGO.</Typography.Title>
                    <Col className="sign-in-container__left__img">
                        <img src={logo} />
                        <Col className="sign-in-container__left__img__progress">
                            <Col className="sign-in-container__left__img__progress__above"></Col>
                            <Col className="sign-in-container__left__img__progress__below"></Col>
                        </Col>
                    </Col>
                </Col>
            </Col>
            <Col className="sign-in-container__right">
                <Col className="sign-in-container__right__first">
                    <Typography.Paragraph className="sign-in-container__right__first__signup">
                        <Typography.Paragraph>Not registered yet?</Typography.Paragraph>
                        <Link to={RoutePath.SIGNUP}>Sign Up</Link>
                    </Typography.Paragraph>
                </Col>
                <Col className="sign-in-container__right__second">
                    <Typography.Title level={1}>Sign In</Typography.Title>
                    <Form name={FormNames.SIGN_IN} className="sign-in-content-form" form={form}>
                        <Typography.Paragraph className="sign-in-container__right__second__emailLabel">
                            E-mail
                        </Typography.Paragraph>
                        <Form.Item
                            className="sign-in-container__right__second__email"
                            name={UserStoreDataKeys.EMAIL}
                        >
                            <Input
                                placeholder="Enter your working email"
                                required
                                value={email}
                                onChange={evt => setEmail(evt.target.value)}
                            />
                        </Form.Item>
                        <Typography.Paragraph className="sign-in-container__right__second__passLabel">
                            Password
                        </Typography.Paragraph>
                        <Col style={{ position: 'relative' }}>
                            <Form.Item
                                className="sign-in-container__right__second__password"
                                name={UserStoreDataKeys.PASSWORD}
                            >
                                <Password
                                    placeholder="Enter your password"
                                    required={true}
                                    value={pass}
                                    onChange={evt => setPass(evt.target.value)}
                                    iconRender={visible =>
                                        visible ? (
                                            <EyeOutlined
                                                size={4}
                                                style={{
                                                    color: DefaultThemeColors.eyeOutLined,
                                                    fontSize: '20px',
                                                }}
                                            />
                                        ) : (
                                            <EyeInvisibleOutlined
                                                size={4}
                                                style={{
                                                    color: DefaultThemeColors.eyeOutLined,
                                                    fontSize: '20px',
                                                }}
                                            />
                                        )
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Typography.Paragraph className="sign-in-container__right__second__forgot">
                            {passwordErrorText && (
                                <Typography.Paragraph className="password-extra">
                                    {passwordErrorText}
                                </Typography.Paragraph>
                            )}
                            <Link to={RoutePath.FORGOT_PASSWORD}>Forgot password?</Link>
                        </Typography.Paragraph>
                        <Button
                            id="submitBtn"
                            htmlType="submit"
                            disabled={pass.length < 8 || email.length < 6}
                            form={FormNames.SIGN_IN}
                        >
                            Sign in
                        </Button>
                    </Form>
                </Col>
                <Col className="sign-in-container__right__footer">
                    <Typography.Paragraph className="sign-in-container__right__footer">
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

export default SignInContent;
