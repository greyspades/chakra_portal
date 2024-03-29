export type Candidate = {
  firstName: string,
  lastName: string,
  dob: string,
  roleId: string,
  email: string,
  password?: string,
  applDate?: string,
  cv?: any,
  phone: string,
  stage?: string,
  status?: string,
  id?: string,
  gender?: "Male" | "Female",
  education?: string,
  experience?: string,
  flag?: string,
  otherName?: string,
  jobName?: string,
  tempId?: string,
  coverLetter?: string,
  address?: string,
  maritalStatus?: string,
  state?: string,
  lga?: string
}

export type Comment = {
  id?: string,
  firstName: string,
  lastName: string,
  comment: string,
  date?: string
}