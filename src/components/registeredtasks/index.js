import React, { useState } from 'react'
import './styles.css'
import { TbBellZ } from 'react-icons/tb';
import { IoMdCheckmark } from 'react-icons/io';
import { BsPencilFill } from 'react-icons/bs';
import Tooltip from '@material-ui/core/Tooltip';
import { MdOutlineDescription } from 'react-icons/md';
import { deleteTasks, updateTasks } from '../../reducer'
import { RiDeleteBin6Line } from 'react-icons/ri';
import { HiSelector } from 'react-icons/hi';
import { BiTimeFive, BiCalendar } from 'react-icons/bi';
import { useSelector, useDispatch } from 'react-redux'

import { ApiLogedCall } from '../../apiCall'


function RegisteredTasks({ users }) {

    const [editTask, setEditTask] = useState(false)

    const token = useSelector((state) => state.payload.token)
    const tasks = useSelector((state) => state.payload.tasks)
    const companyId = useSelector((state) => state.payload.companyId)

    const dispatch = useDispatch()

    const [description, setDescription] = useState('')
    const [userDate, setUserDate] = useState('')
    const [userTime, setUserTime] = useState(new Date().getTime())
    const [assignUser, setAssignUser] = useState('')
    const [display, setDisplay] = useState(true)

    const updateTask = (taskjson) => {

        if (!description || !userDate || !userTime || !assignUser) return alert("Every input field is required")

        let timeHour = parseInt(userTime.split(":")[0]) * 3600
        let timeMinute = parseInt(userTime.split(":")[1]) * 60

        let convertedTime = timeHour + timeMinute

        let zone = Date().slice(Date().indexOf("+") + 1, Date().lastIndexOf("(")).slice(0, 3) || Date().slice(Date().indexOf("-") + 1, Date().lastIndexOf("(")).slice(3);
        let hours = parseInt(zone) * 3600
        let minutes = Date().slice(Date().indexOf("+") + 1, Date().lastIndexOf("(")).slice(3) || Date().slice(Date().indexOf("-") + 1, Date().lastIndexOf("(")).slice(3)
        let convertedMinute = parseInt(minutes) * 60
        let time_zone = hours + convertedMinute

        let taskId = taskjson.id

        let task = {
            task_msg: description,
            task_date: userDate,
            task_time: convertedTime,
            time_zone,
            is_completed: 0,
            assigned_user: assignUser
        }

        ApiLogedCall(`https://stage.api.sloovi.com/task/lead_465c14d0e99e4972b6b21ffecf3dd691/${taskId}?company_id=${companyId}`, "PUT", task, token, (result) => {
            if (result['status'] = 'success') {

                dispatch(updateTasks(task))
                setEditTask(!editTask)

            } else {
                alert(result.message)
            }


        })

    }

    const deleteTask = (task) => {
        let taskId = task.id

        let body = {}

        ApiLogedCall(`https://stage.api.sloovi.com/task/lead_465c14d0e99e4972b6b21ffecf3dd691/${taskId}?company_id=${companyId}`, "DELETE", body, token, (result) => {
            if (result['status'] = 'success') {
                dispatch(deleteTasks(task))

            } else {
                alert(result.message)
            }


        })

    }

    return (
        <div >
            {
                tasks.map((task, i) => (

                    <>
                        {
                            !task.visibility ? (
                                <div key={`${task.id + i} `} className='container1' >
                                    <div className='usercontainer'>
                                        <img src={task.assigned_user_icon} style={{ height: 55, width: 55, borderRadius: 5 }} />

                                        <div className='userdetails' >
                                            <p>{task.task_msg}</p>
                                            <p style={{ color: 'red', fontSize: 14 }}> {task.task_date} </p>
                                        </div>
                                    </div>

                                    <div className='features' >
                                        {
                                            !task.snooze ? (
                                                <p onClick={() => {
                                                    setDescription(task.task_msg)
                                                    setUserDate(task.task_date)
                                                    setAssignUser(task.assigned_user)

                                                    let convertedTime = task.task_time
                                                    let convertToHours = convertedTime / 3600
                                                    let hours = Math.floor(convertToHours)
                                                    let minutes = Math.floor((convertToHours - hours) * 60)
                                                    let time = `${hours}:${minutes}`

                                                    setUserTime(time)
                                                    let task2 = {
                                                        ...tasks[i],
                                                        visibility: true
                                                    }

                                                    dispatch(updateTasks(task2))
                                                    
                                                }}>
                                                    <Tooltip title="Edit this Task" arrow>
                                                        <BsPencilFill style={{ color: 'black' }} />
                                                    </Tooltip>
                                                </p>
                                            ) : (
                                                <p style={{ border: 'none' }}></p>
                                            )
                                        }

                                        <p onClick={() => {
                                            setDisplay(!display)
                                            let task2 = {
                                                ...tasks[i],
                                                snooze : '' || undefined ? true : !tasks[i]['snooze']
                                            }                                                    
                                            
                                            dispatch(updateTasks(task2))
                                        }} >
                                            <Tooltip title="Snooze this Task to appear in your Inbox at a later date" arrow>
                                                <TbBellZ style={{ color: 'black' }} />
                                            </Tooltip>
                                        </p>
                                        <p >
                                            <IoMdCheckmark style={{ color: 'black' }} />
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div key={task.id} className='form-body' >
                                        <div className='form' >
                                            <p>Task Description</p>
                                            <div className='input-container' >
                                                <input
                                                    value={description}
                                                    onChange={(val) => setDescription(val.target.value)} type="text" />
                                                <div style={{ justifyContent: 'center', alignContent: 'center', alignItem: 'center' }} >
                                                    <MdOutlineDescription style={{ fontSize: 18, marginRight: 5 }} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='row' >
                                            <div className='col-lg-6 col-md-6 nomargin' >
                                                <div className='form right-space' >
                                                    <p>Date</p>
                                                    <div className='input-container' >
                                                        <div style={{ justifyContent: 'center', alignContent: 'center', alignItem: 'center' }} >
                                                            <BiCalendar
                                                                style={{ fontSize: 18, marginLeft: 5 }} />
                                                        </div>
                                                        <input
                                                            min="1997-01-01"
                                                            value={userDate}
                                                            onChange={(data) => setUserDate(data.target.value)}
                                                            placeholder='Date' type="date" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-lg-6 col-md-6 nomargin' >
                                                <div className='form left-space' >
                                                    <p>Time</p>
                                                    <div className='input-container' >
                                                        <div style={{ justifyContent: 'center', alignContent: 'center', alignItem: 'center' }} >
                                                            <BiTimeFive style={{ fontSize: 18, marginLeft: 5 }} />
                                                        </div>
                                                        <input value={userTime}
                                                            onChange={(data) => setUserTime(data.target.value)} placeholder='Time' type="time" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='form' >
                                            <p>Assign User</p>
                                            <div className='input-container' >
                                                <select
                                                    value={assignUser}
                                                    onChange={(data) => setAssignUser(data.target.value)}
                                                    type="text" >
                                                    <option></option>
                                                    {
                                                        users.map((data, i) => (
                                                            <option key={`${data.user_id + i}`} value={data.user_id} >{data.name}</option>
                                                        ))
                                                    }

                                                </select>
                                                <div style={{ justifyContent: 'center', alignContent: 'center', alignItem: 'center' }} >
                                                    <HiSelector style={{ fontSize: 18, marginRight: 5 }} />
                                                </div>

                                            </div>
                                        </div>
                                        <br />
                                        <div className='buttons_group' >
                                            <div>
                                                <RiDeleteBin6Line onClick={() => deleteTask(task)} style={{ fontSize: 18, marginLeft: 5, cursor: 'pointer' }} />
                                            </div>
                                            <div>
                                                <button
                                                    onClick={() => {
                                                        setEditTask(!editTask)
                                                        let task2 = {
                                                            ...tasks[i],
                                                            visibility: false
                                                        }

                                                        dispatch(updateTasks(task2))
                                                    }}
                                                    style={{ backgroundColor: 'rgba(0,0,0,0)', border: 'none', color: '#939CAD', padding: '2.5px 15px' }} >Cancel</button>
                                                <button
                                                    onClick={() => updateTask(task)}
                                                    style={{ backgroundColor: '#47BB7F', border: 'none', color: '#fff', padding: '2.5px 15px', borderRadius: 5 }} >Save</button>
                                            </div>

                                        </div>
                                        <br />
                                    </div>
                                </>
                            )
                        }

                    </>
                ))
            }

        </div>
    )
}

export default RegisteredTasks