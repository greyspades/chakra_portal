export type Candidate = {
  firstName: string,
  lastName: string,
  dob: string,
  roleId: string,
  email: string,
  password: string,
  applDate?: string,
  cv?: any,
  phone: string,
  stage?: string,
  status?: string,
  id: string,
  gender: "Male" | "Female" | "Non Binary",
  education: string,
  experience: string
}