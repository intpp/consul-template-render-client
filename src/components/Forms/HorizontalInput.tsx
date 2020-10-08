import React from 'react';
import { Field } from 'formik';
import classNames from 'classnames';

interface HorizontalInputProps {
  name: string;
  touched: boolean;
  type: 'text' | 'password' | 'email';
  id?: string;
  label?: string;
  error?: string;
  addon?: string;
}

const HorizontalInput = ({ label, name, type = 'text', addon, error, touched, id, ...rest }: HorizontalInputProps) => {
  const inputNode = (
    <Field
      name={name}
      type={type}
      className={classNames('form-control', { 'is-valid': touched && !error, 'is-invalid': touched && error })}
      id={id}
      {...rest}
    />
  );

  return (
    <div className="form-group">
      {label && <label htmlFor={id}>{label}</label>}
      {addon ? (
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">{addon}</span>
          </div>
          {inputNode}
        </div>
      ) : inputNode}
      {touched && error ? (<div className="invalid-feedback">{error}</div>) : null}
    </div>
  );
};

export default HorizontalInput;
