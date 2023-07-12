import React, { useCallback } from 'react';
import { Form } from 'antd';
import { FormFinishInfo } from 'rc-field-form/lib/FormContext';
import { FormNames } from '../../utils/constants';
import { signIn, signUp, signUpToken } from '../../redux/actions';
import { SignInData, SignUpData } from '../../core/models/user';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from '../../routes/routes';
import { FormProviderProps } from 'antd/lib/form/context';
import { getUrlParams } from '../../utils/helpers';

export const FormProvider: React.FC<FormProviderProps> = props => {
    const navigate = useNavigate();
    const navigateHome = useCallback(() => {
        const status = getUrlParams(window.location.search).status;
        let path;
        if (status === 'signin' || status === 'signup' || status === 'active')
            path = RoutePath.USER_BUSINESSES;
        else path = RoutePath.DASHBOARD;
        navigate(path);
    }, [navigate]);
    const { children } = props;
    const dispatch = useDispatch();
    const onFormFinish = (name: string, { values }: FormFinishInfo) => {
        switch (name as string) {
            case FormNames.SIGN_IN: {
                dispatch(
                    signIn({ ...values, navigateHome } as SignInData & {
                        navigateHome: () => void;
                    }),
                );
                break;
            }
            case FormNames.SIGN_UP: {
                dispatch(
                    signUp({ ...values, navigateHome } as SignUpData & {
                        navigateHome: () => void;
                    }),
                );
                break;
            }
            case FormNames.SIGN_UP_TOKEN: {
                dispatch(
                    signUpToken({ ...values, navigateHome } as SignUpData & {
                        navigateHome: () => void;
                    }),
                );
                break;
            }
            case FormNames.FORGOT_PASS: {
                break;
            }
        }
    };
    return <Form.Provider onFormFinish={onFormFinish}>{children}</Form.Provider>;
};

export default FormProvider;
