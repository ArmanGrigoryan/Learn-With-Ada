import React, { useEffect } from 'react';
import Password from 'antd/es/input/Password';
import { Button, Input, Checkbox, Form } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useForm } from 'antd/es/form/Form';
import './sign-up-content.less';
import { Typography } from 'antd';
import BaseContent from '../../core/base-content';
import { Link } from 'react-router-dom';
import { FormNames, UserStoreDataKeys } from '../../utils/constants';
import { RoutePath } from '../../routes/routes';
import { useDispatch, useSelector } from 'react-redux';
import { authSelect, clearEmailError, clearPasswordError } from '../../redux';

export function SignUpContent() {
    const [termsAndConditionsChecked, setTermsAndConditionsChecked] = React.useState(false);
    const { emailErrorText, passwordErrorText } = useSelector(authSelect);
    const [form] = useForm();
    const dispatch = useDispatch();
    const onCheckTermsAndConditions = React.useCallback((event: CheckboxChangeEvent) => {
        setTermsAndConditionsChecked(event.target.checked);
    }, []);
    useEffect(() => {
        return () => {
            dispatch(clearEmailError());
            dispatch(clearPasswordError());
        };
    }, [dispatch]);
    return (
        <BaseContent
            headContent={
                <>
                    <Typography.Title>Sign Up</Typography.Title>
                    <Typography.Paragraph>
                        Already have an account? <Link to={RoutePath.SIGNIN}>Sign In</Link>
                    </Typography.Paragraph>
                </>
            }
            className={'sign-up-content'}
        >
            <Form className={'sign-up-content'} name={FormNames.SIGN_UP} form={form}>
                <Form.Item
                    name={UserStoreDataKeys.FIRST_NAME}
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your first name',
                        },
                    ]}
                >
                    <Input placeholder={'First Name'} />
                </Form.Item>
                <Form.Item
                    name={UserStoreDataKeys.LAST_NAME}
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your last name',
                        },
                    ]}
                >
                    <Input placeholder={'Last Name'} />
                </Form.Item>
                <Form.Item
                    name={UserStoreDataKeys.EMAIL}
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your email',
                        },
                        {
                            type: 'email',
                            message: 'Please enter a valid email',
                        },
                    ]}
                    extra={
                        emailErrorText && (
                            <Typography.Paragraph
                                style={{
                                    fontSize: '12px',
                                    lineHeight: '16px',
                                    color: 'red',
                                }}
                            >
                                {emailErrorText}
                            </Typography.Paragraph>
                        )
                    }
                >
                    <Input type={'email'} placeholder={'Email'} />
                </Form.Item>
                <Form.Item
                    extra={
                        passwordErrorText ? (
                            <Typography.Paragraph
                                style={{
                                    fontSize: '12px',
                                    lineHeight: '16px',
                                    color: 'red',
                                }}
                            >
                                {passwordErrorText}
                            </Typography.Paragraph>
                        ) : (
                            'Password must contain numbers, A-Z and a-z letters and consist of at least 6 characters.'
                        )
                    }
                    name={UserStoreDataKeys.PASSWORD}
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your password',
                        },
                        {
                            pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\\w\\s]).{6,}$/,
                            message: 'Please enter a valid password',
                        },
                    ]}
                >
                    <Password placeholder={'Password'} />
                </Form.Item>
                <Form.Item initialValue={termsAndConditionsChecked}>
                    <Checkbox onChange={onCheckTermsAndConditions}>
                        I agree to{' '}
                        <Link to={'https://google.com'} target={'_blank'} rel={'noreferrer'}>
                            Terms and Condition
                        </Link>
                    </Checkbox>
                </Form.Item>
            </Form>
            <Button
                block
                type={'primary'}
                className={'sign-up-content-button'}
                disabled={!termsAndConditionsChecked}
                htmlType={'submit'}
                form={FormNames.SIGN_UP}
            >
                Sign Up
            </Button>
        </BaseContent>
    );
}

export default SignUpContent;
