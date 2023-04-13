import React, { useEffect, useState, useRef } from "react";
import { Candidate } from "../types/candidate";
import {
  Divider,
  Button,
  CircularProgress,
  IconButton,
  Alert,
  AlertTitle,
  FormControl,
  InputLabel,
  Dialog,
  Select,
  SelectChangeEvent,
  MenuItem,
  Paper
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Axios, { AxiosError, AxiosResponse } from "axios";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import Modal from "@mui/material/Modal";
import CircleIcon from "@mui/icons-material/Circle";
import PrintIcon from "@mui/icons-material/Print";
import SchoolIcon from "@mui/icons-material/School";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import BookIcon from "@mui/icons-material/Book";
import CloseIcon from "@mui/icons-material/Close";
import WorkIcon from "@mui/icons-material/Work";
import CalendarToday from "@mui/icons-material/CalendarToday";
import BadgeIcon from "@mui/icons-material/Badge";
import { Role } from "../types/roles";
import { useReactToPrint } from "react-to-print";
import { ScheduleInterview } from "./interviews/add";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type ApplicantProps = {
  data: Candidate;
  close: () => void;
  role: Role;
};

export const Applicant = ({ data, close, role}: ApplicantProps) => {
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState<number>(0);
  const [cvData, setCvData] = useState();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [skills, setSkills] = useState<string[]>();
  const [education, setEducation] = useState<{ [key: string]: string }[]>();
  const [exp, setExp] = useState<{ [key: string]: string }[]>();
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [flag, setFlag] = useState<string>("");
  const [flagLoading, setFlagLoading] = useState<boolean>(false);
  const [mailTemplate, setMailTemplate] = useState<string>("");
  const [mailLoading, setMailLoading] = useState<boolean>(false);
  const [stage, setStage] = useState<string>();
  const [interview, setInterview] = useState<boolean>(false);

  const printerRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printerRef.current,
    pageStyle: `@media print {
      @page {
        size: 400px 800px;
        margin: 0;
      }
    }`,
  });

  const flags: { [key: string]: string }[] = [
    {
      name: "Maybe",
      value: "maybe",
    },
    {
      name: "Not Fit",
      value: "notFit",
    },
    {
      name: "Best Fit",
      value: "bestFit",
    },
  ];

  const stages: string[] = ["2", "3", "4"];

  const openModal = () => setModalOpen(true);

  const closeModal = () => setModalOpen(false);

  const onDocumentLoadSuccess = ({ numPages }: any) => {
    setNumPages(numPages);
    if (numPages > 1) {
      setTimeout(() => {
        setPage(2);
      }, 0);
    }
  };

  useEffect(() => {
    const edu = JSON.parse(data?.education as string);
    const exp = JSON.parse(data?.experience as string);
    setEducation(edu);
    setExp(exp);
  }, []);

  const handleStatusChange = (code: number) => {
    setStatusCode(code);
    setTimeout(() => setStatusCode(0), 4000);
  };

  const moveToNextStage = (e: SelectChangeEvent) => {
    setLoading(true);
    const body = {
      id: data.id,
      stage: e.target.value,
    };
    Axios.post("http://localhost:5048/stage", body).then(
      (res: AxiosResponse) => {
        setLoading(false);
        handleStatusChange(res.data.code);
        if (res.data.code == 200) {
          alert("Applicant moved to the next stage");
        }
      }
    );
  };

  useEffect(() => {
    Axios.get(`http://localhost:5048/api/Candidate/skills/${data.id}`).then(
      (res: AxiosResponse) => {
        setSkills(res.data);
      }
    );

    return;
  }, []);

  const displayMessage = (code: number) => {
    switch (code) {
      case 200:
        return (
          <Alert
            className="h-[40px] p-1 pb-0 w-[350px]"
            variant="filled"
            severity="success"
          >
            <AlertTitle>Success</AlertTitle>
            Successfull
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

  const handleFlag = (e: SelectChangeEvent) => {
    setFlag(e.target.value);
    setFlagLoading(true);
    const body = {
      id: data.id,
      flag: e.target.value,
      roleName: role.name
    };
    Axios.post("http://localhost:5048/api/Candidate/flag", body)
      .then((res: AxiosResponse) => {
        if (res.data.code == 200) {
          setFlagLoading(false);
          alert(`Applicant successfully flagged as`);
        }
      })
      .catch((e: AxiosError) => {
        console.log(e.message);
        setFlagLoading(false);
      });
  };

  const cancelApplication = () => {
    const body = {
      id: data?.id,
    };
    Axios.post("http://localhost:5048/api/Candidate/cancel", body)
      .then((res) => {
        if (res.data.code == 200) {
          alert("Application cancelled successfully");
          setShowDialog(false);
        }
      })
      .catch((e: AxiosError) => {
        console.log(e.message);
      });
  };

  const fields: { [key: string]: any }[] = [
    {
      name: "First Name",
      value: data.firstName,
    },
    {
      name: "Other Name",
      value: data.otherName,
    },
    {
      name: "Last Name",
      value: data.lastName,
    },
    {
      name: "Gender",
      value: data.gender,
    },
    {
      name: "Date of Birth",
      value: data.dob?.split("T")[0],
    },
    {
      name: "Application Date",
      value: data.applDate?.split("T")[0],
    },
    {
      name: "Job Role Applied",
      value: role?.name,
    },
    {
      name: "Phone Number",
      value: data.phone,
    },
    {
      name: "Application Stage",
      value: data.stage,
    },
    {
      name: "Application Status",
      value: data.status,
    },
    {
      name: "Flag",
      value: data.flag ?? "Not yet Flagged",
    },
  ];

  const printResume = () => {
    if (document.getElementById("GFG")) {
      var divContents = document.getElementById("cv")?.innerHTML;
      var a = window.open("", "", "height=500, width=500");
      a?.document.write("<html>");
      a?.document.write("<body > <h1>Div contents are <br>");
      a?.document.write(divContents!);
      a?.document.write("</body></html>");
      a?.document.close();
      a?.print();
    }
  };

  const renderEducation = () => {
    return education?.map((item: { [key: string]: string }, idx) => (
      <div key={idx} className="flex flex-row gap-3 mt-6">
        <div>
          <p className="text-[11px]">School Attended</p>
          <div className="flex flex-row bg-white p-1 rounded-md place-items-center">
            <SchoolIcon className="text-green-700" />
            <p className="mx-2">{item.school}</p>
          </div>
        </div>
        <div>
          <p className="text-[11px]">Course of Study</p>
          <div className="flex flex-row bg-white p-1 rounded-md place-items-center">
            <SchoolIcon className="text-green-700" />
            <p className="mx-2">{item.course}</p>
          </div>
        </div>
        <div>
          <p className="text-[11px]">Certificate</p>
          <div className="flex flex-row bg-white p-1 rounded-md place-items-center">
            <SchoolIcon className="text-green-700" />
            <p className="mx-2">{item.degree}</p>
          </div>
        </div>
        <div>
          <p className="text-[11px]">Graduation Date</p>
          <div className="flex flex-row bg-white p-1 rounded-md place-items-center">
            <CalendarToday className="text-green-700" />
            <p className="mx-2">{item.graduationDate}</p>
          </div>
        </div>
      </div>
    ));
  };

  const renderInfo = () => {
    return fields?.map((item: { [key: string]: string }, idx: number) => (
      <div
        key={idx}
        className="flex flex-row gap-2 bg-white p-1 rounded-md overflow-x-hidden h-[35px]"
      >
        <p>{item.name}:</p>
        <p className="text-green-700 font-semibold">{item.value}</p>
      </div>
    ));
  };

  const generateId = () => {
    var body = {
      value: data.id,
    };
    Axios.post("http://localhost:5048/api/Candidate/generate/tempId", body)
      .then((res: AxiosResponse) => {
        console.log(res.data);
      })
      .catch((err: AxiosError) => {
        console.log(err.message);
      });
  };

  const renderExp = () => {
    return exp?.map((item: { [key: string]: string }, idx: number) => (
      <div key={idx}>
        <div className="flex flex-row gap-6">
          <div>
            <p className="text-[11px]">Employer</p>
            <div className="bg-white p-2 rounded-md flex flex-row gap-4">
              <WorkIcon className="text-green-700" />
              {item?.employer}
            </div>
          </div>
          <div>
            <p className="text-[11px]">Job Title</p>
            <div className="bg-white p-2 rounded-md flex flex-row gap-4">
              <BadgeIcon className="text-green-700" />
              {item?.title}
            </div>
          </div>
          <div>
            <p className="text-[11px]">Start Date</p>
            <div className="bg-white p-2 rounded-md flex flex-row gap-4">
              <CalendarToday className="text-green-700" />
              {item?.startDate}
            </div>
          </div>
          <div>
            <p className="text-[11px]">End Date</p>
            <div className="bg-white p-2 rounded-md flex flex-row gap-4">
              <CalendarToday className="text-green-700" />
              {item?.endDate}
            </div>
          </div>
        </div>
        <div className="mt-[20px]">
          <p className="text-[11px]">Duties</p>
          <div className="bg-white p-2 h-[100px] rounded-md overflow-y-scroll">
            {item?.description}
          </div>
        </div>
      </div>
    ));
  };

  const renderSkills = () => {
    return skills?.map((item: string, idx: number) => (
      <div
        className="bg-white p-1 flex place-items-center flex-row justify-items-center rounded-md overflow-x-hidden m-2 w-auto h-[35px]"
        key={idx}
      >
        <CircleIcon className="h-[10px] ml-[-7px] text-green-700" />
        <p className="mt-[-3px] ml-[-5px]">{item}</p>
      </div>
    ));
  };

  const mailTemplates: string[] = ["notFit", "accepted", "none"];

  const handleTemplateChange = (e: SelectChangeEvent) => {
    setMailTemplate(e.target.value);
    var body = {
      template: e.target.value,
      reciever: "odenadoma@gmail.com",
    };
    setMailLoading(true);
    Axios.post("http://localhost:5048/api/Candidate/mail", body)
      .then((res: AxiosResponse) => {
        console.log(res.data);
        setMailLoading(false);
        if (res.data.code == 200) {
          setMailTemplate("none");
          alert("Candidate mailed successfully");
        }
      })
      .catch((err: AxiosError) => {
        console.log(err.message);
        setMailTemplate("none");
        setMailLoading(false);
      });
  };

  return (
    <div className="">
      <Dialog open={showDialog}>
        <div className="h-[170px] bg-white p-4">
          <p className="font-semibold text-xl">Cancel Application?</p>
          <p className="font-semibold mt-4">
            Are you sure you want to cancel {data.firstName}'s Application?
          </p>
          <div className="flex justify-end">
            <div className="flex flex-row justify-between w-[50%] mt-6">
              <Button
                onClick={() => setShowDialog(false)}
                className="bg-green-700 text-white"
              >
                No
              </Button>
              <Button
                onClick={cancelApplication}
                className="bg-gray-400 text-white"
              >
                Yes
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
      <div className="flex justify-between">
        <p className="text-2xl font-bold text-green-700">
          Applicant Information
        </p>
        <IconButton onClick={close}>
          <ArrowBackIcon className="text-green-700" />
        </IconButton>
      </div>

      <div className="grid grid-cols-5 gap-4 mt-4">
        <div className="grid col-span-4">
          <div className="">
            <p className="text-xl font-semibold">Personal Info</p>
          </div>
          <div className="grid grid-cols-2 h-[70%] gap-2">{renderInfo()}</div>
        </div>

        <div className="grid grid-rows-4 h-[250px] col-span-1">
          <div id="cv" className="flex justify-end row-span-3">
            <Document
              className=""
              onLoadError={(e) => console.log(e)}
              file={`http://localhost:5048/resume/${data.id}`}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page ref={printerRef} pageNumber={page} height={200} />
            </Document>
          </div>

          <div className="grid justify-end row-span-1 mt-6">
            <div className="grid grid-cols-2 gap-8">
              <IconButton
                className="bg-green-700 rounded-md h-[30px] w-[60px]"
                onClick={openModal}
              >
                <FindInPageIcon className="text-white" />
                <p className="text-[12px] text-white">View</p>
              </IconButton>

              <IconButton
                className="bg-green-700 rounded-md h-[30px] w-[60px]"
                onClick={handlePrint}
              >
                <PrintIcon className="text-white" />
                <p className="text-[12px] text-white">Print</p>
              </IconButton>
            </div>
          </div>
        </div>
      </div>
      <Divider variant="fullWidth" className="bg-green-700 h-[2px] mt-1" />
      {/* skills */}
      <div className="mt-[20px]">
        <p className="text-xl font-semibold mb-4">Skills</p>
        <div className="flex flex-row">{renderSkills()}</div>
      </div>
      <Divider variant="fullWidth" className="bg-green-700 h-[2px] mt-1" />
      {/* education */}
      <div className="mt-[20px]">
        <p className="text-xl font-semibold mb-6">Work History</p>
        <div>{renderExp()}</div>
      </div>
      <Divider variant="fullWidth" className="bg-green-700 h-[2px] mt-1" />
      {/* experience */}
      <div className="pt-6 pb-2">
        <p className="text-xl font-semibold">Education</p>
        {renderEducation()}
      </div>
      <Divider variant="fullWidth" className="bg-green-700 h-[2px] mt-4" />
      <div className="flex flex-row mt-4 justify-end gap-4">
        <FormControl className="">
          <InputLabel className="text-sm">Flag Candidate</InputLabel>
          <Select
            value={flag}
            onChange={handleFlag}
            className="w-[120px] text-black bg-white h-[50px]"
            label="Experience"
            placeholder="Flag"
            size="small"
          >
            {flags.map((item: { [key: string]: string }, idx: number) => (
              <MenuItem key={idx} value={item.value}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {flagLoading && (
          <div>
            <CircularProgress />
          </div>
        )}
        {/* <FormControl className="">
          <InputLabel className="text-sm">Send Mail</InputLabel>
          <Select
            value={mailTemplate}
            onChange={handleTemplateChange}
            className="w-[120px] text-black bg-white h-[50px]"
            label="Experience"
            placeholder="Flag"
            size="small"
          >
            {mailTemplates.map((item: string, idx: number) => (
              <MenuItem key={idx} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}
        {mailLoading && (
          <div>
            <CircularProgress thickness={5} className="text-green-700" />
          </div>
        )}
        <Button
          onClick={generateId}
          className="bg-gray-400 text-white w-[200px]"
        >
          {loading ? (
            <CircularProgress
              thickness={7}
              className="text-white w-[10px] h-[10px] p-1"
            />
          ) : (
            <p>Cancel Application</p>
          )}
        </Button>

        <Button
          className="bg-green-700 text-white w-[200px]"
          onClick={() => setInterview(true)}
        >
          {loading ? (
            <CircularProgress
              thickness={7}
              className="text-white w-[10px] h-[10px] p-1"
            />
          ) : (
            <p>Schedule Interview</p>
          )}
        </Button>
        {/* <FormControl className="">
          <InputLabel className="text-sm">Move to stage</InputLabel>
          <Select
            value={stage}
            onChange={moveToNextStage}
            className="w-[140px] text-black bg-white h-[50px]"
            label="Experience"
            placeholder="Flag"
            size="small"
          >
            {stages.map((item: string, idx: number) => (
              <MenuItem key={idx} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}

        {loading && (
          <div>
            <CircularProgress thickness={5} className="text-green-700" />
          </div>
        )}
      </div>
      <Modal
        open={modalOpen}
        onClose={closeModal}
        className="flex justify-center"
      >
        <div className="w-[600px] h-[700px] flex justify-center overflow-scroll">
          <Document
            className="h-[200px]"
            onLoadError={(e) => console.log(e)}
            onSourceError={(e) => console.log(e)}
            file={`http://localhost:5048/resume/${data.id}`}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page pageNumber={page} height={800} />
          </Document>
        </div>
      </Modal>
      <Modal onClose={() => setInterview(false)} open={interview} className="flex justify-center">
        <ScheduleInterview candidate={data} role={role} />
      </Modal>
    </div>
  );
};
