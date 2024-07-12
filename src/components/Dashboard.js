import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Summary from './Summary';
import moment from 'moment';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Select, DatePicker, Input, Form as AntForm } from 'antd';
import './Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const { Option } = Select;

const Dashboard = () => {
  const [budgetItems, setBudgetItems] = useState([]);
  const [expenseItems, setExpenseItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const { username } = location.state || {};

  useEffect(() => {
    if (username) {
      fetchData(username);
    }
  }, [username]);

  const fetchData = async (username) => {
    try {
      const response = await fetch(`https://sheetdb.io/api/v1/tous9t9p3zzfs/search?username=${username}`);
      const data = await response.json();

      const budgetData = data.filter((item) => item.type === 'income');
      const expenseData = data.filter((item) => item.type === 'expense');

      setBudgetItems(budgetData);
      setExpenseItems(expenseData);

      const eventsData = data.map((item) => ({
        title: `${item.type === 'income' ? 'Gelir' : 'Gider'}: ${item.amount}`,
        start: new Date(item.date),
        end: new Date(item.date),
        allDay: true,
      }));

      setEvents(eventsData);

      const totalBudgetCalc = budgetData.reduce((acc, item) => acc + parseFloat(item.amount), 0);
      const totalExpensesCalc = expenseData.reduce((acc, item) => acc + parseFloat(item.amount), 0);
      const remainingBudgetCalc = totalBudgetCalc - totalExpensesCalc;

      setTotalBudget(totalBudgetCalc);
      setTotalExpenses(totalExpensesCalc);
      setRemainingBudget(remainingBudgetCalc);
    } catch (error) {
      console.error('Veri çekerken hata oluştu:', error);
    }
  };

  const handleFormSubmit = async (values) => {
    const newData = {
      type: values.type,
      category: values.category,
      amount: parseFloat(values.amount),
      date: values.date,
      username: username,
    };

    if (values.type === 'income') {
      setBudgetItems((prevItems) => [...prevItems, { ...newData }]);
      setTotalBudget((prevTotal) => prevTotal + parseFloat(values.amount));
      setRemainingBudget((prevRemaining) => prevRemaining + parseFloat(values.amount));
    } else if (values.type === 'expense') {
      setExpenseItems((prevItems) => [...prevItems, { ...newData }]);
      setTotalExpenses((prevTotal) => prevTotal + parseFloat(values.amount));
      setRemainingBudget((prevRemaining) => prevRemaining - parseFloat(values.amount));
    }

    setEvents((prevEvents) => [
      ...prevEvents,
      {
        title: `${values.type === 'income' ? 'Gelir' : 'Gider'}: ${values.amount}`,
        start: new Date(values.date),
        end: new Date(values.date),
        allDay: true,
      },
    ]);

    try {
      const response = await fetch('https://sheetdb.io/api/v1/tous9t9p3zzfs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [{ ...values, username }],
        }),
      });

      if (response.ok) {
        console.log('Veri başarıyla eklendi.');
      } else {
        console.error('Veri eklenirken hata oluştu.');
      }
    } catch (error) {
      console.error('Ağ hatası:', error);
    }
  };

  const handleCalendarOpen = () => {
    navigate('/calendar', {
      state: {
        events,
      },
    });
  };

  const handleReportSend = () => {
    navigate('/report', {
      state: {
        budgetItems,
        expenseItems,
        totalBudget,
        totalExpenses,
        remainingBudget,
      },
    });
  };

  const handleLogout = () => {
    alert('Başarıyla çıkış yaptınız!');
    navigate('/');
  };

  return (
    <div className="dashboard">
      <div className="charts-section">
        <div className="form-section">
          <h3>Ekle</h3>
          <Formik
            initialValues={{
              type: 'income',
              amount: '',
              category: 'other',
              date: moment().format('YYYY-MM-DD'),
            }}
            validationSchema={Yup.object({
              type: Yup.string().required('Tür seçilmelidir.'),
              amount: Yup.number().required('Miktar girilmelidir.').positive('Miktar pozitif olmalıdır.'),
              category: Yup.string().required('Kategori seçilmelidir.'),
              date: Yup.date().required('Tarih seçilmelidir.'),
            })}
            onSubmit={handleFormSubmit}
          >
            {({ values, setFieldValue, handleSubmit }) => (
              <AntForm layout="vertical" onFinish={handleSubmit}>
                <AntForm.Item label="Tür" name="type" rules={[{ required: true, message: 'Tür seçilmelidir.' }]}>
                  <Select defaultValue="income" onChange={(value) => setFieldValue('type', value)}>
                    <Option value="income">Gelir</Option>
                    <Option value="expense">Gider</Option>
                  </Select>
                </AntForm.Item>
                <AntForm.Item label="Miktar" name="amount" rules={[{ required: true, message: 'Miktar girilmelidir.' }]}>
                  <Input type="number" placeholder="Miktar" onChange={(e) => setFieldValue('amount', e.target.value)} />
                </AntForm.Item>
                <AntForm.Item label="Kategori" name="category" rules={[{ required: true, message: 'Kategori seçilmelidir.' }]}>
                  <Select defaultValue="other" onChange={(value) => setFieldValue('category', value)}>
                    {values.type === 'income' ? (
                      <>
                        <Option value="salary">Maaş</Option>
                        <Option value="payment">Ödeme</Option>
                        <Option value="rent">Kira</Option>
                        <Option value="other">Diğer</Option>
                      </>
                    ) : (
                      <>
                        <Option value="rent">Kira</Option>
                        <Option value="transport">Ulaşım</Option>
                        <Option value="food">Gıda</Option>
                        <Option value="bills">Fatura</Option>
                        <Option value="other">Diğer</Option>
                      </>
                    )}
                  </Select>
                </AntForm.Item>
                <AntForm.Item label="Tarih" name="date" rules={[{ required: true, message: 'Tarih seçilmelidir.' }]}>
                  <DatePicker
                    format="YYYY-MM-DD"
                    onChange={(date, dateString) => setFieldValue('date', dateString)}
                    value={moment(values.date)}
                  />
                </AntForm.Item>
                <AntForm.Item>
                  <Button type="primary" htmlType="submit">
                    Ekle
                  </Button>
                </AntForm.Item>
              </AntForm>
            )}
          </Formik>
        </div>
        <div className="pie-chart">
          <h3>Bütçe Dağılımı</h3>
          <Pie data={{
            labels: ['Harcamalar', 'Kalan Bütçe'],
            datasets: [{
              data: [totalExpenses, remainingBudget],
              backgroundColor: ['#FF6384', '#36A2EB'],
            }],
          }} />
        </div>
        <div className="summary-section">
          <Summary budgetItems={budgetItems} expenseItems={expenseItems} />
        </div>
      </div>
      <div className="buttons-section">
        <Button onClick={handleReportSend}>Rapor Gönder</Button>
        <Button onClick={handleCalendarOpen}>Takvimi Aç</Button>
        <Button onClick={handleLogout}>Çıkış Yap</Button>
      </div>
    </div>
  );
};

export default Dashboard;
