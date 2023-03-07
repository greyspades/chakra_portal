import React, { useState, useEffect, useContext } from 'react'
import { Paper, SelectChangeEvent, Select, MenuItem, FormControl, InputLabel, Divider, Button, IconButton } from '@mui/material'
import { Role } from '../types/roles';
import  Axios  from 'axios';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { MainContext } from '../context';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Context } from 'vm';
import { AppContext } from 'next/app';
import { AddRole } from './addRole';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const EditRole = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchVal, setSearchVal] = useState<string>("");
  const [activeRole, setActiveRole] = useState<Role>();
  const [step, setStep] = useState<number>(1)
  const [unit, setUnit] = useState<string>("Finance")
  const [editing, setEditing] = useState<boolean>(false)

  const { candidate, setCandidate, role, setRole, editableRole, setEditableRole } = useContext(MainContext) as any

  const units: string[] = [
    'Finance',
    'Networking',
    'Audit',
    'Legal',
    'Maintainance',
    'It'
  ]

  useEffect(() => {
    Axios.get(`http://localhost:5048/roles/Role/byUnit/${unit}`).then((res) => {
      setRoles(res.data);
    });
  }, [unit]);

  const toggleEditMode = (role: Role) => {
    setEditableRole(role)
    setEditing(true)
  }
  
  const cancel = () => {
    setEditing(false)
  }

  const displayRoles = () => {
    return roles?.map((role: Role, idx) => (
      <div key={idx} className='bg-white w-[100%] h-[40px] mt-3 flex flex-row rounded-md p-2 justify-between justify-items-center'>
        <div className='text-green-700'>
        {role.name}
        </div>
        <div className='flex'>
          <div className='flex flex-row mr-[70px] justify-items-center'>
            <p>
              Active
            </p>
            <FiberManualRecordIcon className='text-green-700 ml-2 w-3' />
          </div>
        <IconButton className='mr-4' onClick={() => toggleEditMode(role)}>
            <DriveFileRenameOutlineIcon className='text-green-700' />
          </IconButton>
        <IconButton>
            <DeleteOutlineIcon className='text-green-700' />
          </IconButton>
        </div>
      </div>
    ))
  }

  const handleUnitChange = (event: SelectChangeEvent) => {
    setUnit(event.target.value as string);
  };

  return (
    <div>
      {!editing && (
        <Paper className=" md:h-auto bg-slate-100 p-6 align-middle md:mt-[30px] w-[79%] md:fixed">
        <div className='flex flex-row'>
        <p className="text-2xl h-[40px]">Edit Role</p>
        </div>
        <div className='flex flex-row mt-4'>
          <p>
            
          </p>
          <FormControl>
            <InputLabel className="text-sm" id="demo-simple-select-label">
            Unit
            </InputLabel>
          <Select
          value={unit}
          onChange={handleUnitChange}
          className="w-[170px] text-black bg-white h-[50px]"
          label="Experience"
          placeholder="Experience"
          size="small"
          >{units.map((item: string) => (
            <MenuItem className='text-black' value={item}>{item}</MenuItem>
          ))}
          </Select>
          </FormControl>
        </div>
        <Divider variant="fullWidth" className="bg-green-700 h-[2px] mt-4" />
        <div className='overflow-y-auto md:h-[350px]'>
          {displayRoles()}
        </div>
        {/* <Button onClick={() => console.log(editableRole)}>
          click
        </Button> */}
      </Paper>
      )}
      {editing && (
        <AddRole cancel={cancel} editing={editing} role={role} />
      )}
    </div>
  )
}
