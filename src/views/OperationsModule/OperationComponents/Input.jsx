
import React from "react";
import { useField } from "formik";

function Input({ name, label }) {
  const [field] = useField({ name, type: "text" });
  const input = <input id={name} name={name} type="text" {...field} />;

  if (label) {
    return (
      <div className="field">
        <label htmlFor={name}>{label}</label>
        {input}
      </div>
    );
  }
  return input;
}

export default React.memo(Input);
