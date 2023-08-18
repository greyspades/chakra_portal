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
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Auth: req.body.head
    },
    body: req.body.body,
  };
  let response = await fetch("http://localhost:5089/roles/Role/all", options).then((res) => {
    let resData = res.json();
    console.log("response na")
    return resData;
  });
  res.status(200).json(response)
}
