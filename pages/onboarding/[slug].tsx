import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import axios, { AxiosResponse } from 'axios'
import { Navbar } from '../../components/navbar'
import { Button, CircularProgress, FormControl, Paper } from '@mui/material'
import { Candidate } from '../../types/candidate'
import { useRouter } from 'next/router'
import { CustomInput } from '../../components/customInput'
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Notifier } from "../../components/notifier";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { CalendarMonth, Close } from "@mui/icons-material";
import NaijaStates from 'naija-state-local-government';
import HomeIcon from '@mui/icons-material/Home';
import { error } from "console";
import Link from "next/link";


const Onboarding = () => {
    const [userData, setUserData] = useState<Candidate>()
    const [loaded, setLoaded] = useState<boolean>(false)
    const [phone, setPhone] = useState<{[key: string]: string}>({
      main: "",
      alt: ""
    })
    const [location, setLocation] = useState<{[key: string]: string}>({
      state: "",
      lga: ""
    })
    const [meta, setMeta] = useState<{[key: string]: string}>({
      marital: "",
      gender: "",
      religion: ""
    })

    const router = useRouter()

    const handlePhoneChange = (e: any, type: string) => {
      setPhone({...phone, [type]: e});
    };

    const handleMetaChange = (e: any, type: string) => {
      let update = { ...meta, [type]: e.target.value}
      setMeta(update)
    }

    const handleLocationChange = (e: any, type: string) => {
      let update = { ...location, [type]: e.target.value}
      setLocation(update)
    }

    const genders = ["Male", "Female"];

    const maritalStatuses: string[] = ["Single", "Married", "Divorced"];

    const religions: string[] = ["Christian", "Muslim", "Agnostic", "Atheist", "Other"]

    
    const getCandidate = (id: string) => {
        let body = {
            id
          }
          axios.post(process.env.NEXT_PUBLIC_GET_CANDIDATE_BY_ID as string, body)
          .then((res: AxiosResponse) => {
            if(res.data.code == 200) {
                // console.log(res.data.data)
                let data: Candidate = res.data.data[0]
                setUserData(data);
                setPhone({main: data?.phone, alt: ""});
                setLocation({lga: data.lga, state: data.state})
                setLoaded(true);
                setMeta({marital: data?.maritalStatus, gender: data?.gender, religion: "Christian"})
            //   setSelctCandidate(res.data.data[0]);
            //   let role = roles?.find((item: Role) => item.id == res.data.data[0]?.roleId);
            //   setRole(role);
            //   setModalOpen("");
            //   setViewing(true);
            }
          })
    }

    useEffect(() => {
        let { slug } = router.query
        if(slug && router.isReady) {
            getCandidate(slug as string)
        }
    }, [router.isReady])

    //* renames the fct state to abuja
  var updatedLoc = NaijaStates.states().map((item) => {
    if(item == "Federal Capital Territory") {
      item = "Abuja"
    }
    return item;
  })

  return (
    <div>
        <Navbar />
        <div className='bg-slate-100 flex justify-center p-6 mt-[60px]'>
        <Paper className='bg-white w-[100%] p-6'>
          <div className='flex justify-center'>
            <p className='text-[24px] font-semibold'>
              Candidate Onboarding
            </p>
          </div>
            <div className='flex justify-center mt-[60px]'>
              {!loaded ? <CircularProgress thickness={10} className='text-green-700 w-[60px] h-[60px]' /> : <form>
                <Formik initialValues={{
                  firstName: userData?.firstName ?? "",
                  lastName: userData?.lastName ?? "",
                  otherName: userData?.otherName ?? "",
                  email: userData?.email ?? "",
                  dob: userData?.dob.split("T")[0] ?? "",

                  // phone: userData?.phone ?? "",
                  // altPhone: "",
                  // gender: userData?.gender ?? "",
                  // state: userData?.state ?? "",
                  // lga: userData?.lga ?? "",
                  address: userData?.address ?? ""

                }} onSubmit={(value) => {

                }}>{({handleChange, handleSubmit, values, errors }) => (
                  <div>
                    <div className='flex flex-row gap-10'>
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
                    <div className='flex flex-row mt-[40px] gap-10'>
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
                          onChange={(phone) => handlePhoneChange(phone, "main")}
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
                          <p className="text-[11px]">Alternate Phone Number</p>
                        </div>
                        <PhoneInput
                         inputClass="h-[40px] w-[320px] md:w-[350px] bg-gray-100 rounded-md no-underline shadow-md"
                          country={"ng"}
                          value={phone?.alt}
                          onChange={(phone) => handlePhoneChange(phone, "alt")}
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

                    <div className='flex flex-row gap-10 mt-[40px]'>
                      <CustomInput
                        value={location.state}
                        onChange={(e) => handleLocationChange(e, "state")}
                        component={"select"}
                        selValues={updatedLoc}
                        placeHolder="State"
                        classes="h-[40px] w-[320px] md:w-[350px] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                        fitWidth
                        required
                      />
                      <CustomInput
                        value={location.lga}
                        onChange={(e) => handleLocationChange(e, "lga")}
                        component={"select"}
                        selValues={NaijaStates.lgas(location?.state)?.lgas}
                        placeHolder="City"
                        classes="h-[40px] w-[320px] md:w-[350px] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                        fitWidth
                        required
                      />
                      <CustomInput
                        value={values.address}
                        onChange={handleChange("address")}
                        component={"text"}
                        placeHolder="Address"
                        classes="h-[40px] md:w-[350px] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                        error={errors.address}
                        icon={<PersonIcon className="text-green-700" />}
                        fitWidth
                        required
                      />
                    </div>
                    <div className='flex flex-row gap-10 mt-[40px]'>
                    <CustomInput
                        value={meta.marital}
                        onChange={(e: any) => handleMetaChange(e, "marital")}
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
                        onChange={(e: any) => handleMetaChange(e, "religion")}
                        component={"select"}
                        placeHolder="Religion"
                        selValues={religions}
                        classes="h-[40px] md:w-[350px] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md mt-4"
                        fitWidth
                        required
                      />
                    </div>
                    <div className='flex flex-row mt-[40px] gap-10'>
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
                    </div>
                    <div className='flex justify-center mt-[60px]'>
                          <Button className='h-[50px] w-[300px] capitalize text-white bg-green-700'>
                            Submit
                          </Button>
                    </div>
                  </div>
                )}

                </Formik>
              </form>}
            </div>
        </Paper>
    </div>
    </div>
  )
}

export default Onboarding