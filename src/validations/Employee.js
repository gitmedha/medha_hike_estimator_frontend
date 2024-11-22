import * as Yup from "yup";

export const employeeValidations = Yup.object({
    current_band: Yup.string().required("Current Band is required"),
    date_of_joining: Yup.date().required("Date of Joining is required"),
    employee_id: Yup.string().required("Employee ID is required"),
    department: Yup.string().required("Department is required"),
    employee_status: Yup.string().required("Employee Status is required"),
    years: Yup.number()
        .required("Years are required.")
        .min(0, "Years cannot be negative.")
        .max(50, "Years cannot exceed 50."),
    months: Yup.number()
        .required("Months are required.")
        .min(0, "Months cannot be negative.")
        .max(11, "Months should be between 0 and 11.")
        .test(
            "valid-months",
            "Months must be less than 12.",
            (value) => value === undefined || (value >= 0 && value <= 11)
        ),
    email_id: Yup.string().email().required("Email ID is required"),
    title: Yup.string().required("Title is required"),
    employee_type: Yup.string().required("Employee Type is required"),
    first_name: Yup.string().required("First Name is required"),
    last_name: Yup.string().required("Last Name is required")
})