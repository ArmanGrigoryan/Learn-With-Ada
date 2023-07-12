import React, { useCallback, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { topicSelect } from '../../redux';
import { TopicData } from '../../core/models/topic';
import { LessonGet } from '../../core/models/lesson';
import { CarouselRef } from 'antd/lib/carousel';
import { Row, Col, Typography, Button, Carousel, Select, Rate } from 'antd';
import { BankOutlined, RightOutlined, LeftOutlined, CloseOutlined } from '@ant-design/icons';
import Media from '../../components/media';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from '../../routes/routes';
import './learn-from-stream.less';

const LearnFromStreamContent: React.FC = () => {
    const navigate = useNavigate();
    const [current, setCurrent] = useState<number>(0);
    const topics = useSelector(topicSelect).topics.filter(
        item => item?.lessons?.length > 0,
    ) as TopicData[];
    const [filteredTopic, setFilteredTopic] = useState(topics[0]);
    const [filteredValue, setFilteredValue] = useState<string>();
    const [filteredLessons, setFilteredLessons] = useState(
        filteredTopic?.lessons.filter(item => item.instruction.instructionFile) as LessonGet[],
    );
    const onArrowClick = useCallback((type: string) => {
        if (type === 'next') {
            return slider.current?.next();
        } else if (type === 'previous') {
            return slider.current?.prev();
        }
    }, []);
    const slider = useRef<CarouselRef>(null);
    const onLessonClick = useCallback(
        id => {
            const idx = filteredLessons.findIndex(item => item.id === id);
            setCurrent(idx);
            return slider.current?.goTo(idx);
        },
        [filteredLessons],
    );
    const afterChange = useCallback(key => {
        setCurrent(key);
    }, []);

    const addHandler = useCallback(() => {
        navigate(RoutePath.LESSON_CREATE);
    }, [navigate]);
    const filterHandler = (value?: string) => {
        const topicName = value || filteredValue;
        if (topicName) {
            const topic = topics.find(each => each.name === topicName) as TopicData;
            const lessons = topic?.lessons.filter(each => each.instruction?.instructionFile) || [];
            setCurrent(0);
            setFilteredTopic(topic);
            setFilteredLessons(lessons);
        }
    };
    const shuffleTopic = useCallback(() => {
        const idx = Math.floor(Math.random() * topics.length);
        const newLessons = [...topics[idx].lessons];
        const lessons = newLessons.filter(each => each.instruction?.instructionFile) || [];
        setCurrent(0);
        setFilteredTopic(topics[idx]);
        setFilteredLessons(lessons);
    }, [topics]);
    return (
        <Col className="learn-from-stream-content">
            <Col className="absolute"></Col>
            <Row justify="center">
                <Col className="learn-from-stream-content__modal-container">
                    <Row className="learn-from-stream-content__modal-container__aboveCarousel">
                        <Col className="first">
                            <Typography.Title level={5}>
                                Topic: {filteredTopic?.name}
                            </Typography.Title>
                        </Col>
                        <Col className="learn-from-stream-content__modal-container__aboveCarousel__div">
                            <Select
                                showSearch={false}
                                showArrow={false}
                                style={{ width: 300 }}
                                placeholder="What do you want to learn today..."
                                optionFilterProp="children"
                                clearIcon={<CloseOutlined />}
                                onChange={(value: string) => setFilteredValue(value)}
                            >
                                {topics.map(each => {
                                    return (
                                        <Select.Option
                                            disabled={each?.id === (filteredTopic as TopicData)?.id}
                                            key={each.id}
                                            value={each.name}
                                        >
                                            {each.name}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                            <Button onClick={() => filterHandler()}>Search</Button>
                            <Typography.Title level={5}>
                                Achievements <BankOutlined />
                            </Typography.Title>
                        </Col>
                    </Row>
                    <Row className="learn-from-stream-content__modal-container__carousel-container">
                        <Col
                            className="learn-from-stream-content__modal-container__carousel-container__left"
                            span={18}
                        >
                            <Row
                                justify="space-between"
                                align={'middle'}
                                className="learn-from-stream-content__modal-container__carousel-container__left__arrows"
                            >
                                <Col>
                                    <Button
                                        onClick={() => onArrowClick('previous')}
                                        type="link"
                                        disabled={filteredLessons?.length === 0}
                                    >
                                        <LeftOutlined /> Alternate lesson
                                    </Button>
                                </Col>
                                <Col>
                                    <Button
                                        onClick={() => onArrowClick('next')}
                                        type="link"
                                        disabled={filteredLessons?.length === 0}
                                    >
                                        Alternate lesson <RightOutlined />
                                    </Button>
                                </Col>
                            </Row>
                            <Carousel
                                effect="scrollx"
                                lazyLoad="progressive"
                                ref={slider}
                                dots={false}
                                afterChange={afterChange}
                                className="learn-from-stream-content__modal-container__carousel-container__left__carousel"
                            >
                                {filteredLessons?.map(each => {
                                    const fileFormat = each?.instruction?.instructionFile
                                        ?.split('.')
                                        .pop();
                                    const type =
                                        fileFormat === 'mp3'
                                            ? 'audio'
                                            : fileFormat === 'mp4'
                                            ? 'video'
                                            : '';
                                    return (
                                        <Media
                                            key={each?.id + Math.random()}
                                            type={type}
                                            endHandler={() => slider.current?.next()}
                                            src={each.instruction?.instructionFile as string}
                                        />
                                    );
                                })}
                            </Carousel>
                            <Row justify="center">
                                <Button onClick={shuffleTopic}>Shuffle topic</Button>
                            </Row>
                        </Col>
                        <Col
                            span={6}
                            className="learn-from-stream-content__modal-container__carousel-container__right"
                        >
                            <Col className="learn-from-stream-content__modal-container__carousel-container__right__above">
                                <Typography.Title level={5}>Related topics</Typography.Title>
                                {topics
                                    .filter(item => item?.id !== filteredTopic?.id)
                                    .map(each => {
                                        return (
                                            <Typography.Paragraph
                                                className="underline"
                                                key={each.id}
                                                onClick={() => filterHandler(each.name)}
                                            >
                                                {each.name}
                                            </Typography.Paragraph>
                                        );
                                    })}
                            </Col>
                            <Col>
                                <Typography.Title level={5}>
                                    This lesson counts towards
                                </Typography.Title>
                                <Typography.Paragraph className="underline">
                                    HIGH School GED
                                </Typography.Paragraph>
                                <Typography.Paragraph className="underline">
                                    Collage Algebra
                                </Typography.Paragraph>
                                <Typography.Paragraph className="underline">
                                    Google Jobs
                                </Typography.Paragraph>
                            </Col>
                        </Col>
                    </Row>
                    <Row className="learn-from-stream-content__modal-container__footer">
                        <Col>
                            <Typography.Title level={5}>Alternative Lessons</Typography.Title>
                            {filteredLessons?.map((item, idx) => {
                                return (
                                    <Col
                                        className="learn-from-stream-content__modal-container__footer__row"
                                        key={item.id}
                                    >
                                        <Typography.Text
                                            className={`underline ${
                                                idx === current ? 'active-lesson' : ''
                                            }`}
                                            onClick={() => onLessonClick(item.id)}
                                        >
                                            Alternative {idx + 1}
                                        </Typography.Text>
                                        <Rate allowHalf defaultValue={4.5}></Rate>
                                        <Typography.Text
                                            className={`underline ${
                                                idx === current ? 'active-lesson' : ''
                                            }`}
                                            onClick={() => onLessonClick(item.id)}
                                        >
                                            Creator: User ({item.createdByUserId})
                                        </Typography.Text>
                                        <Typography.Text>3:45</Typography.Text>
                                        <Typography.Text>43k views</Typography.Text>
                                    </Col>
                                );
                            })}
                            <Typography.Paragraph
                                className="underline"
                                style={{ marginTop: '10px' }}
                                onClick={addHandler}
                            >
                                Help teach the world: add your own lesson
                            </Typography.Paragraph>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Col>
    );
};

export default LearnFromStreamContent;
