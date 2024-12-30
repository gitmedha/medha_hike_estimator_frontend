import * as Yup from "yup";

// Define a schema for our form

export const bonusValidations = Yup.object().shape({
    review_cycle: Yup.string().required('Review cycle is required'),
    average: Yup.number()
      .typeError('Average must be a number')
      .min(0, 'Average cannot be less than 0')
      .required('Average is required'),
    compentency: Yup.number()
      .typeError('Competency must be a number')
      .min(0, 'Competency cannot be less than 0')
      .required('Competency is required'),
    employee_id: Yup.string().required('Employee ID is required'),
    full_name: Yup.string().required('Full name is required'),
    bonus: Yup.string(),
      kra: Yup.number()
      .typeError('KRA vs Goals must be a number')
      .min(0, 'KRA vs Goals cannot be less than 0')
      .required('KRA vs Goals is required'),
    manager: Yup.string().required('Reviewer is required'),
      normalized_ratings: Yup.number()
      .typeError('Normalize rating must be a number')
    }
);