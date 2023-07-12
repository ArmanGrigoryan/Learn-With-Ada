import React from 'react';
import { Col, Row } from 'antd';
import classnames from 'classnames';
import { LabelValueProps } from '../../utils/interfaces';
import './label-value.less';

export function LabelValue(props: LabelValueProps) {
    const { label = null, value = null, className, ...rest } = props;
    const classes = classnames('label-value', className);
    return (
        <Row className={classes} {...rest}>
            <Col span={12} className="label-value-label">
                {label}
            </Col>
            <Col span={12} className="label-value-value">
                {value}
            </Col>
        </Row>
    );
}

export default LabelValue;
