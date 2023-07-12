import React, { useMemo } from 'react';
import { Col, Row, Select } from 'antd';
import { BusinessCreateData, BusinessProps } from '../../utils/interfaces';
import { businessSelect } from '../../redux';
import { useSelector } from 'react-redux';
import { getBusinessName, noop } from '../../utils/helpers';

const BusinessesList = ({ selected = '', onBusinessSelect = noop }: BusinessProps) => {
    const { businesses } = useSelector(businessSelect);
    const selectedBusiness = useMemo(() => {
        if (selected) {
            const businessName = getBusinessName(selected, businesses);
            return businessName;
        }
        return null;
    }, [selected, businesses]);
    return (
        <Select
            onChange={onBusinessSelect}
            placeholder={'Select business'}
            virtual={false}
            bordered
            defaultValue={selectedBusiness}
        >
            {businesses.map(({ id, name }: BusinessCreateData) => (
                <Select.Option value={name} key={id}>
                    <Row align={'middle'}>
                        <Col>{name}</Col>
                    </Row>
                </Select.Option>
            ))}
        </Select>
    );
};

export default BusinessesList;
