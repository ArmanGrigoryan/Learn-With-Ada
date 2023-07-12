import React, { useCallback } from 'react';
import { Modal as AntModal, Row, Spin } from 'antd';
import { Typography, Button } from 'antd';
import { noop } from '../../utils/helpers';
import { CloseOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { lessonSelect } from '../../redux';
import { ModalProps } from '../../utils/interfaces';

const ModalConfirm: React.FC<ModalProps> = ({
    visible = false,
    onCancel = noop,
    submitHandler = noop,
    name = '',
    type = '',
}) => {
    const { loading: deleteLessonLoading } = useSelector(lessonSelect);
    const width = 600;
    const level = 4;
    const onClose = useCallback(() => {
        onCancel(false);
    }, [onCancel]);
    return (
        <div>
            <AntModal
                centered
                width={width}
                visible={visible}
                closeIcon={<CloseOutlined onClick={onClose} />}
                footer={
                    <Row justify={'center'}>
                        <Button style={{ borderRadius: '8px' }} type="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        {deleteLessonLoading ? (
                            <Spin tip="Deleting..."></Spin>
                        ) : (
                            <Button
                                style={{ borderRadius: '8px' }}
                                htmlType="submit"
                                type="primary"
                                onClick={submitHandler}
                            >
                                Delete
                            </Button>
                        )}
                    </Row>
                }
            >
                <Typography.Title
                    level={level}
                    className="modal-body-header"
                    style={{ marginBottom: '32px', lineHeight: '30px' }}
                >
                    {`Are you sure to delete ${name ? `${type} with name ${name}` : 'lesson'}`}
                </Typography.Title>
            </AntModal>
        </div>
    );
};
export default ModalConfirm;
