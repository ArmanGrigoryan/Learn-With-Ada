import { Layout, Row, Col } from 'antd';
import React from 'react';
import classnames from 'classnames';
import './base-content.less';
import { BaseContentProps } from '../../utils/interfaces';

export const BaseContent: React.FC<BaseContentProps> = props => {
    const { headContent, className, children, ...rest } = props;
    const classes = classnames('base-content', className);
    return (
        <Layout.Content className={classes}>
            <Row justify={'center'}>
                <Row className={classes} {...rest}>
                    <Col span={24}>
                        <div className={'base-content-head-content'}>{headContent}</div>
                        {children}
                    </Col>
                </Row>
            </Row>
        </Layout.Content>
    );
};

export default BaseContent;
