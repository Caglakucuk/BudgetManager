import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Input, Button } from 'antd';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  const initialValues = {
    username: '',
    password: ''
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Kullanıcı adı gereklidir'),
    password: Yup.string().required('Şifre gereklidir')
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch(`https://sheetdb.io/api/v1/tous9t9p3zzfs/search?username=${values.username}`);
      const data = await response.json();

      if (data.length > 0 && data[0].password === values.password) {
        console.log('Giriş başarılı');
        navigate('/dashboard', { state: { username: values.username } }); 
      } else {
        console.error('Kullanıcı adı veya şifre hatalı');
        alert('Kullanıcı adı veya şifre hatalı');
      }
    } catch (error) {
      console.error('Ağ hatası:', error);
      alert('Ağ hatası oluştu, lütfen tekrar deneyin');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Giriş Yap</h1>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Kullanıcı Adı</label>
                <Field type="text" id="username" name="username" as={Input} />
                <ErrorMessage name="username" component="div" className="error-message" />
              </div>
              <div className="form-group">
                <label htmlFor="password">Şifre</label>
                <Field type="password" id="password" name="password" as={Input.Password} />
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>
              <div className="button-container">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="submit-button"
                  block
                  disabled={isSubmitting}
                >
                  Giriş Yap
                </Button>
                <Button
                  type="primary"
                  className="signup-button"
                  block
                  onClick={handleSignUpClick}
                >
                  Kayıt Ol
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
