import React, { useState, useEffect } from 'react';
import { Modal, Button, Radio, Input, Typography, Select } from '@douyinfe/semi-ui';
import { IconClose } from '@douyinfe/semi-icons';
import styles from './AttendanceModal.module.scss';

const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
const { Text, Title } = Typography;

const AttendanceModal = ({ visible, onCancel, onConfirm, students }) => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    useEffect(() => {
        if (students.length > 0) {
            const initialRecords = students.map(student => ({
                date: getCurrentDate(),  // Set the current date (YYYY-MM-DD)
                class_time: getCurrentDateTime(),
                id: student.id,
                name: student.name,
                status: 1,  // Default status as 'normal'
                session: determineCurrentSession(),  // Determine current session (morning or afternoon)
                note: ''
            }));
            setAttendanceRecords(initialRecords);
        }
    }, [students]);

    const determineCurrentSession = () => {
        const currentHour = parseInt(String(new Date().getHours()).padStart(2, '0'));
        return currentHour < 12 ? 0 : 1;  // 0 for morning, 1 for afternoon
    };

    const handleStatusChange = (index, status) => {
        const newRecords = [...attendanceRecords];
        newRecords[index].status = status;
        setAttendanceRecords(newRecords);
    };

    const handleNoteChange = (index, note) => {
        const newRecords = [...attendanceRecords];
        newRecords[index].note = note;
        setAttendanceRecords(newRecords);
    };

    const handleSessionChange = (index, session) => {
        const newRecords = [...attendanceRecords];
        newRecords[index].session = session;
        setAttendanceRecords(newRecords);
    };

    const handleConfirm = () => {
        onConfirm(attendanceRecords);
    };

    return (
        <Modal
            visible={visible}
            onCancel={onCancel}
            title="添加考勤"
            footer={
                <div>
                    <Button onClick={onCancel} type="tertiary">取消</Button>
                    <Button onClick={handleConfirm} type="primary">确定</Button>
                </div>
            }
            closeIcon={<IconClose />}
            centered
        >
            <div className={styles.attendanceModal}>
                {attendanceRecords.map((record, index) => (
                    <div key={record.id} className={styles.studentRow}>
                        <Text>{record.name}</Text>
                        <Radio.Group
                            type="button"
                            buttonSize="large"
                            value={record.status}
                            onChange={(e) => handleStatusChange(index, e.target.value)}
                        >
                            <Radio value={-1}>迟到</Radio>
                            <Radio value={-2}>请假</Radio>
                            <Radio value={0}>缺席</Radio>
                        </Radio.Group>
                        <Input
                            placeholder="备注："
                            value={record.note}
                            onChange={(e) => handleNoteChange(index, e)}
                        />
                    </div>
                ))}
            </div>
        </Modal>
    );
};

export default AttendanceModal;
