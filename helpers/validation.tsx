import React from 'react'
import * as Yup from "yup";

//* calculates the candidates age and validates the birthday
const calculateAge = (birthday: any) => {
  var ageDifMs = Date.now() - birthday;
  var ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

//* validation schema for cover letter
export const ApplicationValidation = Yup.object().shape({
  coverLetter: Yup.string().required("this field is fequired"),
});

//* validation information for a candidate
export const CandidateValidation = Yup.object().shape({
  email: Yup.string()
    .email('The email is invalid')
    .required('This field is required'),
  password: Yup.string()
    .min(3, 'The password is too short')
    .max(12, 'The password is too long')
    .required('This field is required'),
  firstName: Yup.string()
  .required('this field is required'),
  lastName: Yup.string()
  .required('this field is required'),
  otherName: Yup.string(),
  dob: Yup.date().required('this field is required').test("birthday", "Must be upto 18 years of age", function(val) {
    return calculateAge(new Date(val)) > 18;
},
),
  validPassword: Yup.string().required('this field is required')
  .oneOf([Yup.ref('password')], 'Your passwords do not match.'),
  address: Yup.string().required("this field is fequired"),
});

//* validation for the sign in form
export const SignInValidation = Yup.object().shape({
  email: Yup.string()
  .email('The email is invalid')
  .required('This field is required'),
  password: Yup.string()
  .required('This field is required'),
  validPassword: Yup.string().required('this field is required')
  .oneOf([Yup.ref('password')], 'Your passwords do not match.'),
})

//* validation for creating a new job role
export const CreateJobValidation = Yup.object().shape({
  name: Yup.string()
  .required('This field is required'),
  unit: Yup.string()
  .required('This field is required'),
  deadline: Yup.date().required('this field is required').min(new Date(), "Please select a future date"),
})

//* validation for interview scheduling
export const InterviewForm = Yup.object().shape({
  date: Yup.date().required('this field is required').min(new Date(), "Please select a future date"),
  time: Yup.string().required('this field is required'),
  topic: Yup.string().notRequired()
})

//* validation for admin login
export const AdminForm = Yup.object().shape({
  userId: Yup.string().required('this field is required'),
  password: Yup.string()
  .required('This field is required'),
})
