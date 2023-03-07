import React, { ChangeEvent, useEffect, useState, useContext } from "react";
import {
  Paper,
  TextField,
  Input,
  Select,
  SelectChangeEvent,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  CircularProgress,
  Alert,
  AlertTitle,
  IconButton
} from "@mui/material";
import { Formik } from "formik";
// import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState,} from "draft-js";
import "../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Axios, { AxiosResponse } from "axios";
import dynamic from "next/dynamic";
import { EditProps } from "../types/roles";
import { MainContext } from "../context";
import htmlToDraft from 'html-to-draftjs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Role } from "../types/roles";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  {
    ssr: false,
  }
);

export const AddRole = ({editing,  cancel}: EditProps) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const [experience, setExperience] = useState("");

  const [salary, setSalary] = useState("");

  const [loading, setLoading] = useState(false);

  const [loaded, setLoaded] = useState(false);

  const [statusCode, setStatusCode] = useState<number>();

  const [contentState, setContentState] = useState()

  const { candidate, setCandidate, role, setRole, editableRole, setEditableRole } = useContext(MainContext) as any

  useEffect(() => {
    if(editableRole && editing) {
      setEditorState(EditorState.createWithContent(ContentState.createFromText(editableRole?.description)))
      setSalary(editableRole.salary)
      setExperience(editableRole.experience.toString())
    }
  },[])

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
  };

  const years = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  const handleExpChange = (event: SelectChangeEvent) => {
    setExperience(event.target.value as string);
  };

  const handleSalChange = (event: any) => {
    var regex = /^[0-9]+$/;
    var input = event.target.value;
    if (input.match(regex) || input.includes('-')) {
      setSalary(event.target.value);
    }
    setSalary(event.target.value);
  };

  const handleStatusChange = (code: number) => {
    setStatusCode(code);
    setTimeout(() => setStatusCode(0), 4000);
  };

  const displayMessage = (code: number) => {
    switch (code) {
      case 200:
        return (
          <Alert
            className="h-[70px] p-1 pb-0 w-[350px]"
            variant="filled"
            severity="success"
          >
            <AlertTitle>Success</AlertTitle>
            {!editing ? 'Role Added Successfully' : 'Role Updated Successfully'}
          </Alert>
        );
      case 400:
        return (
          <Alert
            className="h-[70px] p-1 pb-0 w-[350px]"
            variant="outlined"
            severity="error"
          >
            <AlertTitle>Error</AlertTitle>
            An Error Occured Processing your Request
          </Alert>
        );
      default:
        return <div></div>;
    }
  };
  return (
    <div>
      <Paper className=" md:h-auto bg-slate-100 p-6 align-middle md:mt-[30px] w-[79%] md:fixed">
        <div className="flex flex-row justify-between">
          {!editing && (
            <p className="text-2xl h-[40px]">Add New Role</p>
          )}
          {
            editing && (
              <div className="flex flex-row justify-between justify-items-center w-[100%]">
                <p className="text-2xl h-[40px]">Edit Role</p>
                <IconButton onClick={cancel}>
          <ArrowBackIcon className='text-green-700' />
        </IconButton>
              </div>
            )
          }
          <div className="">
            {displayMessage(statusCode as number)}
          </div>
        </div>

        <div className="mt-2">
          <form>
            <Formik
              enableReinitialize
              initialValues={{
                name: editing ? editableRole?.name : '',
                experience: "",
                unit: editing ? editableRole?.unit : '',
                salary: editing ? editableRole?.salary : '',
                description: "",
                deadline: editing ? editableRole?.deadline.split('T')[0] : '',
              }}
              onSubmit={(value, { resetForm }) => {
                setLoading(true);
                var url = !editing ? "http://localhost:5048/roles/Role" : "http://localhost:5048/roles/Role/edit"
                var body: Role = {
                  id: editing ? editableRole.id : null,
                  name: value.name,
                  experience: parseInt(experience),
                  salary: salary,
                  unit: value.unit,
                  description: editorState.getCurrentContent().getPlainText(),
                  deadline: value.deadline,
                  status: ''
                };
                console.log(body)
                Axios.post(url, body, {
                  headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                  },
                  withCredentials: false,
                })
                  .then((res: AxiosResponse) => {
                    setLoading(false);
                    console.log(res.data)
                    if(res.data.code == 200) {
                      if(!editing) {
                        resetForm();
                        setSalary("");
                        setExperience("");
                        setEditorState(EditorState.createEmpty());
                        }
                    }
                    handleStatusChange(res.data.code);
                  })
                  .catch((err) => {
                    console.log(err);
                    setLoading(false);
                  });
              }}
            >
              {({ handleChange, handleSubmit, values }) => (
                <div>
                  <div className="flex flex-col">
                    <Input
                      value={values.name}
                      onChange={handleChange("name")}
                      placeholder="Role Title"
                      className="bg-white h-[40px] w-[250px] p-2"
                    />
                    <Editor
                      editorState={editorState}
                      wrapperClassName="flex flex-col h-[300px] mt-4"
                      editorClassName="bg-white p-2"
                      onEditorStateChange={handleEditorChange}
                      placeholder="Role Description"
                    />
                    <div className=""></div>
                    <div className="flex flex-row mt-8 justify-between justify-items-center h-[50px]">
                      <div className="flex flex-row justify-between w-[65%] justify-items-center">
                        <input
                          value={values.unit}
                          onChange={handleChange("unit")}
                          placeholder="Unit"
                          className="bg-white w-[200px] p-2"
                        />

                        <FormControl className="">
                          <InputLabel
                            className="text-sm"
                            id="demo-simple-select-label"
                          >
                            Experience
                          </InputLabel>
                          <Select
                            value={experience}
                            onChange={handleExpChange}
                            className="w-[120px] text-black bg-white h-[50px]"
                            label="Experience"
                            placeholder="Experience"
                            size="small"
                          >
                            {years.map((item: string) => (
                              <MenuItem value={parseInt(item)}>{item}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <input
                          value={salary}
                          onChange={handleSalChange}
                          placeholder="Salary"
                          className="bg-white p-2 w-[100px]"
                          type="text"
                          name="salary"
                          id="salary"
                        />

                        <input
                          value={values.deadline}
                          onChange={handleChange("deadline")}
                          placeholder="Deadline"
                          className="bg-white p-2"
                          type="date"
                          name="deadline"
                          id="deadline"
                        />
                      </div>

                      <Button
                        className="bg-green-700 text-white w-[150px]"
                        onClick={handleSubmit as any}
                      >
                        {loading ? (
                          <CircularProgress
                            thickness={7}
                            className="text-white w-[10px] h-[10px] p-1"
                          />
                        ) : (
                          <p>Submit</p>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Formik>
          </form>
        </div>
      </Paper>
    </div>
  );
};
