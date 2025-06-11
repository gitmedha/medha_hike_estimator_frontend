import * as Yup from "yup";
import moment from "moment";

export const incrementValidations = Yup.object().shape({
  average: Yup.number()
    .typeError("Average must be a number")
    .min(0, "Average cannot be less than 0")
    .required("Average is required"),
  compentency: Yup.number()
    .typeError("Competency must be a number")
    .min(0, "Competency cannot be less than 0")
    .required("Competency is required"),
  current_band: Yup.string().required("Current band is required"),
  current_salary: Yup.string().required("Current salary is required"),
  employee_id: Yup.string().required("Employee ID is required"),
  full_name: Yup.string().required("Full name is required"),
  inc_adjustments: Yup.string()
    .required("Incremental adjustments are required"),
  increment: Yup.string().required("Increment is required"),
  kra_vs_goals: Yup.number()
    .typeError("KRA vs Goals must be a number")
    .min(0, "KRA vs Goals cannot be less than 0")
    .required("KRA vs Goals is required"),
  long_tenure: Yup.string()
    .oneOf(["Yes", "No"], "Long tenure must be Yes or No")
    .required("Long tenure is required"),
  manager: Yup.string().required("Manager is required"),
  new_band: Yup.string().required("New band is required"),
  new_salary: Yup.string().required("New salary is required"),
  normalize_rating: Yup.number()
    .typeError("Normalize rating must be a number")
    .required("Normalize rating is required"),
  tenure: Yup.number()
    .typeError("Tenure must be a number")
    .min(0, "Tenure cannot be less than 0")
    .required("Tenure is required"),

  from_review_cycle: Yup.string()
    .required("From review cycle is required"),

  to_review_cycle: Yup.string()
    .required("To review cycle is required")
    .test(
      "is-after-from",
      "To review cycle must be after From review cycle",
      function (toDate) {
        const { from_review_cycle } = this.parent;
        const from = moment(from_review_cycle, "MMM YYYY", true);
        const to = moment(toDate, "MMM YYYY", true);
        if (!from.isValid() || !to.isValid()) return true;
        return to.isAfter(from);
      }
    ),
});
