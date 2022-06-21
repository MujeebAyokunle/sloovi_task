import React, { useEffect, useState } from 'react'
import './App.css';
import Task from './components/task';
import { ApiLogedGetCall, ApiLoginCall } from './apiCall'
import { useDispatch, } from 'react-redux'
import { setToken, setCompanyId } from './reducer'
import { fetchTask } from './reducer'

function App() {

  const dispatch = useDispatch()

  const [users, setUsers] = useState([])

  useEffect(() => {
    const data = {
      email: "smithwills1989@gmail.com",
      password: "12345678"
    }

    ApiLoginCall('https://stage.api.sloovi.com/login', 'POST', data, (result) => {
      console.log(result)
      dispatch(setToken(result.results.token))
      dispatch(setCompanyId(result.results.company_id))
      
      ApiLogedGetCall(`https://stage.api.sloovi.com/team?product=outreach&company_id=${result.results.company_id}`, "GET", result.results.token, (response) => {
        setUsers(response.results.data)
        
        ApiLogedGetCall(`https://stage.api.sloovi.com/task/lead_465c14d0e99e4972b6b21ffecf3dd691?company_id=${result.results.company_id}`, "GET", result.results.token, (data) => {
          console.log(data.results)
          dispatch(fetchTask(data.results))
          
        })
      })

    })

  }, [])

  return (
    <div className="row App">
      <div className='row' style={{ height: '100vh' }}>

        <div className='col-lg-2 col-md-2 col-sm-2 nomargin' style={{ height: '100%', backgroundColor: '#323E4D' }} >

        </div>
        <div className='col-lg-10 col-md-10 col-sm-10 nomargin' style={{ backgroundColor: '#FAFAFA' }} >
          <div className='topNav' >

          </div>
          <div className='container' >
            <Task users={users} />
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
