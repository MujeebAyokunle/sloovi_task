import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    token: '',
    companyId: '',
    tasks: []
  },
  reducers: {
    setToken: (state, action) => {

      state.token = action.payload
    },
    setCompanyId: (state, action) => {

      state.companyId = action.payload
    },
    setTask: (state, action) => {

      state.tasks.push(action.payload)
    },
    fetchTask: (state, action) => {

      state.tasks = action.payload
    },
    deleteTasks: (state, action) => {

      let task = action.payload
      
      let id = task.id;

      for (let i = 0; i < state.tasks.length; i++) {
        if (state.tasks[i].id == id) {
          state.tasks.splice(i, 1);
          break;
        }
      }

    },
    updateTasks: (state, action) => {

      let task = action.payload
      
      let id = task.id;

      for (let i = 0; i < state.tasks.length; i++) {
        if (state.tasks[i].id == id) {
          state.tasks[i] = task
          break;
        }
      }

    }
  },
})

// Action creators are generated for each case reducer function
export const { setToken, setTask, incrementByAmount, setCompanyId, deleteTasks, updateTasks, fetchTask } = counterSlice.actions

export default counterSlice.reducer