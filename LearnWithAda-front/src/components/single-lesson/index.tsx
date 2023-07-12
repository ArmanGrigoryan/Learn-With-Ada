import { Form, Radio } from 'antd';
import React from 'react';
import { FormNames } from '../../utils/constants';

const SingleLesson: React.FC = () => {
    return (
        <Form name={FormNames.TAKE_ASSESSMENT}>
            <Form.Item
                label="Assessment answer"
                name={'assessmentAnswer'}
                rules={[
                    {
                        required: true,
                        message: 'Assessment answer is required.',
                    },
                ]}
            >
                <Radio.Group>
                    <Radio.Button value={true}>True</Radio.Button>
                    <Radio.Button value={false}>False</Radio.Button>
                </Radio.Group>
            </Form.Item>
        </Form>
    );
};

export default SingleLesson;
