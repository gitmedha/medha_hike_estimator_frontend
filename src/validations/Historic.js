import * as Yup from "yup";

export const historicValidations = Yup.object({
    employee: Yup.string().required("Employee name is required"),
    reviewer:Yup.string().required("Reviewer name is required"),
    kra_vs_goals:Yup.number().required("Kra vs goals are required"),
    competency: Yup.number().required("Competency is required"),
    final_score: Yup.number().required("Final score is required"),
    start_month: Yup.date(),
    ending_month: Yup.date().when("start_month", (start_month, schema) =>
        start_month
      ? schema.min(start_month, "End Month must be greater than Start Month")
      : schema
  ),
})