// DEPENDENCIES
import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import NavBar from './components/NavBar'
import Home from './components/Home'
import Logs from './components/Logs.js'
import LogNewForm from './components/LogNewForm.js'
import Show from './components/Show'
import Edit from './components/Edit.js'
import NotFound from './components/NotFound.js'
import axios from 'axios'
import{ apiUrl } from './util/apiURL'

// CONFIGURATION
const API_BASE = apiUrl()


const App = () => {

  const [ logs, setLogs ] = useState([])

  useEffect(() => {
    axios.get(`${API_BASE}/logs`)
    .then((response)=>{ 
      const { data } = response
      setLogs(data)
     })
  }, [])

  const addLog = (newLog) =>{ 
    axios.post(`${API_BASE}/logs`, newLog).then((response) =>{ 
      return axios.get(`${API_BASE}/logs`)
    }).then((response) =>{ 
      setLogs(response.data)
    }).catch((error) =>{ 
      console.error(error)
    })
  }

  const deleteLog = (index) => { 
    axios.delete(`${API_BASE}/logs/${index}`).then((response) => { 
      const logsArray = [...logs]
      logsArray.splice(index,1)
      setLogs(logsArray)
     }).catch((error)=>{ 
       console.error(error)
     })
   }

   const updateLog= (updatedLog, index) => { 
    axios.put(`${API_BASE}/logs/${index}`, updatedLog)
    .then(
      (response) =>{ 
        const updatedArray = [ ...logs]
        updatedArray[index] = updatedLog
        setLogs(updatedArray)
       },
      (error) =>{
        console.error(error)
      }
    )
  }

  return (
    <div className="container-fluid">
      <NavBar />
      <Switch>
        <Route exact path="/">
          <Home key={uuid()}/>
        </Route>
        <Route exact path="/logs">
          <Logs logs={logs} key={uuid()}/>
        </Route>
        <Route path="/logs/new">
          <LogNewForm addLog={addLog} key={uuid()}/>
        </Route>
        <Route exact path="/logs/:index">
          <Show deleteLog={deleteLog} logs={logs} key={uuid()}/>
        </Route>
        <Route exact path="/logs/:index/edit">
          <Edit updateLog={updateLog} logs={logs} key={uuid()}/>
        </Route>
        <Route>
            <NotFound />
          </Route> 
      </Switch>
    </div>
  );
};

export default App;
