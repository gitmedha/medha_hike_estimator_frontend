import PropTypes from "prop-types";
import { Formik, Form } from "formik";

const FormContainer = (props) => {
  const { onSubmit, initialValues, validationSchema, children } = props;

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      {(formik) => <Form>{children}</Form>}
    </Formik>
  );
};

FormContainer.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
};

export default FormContainer;
