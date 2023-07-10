import React, { useEffect, useState, useRef } from "react";
import { Candidate, Comment } from "../types/candidate";
import {
  Divider,
  Button,
  CircularProgress,
  IconButton,
  FormControl,
  InputLabel,
  Dialog,
  Select,
  SelectChangeEvent,
  MenuItem
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
import WorkIcon from "@mui/icons-material/Work";
import CalendarToday from "@mui/icons-material/CalendarToday";
import BadgeIcon from "@mui/icons-material/Badge";
import { Role } from "../types/roles";
import { useReactToPrint } from "react-to-print";
import { ScheduleInterview } from "./interviews/add";
import { Notifier } from "./notifier";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type ApplicantProps = {
  data: Candidate;
  close: () => void;
  role: Role;
};

export const Applicant = ({ data, close, role }: ApplicantProps) => {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [skills, setSkills] = useState<string[]>();
  const [education, setEducation] = useState<{ [key: string]: string }[]>();
  const [exp, setExp] = useState<{ [key: string]: string }[]>();
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [flag, setFlag] = useState<string>("");
  const [flagLoading, setFlagLoading] = useState<boolean>(false);
  const [interview, setInterview] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>()
  const [numPages, setNumPages] = useState<number>(0)
  const [statusCode, setStatusCode] = useState<number>();
  const [status, setStatus] = useState<{[key: string]: any}>({
    open: false
  })

  //* ref for attaching unto the pdf div
  const printerRef = useRef(null);

  //* prints the resume
  const handlePrint = useReactToPrint({
    content: () => printerRef.current,
    pageStyle: `@media print {
      @page {
        size: 400px 800px;
        margin: 0;
      }
    }`,
  });

  //* candidate flags
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

  //* opens the resume modal
  const openModal = () => setModalOpen(true);

  //* closes the resume modal
  const closeModal = () => setModalOpen(false);

  //* callback fired once the resume has loaded
  const onDocumentLoadSuccess = ({ numPages }: any) => {
    setNumPages(numPages);
    if (numPages > 1) {
      setTimeout(() => {
        setPage(1);
      }, 0);
    }
  };

  //* parses the education and experience data from JSON
  useEffect(() => {
    const edu = JSON.parse(data?.education as string);
    const exp = JSON.parse(data?.experience as string);
    setEducation(edu);
    setExp(exp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //* fired once the status has changed
  const handleStatusChange = (code: number) => {
    setStatusCode(code);
    setTimeout(() => setStatusCode(0), 4000);
  };

  //* gets all candidate comments
  const getComments = () => {
    let body = {
      id: data?.id
    }
    Axios.post(process.env.NEXT_PUBLIC_GET_COMMENTS_BY_ID as string, body)
    .then((res: AxiosResponse) => {
      if(res.data.code == 200) {
        setComments(res.data.data);
      }
    })
    .catch((err: AxiosError) => {
      console.log(err.message)
      setStatus({
        open: true,
        topic: "Unsuccessful",
        content: err.message,
      });
    })
  }

  useEffect(() => {
   //* fetches candidate skills
   let body = {
    id: data.id
   }
    Axios.post(process.env.NEXT_PUBLIC_GET_SKILLS as string, body).then(
      (res: AxiosResponse) => {
        setSkills(res.data);
      }
    );

    //* call to fetch comments
    getComments();

    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //* flags candidate
  const handleFlag = (e: SelectChangeEvent) => {
    setFlag(e.target.value);
    setFlagLoading(true);

    const body = {
      id: data.id,
      flag: e.target.value,
      roleName: role.name,
    };

    Axios.post(`${process.env.NEXT_PUBLIC_FLAG_CANDIDATE}`, body)
      .then((res: AxiosResponse) => {
        if (res.data.code == 200) {
          setFlagLoading(false);
          setStatus({
            open: true,
            topic: "Successful",
            content: `Candidate successfully flagged as ${e.target.value}`
          })
        }
      })
      .catch((e: AxiosError) => {
        setStatus({
          open: true,
          topic: "Unsuccessful",
          content: e.message,
        });
        setFlagLoading(false);
      });
  };

  //* cancels candidates application
  const cancelApplication = () => {
    const body = {
      id: data?.id,
    };
    Axios.post(process.env.NEXT_PUBLIC_CANCEL_APPLICATION as string, body)
      .then((res) => {
        if (res.data.code == 200) {
          setStatus({
            open: true,
            topic: "Successful",
            content: "Application Cancelled Successfully"
          })
          setShowDialog(false);
        }
      })
      .catch((e: AxiosError) => {
        console.log(e.message);
      });
  };

  //* array containing personal information which is mapped and rendered to the screen
  const fields: { [key: string]: any }[] = [
    {
      name: "First Name",
      value: data?.firstName,
    },
    {
      name: "Other Name",
      value: data?.otherName,
    },
    {
    name: "Last Name",
      value: data?.lastName,
    },
    {
      name: "Gender",
      value: data?.gender,
    },
    {
      name: "Date of Birth",
      value: data?.dob?.split("T")[0],
    },
    {
      name: "Application Date",
      value: data?.applDate?.split("T")[0],
    },
    {
      name: "Job Role Applied",
      value: data?.jobName,
    },
    {
      name: "Phone Number",
      value: data?.phone,
    },
    {
      name: "Email Address",
      value: data?.email
    },
    {
      name: "House Address",
      value: data?.address
    },
    {
      name: "Marital Status",
      value: data?.maritalStatus
    },
    {
      name: "Application Stage",
      value: data?.stage,
    },
    {
      name: "Application Status",
      value: data?.status,
    },
    {
      name: "Flag",
      value: data?.flag ?? "Not yet Flagged",
    },
    {
      name: "Temporary Id",
      value: `TSN${data?.tempId}` ?? "Not hired",
    },
    {
      name: "State",
      value: data?.state,
    },
    {
      name: "LGA",
      value: data?.lga,
    },
  ];

  //* starts the print operation for the resume
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

  //* renders candidate comments
  const renderComments = () => {
    return comments?.map((item: Comment, idx: number) => (
      <div key={idx} className="bg-white p-2 mt-4 rounded-md">
        <div className="flex flex-row gap-10">
        <p>By: {item?.firstName}</p>
        <p>{item?.lastName}</p>
        </div>
        <p className="capitalize mt-4">comment: {item?.comment}</p>
      </div>
    ))
  }

  const nextPage = () => {
    if(page < numPages) {
      setPage((page) => page + 1)
    }
  }

  const prevPage = () => {
    if(page <= numPages) {
      setPage((page) => page - 1)
    }
  }

  //* renders candidate education information
  const renderEducation = () => {
    return education?.map((item: { [key: string]: string }, idx) => (
      <div key={idx} className="flex flex-row gap-3 mt-6">
        <div>
          <p className="text-[11px]">School Attended</p>
          <div className="flex flex-row bg-white p-1 rounded-md place-items-center">
            <SchoolIcon className="text-green-700" />
            <p className="mx-2 capitalize">{item.school}</p>
          </div>
        </div>
        <div>
          <p className="text-[11px]">Course of Study</p>
          <div className="flex flex-row bg-white p-1 rounded-md place-items-center">
            <SchoolIcon className="text-green-700" />
            <p className="mx-2 capitalize">{item.course}</p>
          </div>
        </div>
        <div>
          <p className="text-[11px]">Certificate</p>
          <div className="flex flex-row bg-white p-1 rounded-md place-items-center">
            <SchoolIcon className="text-green-700" />
            <p className="mx-2 capitalize">{item.degree}</p>
          </div>
        </div>
        <div>
          <p className="text-[11px]">Graduation Date</p>
          <div className="flex flex-row bg-white p-1 rounded-md place-items-center">
            <CalendarToday className="text-green-700" />
            <p className="mx-2 capitalize">{item.graduationDate}</p>
          </div>
        </div>
        {item?.certification && (
          <div>
            <p className="text-[11px]">Certification</p>
            <div className="flex flex-row bg-white p-1 rounded-md place-items-center">
              <CalendarToday className="text-green-700" />
              <p className="mx-2 capitalize">{item?.certification}</p>
            </div>
          </div>
        )}
      </div>
    ));
  };

  //* renders candidates personal information
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

  //* renders candidates experience
  const renderExp = () => {
    return exp?.map((item: { [key: string]: string }, idx: number) => (
      <div key={idx} className="mt-6 mb-4">
        <div className="flex flex-row gap-6">
          <div>
            <p className="text-[11px]">Employer</p>
            <div className="bg-white capitalize p-2 rounded-md flex flex-row gap-4">
              <WorkIcon className="text-green-700" />
              {item?.employer}
            </div>
          </div>
          <div>
            <p className="text-[11px]">Job Title</p>
            <div className="bg-white capitalize p-2 rounded-md flex flex-row gap-4">
              <BadgeIcon className="text-green-700" />
              {item?.title}
            </div>
          </div>
          <div>
            <p className="text-[11px]">Start Date</p>
            <div className="bg-white capitalize p-2 rounded-md flex flex-row gap-4">
              <CalendarToday className="text-green-700" />
              {item?.startDate}
            </div>
          </div>
          <div>
            <p className="text-[11px]">End Date</p>
            <div className="bg-white capitalize p-2 rounded-md flex flex-row gap-4">
              <CalendarToday className="text-green-700" />
              {item?.isCurrent ? "Current Position" : item?.endDate}
            </div>
          </div>
        </div>
        <div className="mt-[20px]">
          <p className="text-[11px]">Duties</p>
          <div className="bg-white capitalize p-2 h-[100px] rounded-md overflow-y-scroll">
            {item?.description}
          </div>
        </div>
      </div>
    ));
  };

  //* renders candidate skills
  const renderSkills = () => {
    return skills?.map((item: string, idx: number) => (
      <div
        className="bg-white p-1 flex place-items-center flex-row justify-items-center rounded-md overflow-x-hidden m-2 w-auto h-[35px]"
        key={idx}
      >
        <CircleIcon className="h-[10px] ml-[-7px] text-green-700" />
        <p className="mt-[-3px] ml-[-5px] capitalize">{item}</p>
      </div>
    ));
  };

  //* clears notifier state
  const clearStatus = () => setStatus({open: false})

  return (
    <div className="">
      {/* notifier component */}
      <Modal className="flex justify-center" open={status?.open ? true : false} onClose={clearStatus}>
        <Notifier topic={status?.topic ?? ""} content={status?.content ?? ""} close={clearStatus}  />
      </Modal>
      <Dialog open={showDialog}>
        <div className="h-[170px] bg-white p-4">
          <p className="font-semibold text-xl">Cancel Application?</p>
          <p className="font-semibold mt-4">
            Are you sure you want to cancel {data?.firstName}'s Application?
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
            <p className="text-xl font-semibold mb-4">Personal Info</p>
          </div>
          <div className="grid grid-cols-2 h-[70%] gap-2">{renderInfo()}</div>
        </div>

        <div className="grid grid-rows-4 h-[250px] col-span-1">
          <div id="cv" className="flex justify-end row-span-3">
            {/* component that displays resume */}
            <Document
              className=""
              onLoadError={(e) => console.log(e)}
              file={`${process.env.NEXT_PUBLIC_GET_RESUME}/${data?.id}`}
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
      <div className="mt-4">
        <div>
          <p className="text-xl font-semibold mb-4">Cover Letter</p>
        </div>
        <div className="flex rounded-md bg-white p-4 w-[100%] h-auto overflow-y-scroll">
          <p>{data?.coverLetter}</p>
        </div>
      </div>
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
      <div  className="pt-6 pb-2">
      <p className="text-xl font-semibold">Comments</p>
        {renderComments()}
      </div>
      <Divider variant="fullWidth" className="bg-green-700 h-[2px] mt-4" />
      <div className="flex flex-row mt-4 justify-end gap-4">
        <FormControl className="">
          <InputLabel className="text-sm">Flag Candidate</InputLabel>
          <Select
            disabled={data.status == "Hired" ? true : false}
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
        <Button
          disabled={data.status == "Pending" ? false : true}
          className={data.status == "Pending" ? "bg-green-700 text-white w-[200px]" : "bg-slate-400 text-white w-[200px]"}
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
        {loading && (
          <div>
            <CircularProgress thickness={5} className="text-green-700" />
          </div>
        )}
      </div>
      {/* modal tht displays the resume in a larger size */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        className="flex justify-center"
      >
        <div className="">
        <div className="w-[550px] sticky top-0 h-[90vh] flex flex-col justify-center overflow-scroll">
          <Document
            className="h-[200px]"
            onLoadError={(e) => console.log(e)}
            onSourceError={(e) => console.log(e)}
            file={`${process.env.NEXT_PUBLIC_GET_RESUME}/${data?.id}`}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page pageNumber={page} height={800} />
          </Document>
        </div>

        <div className="bg-white h-[60px] w-[550px] flex flex-row justify-between place-items-center">
          <div className="flex flex-row w-[70%] justify-between place-items-center ">
      <div className="flex flex-row justify-center place-items-center">
        <IconButton onClick={prevPage}>
        <ArrowBackIosNewIcon className="text-green-700" />
        </IconButton>
        <p>prev Page</p>
      </div>
        <div className="flex flex-row gap-2 place-content-center">
        <p className="text-[18px] text-green-700 font-semibold">
          {numPages}
        </p>
        <p>
          Pages
        </p>
        </div>
      <div className="flex flex-row justify-center place-items-center">
        <p>next Page</p>
        <IconButton onClick={nextPage}>
        <ArrowForwardIosIcon className="text-green-700" />
        </IconButton>
      </div>
    </div>
    <div className="flex flex-row gap-2">
      <p>
      Page
      </p>
      <p className="bg-green-300 w-[60px] h-[30px] flex justify-center">
          {page}
      </p>
    </div>
          </div>
        </div>
      </Modal>
      {/* modal for scheduling interviews */}
      <Modal
        onClose={() => setInterview(false)}
        open={interview}
        className="flex justify-center"
      >
        {/* component for adding new schedules */}
        <ScheduleInterview close={() => setInterview(false)} candidate={data} role={role} />
      </Modal>
    </div>
  );
};
