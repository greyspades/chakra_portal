import React, { useState, useEffect, FC, useContext } from "react";
import Axios, { AxiosError, AxiosResponse } from "axios";
import { Formik, ErrorMessage } from "formik";
import {
  Button,
  Input,
  InputAdornment,
  Paper,
  TextField,
  CircularProgress,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  Radio
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { Role } from "../types/roles";
import { Fields } from "../types/roles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { MainContext } from "../context";
import { useRouter } from "next/router";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BusinessIcon from "@mui/icons-material/Business";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";
import SchoolIcon from "@mui/icons-material/School";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import BookIcon from "@mui/icons-material/Book";
import CloseIcon from '@mui/icons-material/Close';
import { ApplicationValidation, CandidateValidation } from "../helpers/validation";
import { Candidate } from "../types/candidate";
import { Notifier } from "./notifier";
import ArticleIcon from '@mui/icons-material/Article';



export const Application: FC<Role> = (
  { deadline, experience, unit, salary, name, id }: Role,
  { goBack }: any
) => {
  const [info, setInfo] = useState<{
    firstName: string;
    lastName: string;
    dob: Date;
    email: string;
    password: string;
    phone: string;
    roleId: string;
  }>();
  const [file, setFile] = useState<File>();

  const [loading, setLoading] = useState<boolean>(false);

  const [visible, setVisible] = useState<boolean>(false);

  const [expForm, setExpForm] = useState<{}[]>([]);

  const [skillForm, setSkillForm] = useState<{}[]>([]);

  const [eduField, setEdufield] = useState<{}[]>([]);

  const [gender, setGender] = useState<string>("Male");

  const [fileError, setFileError] = useState<string>("");

  const [hasCert, setHasCert] = useState<boolean>();

  const [coverLetter, setCoverLetter] = useState<string>();

  const [addLetter, setAddLetter] = useState<boolean>();

  const [basicInfo, setBasicInfo] = useState<{[key: string]: string}>()

  const [status, setStatus] = useState<{[key: string]: any}>({
    open: false
  })

  const { candidate, setCandidate, role, setRole } = useContext(
    MainContext
  ) as any;

  const router = useRouter();

  const genders = [
    "Male",
    "Female",
  ]

  useEffect(() => {
    let data = JSON.parse(sessionStorage.getItem("cred") ?? "")
    if(data) {
      setBasicInfo(data)
      setGender(data?.gender)
    }
  }, [])

  const fields: Fields[] = [
    {
      name: "firstName",
      icon: <PersonIcon />,
      placeholder: "First name",
    },
    {
      name: "lastName",
      icon: <PersonIcon />,
      placeholder: "Last name",
    },
    {
      name: "phone",
      icon: <PhoneIcon />,
      placeholder: "Phone Number",
    },
    {
      name: "email",
      icon: <EmailIcon />,
      placeholder: "Email Address",
    },
    {
      name: "dob",
      icon: <EmailIcon />,
      placeholder: "Date Of Birth",
    },
  ];

  const degrees = ["Bsc", "Msc", "Mba", "Phd", "Hnd", "Ond", "Other"];

  const handleFileChange = (e: any) => {
    let extensions = ["pdf"];
    let file: File = e.target.files[0];
    let type = file.name.split(".")

    if(extensions.includes(type[type.length -1]) && file.size < 3000000) {
      setFile(e.target.files[0]);
      setFileError("");
    }
    else if(!extensions.includes(type[type.length -1])) {
      setFileError("please select a pdf");
    }
    else if(!(file.size < 3000000)) {
      setFileError("please select a file less than 3mb");
    }
  };

  const handleExpChange = (type: string, index: number, e: any) => {
    console.log(e.target.value)
    if(type != "isCurrent") {
      var update = expForm?.map((item: any, idx) => {
        if (idx == index) {
          item[type] = e.target.value;
        }
        return item;
      });
      setExpForm(update);
    } else {
      var update = expForm?.map((item: any, idx) => {
        if (idx == index) {
          item.isCurrent = !item.isCurrent;
        }
        return item;
      });
      console.log(update)
      setExpForm(update);
    }
  };

  const removeExp = (id: number) => {
    const update = expForm?.filter((item) => expForm.indexOf(item) != id);
    setExpForm(update);
  }

  const removeEdu = (id: number) => {
    const update = eduField?.filter((item) => eduField.indexOf(item) != id);
    setEdufield(update);
  }

  const renderExperience = () => {
    return expForm?.map((item: any, idx: number) => {
      return (
        <div key={idx} className="grid justify-center ">
          <div className="grid justify-end">
            <IconButton className="bg-white h-[35px] w-[35px] mt-[-20px] mb-[20px]" onClick={() => removeExp(idx)}>
              <CloseIcon className="w-[15px] h-[15px]" />
            </IconButton>
          </div>
          <div className="flex flex-row gap-2">
            <FormControl>
              <InputLabel className="flex flex-row ml-[-10px]">
              <p className="mr-2 text-red-700 text-[13px]">
                    *
                  </p>
                Employer
              </InputLabel>
              <Input
                placeholder="Employer"
                value={item.employer}
                onChange={(e) => handleExpChange("employer", idx, e)}
                className="bg-white rounded-md h-[40px] w-[230px] p-4"
                startAdornment={
                  <InputAdornment position="start">
                    <BusinessIcon className="text-green-700" />
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl>
            <InputLabel className="flex flex-row ml-[-10px]">
              <p className="mr-2 text-red-700 text-[13px]">
                    *
                  </p>
                Title
              </InputLabel>
              <Input
                placeholder="Title"
                value={item.title}
                onChange={(e) => handleExpChange("title", idx, e)}
                className="bg-white rounded-md h-[40px] w-[230px] p-4"
                startAdornment={
                  <InputAdornment position="start">
                    <WorkOutlineIcon className="text-green-700" />
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl>
            <InputLabel className="flex flex-row ml-[-10px]">
              <p className="mr-2 text-red-700 text-[13px]">
                    *
                  </p>
                Start Date
              </InputLabel>
              <Input
                placeholder="Start Date"
                value={item.startDate}
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
            <InputLabel className="flex flex-row ml-[-10px]">
              <p className="mr-2 text-red-700 text-[13px]">
                    *
                  </p>
                End Date
              </InputLabel>
              <Input
                disabled = {item?.isCurrent ? true : false}
                placeholder="End Date"
                value={item.endDate}
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
            <FormControl className="flex flex-col">
              <p className="text-[11px] mt-[-10px] ml-[-5px]">
              Is current
              </p>
              {/* <Input type="radio" value={item?.isCurrent} onChange={(e) => console.log(e.target.value)} /> */}
              <Radio name="isCurrent" className="text-green-700" checked={item?.isCurrent === true} value={item?.isCurrent} onClick={(e) => handleExpChange("isCurrent", idx, e)} />
            </FormControl>
          </div>
          <TextField
            placeholder="Job Description"
            value={item.description}
            className="bg-white rounded-md  w-[100%] mt-[7px] mb-[30px]"
            onChange={(e) => handleExpChange("description", idx, e)}
            minRows={4}
            multiline
          />
        </div>
      );
    });
  };

  const addEdu = (type: string, e: any, index: number) => {
    if(type == "degree" && e.target.value == "Other") {
      setHasCert(true);
    }
    // else {
    //   setHasCert(false)
    // }
    let update = eduField?.map((item: { [key: string]: string }, idx) => {
      if (idx == index) {
        item[type] = e.target.value;
      }
      return item;
    });
    setEdufield(update);
  };

  const removeCert = () => {
    setHasCert(false)
  }

  const renderEducation = () => {
    return eduField.map((item: {[key: string]: string}, idx: number) => (
      <div key={idx}>
        <div className="grid justify-end">
      <IconButton className="bg-white h-[35px] w-[35px]" onClick={() => removeEdu(idx)}>
        <CloseIcon className="w-[15px] h-[15px]" />
      </IconButton>
    </div>
      <div className="grid grid-cols-2 mt-[-10px]">
        <FormControl>
        <InputLabel className="flex flex-row ml-[-10px]">
              <p className="mr-2 text-red-700 text-[13px]">
                    *
                  </p>
                School Attended
              </InputLabel>
          <Input
            value={item.school}
            placeholder="School Attended"
            onChange={(e) => addEdu("school", e, idx)}
            className="bg-white w-[400px] h-[40px] px-2 mb-4"
            startAdornment={
              <InputAdornment position="start">
                <SchoolIcon className="text-green-700" />
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl>
        <InputLabel className="flex flex-row ml-[-10px]">
              <p className="mr-2 text-red-700 text-[13px]">
                    *
                  </p>
                Course of Study
              </InputLabel>
          <Input
            value={item.course}
            placeholder="Course of Study"
            onChange={(e) => addEdu("course", e, idx)}
            className="bg-white w-[400px] h-[40px] px-2 mb-4"
            startAdornment={
              <InputAdornment position="start">
                <BookIcon className="text-green-700" />
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl>
        <InputLabel className="flex flex-row ml-[-10px]">
              <p className="mr-2 text-red-700 text-[13px]">
                    *
                  </p>
                Graduation Date
              </InputLabel>
          <Input
            value={item.graduationDate}
            placeholder="Graduation Date"
            type="date"
            onChange={(e) => addEdu("graduationDate", e, idx)}
            className="bg-white w-[180px] h-[40px] px-2 mb-4"
            startAdornment={
              <InputAdornment position="start">
                <CalendarTodayIcon className="text-green-700" />
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl className="md:ml-[-190px]">
        <InputLabel className="flex flex-row ml-[-10px]">
              <p className="mr-2 text-red-700 text-[13px]">
                    *
                  </p>
                Qualification
              </InputLabel>
          <Select
            value={item.degree}
            onChange={(e) => addEdu("degree", e, idx)}
            className="w-[150px] text-black bg-white h-[40px] mt-4"
            label="Experience"
            placeholder="Experience"
            size="small"
          >
            {degrees.map((item: string, idx: number) => (
              <MenuItem key={idx} className="text-black" value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {hasCert && (
          <div>
            <FormControl>
          <InputLabel className="">
              Certification
          </InputLabel>
          <Input
            value={item.certification}
            placeholder="Certification"
            type="text"
            onChange={(e) => addEdu("certification", e, idx)}
            className="bg-white w-[180px] h-[40px] px-2 mb-4"
            startAdornment={
              <InputAdornment position="start">
                <ArticleIcon className="text-green-700" />
              </InputAdornment>
            }
          />
        </FormControl>
          <IconButton className="bg-white h-[25px] w-[25px] ml-[15px]" onClick={removeCert}>
            <CloseIcon className="h-[15px] w-[15px]" />
          </IconButton>
          </div>
        )}
      </div>
      </div>
    ));
  };

  const addField = () => {
    var newField = {
      employer: "",
      title: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
    };
    var update = [...expForm, newField];
    setExpForm(update);
  };

  const addEduField = () => {
    let newField = {
      school: "",
      course: "",
      graduationDate: "",
      degree: "",
      certification: ""
    };
    var update = [...eduField, newField];
    setEdufield(update);
  };

  const addSkillField = () => {
    console.log(skillForm[skillForm.length -1])
    console.log(skillForm)
    if(skillForm[skillForm.length -1] != "") {
      let newSkill = "";
    var update = [...skillForm, newSkill];
    setSkillForm(update);
    }
  };

  const addKill = (e: any, index: number) => {
    let update = skillForm?.map((item, idx) => {
      if (idx == index) {
        item = e.target.value;
      }
      return item;
    });
    setSkillForm(update);
  };

  const removeSkill = (index: number) => {
    const update = skillForm?.filter((item) => skillForm.indexOf(item) != index);
    // const update = skillForm?.map((item, idx) => {
    //   if(idx != index) {
    //     return item
    //   }
    //   return null
    // }) as any
    setSkillForm(update);
  }

  const renderSkills = () => {
    return skillForm?.map((item: any, idx) => (
      <div key={idx} className="flex flex-row align-middle">
        <input
          value={item}
          className="bg-white w-[200px] h-[40px] px-2 mb-4 rounded-md border-b-transparent"
          onChange={(e) => addKill(e, idx)}
          placeholder="skill"
        />
        <IconButton className="mt-[-11px] ml-[-7px] mr-[35px] bg-white h-[10px] w-[10px]" onClick={() => removeSkill(idx)}>
        <CloseIcon className="w-[13px] h-[13px]" />
      </IconButton>
      </div>
    ));
  };

  const clearStatus = () => setStatus({open: false})

  return (
    <div>
      <Modal className="flex justify-center" open={status?.open ? true : false} onClose={clearStatus}>
        <Notifier topic={status?.topic ?? ""} content={status?.content ?? ""} close={clearStatus}  />
      </Modal>
      <Paper className="flex flex-col w-[100%] justify-items-center md:h-[500px] bg-slate-100 overflow-y-scroll pb-10">
      <p className="text-center font-bold text-xl mt-4 mb-4">
        Personal Information
      </p>
      {basicInfo && (
        <form>
        <Formik
          // validateOnChange={true}
          // validateOnBlur={false}
          validationSchema={ApplicationValidation}
          initialValues={{
            firstName: basicInfo?.firstName,
            lastName: basicInfo?.lastName,
            otherName: basicInfo?.otherName,
            email: basicInfo?.email,
            phone: basicInfo?.phone,
            school: "",
            degree: "",
            field: "",
            dob: basicInfo?.dob.split("T")[0],
            gender: basicInfo?.gender,
            password: "",
            coverLetter: ""
          }}
          onSubmit={(value: any, { validateForm } ) => {
            validateForm(value)
            var body = {
              firstName: value.firstName,
              lastName: value.lastName,
              otherName: value.otherName,
              email: value.email,
              phone: value.phone.toString(),
              education: JSON.stringify(eduField),
              experience: JSON.stringify(expForm),
              skills: skillForm,
              dob: value.dob.toString(),
              roleId: id,
              cv: file,
              gender: gender,
              password: value.password,
              jobName: name,
              coverLetter: value.coverLetter
            };
            console.log(expForm)
            const candidateObj: Candidate = {
              firstName: value.firstName,
              lastName: value.lastName,
              email: value.email,
              phone: value.phone.toString(),
              dob: value.dob.toString(),
              roleId: id as string,
            }
            const roleObj: Role = {
              name: name
            }

            let typeArr = file?.name.split(".")
            let type = typeArr?.[typeArr?.length -1]
        
            if(type == "pdf") {
              setLoading(true);
              Axios.post("http://localhost:5048/api/Candidate", body, {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "multipart/form-data",
              },
            })
              .then((res: AxiosResponse) => {
                setLoading(false);
                console.log(res.data);
                if(res.data.code == 200) {
                  setCandidate(candidateObj);
                  setRole(roleObj)
                  router.push('/confirmation');
                }
                else {
                  setStatus({
                    open: true,
                    topic: "Unsuccessful",
                    content: res.data.message
                  })
                }
              })
              .catch((err: AxiosError) => {
                console.log(err.message);
                setLoading(false);
              });
            }
            else {
              setFileError("Please Select a pdf file for your resume")
            }
          }}
        >
          {({ handleSubmit, handleChange, values, errors }) => (
            <div className="grid justify-items-center">
              <div className="flex flex-row gap-3">
                <FormControl>
                <InputLabel className="w-[100%] flex flex-row">
                  
                  First Name
                </InputLabel>
                <Input
                  placeholder="First name"
                  readOnly
                  value={values.firstName}
                  onChange={handleChange("firstName")}
                  className="bg-white rounded-md h-[40px] w-[270px] p-2 mb-0 m-1"
                  startAdornment={
                    <InputAdornment position="start">
                      <PersonIcon className="text-green-700" />
                    </InputAdornment>
                  }
                />
                <div className="text-red-600 text-[10px] ml-4">
                  {errors.firstName as any}
                </div>
                </FormControl>

                <FormControl>
                <InputLabel className="w-[100%] flex flex-row">
                  Other Name
                </InputLabel>
                  <Input
                  placeholder="Other Name"
                  readOnly
                  value={values.otherName}
                  onChange={handleChange("otherName")}
                  className="bg-white rounded-md h-[40px] w-[270px] p-2 mb-0 m-1"
                  startAdornment={
                    <InputAdornment position="start">
                      <PersonIcon className="text-green-700" />
                    </InputAdornment>
                  }
                />
                <div className="text-red-600 text-[10px] ml-4">
                  {errors.otherName as any}
                </div>
                </FormControl>

                <FormControl>
                <InputLabel className="w-[100%] flex flex-row">
                  
                  Last Name
                </InputLabel>
                  <Input
                  placeholder="Last name"
                  readOnly
                  value={values.lastName}
                  onChange={handleChange("lastName")}
                  className="bg-white rounded-md h-[40px] w-[270px] p-4 mb-0 m-1"
                  startAdornment={
                    <InputAdornment position="start">
                      <PersonIcon className="text-green-700" />
                    </InputAdornment>
                  }
                />
                <div className="text-red-600 text-[10px] ml-4">
                  {errors.lastName as any}
                </div>
                </FormControl>
              </div>
              <div className="flex flex-row gap-6 mt-4">
                <FormControl>
                <InputLabel className="w-[100%] flex flex-row">
                  
                  Email
                </InputLabel>
                <Input
                  placeholder="Email Address"
                  readOnly
                  value={values.email}
                  onChange={handleChange("email")}
                  className="bg-white rounded-md h-[40px] w-[400px] p-4 mb-0 m-3"
                  startAdornment={
                    <InputAdornment position="start">
                      <EmailIcon className="text-green-700" />
                    </InputAdornment>
                  }
                />
                <div className="text-red-600 text-[10px] ml-4">
                  {errors.email as any}
                </div>
                </FormControl>
                <FormControl>
                <InputLabel className="w-[100%] flex flex-row">
             
                  Phone Number
                </InputLabel>
                <Input
                  placeholder="Phone Number"
                  readOnly
                  value={values.phone}
                  onChange={handleChange("phone")}
                  className="bg-white rounded-md h-[40px] w-[400px] p-4 mb-0 m-3"
                  startAdornment={
                    <InputAdornment position="start">
                      <PhoneIcon className="text-green-700" />
                    </InputAdornment>
                  }
                />
                <div className="text-red-600 text-[10px] ml-4">
                  {errors.phone as any}
                </div>
                </FormControl>
              </div>
              <div className="flex flex-row gap-2 mt-4">
                <FormControl>
                <div className="w-[100%] ml-3 flex flex-row text-[12px] place-items-center">
                 
                  Date of Birth
                </div>
                  <Input
                  placeholder="Date of Birth"
                  readOnly
                  value={values.dob}
                  type="date"
                  onChange={handleChange("dob")}
                  className="bg-white rounded-md h-[40px] w-[200px] p-4 mt-1 mb-0 m-3"
                  startAdornment={
                    <InputAdornment position="start">
                      <CalendarTodayIcon className="text-green-700" />
                    </InputAdornment>
                  }
                />
                <div className="text-red-600 text-[10px] ml-4">
                  {errors.dob as any}
                </div>
                </FormControl>
                <FormControl>
                <div className="w-[100%] ml-3 flex flex-row text-[12px] place-items-center">
       
                  Gender
                </div>
                  <Select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-[100px] text-black bg-white h-[40px] mt-1"
            label="Experience"
            placeholder="Gender"
            size="small"
            readOnly
          >
            {genders.map((item: string, idx: number) => (
              <MenuItem key={idx} className="text-black" value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
                </FormControl>
                <FormControl className="">
                <div className="w-[100%] ml-3 flex flex-row text-[12px] place-items-center">
                <p className="mr-2 text-red-700 text-[13px]">
                    *
                  </p>
                  Resume
                </div>
                  <Input
                  placeholder="Resume"
                  required
                  type="file"
                  onChange={handleFileChange}
                  className="bg-white rounded-md h-[40px] w-[200px] p-4 mt-1 m-3"
                />
                {
                  fileError && (
                    <div>
                      <p className="text-red-600 text-[10px] mt-[-10px] ml-[10px]">{fileError}</p>
                    </div>
                  )
                }
                </FormControl>

                  {/* <FormControl className="">
                  <div className="w-[100%] ml-3 flex flex-row text-[12px] place-items-center">
     
                  Password
                </div>
                  <Input
                      placeholder="Password"
                      value={values.password}
                      type={visible ? "text" : "password"}
                      onChange={handleChange("password")}
                      className="bg-white rounded-md h-[40px] w-[280px] p-1 pr-0 mt-1 mb-0 m-3"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton onClick={() => setVisible(!visible)}>
                            {visible ? (
                              <VisibilityIcon />
                            ) : (
                              <VisibilityOffIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    <div className="text-red-600 text-[10px] ml-4">
                  {errors.password as any}
                </div>
                </FormControl> */}
              </div>

              <FormControl className="w-[93%] my-[20px]">
              <div className="flex flex-row ml-[-10px] text-[13px] mb-1">
              <p className="mr-2 text-red-700 text-[13px]">
                    *
                  </p>
                <p className="text-gray-600">Cover Letter</p>
              </div>
                  <TextField
                    value={values.coverLetter}
                    onChange={handleChange("coverLetter")}
                    multiline
                    rows={4}
                    className="bg-white w-[100%]"
                    placeholder="Cover Letter"
                  />
                  <div className="text-red-600 text-[10px] ml-4">
                  {errors.coverLetter as any}
                </div>
              </FormControl>

              <div className="w-[100%]">
                <Divider className="bg-green-700 h-[2px] mx-6" />
                <p className="font-bold pl-7 mb-2 mt-2">Work Experience</p>
                <div className="p-4">{renderExperience()}</div>
                <Button
                  onClick={addField}
                  className="flex flex-row text-green-700 align-middle pl-6"
                >
                  <p>Add Work Experience</p>
                  <AddIcon />
                </Button>
              </div>

              <div className="w-[100%]">
                <Divider className="bg-green-700 h-[2px] mx-6" />
                <p className="mb-6 font-bold pl-7 mt-4">Skills</p>
                <div className="grid grid-cols-4 px-6">{renderSkills()}</div>
                <Button
                  onClick={addSkillField}
                  className="flex flex-row text-green-700 align-middle pl-6"
                >
                  <p>Add Skill</p>
                  <AddIcon />
                </Button>
              </div>
              <div className="w-[100%]">
                <Divider className="bg-green-700 h-[2px] mx-6" />
                <p className=" font-bold pl-7 mt-4">Education/Certifications</p>
                <div className="mx-6">{renderEducation()}</div>
                <Button
                  onClick={addEduField}
                  className="flex flex-row text-green-700 align-middle pl-6"
                >
                  <p>Add Education</p>
                  <AddIcon />
                </Button>
              </div>
              <Button
                className="bg-green-700 text-white w-[150px]"
                onClick={() => handleSubmit()}
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
      )}
    </Paper>
    </div>
  );
};
