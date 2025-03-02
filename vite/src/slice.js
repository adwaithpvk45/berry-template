import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
// import { useMemo } from "react";
export const fetchData = createAsyncThunk("data/fetch",async({endpoint,method="GET",body=null})=>{
    try{
        console.log("hello")
        console.log(body)  
        console.log("Sending request to:", `http://localhost:4000/${endpoint}`);
        console.log("Method:", method);
        console.log("Request body:", body);
        const response= await fetch(`http://localhost:4000/${endpoint}`,{
            method,
            headers:{"Content-type":"application/json"},
            body:body?JSON.stringify(body):null
        })
        console.log(response)
        if(!response.ok){
        throw new Error("Request Failed!")
        }

        if(method=="DELETE"){
            return body;
        }
        const data= await response.json()
        console.log("data:",data)
        return data
    }catch(error){
          console.error("Error in fetching data,",error)
    }
})

const dataSlice=createSlice({
    name:"data",
    initialState:{items:[],loading:false,error:null},
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchData.pending,(state)=>{
            state.loading=true
        })
        .addCase(fetchData.fulfilled,(state,action)=>{
            if(action.meta.arg.method=="DELETE"){
                console.log(action.payload)
                state.items=[...state.items.filter((item)=>{ return item._id!==action.payload})]                
                console.log(state.items)
            }else if(action.meta.arg.method=="POST"){
                console.log(action.payload)
                state.items=[...state.items,action.payload]
                console.log(state.items)
            }
            else if(action.meta.arg.method=="PUT"){
                console.log(action.payload)
                state.items=[...state.items.filter((item)=>{ return item._id!==action.payload._id})]                
                state.items=[...state.items,action.payload]
                console.log(state.items)    
            }
            else{
                  console.log(action.payload)
                  state.items=action.payload
                  console.log(state.items)
            }
            state.loading=false
        })
        .addCase(fetchData.rejected,(state)=>{
            state.loading=false
            state.error=action.error.message
        })
    }
})

export const dataReducer = dataSlice.reducer
