
const ApiLogedCall = (url, method, data, token, cb) => {        
    try {        
        console.log(token)
        fetch(url, {            
            method : method,
            headers : {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'content-type' : 'application/json',                
            },                        
            body : JSON.stringify(data) 
            
        })
        .then(res => res.json())
        .then( async (data) => {                        
            await cb(data)
        })
    } catch (error) {
        console.log(error)
    }
}

const ApiLogedGetCall = (url, method, token, cb) => {        
    try {        
        console.log(token)
        fetch(url, {            
            method : method,
            headers : {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'content-type' : 'application/json',                
            }
            
        })
        .then(res => res.json())
        .then( async (data) => {                        
            await cb(data)
        })
    } catch (error) {
        console.log(error)
    }
}

const ApiLoginCall = (url, method, data, cb) => {    
    
    try {
        fetch(url, {            
            method : method,
            headers : {                
                'Accept': 'application/json',
                'content-type' : 'application/json',                
            },            
            body : JSON.stringify(data)
        })
        .then(res => res.json())
        .then( async (data) => {                        
            await cb(data)
        })
    } catch (error) {
        console.log(error)
    }
}

export { ApiLogedCall, ApiLoginCall, ApiLogedGetCall };