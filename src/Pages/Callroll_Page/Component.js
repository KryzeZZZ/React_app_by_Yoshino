// StudentComponents.js
import React from 'react';
import { List, Space, Descriptions, Modal, Typography } from '@douyinfe/semi-ui';

export function StudentLabel({ stuDetail }) {
    return (
        <List.Item style={{ border: '1px solid var(--semi-color-border)', backgroundColor: 'var(--semi-color-bg-2)', borderRadius: '3px', paddingLeft: '20px' }}>
            <Space vertical>
                <h3 style={{ color: stuDetail.chooseAble ? 'black' : 'grey' }}>{stuDetail.name}</h3>
                <div>
                    <Descriptions align="center" size="small" data={[{ key: '分数', value: stuDetail.points }]} />
                </div>
            </Space>
        </List.Item>
    );
}

export function StudentList({ students }) {
    return (
        <List
            grid={{ gutter: 12, span: 6 }}
            dataSource={students}
            renderItem={item => <StudentLabel stuDetail={item} />}
        />
    );
}

export function StudentGrouping({ groups }) {
    return (
        <List
            grid={{ gutter: 1, column: 5 }}
            dataSource={groups}
            renderItem={(group, index) => (
                <div>
                    <Typography.Title level={1}>Group {index + 1}</Typography.Title>
                    {group.map(student => (
                        <StudentLabel key={student.id} stuDetail={student} />
                    ))}
                </div>
            )}
        />
    );
}

export function StudentSelectionModal({ isVisible, onCorrect, onWrong, afterClose, chosenOne }) {
    return (
        <Modal
            title="抽取成功"
            visible={isVisible}
            onOk={onCorrect}
            onCancel={onWrong}
            okText="正确"
            cancelText="错误"
            afterClose={afterClose}
            closeOnEsc={true}
        >
            {chosenOne}
        </Modal>
    );
}
