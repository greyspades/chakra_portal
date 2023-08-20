import type { NextApiRequest, NextApiResponse } from "next";

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
  const options = {
    method: req.body.method,
    headers: {
      "Content-Type": "application/json",
      Auth: req.body.head
    },
    body: req.body.body,
  };
  console.log(req.body.body)
  let response = await fetch(req.body.url, options).then((res) => {
    let resData = res.json();
    return resData;
  }).catch((err) => {
    console.log(err)
  });
  // console.log(response)
  res.status(200).json(response)
}
