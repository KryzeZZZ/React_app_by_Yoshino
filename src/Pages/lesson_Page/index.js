import React, { useEffect, useState } from 'react';
import {Modal, Button, List, Typography, Input, Spin} from '@douyinfe/semi-ui';
import { IconClose, IconArrowLeft, IconPlus } from '@douyinfe/semi-icons';
import styles from './index.module.scss'
import {useLocation, useNavigate} from 'react-router-dom'
import axios from "axios";
import useSWR from "swr";


function LessonChoose() {
    let tempState = useLocation();
    let userIndex = tempState.state.id;
    const navigate = useNavigate()
    const { Text, Title } = Typography;
    // const [lessonData, setLessonData] = useState([]);
    const [visible, setVisible] = useState(false);
    const [lessons, setLessons] = useState([]);
    const showDialog = () => {
        setVisible(true);
    };
    const handleOk = () => {
        setVisible(false);
        // const {data, error, isLoading} = useSWR('http://localhost:3000/Students', () => axios.get('http://localhost:3000/Students').then(response => response.data));
    };
    const handleCancel = () => {
        setVisible(false);
    };
    const handleAfterClose = () => {
    };
    const {data, error, isLoading} = useSWR(`http://localhost:3000/account`, () => axios.get('http://localhost:3000/account').then(response => response.data));
    useEffect(() => {
        if(!(data === undefined)) {
            // console.log(userIndex)
            // console.log(data[])
            setLessons(data[userIndex].lessons)
        }
    }, [data]);
    if(error) return <div>loading failed</div>;
    if(isLoading) return <Spin></Spin>;
    function goBack() {
        navigate(-1);  // 返回上一页
    }
    function EmptyContent() {
        return (
            <div className={"EmptyContent"}>
                <Button theme='light' type='tertiary' icon={<IconArrowLeft />} className={"backButton"} onClick={goBack}></Button>
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
    function chooseLesson(lessonName) {
        // console.log(lessonName);
        for(let index in lessons) {
            // console.log(index);
            if(lessonName === lessons[index].name) {
                tempState.state.lessonId = index;
                navigate("/callroll", {state: tempState})
                return;
            }
        }

    }
    function NonEmptyContent() {
        return (
            <div className={"nonEmptyContent"}>
                <Button theme='light' type='tertiary' icon={<IconArrowLeft />} className={"backButton"} onClick={goBack}></Button>
                <div className={"titleContent"}>
                    <Title heading={1}>请选择您的课程</Title>
                    <Button onClick={showDialog} theme='light' type='tertiary' icon={<IconPlus />} iconPosition={"left"}>新建课程</Button>
                </div>
                <List className={"classList"}
                    dataSource={lessons}
                    renderItem={item => (
                        <Button theme='solid' type='primary' className={"listLabelbox"} onClick={() => {chooseLesson(item.name)}}>{item.name}</Button>
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
                <Input placeholder={"请输入课程名称"}></Input>
            </Modal>
            {!lessons.length ? <EmptyContent /> : <NonEmptyContent />}
            <img src={"lesson_page/moonIcon.svg"} className={"moonshotIcon"}></img>
        </div>
    );
}

export default LessonChoose;