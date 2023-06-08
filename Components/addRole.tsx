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

interface Props {
  name: string;
  code: string;
  cancel: () => void;
}

export const AddRole = ({ name, code, cancel }: Props) => {
  const [experience, setExperience] = useState("");

  const [salary, setSalary] = useState("");

  const [loading, setLoading] = useState(false);

  const [statusCode, setStatusCode] = useState<number | null>();

  const [desc, setDesc] = useState<{ [key: string]: string }[] | null>();

  const [addDesc, setAddDesc] = useState<string>("");

  const [location, setLocation] = useState<string>("");

  const [status, setStatus] = useState<{ [key: string]: any }>({
    open: false,
  });

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

  //* array containing years of experience values
  const years = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  //* handles experience change
  const handleExpChange = (event: SelectChangeEvent) => {
    setExperience(event.target.value as string);
  };

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
      <Paper className=" md:h-auto bg-slate-100 p-6 align-middle md:mt-[30px] w-[79%] md:fixed">
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
                unit: "",
                deadline: "",
              }}
              onSubmit={(value, { resetForm }) => {
                setLoading(true);
                let combinedDesc = [
                  ...(desc as { [key: string]: string }[]),
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
                  unit: value.unit,
                  description: JSON.stringify(combinedDesc),
                  deadline: value.deadline,
                  status: "active",
                  code,
                  location
                };
                //* adds a new job role
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
                      setStatus({
                        open: true,
                        topic: "Successful",
                        content: `Successfully created job role ${name}`,
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
              }}
            >
              {({ handleChange, handleSubmit, values, errors }) => (
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
                    <div className="h-[300px] bg-white p-4 overflow-y-scroll">
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
                      <div className="flex flex-row justify-between w-[70%] justify-items-center">
                        <FormControl>
                          <input
                            value={values.unit}
                            onChange={handleChange("unit")}
                            placeholder="Unit"
                            className="bg-white w-[200px] p-2"
                          />
                          <div className="text-red-600 text-[10px] ml-4">
                            {errors.unit as any}
                          </div>
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
                          <div className="text-red-600 text-[10px] ml-4">
                            {errors.experience as any}
                          </div>
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
                          <div className="text-red-600 text-[10px] ml-4">
                            {errors.experience as any}
                          </div>
                        </FormControl>

                        <FormControl>
                          <input
                            value={values.deadline}
                            onChange={handleChange("deadline")}
                            placeholder="Deadline"
                            className="bg-white p-2"
                            type="date"
                            name="deadline"
                            id="deadline"
                          />
                          <div className="text-red-600 text-[10px] ml-4">
                            {errors.deadline as any}
                          </div>
                        </FormControl>
                      </div>
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
