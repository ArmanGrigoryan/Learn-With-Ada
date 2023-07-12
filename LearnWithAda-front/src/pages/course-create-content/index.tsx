import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Input, Layout, message, Row, Typography, Upload, Select } from 'antd';
import ImgCrop from 'antd-img-crop';
import { UploadOutlined } from '@ant-design/icons';
import type { RcFile, UploadProps } from 'antd/es/upload/interface';
import { FormNames } from '../../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addCourse, courseSelect, updateCourse, userSelect } from '../../redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RoutePath } from '../../routes/routes';
import { Visibility } from '../../core/models/course';

const CourseCreateContent: React.FC = () => {
    const [formik] = Form.useForm();
    const { courseId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoFile, setLogoFile] = useState<File>();
    const { courses } = useSelector(courseSelect);
    const { id } = useSelector(userSelect);
    const course = courses.find(({ id }) => {
        return id == courseId;
    });
    const [publicStatus, setPublicStatus] = useState<boolean>(course?.visibility === 'private');
    const selectAfter = (
        <Select defaultValue="USD" className="select-after">
            <Select.Option value="USD">USD</Select.Option>
        </Select>
    );

    const navigateCoursePage = useCallback(() => {
        navigate(RoutePath.COURSE);
    }, [navigate]);

    const onCourseAdd = useCallback(async () => {
        const fields = formik.getFieldsValue();
        const data = {
            name: fields.name,
            description: fields.description,
            price: +fields.price,
            currentPrice: +(fields.currentPrice || 0),
            visibility: publicStatus ? Visibility.private : Visibility.public,
            file: logoFile,
            logo: logoFile?.name,
        };
        dispatch(
            addCourse({
                ...data,
                createdByUserId: id,
                navigateCoursePage,
            }),
        );
    }, [dispatch, formik, navigateCoursePage, id, logoFile, publicStatus]);

    const onCourseUpdate = useCallback(() => {
        const fields = formik.getFieldsValue();
        const data = {
            name: fields.name,
            description: fields.description,
            price: fields.price,
            currentPrice: fields.currentPrice,
            visibility: publicStatus ? Visibility.private : Visibility.public,
            file: logoFile,
            logo: logoFile?.name,
        };
        dispatch(updateCourse({ ...data, id: course?.id, navigateCoursePage }));
    }, [dispatch, formik, course?.id, navigateCoursePage, logoFile, publicStatus]);

    const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setLogoFile(newFileList?.[0]?.originFileObj as File);
    };

    const beforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 > 2;
        if (isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    useEffect(() => {
        course && setLogoFile(course?.file as File);
    }, [course]);
    return (
        <Layout>
            <Row>
                <Typography.Title level={2} className="title">
                    Add Course
                </Typography.Title>
            </Row>
            <Row justify={'center'}>
                <Col flex={'50%'}>
                    <Form
                        encType="multipart/form-data"
                        form={formik}
                        layout="vertical"
                        name={FormNames.ADD_COURSE}
                        initialValues={
                            course
                                ? {
                                      name: course.name,
                                      description: course.description,
                                      price: course.price,
                                      currentPrice: course.currentPrice,
                                  }
                                : {}
                        }
                    >
                        <Row justify="space-between" align="bottom">
                            <Col span={20}>
                                <Form.Item
                                    name="name"
                                    label="Course name"
                                    rules={[{ required: true }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={2}>
                                <Form.Item name="visibility" label="" style={{ cursor: 'pointer' }}>
                                    <Row align="middle" justify="space-between">
                                        <Input
                                            type="checkbox"
                                            checked={publicStatus}
                                            onChange={() => setPublicStatus(prev => !prev)}
                                        />
                                        Private
                                    </Row>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="price"
                            label="Price"
                            rules={[
                                { required: true },
                                { pattern: /[0-9]+$/, message: 'Please enter a only numbers' },
                            ]}
                        >
                            <Input addonAfter={selectAfter} />
                        </Form.Item>
                        <Form.Item
                            name="currentPrice"
                            label="Current Price"
                            rules={[{ pattern: /[0-9]+$/, message: 'Please enter a only numbers' }]}
                        >
                            <Input addonAfter={selectAfter} />
                        </Form.Item>
                        <Row justify={'end'}>
                            <Button
                                type="primary"
                                form={FormNames.ADD_COURSE}
                                onClick={!course ? onCourseAdd : onCourseUpdate}
                                htmlType={'submit'}
                                style={{ borderRadius: '8px' }}
                            >
                                {!course ? 'Add course' : 'Edit course'}
                            </Button>
                        </Row>
                    </Form>
                    <Form.Item name="myFiles">
                        <ImgCrop>
                            <Upload
                                accept=".png, .jpg, .jpeg, .gif, .tiff"
                                listType="picture"
                                onChange={onChange}
                                onPreview={() => null}
                                maxCount={1}
                                beforeUpload={beforeUpload}
                            >
                                <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                        </ImgCrop>
                    </Form.Item>
                    {course && !logoFile && (
                        <img
                            src={course?.logo}
                            alt="Course logo"
                            width={50}
                            height={50}
                            style={{
                                marginLeft: '10px',
                                marginTop: '-10px',
                                display: 'inline-block',
                            }}
                        />
                    )}
                </Col>
            </Row>
        </Layout>
    );
};

export default CourseCreateContent;
