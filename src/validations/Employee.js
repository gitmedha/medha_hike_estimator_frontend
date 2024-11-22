import * as Yup from "yup";

export const employeeValidations = Yup.object({
    current_band: Yup.string().required("Current Band is required"),
    date_of_joining: Yup.date().required("Date of Joining is required"),
    employee_id: Yup.string().required("Employee ID is required"),
    department: Yup.string().required("Department is required"),
    employee_status: Yup.string().required("Employee Status is required"),
    experience: Yup.string().required("Experience is required"),
    email_id: Yup.string().email().required("Email ID is required"),
    title: Yup.string().required("Title is required"),
    employee_type: Yup.string().required("Employee Type is required"),
    first_name: Yup.string().required("First Name is required"),
    last_name: Yup.string().required("Last Name is required")
})