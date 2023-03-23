import React, { useState, useEffect, useContext } from "react";
import { Formik } from "formik";
import Axios, { AxiosError, AxiosResponse } from "axios";
import {
  Button,
  Input,
  InputAdornment,
  Paper,
  TextField,
  CircularProgress,
  IconButton,
  FormControl,
  InputLabel
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
//   import { Role } from "../types/roles";
import VisibilityIcon from "@mui/icons-material/Visibility";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { MainContext } from "../../context";
import { useRouter } from "next/router";
import CheckIcon from "@mui/icons-material/Check";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BusinessIcon from '@mui/icons-material/Business';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import Divider from "@mui/material/Divider";



export const PersonalInfo = ({ changeStage }: any) => {
  const [file, setFile] = useState<File>();

  const [loading, setLoading] = useState<boolean>(false);

  const [visible, setVisible] = useState<boolean>(false);
  const [stage, setStage] = useState<number>(0);
  const [error, setError] = useState<string>();
  const [exp, setExp] = useState<Experience[]>([]);
  const [pastRoleIdx, setPastRoleIdx] = useState<number>(0);
  const [skills, setSkills] = useState<string[]>();
  const [education, setEducation] = useState<[]>();

  const {
    candidate,
    setCandidate,
    role,
    setRole,
    cvData,
    setCvData,
    cvMeta,
    setCvMeta,
  } = useContext(MainContext) as any;

  const router = useRouter();

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const parseCvMetadata = () => {
    var metaData: Experience[] = [];
    var skillsData:string[] = [];
    var eduData:any = [];
    cvMeta.experience.forEach((item: {[key: string]: any}) => {
      let body: Experience = {
        employer: item?.employer?.name?.raw,
        title: item?.jobTitle?.raw,
        startDate: item?.startDate?.date,
        endDate: item?.endDate?.date,
        description: item?.description
      }
      metaData.push(body)
    })

    cvMeta?.skills?.raw?.forEach((item: any) => {
      skillsData.push(item?.name)
    })

    cvMeta?.education?.educationDetails?.forEach((item: any) => {
      let body = {
        school:item?.schoolName?.raw,
        degree:item?.degree?.name?.raw,
        course:item?.majors?.[0],
        graduationDate:item?.major?.lastEducationDate?.data.split("T")[0]
      }
      eduData.push(body)
    })

    setExp(metaData);
    setSkills(skillsData);
    setEducation(eduData);
  }

  useEffect(() => {
    parseCvMetadata();
  },[]);

  const uploadCv = () => {
    if (file) {
      setError("");
      setLoading(true);
      Axios.post(
        "http://localhost:5048/upload",
        { cv: file },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "multipart/form-data",
          },
        }
      )
        .then((res: AxiosResponse) => {
          setLoading(false);
          console.log(res.data);
          if (res.data.code == 200) {
            setCvData(res.data.data);
            setCvMeta(res.data.cvMeta);
            changeStage(1);
          }
        })
        .catch((err: AxiosError) => {
          console.log(err.message);
          setLoading(false);
        });
    } else {
      setError("Please select a file");
    }
  };

  const handleExpChange = (type: string, index: number, e: any) => {
    var update = exp.map((item: any, idx) => {
        if(idx == index) {
            item[type] = e.target.value
        }
        return item
    });
    console.log(update)
    setExp(update)
  }

  const renderExperience = () => {
    return exp?.map((item: Experience, idx: number) => {

        return (
            <div key={idx} className="grid justify-center mb-4">
            <div className="flex flex-row gap-2">
            <FormControl>
              <InputLabel className="">
                Employer
              </InputLabel>
              <Input value={item.employer} onChange={(e) => handleExpChange("employer", idx, e)} className="bg-white rounded-md h-[40px] w-[230px] p-4"
              startAdornment={
                <InputAdornment position="start">
                  <BusinessIcon className="text-green-700" />
                </InputAdornment>
              }
              />
            </FormControl>
            <FormControl>
              <InputLabel className="">
                Title
              </InputLabel>
              <Input value={item.title} onChange={(e) => handleExpChange("title", idx, e)} className="bg-white rounded-md h-[40px] w-[230px] p-4"
              startAdornment={
                <InputAdornment position="start">
                  <WorkOutlineIcon className="text-green-700" />
                </InputAdornment>
              }
              />
            </FormControl>
              <FormControl>
                <InputLabel>
                  Start Date
                </InputLabel>
              <Input
                value={item.startDate.split("T")[0]}
                type="date"
                onChange={(e) => handleExpChange("startDate", idx, e)}
                className="bg-white rounded-md h-[40px] w-[190px] p-4"
                startAdornment={
                    <InputAdornment position="start">
                      <CalendarTodayIcon className="text-green-700" />
                    </InputAdornment>
                  }
              />
              </FormControl>
                <FormControl>
                <InputLabel>
                  Start Date
                </InputLabel>
                <Input
                value={item.endDate.split("T")[0]}
                type="date"
                onChange={(e) => handleExpChange("endDate", idx, e)}
                className="bg-white rounded-md h-[40px] w-[190px] p-4"
                startAdornment={
                    <InputAdornment position="start">
                      <CalendarTodayIcon className="text-green-700" />
                    </InputAdornment>
                  }
              />
                </FormControl>
            </div>
            <TextField
            value={item.description}
            className="bg-white rounded-md  w-[100%] mt-[7px] mb-[30px]"
            onChange={(e) => handleExpChange("description", idx, e)}
            minRows={4}
            multiline
            />
          </div>
        )
    });
  };

  const renderSkills = () => {
    return skills?.map((item: string) => (
      <div className="flex p-2 m-2 text-[12] bg-white h-[40px] overflow-hidden">
        {item}
      </div>
    ))
  }

  const renderEducation = () => {
    return education?.map((item: any) => (
      <div>
        {item.degree}
      </div>
    ))
  }
  // school:item?.schoolName?.raw,
  //       degree:item?.degree?.name?.raw,
  //       course:item?.majors?.[0],
  //       graduationDate:item?.major?.lastEducationDate?.data.split("T")[0]

  return (
    <div>
      <Paper className="flex flex-col w-[100%] justify-items-center md:h-[500px] bg-slate-100 overflow-y-scroll pb-10">
        <p className="text-center font-bold text-xl mt-4 mb-4">
          Personal Information
        </p>
        <form>
          <Formik
            initialValues={{
              firstName: cvMeta?.firstname,
              lastName: cvMeta?.lastname,
              email: cvMeta?.email,
              phone: cvMeta?.contact?.raw,
              school: "",
              degree: "",
              field: "",
              dob: "",
            }}
            onSubmit={(value: any) => {}}
          >
            {({ handleSubmit, handleChange, values }) => (
              <div className="grid justify-items-center">
                <div className="flex flex-row gap-6">
                  <Input
                    placeholder="First name"
                    required
                    value={values.firstName}
                    onChange={handleChange("firstName")}
                    className="bg-white rounded-md h-[40px] w-[400px] p-4 m-3"
                    startAdornment={
                      <InputAdornment position="start">
                        <PersonIcon className="text-green-700" />
                      </InputAdornment>
                    }
                  />
                  <Input
                    placeholder="Last name"
                    required
                    value={values.lastName}
                    onChange={handleChange("lastName")}
                    className="bg-white rounded-md h-[40px] w-[400px] p-4 m-3"
                    startAdornment={
                      <InputAdornment position="start">
                        <PersonIcon className="text-green-700" />
                      </InputAdornment>
                    }
                  />
                </div>

                <div className="flex flex-row gap-6">
                  <Input
                    placeholder="Email Address"
                    required
                    value={values.email}
                    onChange={handleChange("email")}
                    className="bg-white rounded-md h-[40px] w-[400px] p-4 m-3"
                    startAdornment={
                      <InputAdornment position="start">
                        <EmailIcon className="text-green-700" />
                      </InputAdornment>
                    }
                  />
                  <Input
                    placeholder="Phone Number"
                    required
                    value={values.phone}
                    onChange={handleChange("phone")}
                    className="bg-white rounded-md h-[40px] w-[400px] p-4 m-3"
                    startAdornment={
                      <InputAdornment position="start">
                        <PhoneIcon className="text-green-700" />
                      </InputAdornment>
                    }
                  />
                </div>
                <div className="flex flex-row gap-6">
                  <Input
                    placeholder="Date of Birth"
                    required
                    value={values.dob}
                    type="date"
                    onChange={handleChange("dob")}
                    className="bg-white rounded-md h-[40px] w-[400px] p-4 m-3"
                    startAdornment={
                      <InputAdornment position="start">
                        <CalendarTodayIcon className="text-green-700" />
                      </InputAdornment>
                    }
                  />
                  <Input
                    placeholder="Phone Number"
                    required
                    value={values.phone}
                    onChange={handleChange("phone")}
                    className="bg-white rounded-md h-[40px] w-[400px] p-4 m-3"
                    startAdornment={
                      <InputAdornment position="start">
                        <PhoneIcon className="text-green-700" />
                      </InputAdornment>
                    }
                  />
                </div>
                

                <div className="">
                <Divider  className="bg-green-700 h-[2px] mt-4" />
                  <p className="mt-6 mb-6 text-xl font-bold">
                    Work History
                  </p>
                    {renderExperience()}
                  <Divider  className="bg-green-700 h-[2px] mb-4 mt-[-20px]" />
                </div>

                <div className="w-[100%]">
                <p className="mb-6 text-xl font-bold pl-7">
                    Skills
                  </p>
                  <div className="grid grid-cols-5 p-4">
                  {renderSkills()}
                  </div>
                  {/* <Divider variant="inset"  className="bg-green-700 h-[2px] w-[100%] mt-4" /> */}
                </div>
                <div className="w-[100%]">
                <p className="mb-6 text-xl font-bold pl-7">
                    Education
                  </p>
                  
                </div>
                <Button
                        className="bg-green-700 text-white w-[150px]"
                        onClick={() => console.log(cvMeta.skills.raw)}
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
            )}
          </Formik>
        </form>
      </Paper>
    </div>
  );
};
