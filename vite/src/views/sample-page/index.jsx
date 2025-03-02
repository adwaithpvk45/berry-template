// material-ui
  // import Typography from '@mui/material/Typography';
  // import { InputAdornment } from "@mui/material";

// project imports
// import MainCard from 'ui-component/cards/MainCard';
import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { TextField } from '@mui/material';
// import {InputLabel} from '@mui/material';
// import {OutlinedInput} from '@mui/material';
// import MenuItem from '@mui/material/MenuItem';
// import InputProps from '@mui/material'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Formik,Field,Form } from 'formik'
import * as Yup from 'yup'
import {useSelector,useDispatch} from 'react-redux'
import { fetchData } from '../../slice';
import { useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import UpdateIcon from '@mui/icons-material/UpdateOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useCallback } from 'react';
import DialogContentText from '@mui/material/DialogContentText';
import Draggable from 'react-draggable';
// ==============================|| SAMPLE PAGE ||============================== //

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    // padding: theme.spacing(2),
    borderRadius: 12,   // Custom border radius
    padding: theme.spacing(4), 
    margin:theme.spacing(4) ,
    border: "2px solidrgb(115, 115, 115)",  // Blue border
    // boxShadow: theme.shadows[10],
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


function PaperComponent(props) {
  const nodeRef = React.useRef(null);
  return (
    <Draggable
      nodeRef={nodeRef}
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} ref={nodeRef} />
    </Draggable>
  );
}



export default function SamplePage() {

    const dispatch= useDispatch();
  
  // console.log(items)
  const {items,loading,error} = useSelector((state)=>state.data);

  const [open, setOpen] = React.useState(null);

  const [view,setView] = React.useState({})

  const handleClickOpen = (diagName) => {
    setOpen(diagName);
  };
  const handleClose = ( ) => {
    setOpen(null);
  };
  
  const handleDelete = useCallback(async (id) =>{
    try {
      const response = await dispatch(fetchData({endpoint:"deleteData",method:"DELETE",body:{id}}))
   console.log(response.payload)
   await console.log(items);
   await dispatch(fetchData({ endpoint: "getData", method: "GET" }))
    } catch (error) {
      console.error("Error fetching data:",error)
    }
  },[dispatch])

  const handleView = (async(id) =>{
   try{
    const viewItem = await items.filter((item)=>item._id===id)
  console.log(viewItem)
  setView(viewItem)
}catch(err){
  console.log("Error in fetching data:",err)
}
  // console.log(view)
})

// const handleUpdate = useCallback(async (id,item) =>{
//   try {
//     console.log(item)
//     const response = await dispatch(fetchData({endpoint:`updateData/${id}`,method:"PUT",body:item}))
//     console.log(response.payload)
//     await console.log(items);
//     // await dispatch(fetchData({ endpoint: "getData", method: "GET" }))
//   } catch (error) {
//     console.error("Error fetching data:",error)
//   }
// },[dispatch])



useEffect(()=>{
  const fetchDataFromAPI = async () => {
    try {
      const response = await dispatch(fetchData({ endpoint: "getData", method: "GET" }));
      console.log("Fetched Data:", response.payload); 
      // const {items,loading,error} = useSelector((state)=>state.data);
      // console.log(items)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }; 
  fetchDataFromAPI();
},[])



const validationSchema=Yup.object({
  ID:Yup.string().required('ID is Required'),
  Model:Yup.string().required('Provide the Model No'),
  Year:Yup.number().required('Provide the Year of Release'),
  Mileage:Yup.number().required('Provide the Mileage'),
  Fuel_Type:Yup.string().required('Provide the Fuel type'),
  Top_Speed:Yup.number().required('Provide the Top speed'),
  Amount:Yup.number().required('Provide the Amount.'),
})

  return (

    <React.Fragment>
      <div style={{margin:'20px'}}>
      <Button variant="outlined" onClick={()=>handleClickOpen("diagName1")}>
        Add +
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open==="diagName1"}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
         Product Details
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
    <Formik 
    initialValues={{ID:'',Model:'',Year:'',Mileage:'',Fuel_Type:'',Top_Speed:'',Amount:''}}
    validationSchema={validationSchema}
    onSubmit={ 
      async( values,{resetForm})=>{
      console.log(values)
      try{
        const response = await dispatch(fetchData({endpoint:"addData",method:"POST",body:values}))
        console.log(response)
        if(!response.payload){
          throw new Error("The response is not available or there is an error in fetching error")
        }
      resetForm();
      // handleSubmit();
      handleClose();
    }catch(err){
      console.error("Error in fetching",err)
    }

    }}
    >
      {({ handleSubmit, errors, touched,isValid}) => ( 
        <Form onSubmit={(e)=>{
        e.preventDefault();
        handleSubmit()
      }}>
        <DialogContent dividers
        style={{display:'grid',gridTemplateColumns:'1fr 1fr',columnGap:'30px'}}>
          <Field
          as={TextField}
          label='ID'
          name='ID'
          margin='normal'
          error={touched.ID && Boolean(errors.ID)}
          helperText={touched.ID && errors.ID}
          >
          </Field>
          <Field
          as={TextField}
          label='Model'
          name='Model'
          margin='normal'
          error={touched.Model && Boolean(errors.Model)}
          helperText={touched.Model && errors.Model}
          >
          </Field>
          <Field
          as={TextField}
          label='Year'
          name='Year'
          margin='normal'
          error={touched.Year && Boolean(errors.Year)}
          helperText={touched.Year && errors.Year}
          >
          </Field>
          <Field
          as={TextField}
          label='Mileage'
          name='Mileage'
          margin='normal'
          error={touched.Mileage && Boolean(errors.Mileage)}
          helperText={touched.Mileage && errors.Mileage}
          >
          </Field>
          <Field
          as={TextField}
          label='Fuel Type'
          name='Fuel_Type'
          margin='normal'
          error={touched.Fuel_Type && Boolean(errors.Fuel_Type)}
          helperText={touched.Fuel_Type && errors.Fuel_Type}
          >
          </Field>
          <Field
          as={TextField}
          label='Top speed'
          name='Top_Speed'
          margin='normal'
          error={touched.Top_Speed && Boolean(errors.Top_Speed)}
          helperText={touched.Top_Speed && errors.Top_Speed}
          >
          </Field>
          <Field
          as={TextField}
          label='Amount'
          name='Amount'
          margin='normal'
          error={touched.Amount && Boolean(errors.Amount)}
          helperText={touched.Amount && errors.Amount}
          >
          </Field>
        </DialogContent>
        {/* </DialogContent> */}
        <DialogActions>
          <Button autoFocus onClick={handleClose} type='submit' disabled={!isValid}>
            Add product
          </Button>
        </DialogActions>
        </Form>
      )}
    </Formik>
      </BootstrapDialog>
      </div>
      
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>SL.NO</TableCell>
            <TableCell align="center">ID</TableCell>
            <TableCell align="center">Model</TableCell>
            <TableCell align="center">Year</TableCell>
            <TableCell align="center">Mileage&nbsp;(Km/L)</TableCell>
            <TableCell align="center">Fuel Type</TableCell>
            <TableCell align="center">Top speed&nbsp;(Km/hr)</TableCell>
            <TableCell align="center">Amount&nbsp;($)</TableCell>
           <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        
       <TableBody>
          { items.map((item,index)=>(
           <TableRow
              key={item.ID}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">{index+1}</TableCell>
              <TableCell align="center">{item.ID}</TableCell>
              <TableCell align="center">{item.Model}</TableCell>
              <TableCell align="center">{item.Year}</TableCell>
              <TableCell align="center">{item.Mileage}</TableCell>
              <TableCell align="center">{item.Fuel_Type}</TableCell>
              <TableCell align="center">{item.Top_Speed}</TableCell>
              <TableCell align="center">{item.Amount}</TableCell>
              <TableCell align="center">

                {/* View button and its Dialog box */}
              <IconButton aria-label="view" size="small" color='success' 
              onClick={()=>{
                handleClickOpen("diagName2");
                handleView(item._id)}}
                ><VisibilityIcon fontSize="inherit" /></IconButton>
              <Dialog
        open={open==="diagName2"}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Details
        </DialogTitle>
        <DialogContent style={{marginLeft:"60px",marginRight:"auto"}}>
        
        {view[0] && Object.entries(view[0]).map(([key,value])=>(
        <TextField
          id="outlined-read-only-input"
          key={key}
          label={key.toUpperCase()}
          value={value }
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
          style={{margin:"10px"}}
        />
         ))}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>


      {/*  update button and its dialog box */}

              <IconButton aria-label="update" size="small"  onClick={()=>{handleView(item._id);handleClickOpen("diagName3")}}><UpdateIcon fontSize="inherit" /></IconButton>
              <Dialog
        open={open==="diagName3"}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Update Data
        </DialogTitle>
        {/*Formik used as the data need to be submitted to the backend*/}
         <Formik 
    initialValues={view[0]||{}}
    validationSchema={validationSchema}
    onSubmit={ 
      async( values,{resetForm})=>{
      console.log(values)
      try{
        const response = await dispatch(fetchData({endpoint:`updateData/${values._id}`,method:"PUT",body:values}))
        console.log(response)
        if(!response.payload){
          throw new Error("The response is not available or there is an error in fetching error")
        }
      resetForm();
      // handleSubmit();
      handleClose();
    }catch(err){
      console.error("Error in fetching",err)
    }

    }}
    >
       {({ handleSubmit,handleChange,errors, touched,isValid}) => ( 
        <Form onSubmit={(e)=>{
        e.preventDefault();
        handleSubmit()
      }}>
        <DialogContent style={{marginLeft:"60px",marginRight:"auto"}}>
        
        {view && Object.entries(view[0]).map(([key])=>(
         <Field
         key={key}
         as={TextField}
         label={key}
         name={key}
         margin="normal"
         onChange={handleChange}
         style={{marginRight:"40px"}}
         error={touched.Mileage && Boolean(errors.Mileage)}
         helperText={touched.Mileage && errors.Mileage}
         ></Field>
         ))}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button type='submit' disabled={!isValid} onClick={handleClose}>Update</Button>
        </DialogActions>
      </Form>
       )}
      </Formik>
      </Dialog>
              <IconButton aria-label="delete" size="small" color='error' onClick={()=>handleDelete(item._id)}><DeleteIcon fontSize="inherit" /></IconButton>
              </TableCell>
            </TableRow>
           ))}
        </TableBody>
      </Table>
    </TableContainer>
    </React.Fragment>
  );
}
