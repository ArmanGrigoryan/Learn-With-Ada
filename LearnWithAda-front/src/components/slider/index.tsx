import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import './slider.less';
import 'swiper/less';
import 'swiper/less/navigation';
import 'swiper/less/pagination';
import 'swiper/less/scrollbar';
import { Button, Card, Col, Row, Skeleton, Tooltip, Typography } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { courseSelect, lessonSelect, topicSelect } from '../../redux';
import { useSelector } from 'react-redux';
import { getTopicLessons } from '../../utils/helpers';
import { TopicData } from '../../core/models/topic';
import { DefaultThemeColors } from '../../utils/colors';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SliderProps } from '../../utils/interfaces';

const Slider: React.FC<SliderProps> = ({ courseId }) => {
    const navigate = useNavigate();
    const { courses } = useSelector(courseSelect);
    const { topics } = useSelector(topicSelect);
    const { lessons } = useSelector(lessonSelect);
    const topicIds = courses.find(({ id }) => courseId == id)?.topicIds;
    const courseTopics = topics.filter(each => topicIds?.includes(each.id));
    const OnTakeAssessment = useCallback(
        id => {
            navigate(`/lesson-assessment/${id}`);
        },
        [navigate],
    );
    return (
        <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={50}
            slidesPerView={3}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            onSwiper={swiper => swiper}
            onSlideChange={() => 'slide change'}
        >
            {courseTopics &&
                courseTopics?.length > 0 &&
                Array.isArray(courseTopics) &&
                courseTopics.map(({ name, id }: TopicData) => {
                    return (
                        <SwiperSlide key={id}>
                            <Tooltip
                                overlay={
                                    <>
                                        <Typography.Title level={5}>Lessons</Typography.Title>
                                        <Row gutter={16}>
                                            {id && getTopicLessons(id, lessons)?.length ? (
                                                getTopicLessons(id, lessons).map(
                                                    ({ instruction, id: lessonId }) => (
                                                        <div className="tooltip-actions" key={id}>
                                                            <Col>
                                                                <Typography.Paragraph
                                                                    style={{
                                                                        color: DefaultThemeColors.white,
                                                                    }}
                                                                >
                                                                    {instruction[0].instruction}
                                                                </Typography.Paragraph>
                                                            </Col>
                                                            <Col>
                                                                <Button
                                                                    className="tooltip-actions-button"
                                                                    style={{ borderRadius: '8px' }}
                                                                    type="primary"
                                                                    onClick={() =>
                                                                        OnTakeAssessment(lessonId)
                                                                    }
                                                                >
                                                                    Take Assessment
                                                                </Button>
                                                            </Col>
                                                        </div>
                                                    ),
                                                )
                                            ) : (
                                                <Col>
                                                    <Typography.Paragraph
                                                        style={{ color: DefaultThemeColors.white }}
                                                    >
                                                        No lessons
                                                    </Typography.Paragraph>
                                                </Col>
                                            )}
                                        </Row>
                                    </>
                                }
                                overlayClassName=""
                                placement="top"
                            >
                                <Card
                                    hoverable
                                    cover={
                                        <img
                                            alt="Web development image"
                                            src="https://previews.123rf.com/images/melpomen/melpomen1508/melpomen150800268/44542296-hand-pressing-an-online-course-button-on-blurred-city-lights-background.jpg"
                                        />
                                    }
                                >
                                    <Skeleton loading={false} active>
                                        <Meta title={name} description="Course description" />
                                    </Skeleton>
                                </Card>
                            </Tooltip>
                        </SwiperSlide>
                    );
                }, [])}
        </Swiper>
    );
};
export default Slider;
