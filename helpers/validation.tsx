import React from 'react'
import * as Yup from "yup";

function calculateAge(birthday: any) {
  var ageDifMs = Date.now() - birthday;
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export const validate = (body: {[key: string]: string}, type: string) => {
  switch(type) {
    case "status":
      if(body["email"] && body["password"] && body["email"].includes("@") && body["email"].includes(".") ) {
        return true;
      }
      else return false;

    default :
    return false;
  }
}

export const ApplicationValidation = Yup.object().shape({
  coverLetter: Yup.string().required("this field is fequired"),
});


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
  phone: Yup.string().required('this field is required').min(11, "Must be at least 11 digits").max(11, 'Must not be more than 11 digits'),
  // coverLetter: Yup.string().required("this field is fequired"),
  validPassword: Yup.string().required('this field is required')
  .oneOf([Yup.ref('password')], 'Your passwords do not match.'),
  address: Yup.string().required("this field is fequired"),
});

export const SignInValidation = Yup.object().shape({
  email: Yup.string()
  .email('The email is invalid')
  .required('This field is required'),
  password: Yup.string()
  .required('This field is required'),
  validPassword: Yup.string().required('this field is required')
  .oneOf([Yup.ref('password')], 'Your passwords do not match.'),
})

export const InterviewForm = Yup.object().shape({
  date: Yup.date().required('this field is required').min(new Date(), "Please select a future date"),
  time: Yup.string().required('this field is required'),
  topic: Yup.string().notRequired()
})

export const AdminForm = Yup.object().shape({
  userId: Yup.string().required('this field is required'),
  password: Yup.string()
  .required('This field is required'),
})
