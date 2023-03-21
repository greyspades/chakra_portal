// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const fs = require('fs');


type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if(req.method == "GET") {
    var data =fs.readFileSync('./public/cv/resume.pdf');
// res.contentType("application/pdf");
res.send(data);
  }
}
