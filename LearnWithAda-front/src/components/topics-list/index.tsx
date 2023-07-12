import React, { useMemo } from 'react';
import { Col, Row, Select } from 'antd';
import { TopicData } from '../../core/models/topic';
import { topicSelect } from '../../redux';
import { useSelector } from 'react-redux';
import { getTopicName, noop } from '../../utils/helpers';
import { TopicPropsTopicsList as TopicProps } from '../../utils/interfaces';
import { AuthDataKeys } from '../../utils/constants';

const TopicsList = ({ selected = '', onTopicSelect = noop }: TopicProps) => {
    const userId = localStorage.getItem(AuthDataKeys.USER_ID);
    const topics = useSelector(topicSelect).topics.filter(item => item.createdByUserId == userId);
    const selectedTopic = useMemo(() => {
        if (selected) {
            const topicName = getTopicName(selected, topics);
            return topicName;
        }
        return null;
    }, [selected, topics]);
    return (
        <Select
            onChange={onTopicSelect}
            placeholder={'Select topic'}
            virtual={false}
            bordered
            defaultValue={selectedTopic && selectedTopic}
        >
            {topics.map(({ id, name }: TopicData) => (
                <Select.Option value={name} key={id}>
                    <Row align={'middle'}>
                        <Col>{name}</Col>
                    </Row>
                </Select.Option>
            ))}
        </Select>
    );
};

export default TopicsList;
