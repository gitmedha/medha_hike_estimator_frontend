import * as Yup from "yup";

export const calendarValidations = Yup.object({
  status: Yup.string(),
  assigned_to: Yup.string(),
  start_date: Yup.date(),
  end_date: Yup.date().when("start_date", (start_date, schema) =>
    start_date
      ? schema.min(start_date, "End date must be greater than start date")
      : schema
  ),
  alumni_service: Yup.string().required("Alumni Service is required."),
  reporting_date: Yup.date(),
  location: Yup.string().required("Location is required."),
  participants: Yup.number().required("Participants is required.")


});
