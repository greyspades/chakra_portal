import React, { useEffect, useState } from "react";
import {
  Paper,
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
  IconButton,
  Modal,
  TextField,
} from "@mui/material";
import { Formik } from "formik";
import "../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios, { AxiosError, AxiosResponse } from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Role } from "../types/roles";
import { Notifier } from "./notifier";
import { CreateJobValidation } from "../helpers/validation";
import { Update } from "@mui/icons-material";
import { error } from "console";
import Listings from "../pages/listings";

interface Props {
  name: string;
  code: string;
  cancel: () => void;
  refresh: () => void;
}

export const AddRole = ({ name, code, cancel, refresh }: Props) => {
  const [experience, setExperience] = useState("");

  const [salary, setSalary] = useState("");

  const [loading, setLoading] = useState(false);

  const [statusCode, setStatusCode] = useState<number | null>();

  const [desc, setDesc] = useState<{ [key: string]: string }[] | null>();

  const [addDesc, setAddDesc] = useState<string>("");

  const [location, setLocation] = useState<string>("");

  const [qualification, setqualification] = useState<string>("");

  const [status, setStatus] = useState<{ [key: string]: any }>({
    open: false,
  });
  const [skill, setSkill] = useState<string>()

  const [reqSkills, setReqSkills] = useState<string[]>([])

  const [course, setCourse] = useState<string>("")

  const [jobType, setJobType] = useState<string>("")

  const [fieldType, setFieldType] = useState<string>("text")

  const [fieldErrors, setFieldErrors] = useState<{[key: string]: boolean}>({
    reqSkills: false,
    jobType: false,
    qualification: false,
    location: false,
    experience: false
  })

  const degrees = ["BSC", "MSC", "MBA", "PHD", "HND", "OND", "Other"];

  const jobTypes = ["Full time", "Part time", "Internship", "Contract"]
  

  //* gets the job description
  useEffect(() => {
    let body = {
      code,
    };
    axios
      .post(process.env.NEXT_PUBLIC_GET_JOB_DESCRIPTION as string, body)
      .then((res: AxiosResponse) => {
        if (res.data.code == 200) {
          setDesc(res.data.data);
        }
      })
      .catch((err: AxiosError) => {
        console.log(err.message);
        // setStatus({
        //   open: true,
        //   topic: "Usuccessful",
        //   content: err.message,
        // });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const locations = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT - Abuja",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];

  const handleCourseChange = (e: any) => {
    setCourse(e.target.value)
  }

  //* array containing years of experience values
  const years = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  //* handles experience change
  const handleExpChange = (event: SelectChangeEvent) => {
    setExperience(event.target.value as string);
  };

  const handleQualChange = (event: SelectChangeEvent) => {
    setqualification(event.target.value as string);
  };

  const handleJobTypeChange = (e: any) => {
    setJobType(e.target.value)
  }

    //* handles location change
    const handleLocChange = (event: SelectChangeEvent) => {
      setLocation(event.target.value as string);
    };

  //* displays status message for operations
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
            Job Listing Created Successfully'
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
      case 501:
        return (
          <Alert
            className="h-[70px] p-1 pb-0 w-[350px]"
            variant="outlined"
            severity="error"
          >
            <AlertTitle>Error</AlertTitle>
            This job is already active
          </Alert>
        );

      default:
        return <div></div>;
    }
  };

  const handleSkillChange = (e: any) => {
    let value = e.target.value
    setSkill(value)
    // if(value && value != "") {
      
    //   // if(value.includes(",")) {
    //   //   console.log(skill)
    //   //   let skillList = skill?.split(",")
    //   //   setReqSkills(skillList as any)
    //   // }
    // }
  }

  const renderReqSkills = () => {
    return skill?.split(",")?.map((item: string, idx: number) => (
      <div key={idx} className="bg-white p-2 rounded-lg text-black border-solid border-2 border-green-700 h-[40px]">
          {item}
      </div>
    ))
  }

  //* renders the job description
  const displayDesc = () => {
    return desc?.map((item: { [key: string]: string }, idx: number) => (
      <div key={idx} className="flex flex-row gap-4 mt-2">
        <p>{item?.["RowNum~~Blnk"]}</p>
        <p className="capitalize">
          {item?.["Job responsibility~~Sentc"].toLowerCase()}
        </p>
      </div>
    ));
  };

  //* clears the notifier state and closes the notifier
  const clearStatus = () => {
    setStatus({ open: false });
    cancel();
  };

  const handleDescChange = (e: any) => {
    setAddDesc(e.target.value);
  };

  return (
    <div>
      <Modal
        className="flex justify-center"
        open={status?.open ? true : false}
        onClose={clearStatus}
      >
        <Notifier
          topic={status?.topic ?? ""}
          content={status?.content ?? ""}
          close={clearStatus}
        />
      </Modal>
      <Paper className=" md:h-[90vh] bg-slate-100 p-4 align-middle md:mt-[30px] w-[79%] md:fixed overflow-y-scroll">
        <div className="flex flex-row justify-between">
          <p className="text-2xl h-[40px]">Add New Job Listing</p>
          <IconButton onClick={cancel}>
            <ArrowBackIcon className="text-green-700" />
          </IconButton>
          {statusCode && (
            <div className="">{displayMessage(statusCode as number)}</div>
          )}
        </div>
        <div className="mt-2">
          <form>
            <Formik
              enableReinitialize
              validationSchema={CreateJobValidation}
              initialValues={{
                name: name,
                experience: "",
                deadline: "",
                course: "",
              }}
              onSubmit={(value, { resetForm }) => {
                
                
                //* adds a new job role
                if(reqSkills && location && qualification && experience) {
                  
                  let combinedDesc = [
                    ...(desc as { [key: string]: string }[] ?? [{}]),
                    {
                      ["RowNum~~Blnk"]: "",
                      ["JFR Code~~Blnk"]: "",
                      ["Job responsibility~~Sentc"]: addDesc,
                    },
                  ];

                  //* add job role request payload
                  const body: Role = {
                    name: value.name,
                    experience: parseInt(experience),
                    description: JSON.stringify(combinedDesc),
                    deadline: value.deadline,
                    status: "active",
                    code,
                    location,
                    skills: JSON.stringify(skill?.split(",")),
                    qualification: `${qualification} in ${value.course}`,
                    jobType
                  };
                  // console.log(body)
                  setLoading(true);
                  axios
                  .post(
                    process.env.NEXT_PUBLIC_CREATE_NEW_JOB_ROLE as string,
                    body,
                    {
                      headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type": "application/json",
                      },
                      withCredentials: false,
                    }
                  )
                  .then((res: AxiosResponse) => {
                    setLoading(false);
                                    
                    if (res.data.code == 200) {
                      resetForm();
                      setSalary("");
                      setExperience("");
                      refresh();
                      setStatus({
                        open: true,
                        topic: "Successful",
                        content: `Successfully created job role ${name}`,
                      });
                    } else {
                      setStatus({
                        open: true,
                        topic: "Unsuccessful",
                        content: res.data.message,
                      });
                    }
                  })
                  .catch((err: AxiosError) => {
                    setLoading(false);
                    setStatus({
                      open: true,
                      topic: "Unsuccessful",
                      content: err.message,
                    });
                  });
                } else if(!reqSkills) {
                  setFieldErrors({ ...fieldErrors, reqSkills: true})
                  console.log("has skill error")
                } else if(!location) {
                  setFieldErrors({ ...fieldErrors, location: true})
                } else if(!qualification) {
                  setFieldErrors({ ...fieldErrors, qualification: true})
                } else if(!experience) {
                  setFieldErrors({ ...fieldErrors, experience: true})
                } else if(!jobType) {
                  setFieldErrors({ ...fieldErrors, jobType: true})
                }
              }}
            >
              {({ handleChange, handleSubmit, values, errors, setFieldValue }) => (
                <div>
                  <div className="flex flex-col">
                    <FormControl>
                      <Input
                        value={values.name}
                        onChange={handleChange("name")}
                        placeholder="Job Role Title"
                        className="bg-white h-[40px] w-[250px] p-2"
                      />
                      <div className="text-red-600 text-[10px] ml-4">
                        {errors.name as any}
                      </div>
                    </FormControl>
                    <div className="">
                      <p className="text-[16px] mt-4 mb-1">Responsibilities</p>
                    </div>
                    <div className="h-[200px] bg-white p-4 overflow-y-scroll">
                      {displayDesc()}
                      <div className="mt-6">
                        <p className="font-semibold">Additional data</p>
                        <TextField
                          value={addDesc}
                          onChange={handleDescChange}
                          multiline
                          minRows={3}
                          className="bg-white w-[100%]"
                        />
                      </div>
                    </div>
                    <div className=""></div>
                    <div className="flex flex-row mt-4 justify-between justify-items-center h-[50px]">
                      <div className="flex flex-row justify-between w-[100%] justify-items-center">
                        {/* <FormControl>
                          <input
                            value={values.unit}
                            onChange={handleChange("unit")}
                            placeholder="Unit"
                            className="bg-white w-[200px] p-2"
                          />
                          <div className="text-red-600 text-[10px] ml-4">
                            {errors.unit as any}
                          </div>
                        </FormControl> */}
                        
                        <FormControl className="">
                          <InputLabel
                            className="text-sm"
                            id="demo-simple-select-label"
                          >
                            Job type
                          </InputLabel>
                          <Select
                            value={jobType}
                            onChange={handleJobTypeChange}
                            className="w-[120px] text-black bg-white h-[40px]"
                            label="Job location"
                            placeholder="Job Type"
                            size="small"
                          >
                            {jobTypes.map((item: string, idx: number) => (
                              <MenuItem key={idx} value={item}>
                                {item}
                              </MenuItem>
                            ))}
                          </Select>
                          {fieldErrors.jobType && (
                            <div className="text-red-600 text-[10px] ml-4">
                                This Field is required
                            </div>
                          )}
                        </FormControl>

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
                            className="w-[120px] text-black bg-white h-[40px]"
                            label="Experience"
                            placeholder="Experience"
                            size="small"
                          >
                            {years.map((item: string, idx: number) => (
                              <MenuItem key={idx} value={parseInt(item)}>
                                {item}
                              </MenuItem>
                            ))}
                          </Select>
                          {fieldErrors.experience && (
                            <div className="text-red-600 text-[10px] ml-4">
                                This Field is required
                            </div>
                          )}
                        </FormControl>

                        <FormControl className="">
                          <InputLabel
                            className="text-sm"
                            id="demo-simple-select-label"
                          >
                            Job Location
                          </InputLabel>
                          <Select
                            value={location}
                            onChange={handleLocChange}
                            className="w-[120px] text-black bg-white h-[40px]"
                            label="Job location"
                            placeholder="Job location"
                            size="small"
                          >
                            {locations.map((item: string, idx: number) => (
                              <MenuItem key={idx} value={item}>
                                {item}
                              </MenuItem>
                            ))}
                          </Select>
                          {fieldErrors.location && (
                            <div className="text-red-600 text-[10px] ml-4">
                                This Field is required
                            </div>
                          )}
                        </FormControl>

                        <FormControl className="">
                          <InputLabel
                            className="text-sm"
                            id="demo-simple-select-label"
                          >
                            Required Qualification
                          </InputLabel>
                          <Select
                            value={qualification}
                            onChange={handleQualChange}
                            className="w-[120px] text-black bg-white h-[40px]"
                            label="Job location"
                            placeholder="Qualification"
                            size="small"
                          >
                            {degrees.map((item: string, idx: number) => (
                              <MenuItem key={idx} value={item}>
                                {item}
                              </MenuItem>
                            ))}
                          </Select>
                          {fieldErrors.qualification && (
                            <div className="text-red-600 text-[10px] ml-4">
                                This Field is required
                            </div>
                          )}
                        </FormControl>

                        <FormControl className="">
                          <Input
                            value={values.course}
                            onChange={handleChange("course")}
                            className="w-[220px] text-black bg-white h-[40px] px-2"
                            placeholder="Course of study"
                            size="small"
                          />
                            
                          <div className="text-red-600 text-[10px] ml-4">
                            {errors.course as any}
                          </div>
                        </FormControl>

                        <FormControl>
                          <input
                            value={values.deadline}
                            onChange={handleChange("deadline")}
                            placeholder="deadline"
                            className="bg-white p-2"
                            type={fieldType}
                            onFocus={() => setFieldType("date")}
                            onBlur={() => setFieldType("text")}
                            name="Application Deadline"
                            id="deadline"
                          />
                          <div className="text-red-600 text-[10px] ml-4">
                            {errors.deadline as any}
                          </div>
                        </FormControl>
                      </div>
                    </div>
                    
                    <div className="flex flex-row gap-4 mt-4">
                    <FormControl>
                      <InputLabel>
                      Skills seperated by commas
                      </InputLabel>
                          <Input
                            value={skill}
                            onChange={handleSkillChange}
                            placeholder="Required skills"
                            className="bg-white p-2 min-w-[300px] h-[40px]"
                            type="text"
                          />
                          {fieldErrors.reqSkills && (
                            <div className="text-red-600 text-[10px] ml-4">
                                This Field is required
                            </div>
                          )}
                        </FormControl>
                        <div className="flex flex-row flex-wrap gap-4 mt-4">
                          {renderReqSkills()}
                        </div>
                    </div>
                    <div className="mt-[20px]">
                    <Button
                        className="bg-green-700 text-white w-[150px]"
                        onClick={handleSubmit as any}
                      >
                        {loading ? (
                          <CircularProgress
                            thickness={7}
                            className="text-white w-[30px] h-[30px] p-1"
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
