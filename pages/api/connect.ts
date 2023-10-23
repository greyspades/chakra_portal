import type { NextApiRequest, NextApiResponse } from "next";
import CryptoJS from "crypto-js";

type Data = {
  name: string;
};

type Req = {
  head: string,
  body: string,
  url: string
}

type UrlData = {
  code: string,
  url: string
}

const urls:UrlData[] = [
  {
    code: "createMeeting",
    url: process.env.CREATE_MEETING
  },
  {
    code: "createComment",
    url: process.env.CREATE_COMMENT
  },
  {
    code: "getJobRoles",
    url: process.env.GET_JOB_ROLES
  },
  {
    code: "getCandidateById",
    url: process.env.GET_CANDIDATE_BY_ID
  },
  {
    code: "getJobDescription",
    url: process.env.GET_JOB_DESCRIPTION
  },
  {
    code: "getSkills",
    url: process.env.GET_SKILLS
  },
  {
    code: "cancelApplication",
    url: process.env.CANCEL_APPLICATION
  },
  {
    code: "getResume",
    url: process.env.GET_RESUME
  },
  {
    code: "getActiveRoles",
    url: process.env.GET_ACTIVE_ROLES
  },
  {
    code: "getCandidateByStage",
    url: process.env.GET_CANDIDATE_BY_STAGE
  },
  {
    code: "hireCandidate",
    url: process.env.HIRE_CANDIDATE
  },
  {
    code: "getAllJobRoles",
    url: process.env.GET_ALL_JOB_ROLES
  },
  {
    code: "searchJobRoles",
    url: process.env.SEARCH_JOB_ROLES
  },
  {
    code: "getStatus",
    url: process.env.GET_STATUS
  },
  {
    code: "cancelApplication",
    url: process.env.CANCEL_APPLICATION
  },
  {
    code: "signIn",
    url: process.env.SIGN_USER_IN
  },
  {
    code: "getMeetings",
    url: process.env.GET_MEETINGS
  },
  {
    code: "getComments",
    url: process.env.GET_COMMENTS_BY_ID
  },
  {
    code: "flagCandidate",
    url: process.env.FLAG_APPLICATION
  },
  {
    code: "adminAuth",
    url: process.env.ADMIN_AUTH
  },
  {
    code: "validateEmail",
    url: process.env.VALIDATE_EMAIL
  },
  {
    code: "getMetrics",
    url: process.env.GET_METRICS
  },
  {
    code: "getCandidatesByJob",
    url: process.env.GET_APPLICATIONS_BY_JOB
  },
  {
    code: "createApplication",
    url: process.env.CREATE_APPLICATION
  },
  {
    code: "createUser",
    url: process.env.CREATE_NEW_USER
  },
  {
    code: "signUserIn",
    url: process.env.SIGN_USER_IN
  },
  {
    code: "getStatus",
    url: process.env.GET_STATUS
  },
  {
    code: "createJob",
    url: process.env.CREATE_NEW_JOB_ROLE
  },
  {
    code: "sendResetMail",
    url: process.env.SEND_PASS_RESET_MAIL
  },
  {
    code: "resetPassword",
    url: process.env.RESET_PASSWORD
  },
  {
    code: "changeStatus",
    url: process.env.CHANGE_STATUS
  },
  {
    code: "getByFlag",
    url: process.env.GET_APPLICANTS_BY_FLAG
  },
  {
    code: "getCv",
    url: process.env.GET_RESUME
  },
  {
    code: "getJobByCode",
    url: process.env.GET_JOB_BY_CODE
  },
  {
    code: "UpdateRole",
    url: process.env.UPDATE_JOB_ROLE
  }
]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  var key = CryptoJS.enc.Utf8.parse(process.env.AES_KEY);
  var iv = CryptoJS.enc.Utf8.parse(process.env.AES_IV);

  let reqToken = CryptoJS.AES.encrypt(
    process.env.AUTH_TOKEN,
    key,
    {
      iv: iv,
    }
  ).toString();

  const options = {
    method: req.body.method,
    headers: {
      "Content-Type": "application/json",
      Auth: reqToken
    },
    body: req.body.body,
  };

  const reqUrl: string = urls.find((item: UrlData) => item.code === req.body.url).url
  let response = await fetch(reqUrl, options).then(async(resDat) => {
    if(resDat.ok) {
      let resData = await resDat.json();
    return resData
    } else {
      res.status(400).json({message: "failed to process this request"})
    }
  }).catch((err) => {
    console.log(err)
  });

  res.status(200).json(response)
  // res.status(200).json({})
}
