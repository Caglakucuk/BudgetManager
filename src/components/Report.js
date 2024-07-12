import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import './Report.css';

const categoryMap = {
  salary: 'Maaş',
  rent: 'Kira',
  payment: 'Ödeme',
  other: 'Diğer',
  transport: 'Ulaşım',
  food: 'Gıda',
  bills: 'Fatura',
  clothing: 'Giyim',
};

const Report = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    budgetItems = [],
    expenseItems = [],
    totalBudget = 0,
    totalExpenses = 0,
    remainingBudget = 0,
    user,
  } = location.state || {};

  const formatCurrency = (amount) => `₺${amount}`;

  const generateReportText = () => {
    if (user) {
      const totalIncome = budgetItems.reduce((total, item) => total + parseFloat(item.amount), 0);
      const totalExpense = expenseItems.reduce((total, item) => total + parseFloat(item.amount), 0);

      const expensesText = expenseItems.map(item => `${categoryMap[item.category] || item.category}: ${formatCurrency(item.amount)}`).join(', ');
      const incomesText = budgetItems.map(item => `${categoryMap[item.category] || item.category}: ${formatCurrency(item.amount)}`).join(', ');

      return `Merhaba ${user.username},\n\nToplam harcamaların: ${expensesText}.\nToplam gelirlerin: ${incomesText}.\n\nKalan bütçe: ${formatCurrency(remainingBudget)}\nToplam bütçe: ${formatCurrency(totalBudget)}\nToplam harcama: ${formatCurrency(totalExpense)}`;
    }
    return '';
  };

  const handleSendEmail = () => {
    message.info('Mail gönderildi!');
  };

  return (
    <div className="report">
      <h2>Bütçe Raporu</h2>
      <div className="report-section">
        <h3>Gelirler</h3>
        <table className="report-table">
          <thead>
            <tr>
              <th>Kategori</th>
              <th>Tutar</th>
              <th>Tarih</th>
            </tr>
          </thead>
          <tbody>
            {budgetItems.map(item => (
              <tr key={item.id}>
                <td>{categoryMap[item.category] || item.category}</td>
                <td>{formatCurrency(item.amount)}</td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="report-section">
        <h3>Giderler</h3>
        <table className="report-table">
          <thead>
            <tr>
              <th>Kategori</th>
              <th>Tutar</th>
              <th>Tarih</th>
            </tr>
          </thead>
          <tbody>
            {expenseItems.map(item => (
              <tr key={item.id}>
                <td>{categoryMap[item.category] || item.category}</td>
                <td>{formatCurrency(item.amount)}</td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="report-summary">
        <h3>Özet</h3>
        <p>Toplam Bütçe: {formatCurrency(totalBudget)}</p>
        <p>Toplam Harcamalar: {formatCurrency(totalExpenses)}</p>
        <p>Kalan Bütçe: {formatCurrency(remainingBudget)}</p>
      </div>
      <div className="report-text">
        <h3>Rapor</h3>
        <p>{generateReportText()}</p>
      </div>
      <Button type="primary" onClick={handleSendEmail} style={{ marginTop: '10px' }}>Mail Gönder</Button>
    </div>
  );
};

export default Report;
