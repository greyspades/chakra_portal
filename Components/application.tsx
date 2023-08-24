import React, { useState, useEffect, FC, useContext } from "react";
import Axios, { AxiosError, AxiosResponse } from "axios";
import { Formik } from "formik";
import {
  Button,
  Paper,
  CircularProgress,
  IconButton,
  FormControl,
  Modal,
  Radio,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { Role } from "../types/roles";
import { MainContext } from "../context";
import { useRouter } from "next/router";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BusinessIcon from "@mui/icons-material/Business";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";
import BookIcon from "@mui/icons-material/Book";
import CloseIcon from "@mui/icons-material/Close";
import { ApplicationValidation } from "../helpers/validation";
import { Candidate } from "../types/candidate";
import { Notifier } from "./notifier";
import ArticleIcon from "@mui/icons-material/Article";
import { CustomInput } from "./customInput";
import CryptoJS from "crypto-js";
import { postAsync, postContent, postCustom } from "../helpers/connection";
import { lowerKey } from "../helpers/formating";

export const Application: FC<Role> = ({ name, id }: Role) => {
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

  const [expForm, setExpForm] = useState<{}[]>([]);

  const [skillForm, setSkillForm] = useState<{}[]>([]);

  const [eduField, setEdufield] = useState<{}[]>([]);

  const [gender, setGender] = useState<string>("Male");

  const [fileError, setFileError] = useState<string>("");

  const [genError, setGenError] = useState<boolean>(false);

  // const [hasCert, setHasCert] = useState<boolean>();

  const [basicInfo, setBasicInfo] = useState<{ [key: string]: string }>();

  const [gradError, setGradErr] = useState<boolean>(false);

  const [status, setStatus] = useState<{ [key: string]: any }>({
    open: false,
  });
  var key = CryptoJS.enc.Utf8.parse(process.env.NEXT_PUBLIC_AES_KEY);
  var iv = CryptoJS.enc.Utf8.parse(process.env.NEXT_PUBLIC_AES_IV);

  //* context hook holding global state
  const { setCandidate, setRole } = useContext(MainContext) as any;

  //* router hook for routing operations
  const router = useRouter();

  //* genders for gender selection
  const genders = ["Male", "Female"];

  //* gets basic user info from session storage
  useEffect(() => {
    const bytes = CryptoJS.AES.decrypt(
      sessionStorage.getItem("cred") ?? "",
      process.env.NEXT_PUBLIC_AES_KEY
    );
    const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    const mainData = lowerKey(data) as Candidate;
    if (data) {
      // console.log(data)
      setBasicInfo(mainData);
      setGender(mainData?.gender);
    }
  }, []);

  //* qualifications for qualification selection
  const degrees = ["BSC", "MSC", "MBA", "PHD", "HND", "OND", "Other"];

  //* handles resume selection
  const handleFileChange = (e: any) => {
    let extensions = ["pdf"];
    let file: File = e.target.files[0];
    let type = file.name.split(".");

    //* if the file is pdf and less than 3mb
    if (extensions.includes(type[type.length - 1]) && file.size < 2000000) {
      setFile(e.target.files[0]);
      setFileError("");
    } else if (!extensions.includes(type[type.length - 1])) {
      setFileError("please select a pdf");
    } else if (!(file.size < 3000000)) {
      setFileError("please select a file less than 3mb");
    }
  };

  //* handles changes to the experience fields
  const handleExpChange = (type: string, index: number, e: any) => {
    //* if the candidate currently works at the organization
    if (type != "isCurrent") {
      var update = expForm?.map((item: any, idx: number) => {
        if (idx == index) {
          item[type] = e.target.value;
        }
        return item;
      });
      setExpForm(update);
    } else {
      //* update the field based on its index in the array
      var update = expForm?.map((item: any, idx: number) => {
        if (idx == index) {
          item.isCurrent = !item.isCurrent;
        }
        return item;
      });
      setExpForm(update);
    }
  };

  //* removes the current experience field
  const removeExp = (id: number) => {
    const update = expForm?.filter((item) => expForm.indexOf(item) != id);
    setExpForm(update);
  };

  //* removes the current education field
  const removeEdu = (id: number) => {
    const update = eduField?.filter((item) => eduField.indexOf(item) != id);
    setEdufield(update);
  };

  //* renders the experience forms
  const renderExperience = () => {
    return expForm?.map((item: any, idx: number) => {
      return (
        <div key={idx} className="grid md:px-4 mt-4">
          <div className="grid justify-end mb-[20px]">
            <IconButton
              className="bg-green-300 h-[35px] w-[35px]"
              onClick={() => removeExp(idx)}
            >
              <CloseIcon className="w-[15px] h-[15px]" />
            </IconButton>
          </div>
          <div className="flex md:flex-row flex-col md:gap-2 gap-4">
            <CustomInput
              value={item.employer}
              onChange={(e) => handleExpChange("employer", idx, e)}
              component={"text"}
              placeHolder="Employer"
              classes="h-[40px] md:w-[100%] w-[100%] bg-gray-100 rounded-md no-underline px-1 shadow-md"
              icon={<BusinessIcon className="text-green-700" />}
            />
            <CustomInput
              value={item.title}
              onChange={(e) => handleExpChange("title", idx, e)}
              component={"text"}
              placeHolder="Title"
              classes="h-[40px] md:w-[95%] w-[100%] bg-gray-100 rounded-md no-underline px-1 shadow-md"
              icon={<WorkOutlineIcon className="text-green-700" />}
            />
            <div className="flex flex-row md:gap-2 gap-2 md:mt-0 mt-2">
              <CustomInput
                value={item.startDate}
                onChange={(e) => handleExpChange("startDate", idx, e)}
                component={"text"}
                placeHolder="Start Date"
                type="date"
                classes="h-[40px] md:w-[95%] w-[140px] bg-gray-100 rounded-md no-underline px-1 shadow-md"
                // icon={<CalendarTodayIcon className="text-green-700" />}
              />
              <CustomInput
                disabled={item?.isCurrent ? true : false}
                value={item.endDate}
                onChange={(e) => handleExpChange("endDate", idx, e)}
                component={"text"}
                type="date"
                placeHolder="End Date"
                classes="h-[40px] md:w-[100%] w-[140px] bg-gray-100 rounded-md no-underline px-1 shadow-md"
                // icon={<CalendarTodayIcon className="text-green-700" />}
              />
              <FormControl className="flex flex-col md:ml-4">
                <p className="text-[11px] mt-[-10px]">Current</p>
                <Radio
                  name="isCurrent"
                  className="text-green-700"
                  checked={item?.isCurrent === true}
                  value={item?.isCurrent}
                  onClick={(e) => handleExpChange("isCurrent", idx, e)}
                />
              </FormControl>
            </div>
          </div>
          <div className="mt-4">
            <CustomInput
              value={item.description}
              onChange={(e) => handleExpChange("description", idx, e)}
              component={"field"}
              type="text"
              placeHolder="Description"
              classes="w-[100%] bg-gray-100 rounded-md no-underline shadow-md mt-[7px]"
              rows={4}
            />
          </div>
          <div className="mb-[30px] text-[11px]">
            {item?.hasError && (
              <p className="text-red-600">Please fill out the information</p>
            )}
          </div>
        </div>
      );
    });
  };

  //* add new education form
  const addEdu = (type: string, e: any, index: number) => {
    //* if the candidate has other qualifications
    if (type == "degree" && e.target.value == "Other") {
      let update = eduField?.map((item: { [key: string]: any }, idx) => {
        if (idx == index) {
          item.hasCert = true;
        }
        return item;
      });
      setEdufield(update);
    }
    if (type == "graduationDate") {
      //* if the field type is is graduation date its validates its a past date
      var isPast = new Date(e.target.value) < new Date(new Date());
      if (isPast) {
        let update = eduField?.map((item: { [key: string]: string }, idx) => {
          if (idx == index) {
            item[type] = e.target.value;
          }
          return item;
        });
        setEdufield(update);
        setGradErr(false);
      } else {
        setGradErr(true);
      }
    } else {
      let update = eduField?.map((item: { [key: string]: string }, idx) => {
        if (idx == index) {
          item[type] = e.target.value;
        }
        return item;
      });
      setEdufield(update);
    }
  };

  //* removes other certifications
  const removeCert = (index: number) => {
    let update = eduField?.map((item: { [key: string]: any }, idx) => {
      if (idx == index) {
        item.hasCert = false;
        item.certification = "";
      }
      return item;
    });
    setEdufield(update);
  };

  //* renders the education fields
  const renderEducation = () => {
    return eduField.map((item: { [key: string]: string }, idx: number) => (
      <div key={idx} className="mt-4">
        <div className="grid justify-end">
          <IconButton
            className="bg-green-300 h-[35px] w-[35px]"
            onClick={() => removeEdu(idx)}
          >
            <CloseIcon className="w-[15px] h-[15px]" />
          </IconButton>
        </div>
        <div className="grid md:grid-cols-2 mt-[-10px]">
          <CustomInput
            value={item.school}
            onChange={(e) => addEdu("school", e, idx)}
            component={"text"}
            placeHolder="School Attended"
            classes="h-[40px] md:w-[350px] w-[100%] bg-gray-100 rounded-md no-underline px-2 shadow-md mb-4"
            icon={<BookIcon className="text-green-700" />}
          />
          <CustomInput
            value={item.course}
            onChange={(e) => addEdu("course", e, idx)}
            component={"text"}
            placeHolder="Course of study"
            classes="h-[40px] md:w-[350px] w-[100%] bg-gray-100 rounded-md no-underline px-2 shadow-md mb-4"
            icon={<BookIcon className="text-green-700" />}
          />
          <div className="flex flex-row gap-2 md:mt-4">
            <CustomInput
              value={item.graduationDate}
              onChange={(e) => addEdu("graduationDate", e, idx)}
              component={"text"}
              type="date"
              placeHolder="Graduation date"
              classes="h-[40px] md:w-[180px] w-[170px] bg-gray-100 rounded-md no-underline px-2 shadow-md mb-4"
              // icon={<CalendarTodayIcon className="text-green-700" />}
              error={gradError ? "Please select a past date" : null}
            />

            <CustomInput
              value={item.degree}
              onChange={(e) => addEdu("degree", e, idx)}
              component={"select"}
              selValues={degrees}
              placeHolder="Qualification"
              classes="h-[40px] w-[150px] bg-gray-100 rounded-md no-underline px-2 shadow-md mt-4"
              icon={<CalendarTodayIcon className="text-green-700" />}
              // error={gradError ? "Please select a past date" : null}
            />
          </div>
          {item?.hasCert && (
            <div className="mt-[15px] flex flex-row">
              <CustomInput
                value={item.certification}
                onChange={(e) => addEdu("certification", e, idx)}
                component={"text"}
                placeHolder="Certification"
                classes="h-[40px] md:w-[350px] w-[280px] bg-gray-100 rounded-md no-underline px-2 shadow-md mb-4"
                icon={<ArticleIcon className="text-green-700" />}
              />

              <IconButton
                className="bg-green-300 h-[25px] w-[25px]"
                onClick={() => removeCert(idx)}
              >
                <CloseIcon className="h-[15px] w-[15px]" />
              </IconButton>
            </div>
          )}
        </div>
      </div>
    ));
  };

  //* adds a new experience form
  const addExpField = () => {
    var newField = {
      employer: "",
      title: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      hasError: false,
    };
    var update = [...expForm, newField];
    setExpForm(update);
  };

  //* adds a new education form
  const addEduField = () => {
    let newField = {
      school: "",
      course: "",
      graduationDate: "",
      degree: "BSC",
      certification: "",
      hasCert: false,
    };
    var update = [...eduField, newField];
    setEdufield(update);
  };

  //* adds a new skill form
  const addSkillField = () => {
    if (skillForm[skillForm.length - 1] != "") {
      let newSkill = "";
      var update = [...skillForm, newSkill];
      setSkillForm(update);
    }
  };

  //* inputs a new skill into the indexed form
  const addKill = (e: any, index: number) => {
    let update = skillForm?.map((item, idx) => {
      if (idx == index) {
        item = e.target.value;
      }
      return item;
    });
    setSkillForm(update);
  };

  //* removes the indexed skill field
  const removeSkill = (index: number) => {
    const update = skillForm?.filter(
      (item) => skillForm.indexOf(item) != index
    );
    setSkillForm(update);
  };

  //* renders the skill forms
  const renderSkills = () => {
    return skillForm?.map((item: any, idx) => (
      <div key={idx} className="flex flex-row align-middle">
        <CustomInput
          value={item}
          onChange={(e) => addKill(e, idx)}
          component={"text"}
          placeHolder="Skill"
          classes="md:w-[200px] w-[160px] h-[40px] bg-gray-100 rounded-md no-underline shadow-md mb-4 px-2"
        />
        <IconButton
          className="mt-[-11px] ml-[-7px] mr-[35px] bg-green-300 h-[10px] w-[10px]"
          onClick={() => removeSkill(idx)}
        >
          <CloseIcon className="w-[13px] h-[13px]" />
        </IconButton>
      </div>
    ));
  };

  //* clears the notifier state
  const clearStatus = () => setStatus({ open: false });

  return (
    <div className="">
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
      <Paper className="flex flex-col justify-items-center md:h-[90vh] bg-white overflow-y-scroll pb-[100px] m-2 md:px-6">
        <p className="text-center font-bold text-xl mt-4 mb-[40px]">
          Personal Information
        </p>
        {basicInfo && (
          <form>
            <Formik
              validationSchema={ApplicationValidation}
              initialValues={{
                firstName: basicInfo.firstname,
                lastName: basicInfo.lastname,
                otherName: basicInfo.othername,
                email: basicInfo?.email,
                phone: basicInfo?.phone,
                school: "",
                degree: "",
                field: "",
                dob: basicInfo?.dob.split("T")[0],
                gender: basicInfo?.gender,
                password: "",
                coverLetter: "",
              }}
              //* called once the submit button is clicked
              onSubmit={async (value: any, { validateForm }) => {
                //* validates the form against the schema
                validateForm(value);

                //* request body
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
                  gender: gender,
                  password: value.password,
                  jobName: name,
                  coverLetter: value.coverLetter,
                  cv: file
                };

                //* candidate object
                const candidateObj: Candidate = {
                  firstname: value.firstname,
                  lastname: value.lastname,
                  email: value.email,
                  phone: value.phone.toString(),
                  dob: value.dob.toString(),
                  roleid: id as string,
                };
                //* payload for updating the role
                const roleObj: Role = {
                  name: name,
                };
                //* checks the file type
                let typeArr = file?.name.split(".");
                let type = typeArr?.[typeArr?.length - 1];

                expForm.forEach((item: { [key: string]: any }, idx: number) => {
                  if (!item.title || !item.startDate || !item.employer) {
                    let update = expForm.map(
                      (exp: { [key: string]: any }, index: number) => {
                        if (idx == index) {
                          exp.hasError = true;
                        }
                        return exp;
                      }
                    );
                    setExpForm(update);
                    setGenError(true);
                  }
                });

                eduField.forEach(
                  (item: { [key: string]: any }, idx: number) => {
                    if (
                      !item.course ||
                      !item.graduationDate ||
                      !item.degree ||
                      !item.school
                    ) {
                      let update = eduField.map(
                        (edu: { [key: string]: any }, index: number) => {
                          if (idx == index) {
                            edu.hasError = true;
                          }
                          return edu;
                        }
                      );
                      setEdufield(update);
                      setGenError(true);
                    }
                  }
                );

                let expResult = expForm.every(
                  (item: { [key: string]: string }) =>
                    item.title != "" &&
                    item.startDate != "" &&
                    item.employer != ""
                );

                let eduResult = eduField.every(
                  (item: { [key: string]: string }) =>
                    item.course != "" &&
                    item.graduationDate != "" &&
                    item.degree != "" &&
                    item.school != ""
                );

                if (
                  type == "pdf" &&
                  expResult &&
                  eduResult &&
                  expForm.length > 0 &&
                  eduField.length > 0
                ) {
                  setGenError(false);
                  setLoading(true);
                  let reqHeader = CryptoJS.AES.encrypt(
                    process.env.NEXT_PUBLIC_TOKEN,
                    key,
                    {
                      iv: iv,
                    }
                  ).toString();
                  
                  const options = {
                      head: reqHeader,
                      body: body,
                      url: process.env.NEXT_PUBLIC_CREATE_APPLICATION,
                  }

                  Axios.post(
                    "/api/create",
                    options,{headers: {
                      "Content-Type": "application/json",
                       "Auth": reqHeader
                    }}
                  ) 
                    .then((res) => {
                      setLoading(false)
                      if (res.data.code == 200) {
                        setCandidate(candidateObj);
                        setRole(roleObj);
                        router.push("/confirmation");
                      } else {
                        setStatus({
                          open: true,
                          topic: "Unsuccessful",
                          content: res.data.message,
                        });
                      }
                    })
                    .catch((err: AxiosError) => {
                      console.log(err.message);
                      setLoading(false);
                      setStatus({
                        open: true,
                        topic: "Unsuccessful",
                        content: err.message,
                      });
                    });
                } else if (type != "pdf") {
                  setFileError("Please Select a pdf file for your resume");
                } else if (!eduResult || !expResult) {
                  setStatus({
                    open: true,
                    topic: "Unsuccessful",
                    content:
                      "Please fill in the missing fields in your application",
                  });
                } else if (expForm.length < 1) {
                  setStatus({
                    open: true,
                    topic: "Unsuccessful",
                    content:
                      "Please add some work experience to your application",
                  });
                } else if (eduField.length < 1) {
                  setStatus({
                    open: true,
                    topic: "Unsuccessful",
                    content: "Please add some education to your application",
                  });
                }
              }}
            >
              {({ handleSubmit, handleChange, values, errors }) => (
                <div className="grid justify-items-center">
                  <div className="flex md:flex-row flex-col gap-3">
                    <CustomInput
                      value={values.firstName}
                      onChange={handleChange("firstName")}
                      component={"text"}
                      placeHolder="First Name"
                      readonly
                      classes="h-[40px] md:w-[100%] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                      icon={<PersonIcon className="text-green-700" />}
                      error={errors.firstName}
                    />

                    <CustomInput
                      value={values.otherName}
                      onChange={handleChange("otherName")}
                      component={"text"}
                      placeHolder="Other Name"
                      readonly
                      classes="h-[40px] md:w-[100%] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                      icon={<PersonIcon className="text-green-700" />}
                      error={errors.otherName}
                    />
                    <CustomInput
                      value={values.lastName}
                      onChange={handleChange("lastName")}
                      component={"text"}
                      placeHolder="Last Name"
                      readonly
                      classes="h-[40px] md:w-[100%] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                      icon={<PersonIcon className="text-green-700" />}
                      error={errors.lastName}
                    />
                  </div>
                  <div className="flex md:flex-row flex-col gap-6 mt-[30px]">
                    <CustomInput
                      value={values.email}
                      onChange={handleChange("email")}
                      component={"text"}
                      placeHolder="Email"
                      readonly
                      classes="h-[40px] md:w-[100%] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                      icon={<EmailIcon className="text-green-700" />}
                      error={errors.email}
                    />
                    <CustomInput
                      value={values.phone}
                      onChange={handleChange("phone")}
                      component={"text"}
                      placeHolder="Phone number"
                      readonly
                      classes="h-[40px] md:w-[100%] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                      icon={<PhoneIcon className="text-green-700" />}
                      error={errors.phone}
                    />
                  </div>
                  <div className="flex md:flex-row flex-col gap-2 mt-[30px]">
                    <CustomInput
                      value={values.dob}
                      onChange={handleChange("dob")}
                      component={"text"}
                      type="date"
                      placeHolder="Date of Birth"
                      readonly
                      classes="h-[40px] md:w-[100%] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                      icon={<CalendarTodayIcon className="text-green-700" />}
                      error={errors.dob}
                    />
                    <CustomInput
                      value={values.gender}
                      onChange={handleChange("otherName")}
                      component={"select"}
                      placeHolder="Gender"
                      readonly
                      classes="h-[40px] md:w-[100%] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-[15px]"
                      selValues={genders}
                      error={errors.gender}
                    />

                    <CustomInput
                      onChange={handleFileChange}
                      component={"text"}
                      helper="Pdf only"
                      type={"file"}
                      placeHolder="Resume"
                      readonly
                      classes="h-[40px] md:w-[100%] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                      selValues={genders}
                      error={fileError}
                    />
                  </div>

                  {/* <FormControl className="w-[93%] my-[20px]">
                    <div className="flex flex-row md:ml-[-10px] text-[13px] mb-1">
                      <p className="md:mr-2 text-red-700 text-[13px]">*</p>
                      <p className="text-gray-600">Cover Letter</p>
                    </div>
                    <TextField
                      value={values.coverLetter}
                      onChange={handleChange("coverLetter")}
                      multiline
                      rows={4}
                      // className="bg-white w-[100%]"
                      className=" bg-gray-100 w-[100%] border-green-700 border-solid border-2 rounded-md no-underline shadow-lg"
                      placeholder="Cover Letter"
                    />
                    <div className="text-red-600 text-[10px] ml-4">
                      {errors.coverLetter as any}
                    </div>
                  </FormControl> */}
                  <div className="w-[98%] my-[20px]">
                    <CustomInput
                      value={values.coverLetter}
                      onChange={handleChange("coverLetter")}
                      component={"field"}
                      type={"text"}
                      placeHolder="Cover letter"
                      rows={4}
                      classes=" bg-gray-100 w-[100%] rounded-md no-underline shadow-md mt-4"
                      error={errors?.coverLetter}
                    />
                  </div>

                  <div className="w-[100%]">
                    <Divider className="bg-green-700 h-[2px] md:mx-6 mx-2" />
                    <p className="font-bold pl-7 mt-2">Work Experience</p>
                    <div className="p-4">{renderExperience()}</div>
                    <Button
                      onClick={addExpField}
                      className="flex flex-row text-green-700 align-middle pl-6 capitalize"
                    >
                      <p>Add Work Experience</p>
                      <AddIcon />
                    </Button>
                  </div>

                  <div className="w-[100%]">
                    <Divider className="bg-green-700 h-[2px] md:mx-6 mx-2" />
                    <p className="mb-6 font-bold pl-7 mt-4">Skills</p>
                    <div className="grid md:grid-cols-4 grid-cols-2 md:px-6 px-2 md:gap-12 gap-2">
                      {renderSkills()}
                    </div>
                    <Button
                      onClick={addSkillField}
                      className="flex flex-row text-green-700 align-middle pl-6 capitalize"
                    >
                      <p>Add Skill</p>
                      <AddIcon />
                    </Button>
                  </div>
                  <div className="w-[100%]">
                    <Divider className="bg-green-700 h-[2px] md:mx-6 mx-2" />
                    <p className="font-bold pl-7 mt-4 mb-6">
                      Education/Certifications
                    </p>
                    <div className="md:mx-6 mx-2">{renderEducation()}</div>
                    <Button
                      onClick={addEduField}
                      className="flex flex-row text-green-700 align-middle pl-6 capitalize"
                    >
                      <p>Add Qualification</p>
                      <AddIcon />
                    </Button>
                  </div>
                  <div className="md:mt-[30px] mt-[50px]">
                    <Button
                      className="bg-green-700 text-white w-[150px]"
                      onClick={() => handleSubmit()}
                    >
                      {loading ? (
                        <CircularProgress
                          thickness={7}
                          className="text-white w-[40px] h-[40px] p-1"
                        />
                      ) : (
                        <p>Submit</p>
                      )}
                    </Button>
                  </div>
                  {genError && (
                    <div className="p-4">
                      <p className="text-red-600 text-[11px]">
                        Please fill out the missing fields
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Formik>
          </form>
        )}
      </Paper>
    </div>
  );
};
