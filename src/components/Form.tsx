import React, { useCallback, useState } from 'react';
import AceEditor from 'react-ace';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-github';
import HorizontalInput from './Forms/HorizontalInput';


const RenderTemplateSchema = Yup.object().shape({
  api: Yup.object().shape({
    url: Yup.string().required('Required'),
  }),
  vault: Yup.object().shape({
    url: Yup.string().url('Invalid url').required('Required'),
    token: Yup.string().required('Required'),
  }),
  template: Yup.string().required('Required'),
});

interface SubmitArguments {
  api: {
    url: string;
  },
  vault: {
    url: string;
    token: string;
  },
  template: string;
  envVariables: Array<{ name: string; value: string; }>
}

const TemplateForm = () => {
  const [renderedTemplate, setRenderedTemplate] = useState('');
  const handleSubmit = useCallback(async ({ api, vault, template, envVariables }: SubmitArguments) => {
    const response = await fetch(`${api.url}/render`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vault,
        template,
        envVariables: envVariables.reduce((res, { name, value }) => ({ ...res, [name]: value }), {}),
      }),
    }).then(response => response.json());

    if (response.template) {
      setRenderedTemplate(response.template);
    }
  }, []);

  return (
    <Formik
      initialValues={{
        api: { url: 'http://localhost:3000' },
        vault: { url: '', token: '' },
        envVariables: [],
        template: '',
      }}
      validationSchema={RenderTemplateSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, values, setFieldValue, isSubmitting }) => (
        <Form>
          <div className="row mx-1 my-3">
            <div className="col">
              <h3>Settings</h3>
              <div className="row my-3">
                <div className="col">
                  <HorizontalInput
                    label="API URL"
                    name="api.url"
                    touched={!!touched?.api?.url}
                    type="text"
                    error={errors?.api?.url}
                    id="api-url"
                  />
                  <HorizontalInput
                    label="Vault URL"
                    name="vault.url"
                    touched={!!touched?.vault?.url}
                    type="text"
                    error={errors?.vault?.url}
                    id="vault-url"
                  />
                  <HorizontalInput
                    label="Vault token"
                    name="vault.token"
                    touched={!!touched?.vault?.token}
                    type="password"
                    error={errors?.vault?.token}
                    id="vault-token"
                  />
                </div>
              </div>
            </div>
            <div className="col">
              <h3>Environment variables</h3>
              {values.envVariables.map((value, index) => (
                <div className="row my-3" key={index}>
                  <div className="col">
                    <Field name={`envVariables.${index}.name`} type="text" className="form-control"
                           placeholder="Name" />
                  </div>
                  <div className="col">
                    <Field name={`envVariables.${index}.value`} type="text" className="form-control"
                           placeholder="Value" />
                  </div>
                </div>
              ))}
              <div className="my-2 float-right">
                <button
                  type="button"
                  onClick={() => setFieldValue('envVariables', [...values.envVariables, { name: '', value: '' }])}
                  className="btn btn-dark"
                >
                  Add variable
                </button>
              </div>
            </div>
          </div>

          <div className="row mx-1 my-3">
            <div className="col">
              <AceEditor
                onChange={value => setFieldValue('template', value)}
                value={values.template}
                tabSize={2}
                width="100%"
                mode="java"
                theme="github"
              />
            </div>
            <div className="col">
              <AceEditor value={renderedTemplate} tabSize={2} width="100%" mode="java" theme="github" />
            </div>
          </div>

          <div className="row mx-1 my-3">
            <div className="col">
              <div className="my-2 float-right">
                <button disabled={isSubmitting} type="submit" className="btn btn-success">Render</button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default TemplateForm;
