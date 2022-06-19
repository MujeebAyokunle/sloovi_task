import React, { useState } from 'react'
import './styles.css'
import { GrAdd } from 'react-icons/gr';
import { MdOutlineDescription } from 'react-icons/md';
import { HiSelector } from 'react-icons/hi';
import RegisteredTasks from '../registeredtasks';
import { BiTimeFive, BiCalendar } from 'react-icons/bi';
import { useSelector, useDispatch } from 'react-redux'
import { setTask } from '../../reducer'
import { ApiLogedCall } from '../../apiCall'

const Task = ({ users }) => {

    const tasks = useSelector((state) => state.payload.tasks)
    const token = useSelector((state) => state.payload.token)
    const companyId = useSelector((state) => state.payload.companyId)

    const dispatch = useDispatch()

    const [description, setDescription] = useState('')
    const [userDate, setUserDate] = useState('')
    const [userTime, setUserTime] = useState(new Date().getTime())
    const [assignUser, setAssignUser] = useState('')
    const [viewForm, setViewForm] = useState(false)

    const addTask = () => {

        if (!description || !userDate || !userTime || !assignUser) return alert("Every input field is required")

        let timeHour = parseInt(userTime.split(":")[0]) * 3600
        let timeMinute = parseInt(userTime.split(":")[1]) * 60

        let convertedTime = timeHour + timeMinute

        let zone = Date().slice(Date().indexOf("T") + 1, Date().lastIndexOf("(")).slice(0, 3);
        let hours = parseInt(zone) * 3600
        let minutes = Date().slice(Date().indexOf("T") + 1, Date().lastIndexOf("(")).slice(3)
        let convertedMinute = parseInt(minutes) * 60
        let time_zone = hours + convertedMinute

        let task = {
            task_msg: description,
            task_date: userDate,            
            task_time: convertedTime,
            time_zone,
            is_completed: 0,
            assigned_user: assignUser
        }

        ApiLogedCall(`https://stage.api.sloovi.com/task/lead_465c14d0e99e4972b6b21ffecf3dd691?company_id=${companyId}`, "POST", task, token, (result) => {
            if (result['status'] === 'success') {
                
                dispatch(setTask(result.results))
                setViewForm(false)
                setDescription("")
                setUserTime("")
                setAssignUser("")
                
            } else {
                alert(result.message)
            }


        })

    }

    const selectUser = (userId) => {
        setAssignUser(userId)
    }

    return (
        <div >
            <div className='task_pane' >
                <div className='header_content' >

                    <p> TASKS {tasks.length || 0} </p>
                    <div onClick={() => setViewForm(!viewForm)} className='add' >
                        <GrAdd />
                    </div>
                </div>
                {
                    (!viewForm && tasks.length !== 0) ? (
                        <div>
                            <RegisteredTasks users = {users} tasks={tasks} />
                        </div>

                    ) : (
                        <div className='form-body' >
                            <div className='form' >
                                <p>Task Description</p>
                                <div className='input-container' >
                                    <input value={description} onChange={(val) => setDescription(val.target.value)} type="text" />
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
                                        onChange={(data) => selectUser(data.target.value)}
                                        type="text" >
                                        <option value=""></option>
                                        {
                                            users.map((data, i) => (
                                                <option key = {`${data.user_id + i}`} value={data.user_id} >{data.name}</option>
                                            ))
                                        }

                                    </select>
                                    <div style={{ justifyContent: 'center', alignContent: 'center', alignItem: 'center' }} >
                                        <HiSelector style={{ fontSize: 18, marginRight: 5 }} />
                                    </div>

                                </div>
                            </div>
                            <br />
                            <div className='buttons' >
                                <button
                                    onClick={() => setViewForm(!viewForm)}
                                    style={{ backgroundColor: 'rgba(0,0,0,0)', border: 'none', color: '#939CAD', padding: '2.5px 15px' }} >Cancel</button>
                                <button
                                    onClick={addTask}
                                    style={{ backgroundColor: '#47BB7F', border: 'none', color: '#fff', padding: '2.5px 15px', borderRadius: 5 }} >Save</button>
                            </div>
                            <br />
                        </div>
                    )
                }

            </div>
        </div >
    )
}

export default Task;