import { Col, Row } from 'antd';
import { Typography, Button } from 'antd';
import { GoogleOutlined, FacebookOutlined } from '@ant-design/icons';

const SignInWith: React.FC = () => {
    return (
        <>
            <Row justify={'center'}>
                <Typography.Paragraph className={'sign-in-content-oauth-text'}>
                    Or Sign In with
                </Typography.Paragraph>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Button block>
                        <GoogleOutlined />
                    </Button>
                </Col>
                <Col span={12}>
                    <Button block>
                        <FacebookOutlined />
                    </Button>
                </Col>
            </Row>
        </>
    );
};

export default SignInWith;
