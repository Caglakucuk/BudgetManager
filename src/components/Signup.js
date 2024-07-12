import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Input, Button, Form as AntForm } from 'antd';
import './Signup.css'; 

const Signup = () => {
  const navigate = useNavigate();

  const initialValues = {
    username: '',
    email: '',
    phone_number: '',
    password: ''
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Gerekli'),
    password: Yup.string().required('Gerekli'),
    email: Yup.string().email('Geçersiz e-posta formatı').required('Gerekli'),
    phone_number: Yup.string().required('Gerekli'),
  });

  const onSubmit = async (values) => {
    console.log(values);

    try {
      const response = await fetch('https://sheetdb.io/api/v1/tous9t9p3zzfs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: [values]
        })
      });

      if (response.ok) {
        console.log('Kullanıcı başarıyla eklendi.');
        navigate('/dashboard');
      } else {
        console.error('Kullanıcı eklenirken hata oluştu.');
      }
    } catch (error) {
      console.error('Ağ hatası:', error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1>Kayıt Ol</h1>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ handleSubmit }) => (
            <AntForm onFinish={handleSubmit}>
              <AntForm.Item name="username" label="Kullanıcı Adı">
                <Field name="username" as={Input} />
                <ErrorMessage name="username" component="div" className="error-message" />
              </AntForm.Item>
              <AntForm.Item name="password" label="Şifre">
                <Field name="password" as={Input.Password} />
                <ErrorMessage name="password" component="div" className="error-message" />
              </AntForm.Item>
              <AntForm.Item name="email" label="E-posta">
                <Field name="email" as={Input} />
                <ErrorMessage name="email" component="div" className="error-message" />
              </AntForm.Item>
              <AntForm.Item name="phone_number" label="Telefon Numarası">
                <Field name="phone_number" as={Input} />
                <ErrorMessage name="phone_number" component="div" className="error-message" />
              </AntForm.Item>
              <Button type="primary" htmlType="submit" className="submit-button">Kayıt Ol</Button>
            </AntForm>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Signup;
