import type { NextApiRequest, NextApiResponse } from "next";
import Axios from 'axios'

type Data = {
  name: string;
};

type Req = {
  head: string,
  body: string,
  url: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const options = {
  //   method: 'POST',
  //   headers: {
  //     "Content-Type": "multipart/form-data",
  //      "Auth": req.body.head
  //   },
  //   body: req.body.body,
  // };
  // // console.log(req.body.body)
  // let response = await fetch("http://localhost:5048/api/Candidate/create", options).then((res) => {
  //   let resData = res.json();
  //   return resData;
  // }).catch((err) => {
  //   console.log(err)
  // });
  // console.log(response)
  // res.status(200).json(response)

    const response = await Axios.post(req.body.url, req.body.body, {headers:{
      "Content-Type": "multipart/form-data",
       "Auth": req.body.head
      }})
            .then((res) => {
                // console.log(res.data)
                return res.data
            })
            .catch((err) => {
                console.log(err.message)
            })
    
    res.status(200).json(response)
}
