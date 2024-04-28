import React, { useEffect, useState } from 'react';
import {Modal, Button, List, Typography, Input} from '@douyinfe/semi-ui';
import { IconClose, IconArrowLeft, IconPlus } from '@douyinfe/semi-icons';
import styles from './index.module.scss'
import axios from "axios";

function LessonChoose() {
    const { Text, Title } = Typography;
    const [lessonData, setLessonData] = useState([]);
    const [visible, setVisible] = useState(false);
    const showDialog = () => {
        setVisible(true);
    };
    const handleOk = () => {
        setVisible(false);
    };
    const handleCancel = () => {
        setVisible(false);
    };
    const handleAfterClose = () => {
    };
    useEffect(() => {
        axios.get('http://localhost:3000/Lessons')
            .then(response => {
                setLessonData(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    function EmptyContent() {
        return (
            <div className={"EmptyContent"}>
                <Button theme='light' type='tertiary' icon={<IconArrowLeft />} className={"backButton"}></Button>
                <div className={"titleContent"}>
                    <Title heading={1}>请选择您的课程</Title>
                    {/*<Button theme='light' type='tertiary' icon={<IconPlus />} iconPosition={"left"}>新建课程</Button>*/}
                </div>
                <div className={"NoticeContent"}>
                    <img src={"lesson_page/Notfind.svg"}></img>
                    <Title heading={2}>您还没有创建任何课程</Title>
                    <Text>点击下面的按钮创建课程，您最多可创建n个课程</Text>
                    <Button onClick={showDialog} theme='solid' type='primary' className={"emptyCreate"}>创建课程</Button>
                </div>
            </div>
        );
    }

    function NonEmptyContent() {
        return (
            <div className={"nonEmptyContent"}>
                <Button theme='light' type='tertiary' icon={<IconArrowLeft />} className={"backButton"}></Button>
                <div className={"titleContent"}>
                    <Title heading={1}>请选择您的课程</Title>
                    <Button onClick={showDialog} theme='light' type='tertiary' icon={<IconPlus />} iconPosition={"left"}>新建课程</Button>
                </div>
                <List className={"classList"}
                    dataSource={lessonData}
                    renderItem={item => (
                        <Button theme='solid' type='primary' className={"listLabelbox"}>{item.name}</Button>
                    )}
                />
            </div>
        );
    }

    return (
        <div  className={styles.root}>
            <Modal
                title={(<Title heading={5}>输入你创建的课程名称</Title>)}
                visible={visible}
                onOk={handleOk}
                afterClose={handleAfterClose} //>=1.16.0
                onCancel={handleCancel}
                closeOnEsc={true}
                centered={true}
                width={700}
            >
                <Input placeholder={"请输入密码"}></Input>
            </Modal>
            {!lessonData.length ? <EmptyContent /> : <NonEmptyContent />}
            <img src={"lesson_page/moonIcon.svg"} className={"moonshotIcon"}></img>
        </div>
    );
}

export default LessonChoose;