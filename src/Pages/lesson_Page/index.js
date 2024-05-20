import React, { useEffect, useState } from 'react';
import { Modal, Button, List, Typography, Input, Spin, Popconfirm } from '@douyinfe/semi-ui';
import { IconArrowLeft, IconPlus, IconClose } from '@douyinfe/semi-icons';
import styles from './index.module.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useSWR, { mutate } from 'swr';

function LessonChoose() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const { Text, Title } = Typography;
    const [visible, setVisible] = useState(false);
    const [lessons, setLessons] = useState([]);
    const [courseName, setCourseName] = useState("");
    const [hoveredLesson, setHoveredLesson] = useState(null);

    const headers = {
        Authorization: `Bearer ${token}`
    };

    const fetcherWithHeaders = (url) => axios.get(url, { headers }).then(response => response.data).catch(error => console.log(error));

    const { data, error, isLoading } = useSWR('http://localhost:5050/courses', fetcherWithHeaders);

    const addCourse = (courseName) => {
        const body = { courseName: courseName };
        axios.post('http://localhost:5050/course/add', body, { headers })
            .then(res => {
                console.log("Course added:", res.data);
                mutate('http://localhost:5050/courses', fetcherWithHeaders).catch();
                setVisible(false);
            })
            .catch(err => {
                console.error("Error adding course:", err);
            });
    };

    const deleteCourse = (courseId) => {
        const body = { courseId: courseId };
        axios.post('http://localhost:5050/course/delete', body, { headers })
            .then(res => {
                console.log("Course deleted:", res.data);
                mutate('http://localhost:5050/courses', fetcherWithHeaders).catch()
            })
            .catch(err => {
                console.error("Error adding course:", err);
            });
    };

    const showDialog = () => {
        setVisible(true);
    };

    const handleOk = () => {
        addCourse(courseName);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    useEffect(() => {
        if (data !== undefined) {
            console.log(data);
            setLessons(data);
        }
    }, [data]);

    if (error) return <div>Loading failed</div>;
    if (isLoading) return <Spin />;

    function goBack() {
        navigate(-1);
    }

    function EmptyContent() {
        return (
            <div className={"EmptyContent"}>
                <Button theme='light' type='tertiary' icon={<IconArrowLeft />} className={"backButton"} onClick={goBack}></Button>
                <div className={"titleContent"}>
                    <Title heading={1}>请选择您的课程</Title>
                </div>
                <div className={"NoticeContent"}>
                    <img src={"/lesson_page/Notfind.svg"} alt="No courses found" />
                    <Title heading={2}>您还没有创建任何课程</Title>
                    <Text>点击下面的按钮创建课程，您最多可创建n个课程</Text>
                    <Button onClick={showDialog} theme='solid' type='primary' className={"emptyCreate"}>创建课程</Button>
                </div>
            </div>
        );
    }

    function chooseLesson(courseId) {
        navigate(`/callroll/${courseId}`)
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
                          <div
                              className={"listItem"}
                          >
                              <div
                                  className={"listLabelBox"}
                                  onMouseEnter={() => setHoveredLesson(item.id)}
                                  onMouseLeave={() => setHoveredLesson(null)}
                              >
                                  <Button block
                                          theme='solid'
                                          type='primary'
                                          className={"lessonButton"}
                                          onClick={() => {
                                              chooseLesson(item.id)
                                          }}
                                  >
                                      {item.name}
                                  </Button>
                                  {hoveredLesson === item.id && (
                                      <Popconfirm
                                          title="确定要删除这个课程吗？"
                                          onConfirm={() => deleteCourse(item.id)}
                                          okText="是"
                                          cancelText="否"
                                          position="bottom" // 控制 Popconfirm 的显示位置
                                          arrowPointAtCenter // 让箭头指向触发元素的中心
                                      >
                                          <IconClose className={"deleteIcon"} />
                                      </Popconfirm>
                                  )}
                              </div>
                          </div>
                      )}
                />
            </div>
        );
    }



    return (
        <div className={styles.root}>
            <Modal
                title={(<Title heading={5}>输入你创建的课程名称</Title>)}
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                closeOnEsc={true}
                centered={true}
                width={700}
            >
                <Input placeholder={"请输入课程名称"} onChange={e => setCourseName(e)}></Input>
            </Modal>
            {!lessons.length ? <EmptyContent/> : <NonEmptyContent/>}
            <img src={"/lesson_page/moonIcon.svg"} className={"moonshotIcon"} alt="Moon icon"/>
        </div>
    );
}

export default LessonChoose;
