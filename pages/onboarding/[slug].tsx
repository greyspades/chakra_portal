import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import axios, { AxiosResponse } from "axios";
import { Navbar } from "../../components/navbar";
import {
  Button,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  Paper,
} from "@mui/material";
import { Candidate } from "../../types/candidate";
import { useRouter } from "next/router";
import { CustomInput } from "../../components/customInput";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Notifier } from "../../components/notifier";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { CalendarMonth, Close } from "@mui/icons-material";
import NaijaStates from "naija-state-local-government";
import HomeIcon from "@mui/icons-material/Home";
import { error } from "console";
import Link from "next/link";
import { country_list } from "../../utilities";
import Image from "next/image";


const Onboarding = () => {
  const [userData, setUserData] = useState<Candidate>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [phone, setPhone] = useState<{ [key: string]: string }>({
    main: "",
    alt: "",
    guarantor1: "",
    guarantor2: "",
    referee: "",
    fEmployer: "",
  });
  const [location, setLocation] = useState<{ [key: string]: string }>({
    state: "",
    lga: "",
    Bcountry: "Nigeria",
    OState: "",
    OLga: "",
    OCountry: "Nigeria",
    Ccountry: "Nigeria",
    PCountry: "Nigeria",
  });
  const [meta, setMeta] = useState<{ [key: string]: string }>({
    marital: "Single",
    gender: "Male",
    religion: "Christian",
    guarantor1Gender: "Male",
    guarantor2Gender: "Male",
    refereeGender: "Male",
  });
  const [documents, setDocuments] = useState<
    { [key: string]: string | File }[]
  >([]);

  const [image, setImage] = useState<string>()

  const [imgError, setImgError] = useState<string>("")

  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter();

  const handlePhoneChange = (e: any, type: string) => {
    setPhone({ ...phone, [type]: e });
  };

  const handleMetaChange = (e: any, type: string) => {
    let update = { ...meta, [type]: e.target.value };
    setMeta(update);
  };

  const handleLocationChange = (e: any, type: string) => {
    let update = { ...location, [type]: e.target.value };
    setLocation(update);
  };

  const addDocument = () => {
    let newDocument = {
      name: "",
      file: null,
    };
    setDocuments([...documents, newDocument]);
  };

  const removeDocument = (index: number) => {
    let update = documents.filter((item) => documents.indexOf(item) != index)
    setDocuments(update);
  };

  const genders = ["Male", "Female"];

  const maritalStatuses: string[] = ["Single", "Married", "Divorced"];

  const religions: string[] = [
    "Christian",
    "Muslim",
    "Agnostic",
    "Atheist",
    "Other",
  ];

  const validator = (e: any) => {
    if(!e.target.value.includes("r")) {
      return e.target.value
    }  else return null
  }

  const getCandidate = (id: string) => {
    let body = {
      id,
    };
    axios
      .post("getCandidateById", body)
      .then((res: AxiosResponse) => {
        if (res.data.code == 200) {
          // console.log(res.data.data)
          let data: Candidate = res.data.data[0];
          setUserData(data);
          setPhone({ main: data?.phone, alt: "" });
          setLocation({ lga: data.lga, state: data.state });
          setLoaded(true);
          setMeta({
            marital: data?.maritalstatus,
            gender: data?.gender,
            religion: "Christian",
          });
          //   setSelctCandidate(res.data.data[0]);
          //   let role = roles?.find((item: Role) => item.id == res.data.data[0]?.roleId);
          //   setRole(role);
          //   setModalOpen("");
          //   setViewing(true);
        }
      });
  };

  useEffect(() => {
    let { slug } = router.query;
    if (slug && router.isReady) {
      getCandidate(slug as string);
    }
  }, [router.isReady]);

  const handleImageChange = (e: any) => {
    let file: File = e.target.files[0];
    let typeArr = file?.name.split(".");
    let type = typeArr?.[typeArr?.length - 1];
    console.log(type)
    console.log(file)
    if((type.toLowerCase() == "png" || type.toLowerCase() == "jpg") && file.size < 3000000 ) {
      let imageUrl = URL.createObjectURL(file)
      setImage(imageUrl)
    } else if(!(type.toLowerCase() == "png" || type.toLowerCase() == "jpg")) {
      setImgError("Please select a jpg or png file")
    } else if(file.size > 2000000) {
      setImgError("Please upload an image less than 2mb")
    }
  }

  //* renames the fct state to abuja
  var updatedLoc = NaijaStates.states().map((item) => {
    if (item == "Federal Capital Territory") {
      item = "Abuja";
    }
    return item;
  });

  const handleDocChange = (e: any, type: string, index: number) => {
    let update = documents.map((item: { [key: string]: any }, idx: number) => {
      if (index == idx) {
        item[type] = type=="name" ? e.target.value : e.target.files[0];
      }
      return item;
    });

    setDocuments(update);
  };

  const renderDocs = () => {
    return documents.map((item: { [key: string]: any }, idx: number) => (
      <div className="flex flex-row gap-10 mt-[30px]" key={idx}>
        <CustomInput
          value={item?.name}
          onChange={(e) => handleDocChange(e, "name", idx)}
          component={"text"}
          placeHolder="document name"
          classes="h-[40px] md:w-[350px] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
          // error={errors.firstName}
          icon={<PersonIcon className="text-green-700" />}
          fitWidth
          required
        />

        <CustomInput
          value={item?.file}
          onChange={(e) => handleDocChange(e, "file", idx)}
          component={"text"}
          placeHolder="File"
          type="file"
          classes="h-[40px] md:w-[350px] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
          // error={errors.firstName}
          // icon={<PersonIcon className="text-green-700" />}
          fitWidth
          required
        />
        <IconButton onClick={() => removeDocument(idx)}>
          <Close />
        </IconButton>
      </div>
    ));
  };

  return (
    <div>
      <Navbar />
      <div className="bg-slate-100 flex justify-center p-6 mt-[60px]">
        <Paper className="bg-white w-[100%] p-6">
          <div className="flex justify-center">
            <p className="text-[24px] font-semibold">Candidate Onboarding</p>
          </div>
          <div className="flex justify-center mt-[60px]">
            {!loaded ? (
              <CircularProgress
                thickness={10}
                className="text-green-700 w-[60px] h-[60px]"
              />
            ) : (
              <form>
                <Formik
                  initialValues={{
                    firstName: userData?.firstname ?? "",
                    lastName: userData?.lastname ?? "",
                    otherName: userData?.othername ?? "",
                    email: userData?.email ?? "",
                    dob: userData?.dob.split("T")[0] ?? "",
                    currentAddress: userData?.address ?? "",
                    permanentAddress: userData?.address ?? "",
                    currentCountry: "Nigeria",
                    permanentCountry: "Nigeria",
                    currentState: "",
                    currentCity: "",
                    permanentCity: "",
                    permanentState: "",
                    staffId: userData?.tempid ?? "",
                    hireDate: userData?.hiredate ?? "",
                    cityBirth: "",
                    stateBirth: "",
                    state: userData?.state ?? "",
                    city: userData?.lga ?? "",
                    country: "Nigeria",
                    countryBirth: "Nigeria",
                    lga: "",
                    stateOrigin: "",
                    cityOrigin: "",
                    guarantor1FirstName: "",
                    guarantor2FirstName: "",
                    guarantor1LastName: "",
                    guarantor2LastName: "",
                    guarantor1Email: "",
                    guarantor2Email: "",
                    guarantor1Address: "",
                    guarantor2Address: "",
                    guarantor1Relationship: "",
                    guarantor2Relationship: "",
                    refereeFirstName: "",
                    refereeLastName: "",
                    refereeEmail: "",
                    refereeAddress: "",
                    refereeRelationship: "",
                    fEmployerName: "",
                    fEmployerPhone: "",
                    fEmployerEmail: "",
                    fEmployerAddress: "",
                    jobType: userData?.jobtype
                  }}
                  onSubmit={(value) => {}}
                >
                  {({ handleChange, handleSubmit, values, errors }) => (
                    <div>
                      <div>
                        <div className="flex flex-row">
                          <p className="text-[20px] font-semibold">
                            Basic Information
                          </p>
                        </div>
                        <div className="mt-[-20px] flex flex-row gap-10 justify-between place-items-center">
                          <div className="my-[50px] flex flex-col gap-6">
                          <div>
                          <Image width={250} height={250} placeholder="empty" src={image ?? "/empty.png"} alt="" className="rounded-full max-w-[250px] max-h-[250px]" />
                          </div>
                          {/* <img src="/empty.png" alt="" className="rounded-full object-fill"/> */}
                          <CustomInput
                            // value={image}
                            onChange={handleImageChange}
                            component={"text"}
                            type="file"
                            placeHolder="Passport Photograph"
                            classes="h-[40px] md:w-[350px] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                            fitWidth
                            required
                            error={imgError}
                          />
                          </div>
                          <div className="flex flex-col gap-4">
                          <CustomInput
                            value={values.staffId}
                            onChange={handleChange("staffId")}
                            component={"text"}
                            placeHolder="Staff Id"
                            classes="h-[40px] md:w-[450px] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                            fitWidth
                            readonly
                          />
                          <CustomInput
                            value={values.hireDate}
                            onChange={handleChange("hireDate")}
                            component={"text"}
                            placeHolder="Hire Date"
                            classes="h-[40px] md:w-[450px] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                            fitWidth
                            readonly
                          />
                          <CustomInput
                            value={values.jobType}
                            onChange={handleChange("jobType")}
                            component={"text"}
                            placeHolder="Hire Date"
                            classes="h-[40px] md:w-[450px] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                            error={errors.firstName}
                            readonly
                            fitWidth
                          />
                          </div>
                        </div>
                        <Divider variant="fullWidth" className="h-[2px] bg-green-700 my-8" />
                        <div className="flex flex-row gap-10">
                          <CustomInput
                            value={values.firstName}
                            onChange={handleChange("firstName")}
                            component={"text"}
                            placeHolder="First name"
                            classes="h-[40px] md:w-[350px] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                            error={errors.firstName}
                            icon={<PersonIcon className="text-green-700" />}
                            fitWidth
                            required
                          />
                          <div>
                          <CustomInput
                            value={values.lastName}
                            onChange={handleChange("lastName")}
                            component={"text"}
                            placeHolder="LastName name"
                            classes="h-[40px] md:w-[350px] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                            error={errors.lastName}
                            icon={<PersonIcon className="text-green-700" />}
                            fitWidth
                            required
                          />
                          </div>
                          <CustomInput
                            value={values.otherName}
                            onChange={handleChange("otherName")}
                            component={"text"}
                            placeHolder="Last name"
                            classes="h-[40px] md:w-[350px] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                            error={errors.otherName}
                            icon={<PersonIcon className="text-green-700" />}
                            fitWidth
                            required
                          />
                        </div>
                        <div className="flex flex-row mt-[40px] gap-10">
                          <CustomInput
                            value={values.email}
                            onChange={handleChange("email")}
                            component={"text"}
                            type="email"
                            placeHolder="Email Address"
                            classes="h-[40px] md:w-[350px] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                            error={errors.email}
                            icon={<PersonIcon className="text-green-700" />}
                            fitWidth
                            required
                          />
                          <FormControl className="mt-[-5px]">
                            <div className="w-[100%] flex flex-row mb-[5px]">
                              <p className="text-[11px]">Phone Number</p>
                              <p className="mr-2 text-red-700 text-[14px] mt-[-2px] ml-1">
                                *
                              </p>
                            </div>
                            <PhoneInput
                              inputClass="h-[40px] w-[320px] md:w-[350px] bg-gray-100 rounded-md no-underline shadow-md"
                              country={"ng"}
                              value={phone?.main}
                              onChange={(phone) =>
                                handlePhoneChange(phone, "main")
                              }
                              enableSearch={true}
                              containerStyle={{
                                height: 40,
                              }}
                              inputStyle={{
                                height: 40,
                              }}
                            />
                          </FormControl>
                          <FormControl className="mt-[-5px]">
                            <div className="w-[100%] flex flex-row mb-[5px]">
                              {/* <p className="mr-2 text-red-700 text-[14px] mt-[-5px]">
                            *
                          </p> */}
                              <p className="text-[11px]">
                                Alternate Phone Number
                              </p>
                            </div>
                            <PhoneInput
                              inputClass="h-[40px] w-[320px] md:w-[350px] bg-gray-100 rounded-md no-underline shadow-md"
                              country={"ng"}
                              value={phone?.alt}
                              onChange={(phone) =>
                                handlePhoneChange(phone, "alt")
                              }
                              enableSearch={true}
                              containerStyle={{
                                height: 40,
                              }}
                              inputStyle={{
                                height: 40,
                              }}
                            />
                          </FormControl>
                        </div>

                        <div className="flex flex-row gap-10 mt-[40px]">
                          <CustomInput
                            value={location.country}
                            onChange={(e) => handleLocationChange(e, "country")}
                            // onChange={handleChange("state")}
                            component={"select"}
                            selValues={country_list}
                            placeHolder="Country"
                            classes="h-[40px] w-[320px] md:w-[350px] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                            fitWidth
                            required
                          />
                          <CustomInput
                            value={values.stateOrigin}
                            onChange={handleChange("stateOrigin")}
                            component={"text"}
                            // selValues={NaijaStates.lgas(location?.state)?.lgas}
                            placeHolder="State of Origin"
                            classes="h-[40px] w-[320px] md:w-[350px] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                            fitWidth
                            required
                          />
                          <CustomInput
                            value={values.cityOrigin}
                            onChange={handleChange("cityOrigin")}
                            component={"text"}
                            // selValues={NaijaStates.lgas(location?.state)?.lgas}
                            placeHolder="City of Origin"
                            classes="h-[40px] w-[320px] md:w-[350px] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                            fitWidth
                            required
                          />
                        </div>

                        <div className="mt-[40px] flex flex-row gap-10">
                          <CustomInput
                            value={values.lga}
                            onChange={handleChange("lga")}
                            component={"text"}
                            placeHolder="LGA"
                            classes="h-[40px] md:w-[350px] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                            error={errors.lga}
                            icon={<PersonIcon className="text-green-700" />}
                            fitWidth
                            required
                          />
                          <CustomInput
                            value={values.dob}
                            onChange={handleChange("dob")}
                            component={"text"}
                            type="date"
                            placeHolder="Date of birth"
                            classes="h-[40px] md:w-[350px] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                            error={errors.dob}
                            // icon={<CalendarMonth className="text-green-700" />}
                            fitWidth
                            required
                          />

                          <CustomInput
                            value={values.hireDate}
                            onChange={handleChange("hireDate")}
                            component={"text"}
                            type="date"
                            placeHolder="Hire Date"
                            classes="h-[40px] md:w-[350px] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                            error={errors.dob}
                            // icon={<CalendarMonth className="text-green-700" />}
                            fitWidth
                            required
                          />
                        </div>

                        <div className="flex flex-row gap-10 mt-[40px] flex-wrap">
                          <CustomInput
                            value={location.Ocountry}
                            onChange={(e) =>
                              handleLocationChange(e, "Bcountry")
                            }
                            // onChange={handleChange("state")}
                            component={"select"}
                            selValues={country_list}
                            placeHolder="Country of Birth"
                            classes="h-[40px] w-[320px] md:w-[350px] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                            fitWidth
                            required
                          />
                          <CustomInput
                            value={values.stateBirth}
                            onChange={handleChange("stateBirth")}
                            component={"text"}
                            // selValues={NaijaStates.lgas(location?.state)?.lgas}
                            placeHolder="State of Birth"
                            classes="h-[40px] w-[320px] md:w-[350px] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                            fitWidth
                            required
                          />
                          <CustomInput
                            value={values.cityBirth}
                            onChange={handleChange("cityBirth")}
                            component={"text"}
                            placeHolder="City of Birth"
                            classes="h-[40px] md:w-[350px] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                            error={errors.cityBirth}
                            icon={<PersonIcon className="text-green-700" />}
                            fitWidth
                            required
                          />
                        </div>

                        <div className="flex flex-row gap-10 mt-[40px]">
                          <CustomInput
                            value={meta.marital}
                            onChange={(e: any) =>
                              handleMetaChange(e, "marital")
                            }
                            component={"select"}
                            placeHolder="Marital Status"
                            selValues={maritalStatuses}
                            classes="h-[40px] md:w-[350px] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                            fitWidth
                            required
                          />
                          <CustomInput
                            value={meta.gender}
                            onChange={(e: any) => handleMetaChange(e, "gender")}
                            component={"select"}
                            placeHolder="Gender"
                            selValues={genders}
                            classes="h-[40px] md:w-[350px] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                            fitWidth
                            required
                          />
                          <CustomInput
                            value={meta.religion}
                            onChange={(e: any) =>
                              handleMetaChange(e, "religion")
                            }
                            component={"select"}
                            placeHolder="Religion"
                            selValues={religions}
                            classes="h-[40px] md:w-[350px] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                            fitWidth
                            required
                          />
                        </div>

                        <div className="mt-[40px]">
                          <div className="">
                            <p className="text-[20px] font-semibold">
                              Physical Address
                            </p>
                          </div>
                          <div className="grid grid-cols-3 gap-10 mt-[40px]">
                            <CustomInput
                              value={location.Ccountry}
                              onChange={(e) =>
                                handleLocationChange(e, "Ccountry")
                              }
                              // onChange={handleChange("state")}
                              component={"select"}
                              selValues={country_list}
                              placeHolder="Current Country"
                              classes="h-[40px] w-[320px] md:w-[350px] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                              fitWidth
                              required
                            />

                            <CustomInput
                              value={values.currentState}
                              onChange={handleChange("currentState")}
                              component={"text"}
                              // selValues={NaijaStates.lgas(location?.state)?.lgas}
                              placeHolder="Current State"
                              classes="h-[40px] w-[320px] md:w-[350px] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                              error={errors.currentState}
                              fitWidth
                              required
                            />
                            <CustomInput
                              value={values.currentCity}
                              onChange={handleChange("currentCity")}
                              component={"text"}
                              // selValues={NaijaStates.lgas(location?.state)?.lgas}
                              placeHolder="Current City"
                              classes="h-[40px] w-[320px] md:w-[350px] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                              error={errors.currentState}
                              fitWidth
                              required
                            />

                            <div className="grid col-span-2">
                              <CustomInput
                                value={values.currentAddress}
                                onChange={handleChange("currentAddress")}
                                component={"text"}
                                // selValues={NaijaStates.lgas(location?.state)?.lgas}
                                placeHolder="Current Address"
                                classes=" grid h-[40px] w-[320px] md:w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                                error={errors.currentAddress}
                                fitWidth
                                required
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-10 mt-[40px]">
                            <CustomInput
                              value={location.Pcountry}
                              onChange={(e) =>
                                handleLocationChange(e, "Pcountry")
                              }
                              // onChange={handleChange("state")}
                              component={"select"}
                              selValues={country_list}
                              placeHolder="Permanent Country"
                              classes="h-[40px] w-[320px] md:w-[350px] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                              fitWidth
                              required
                            />

                            <CustomInput
                              value={values.permanentState}
                              onChange={handleChange("permanentState")}
                              component={"text"}
                              // selValues={NaijaStates.lgas(location?.state)?.lgas}
                              placeHolder="Permanent State"
                              classes="h-[40px] w-[320px] md:w-[350px] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                              error={errors.permanentState}
                              fitWidth
                              required
                            />
                            <CustomInput
                              value={values.permanentCity}
                              onChange={handleChange("permanentCity")}
                              component={"text"}
                              // selValues={NaijaStates.lgas(location?.state)?.lgas}
                              placeHolder="Permanent City"
                              classes="h-[40px] w-[320px] md:w-[350px] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                              error={errors.permanentCity}
                              fitWidth
                              required
                            />

                            <div className="grid col-span-2">
                              <CustomInput
                                value={values.permanentAddress}
                                onChange={handleChange("permanentAddress")}
                                component={"text"}
                                // selValues={NaijaStates.lgas(location?.state)?.lgas}
                                placeHolder="Permanent Address"
                                classes=" grid h-[40px] w-[320px] md:w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                                error={errors.permanentAddress}
                                fitWidth
                                required
                              />
                            </div>
                          </div>

                          <div className="mt-[40px]">
                            <div>
                              <p className="text-[20px] font-semibold">
                                First Guarantor
                              </p>
                            </div>
                            <div className="mt-[40px] grid grid-cols-3 gap-10">
                              <CustomInput
                                value={values.guarantor1FirstName}
                                onChange={handleChange("guarantor1FirstName")}
                                component={"text"}
                                // selValues={NaijaStates.lgas(location?.state)?.lgas}
                                placeHolder="Firstname"
                                classes=" grid h-[40px] w-[320px] md:w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                                error={errors.guarantor1FirstName}
                                fitWidth
                                required
                              />
                              <CustomInput
                                value={values.guarantor1LastName}
                                onChange={handleChange("guarantor1LastName")}
                                component={"text"}
                                // selValues={NaijaStates.lgas(location?.state)?.lgas}
                                placeHolder="Lastname"
                                classes=" grid h-[40px] w-[320px] md:w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                                error={errors.guarantor1LastName}
                                fitWidth
                                required
                              />
                              <CustomInput
                                value={meta.guarantor1Gender}
                                onChange={(e) =>
                                  handleMetaChange(e, "guarantor1Gender")
                                }
                                component={"select"}
                                selValues={genders}
                                // selValues={NaijaStates.lgas(location?.state)?.lgas}
                                placeHolder="Permanent Address"
                                classes=" grid h-[40px] w-[320px] md:w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                                // error={errors.permanentAddress}
                                fitWidth
                                required
                              />
                              <CustomInput
                                value={values.guarantor1Email}
                                onChange={handleChange("guarantor1Email")}
                                component={"text"}
                                type="email"
                                // selValues={NaijaStates.lgas(location?.state)?.lgas}
                                placeHolder="Email Address"
                                classes=" grid h-[40px] w-[320px] md:w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                                error={errors.guarantor1Email}
                                fitWidth
                                required
                              />
                              <FormControl className="mt-[-5px]">
                                <div className="w-[100%] flex flex-row mb-[5px]">
                                  <p className="mr-2 text-red-700 text-[14px] mt-[-5px]">
                                    *
                                  </p>
                                  <p className="text-[11px]">Phone Number</p>
                                </div>
                                <PhoneInput
                                  inputClass="h-[40px] w-[320px] md:w-[350px] bg-gray-100 rounded-md no-underline shadow-md"
                                  country={"ng"}
                                  value={phone?.guarantor1}
                                  onChange={(phone) =>
                                    handlePhoneChange(phone, "guarantor1")
                                  }
                                  enableSearch={true}
                                  containerStyle={{
                                    height: 40,
                                  }}
                                  inputStyle={{
                                    height: 40,
                                  }}
                                />
                              </FormControl>
                              <CustomInput
                                value={values.guarantor1Relationship}
                                onChange={handleChange(
                                  "guarantor1Relationship"
                                )}
                                component={"text"}
                                // selValues={NaijaStates.lgas(location?.state)?.lgas}
                                placeHolder="Relationship with guarantor"
                                classes=" grid h-[40px] w-[320px] md:w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                                error={errors.guarantor1Relationship}
                                fitWidth
                                required
                              />

                              <div className="grid col-span-2">
                                <CustomInput
                                  value={values.guarantor1Address}
                                  onChange={handleChange("guarantor1Address")}
                                  component={"text"}
                                  // selValues={NaijaStates.lgas(location?.state)?.lgas}
                                  placeHolder="Permanent Address"
                                  classes=" grid h-[40px] w-[320px] md:w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                                  error={errors.guarantor1Address}
                                  fitWidth
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          <div className="mt-[40px]">
                            <div>
                              <p className="text-[20px] font-semibold">
                                Second Guarantor
                              </p>
                            </div>
                            <div className="mt-[40px] grid grid-cols-3 gap-10">
                              <CustomInput
                                value={values.guarantor2FirstName}
                                onChange={handleChange("guarantor2FirstName")}
                                component={"text"}
                                // selValues={NaijaStates.lgas(location?.state)?.lgas}
                                placeHolder="Firstname"
                                classes=" grid h-[40px] w-[320px] md:w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                                error={errors.guarantor2FirstName}
                                fitWidth
                                required
                              />
                              <CustomInput
                                value={values.guarantor2LastName}
                                onChange={handleChange("guarantor2LastName")}
                                component={"text"}
                                // selValues={NaijaStates.lgas(location?.state)?.lgas}
                                placeHolder="Lastname"
                                classes=" grid h-[40px] w-[320px] md:w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                                error={errors.guarantor2LastName}
                                fitWidth
                                required
                              />
                              <CustomInput
                                value={meta.guarantor2Gender}
                                onChange={(e) =>
                                  handleMetaChange(e, "guarantor2Gender")
                                }
                                component={"select"}
                                selValues={genders}
                                // selValues={NaijaStates.lgas(location?.state)?.lgas}
                                placeHolder="Permanent Address"
                                classes=" grid h-[40px] w-[320px] md:w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                                // error={errors.permanentAddress}
                                fitWidth
                                required
                              />
                              <CustomInput
                                value={values.guarantor2Email}
                                onChange={handleChange("guarantor2Email")}
                                component={"text"}
                                type="email"
                                // selValues={NaijaStates.lgas(location?.state)?.lgas}
                                placeHolder="Email Address"
                                classes=" grid h-[40px] w-[320px] md:w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                                error={errors.guarantor2Email}
                                fitWidth
                                required
                              />
                              <FormControl className="mt-[-5px]">
                                <div className="w-[100%] flex flex-row mb-[5px]">
                                  <p className="mr-2 text-red-700 text-[14px] mt-[-5px]">
                                    *
                                  </p>
                                  <p className="text-[11px]">Phone Number</p>
                                </div>
                                <PhoneInput
                                  inputClass="h-[40px] w-[320px] md:w-[350px] bg-gray-100 rounded-md no-underline shadow-md"
                                  country={"ng"}
                                  value={phone?.guarantor2}
                                  onChange={(phone) =>
                                    handlePhoneChange(phone, "guarantor2")
                                  }
                                  enableSearch={true}
                                  containerStyle={{
                                    height: 40,
                                  }}
                                  inputStyle={{
                                    height: 40,
                                  }}
                                />
                              </FormControl>
                              <CustomInput
                                value={values.guarantor2Relationship}
                                onChange={handleChange(
                                  "guarantor2Relationship"
                                )}
                                component={"text"}
                                // selValues={NaijaStates.lgas(location?.state)?.lgas}
                                placeHolder="Relationship with guarantor"
                                classes=" grid h-[40px] w-[320px] md:w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                                error={errors.guarantor2Relationship}
                                fitWidth
                                required
                              />

                              <div className="grid col-span-2">
                                <CustomInput
                                  value={values.guarantor2Address}
                                  onChange={handleChange("guarantor2Address")}
                                  component={"text"}
                                  // selValues={NaijaStates.lgas(location?.state)?.lgas}
                                  placeHolder="Permanent Address"
                                  classes=" grid h-[40px] w-[320px] md:w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                                  error={errors.guarantor2Address}
                                  fitWidth
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          <div className="mt-[40px]">
                            <div>
                              <p className="text-[20px] font-semibold">
                                First Guarantor
                              </p>
                            </div>
                            <div className="mt-[40px] grid grid-cols-3 gap-10">
                              <CustomInput
                                value={values.guarantor1FirstName}
                                onChange={handleChange("guarantor1FirstName")}
                                component={"text"}
                                // selValues={NaijaStates.lgas(location?.state)?.lgas}
                                placeHolder="Firstname"
                                classes=" grid h-[40px] w-[320px] md:w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                                error={errors.guarantor1FirstName}
                                fitWidth
                                required
                              />
                              <CustomInput
                                value={values.guarantor1LastName}
                                onChange={handleChange("guarantor1LastName")}
                                component={"text"}
                                // selValues={NaijaStates.lgas(location?.state)?.lgas}
                                placeHolder="Lastname"
                                classes=" grid h-[40px] w-[320px] md:w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                                error={errors.guarantor1LastName}
                                fitWidth
                                required
                              />
                              <CustomInput
                                value={meta.guarantor1Gender}
                                onChange={(e) =>
                                  handleMetaChange(e, "guarantor1Gender")
                                }
                                component={"select"}
                                selValues={genders}
                                // selValues={NaijaStates.lgas(location?.state)?.lgas}
                                placeHolder="Permanent Address"
                                classes=" grid h-[40px] w-[320px] md:w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                                // error={errors.permanentAddress}
                                fitWidth
                                required
                              />
                              <CustomInput
                                value={values.guarantor1Email}
                                onChange={handleChange("guarantor1Email")}
                                component={"text"}
                                type="email"
                                // selValues={NaijaStates.lgas(location?.state)?.lgas}
                                placeHolder="Email Address"
                                classes=" grid h-[40px] w-[320px] md:w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                                error={errors.guarantor1Email}
                                fitWidth
                                required
                              />
                              <FormControl className="mt-[-5px]">
                                <div className="w-[100%] flex flex-row mb-[5px]">
                                  <p className="mr-2 text-red-700 text-[14px] mt-[-5px]">
                                    *
                                  </p>
                                  <p className="text-[11px]">Phone Number</p>
                                </div>
                                <PhoneInput
                                  inputClass="h-[40px] w-[320px] md:w-[350px] bg-gray-100 rounded-md no-underline shadow-md"
                                  country={"ng"}
                                  value={phone?.guarantor1}
                                  onChange={(phone) =>
                                    handlePhoneChange(phone, "guarantor1")
                                  }
                                  enableSearch={true}
                                  containerStyle={{
                                    height: 40,
                                  }}
                                  inputStyle={{
                                    height: 40,
                                  }}
                                />
                              </FormControl>
                              <CustomInput
                                value={values.guarantor1Relationship}
                                onChange={handleChange(
                                  "guarantor1Relationship"
                                )}
                                component={"text"}
                                // selValues={NaijaStates.lgas(location?.state)?.lgas}
                                placeHolder="Relationship with guarantor"
                                classes=" grid h-[40px] w-[320px] md:w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                                error={errors.guarantor1Relationship}
                                fitWidth
                                required
                              />

                              <div className="grid col-span-2">
                                <CustomInput
                                  value={values.guarantor1Address}
                                  onChange={handleChange("guarantor1Address")}
                                  component={"text"}
                                  // selValues={NaijaStates.lgas(location?.state)?.lgas}
                                  placeHolder="Permanent Address"
                                  classes=" grid h-[40px] w-[320px] md:w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                                  error={errors.guarantor1Address}
                                  fitWidth
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          <div className="mt-[40px]">
                            <div>
                              <p className="text-[20px] font-semibold">
                                Referee
                              </p>
                            </div>
                            <div className="mt-[40px] grid grid-cols-3 gap-10">
                              <CustomInput
                                value={values.refereeFirstName}
                                onChange={handleChange("refereeFirstName")}
                                component={"text"}
                                // selValues={NaijaStates.lgas(location?.state)?.lgas}
                                placeHolder="Firstname"
                                classes=" grid h-[40px] w-[320px] md:w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                                error={errors.refereeFirstName}
                                fitWidth
                                required
                              />
                              <CustomInput
                                value={values.refereeLastName}
                                onChange={handleChange("refereeLastName")}
                                component={"text"}
                                // selValues={NaijaStates.lgas(location?.state)?.lgas}
                                placeHolder="Lastname"
                                classes=" grid h-[40px] w-[320px] md:w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                                error={errors.refereeLastName}
                                fitWidth
                                required
                              />
                              <CustomInput
                                value={meta.refereeGender}
                                onChange={(e) =>
                                  handleMetaChange(e, "refereeGender")
                                }
                                component={"select"}
                                selValues={genders}
                                // selValues={NaijaStates.lgas(location?.state)?.lgas}
                                placeHolder="Gender"
                                classes=" grid h-[40px] w-[320px] md:w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                                // error={errors.permanentAddress}
                                fitWidth
                                required
                              />
                              <CustomInput
                                value={values.refereeEmail}
                                onChange={handleChange("refereeEmail")}
                                component={"text"}
                                type="email"
                                // selValues={NaijaStates.lgas(location?.state)?.lgas}
                                placeHolder="Email Address"
                                classes=" grid h-[40px] w-[320px] md:w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                                error={errors.refereeEmail}
                                fitWidth
                                required
                              />
                              <FormControl className="mt-[-5px]">
                                <div className="w-[100%] flex flex-row mb-[5px]">
                                  <p className="mr-2 text-red-700 text-[14px] mt-[-5px]">
                                    *
                                  </p>
                                  <p className="text-[11px]">Phone Number</p>
                                </div>
                                <PhoneInput
                                  inputClass="h-[40px] w-[320px] md:w-[350px] bg-gray-100 rounded-md no-underline shadow-md"
                                  country={"ng"}
                                  value={phone?.referee}
                                  onChange={(phone) =>
                                    handlePhoneChange(phone, "referee")
                                  }
                                  enableSearch={true}
                                  containerStyle={{
                                    height: 40,
                                  }}
                                  inputStyle={{
                                    height: 40,
                                  }}
                                />
                              </FormControl>
                              <CustomInput
                                value={values.refereeRelationship}
                                onChange={handleChange("refereeRelationship")}
                                component={"text"}
                                // selValues={NaijaStates.lgas(location?.state)?.lgas}
                                placeHolder="Relationship with referee"
                                classes=" grid h-[40px] w-[320px] md:w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                                error={errors.refereeRelationship}
                                fitWidth
                                required
                              />

                              <div className="grid col-span-2">
                                <CustomInput
                                  value={values.refereeAddress}
                                  onChange={handleChange("refereeAddress")}
                                  component={"text"}
                                  // selValues={NaijaStates.lgas(location?.state)?.lgas}
                                  placeHolder="Permanent Address"
                                  classes=" grid h-[40px] w-[320px] md:w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                                  error={errors.refereeAddress}
                                  fitWidth
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          <div className="mt-[40px]">
                            <div>
                              <p className="text-[20px] font-semibold">
                                Former Employer
                              </p>
                            </div>
                            <div className="mt-[40px] grid grid-cols-3 gap-10">
                              <CustomInput
                                value={values.fEmployerName}
                                onChange={handleChange("fEmployerName")}
                                component={"text"}
                                // selValues={NaijaStates.lgas(location?.state)?.lgas}
                                placeHolder="Name"
                                classes=" grid h-[40px] w-[320px] md:w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                                error={errors.fEmployerName}
                                fitWidth
                                required
                              />
                              <CustomInput
                                value={values.fEmployerEmail}
                                onChange={handleChange("fEmployerEmail")}
                                component={"text"}
                                type="email"
                                // selValues={NaijaStates.lgas(location?.state)?.lgas}
                                placeHolder="Email Address"
                                classes=" grid h-[40px] w-[320px] md:w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                                error={errors.fEmployerEmail}
                                fitWidth
                                required
                              />
                              <FormControl className="mt-[-5px]">
                                <div className="w-[100%] flex flex-row mb-[5px]">
                                  <p className="mr-2 text-red-700 text-[14px] mt-[-5px]">
                                    *
                                  </p>
                                  <p className="text-[11px]">Phone Number</p>
                                </div>
                                <PhoneInput
                                  inputClass="h-[40px] w-[320px] md:w-[350px] bg-gray-100 rounded-md no-underline shadow-md"
                                  country={"ng"}
                                  value={phone?.fEmployer}
                                  onChange={(phone) =>
                                    handlePhoneChange(phone, "fEmployer")
                                  }
                                  enableSearch={true}
                                  containerStyle={{
                                    height: 40,
                                  }}
                                  inputStyle={{
                                    height: 40,
                                  }}
                                />
                              </FormControl>
                              <div className="grid col-span-2">
                                <CustomInput
                                  value={values.fEmployerAddress}
                                  onChange={handleChange("fEmployerAddress")}
                                  component={"text"}
                                  // selValues={NaijaStates.lgas(location?.state)?.lgas}
                                  placeHolder="Former Employer"
                                  classes=" grid h-[40px] w-[320px] md:w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                                  error={errors.fEmployerAddress}
                                  fitWidth
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          <div className="mt-[40px]">
                            <div>
                              <p className="text-[20px] font-semibold">
                                Documents
                              </p>
                            </div>
                            {renderDocs()}
                            <Button
                              onClick={addDocument}
                              className="text-green-700 capitalize mt-[20px]"
                            >
                              Add new Document
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center mt-[60px]">
                        <Button onClick={() => handleSubmit} className="h-[60px] w-[400px] capitalize text-white bg-green-700">
                          {!loading ? <p>Submit</p> : <CircularProgress thickness={5} className="text-white w-[40px] h-[40px]" />}
                        </Button>
                      </div>
                    </div>
                  )}
                </Formik>
              </form>
            )}
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default Onboarding;
