// src/components/Summary.js
import React, { useState, useEffect } from 'react';
import { Select, DatePicker, List, Typography } from 'antd';
import moment from 'moment';
import './Summary.css';

const { Option } = Select;
const { Text } = Typography;

const Summary = ({ budgetItems, expenseItems }) => {
  const categoryMap = {
    salary: 'Maaş',
    rent: 'Kira',
    payment: 'Ödeme',
    other: 'Diğer',
    transport: 'Ulaşım',
    food: 'Gıda',
    clothing: 'Giyim',
    bills: 'Fatura',
  };

  const [filteredBudgetItems, setFilteredBudgetItems] = useState(budgetItems);
  const [filteredExpenseItems, setFilteredExpenseItems] = useState(expenseItems);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const filterItems = (items, category, date) => {
      return items.filter(item => {
        const categoryMatch = category ? item.category === category : true;
        const dateMatch = date ? item.date === date : true;
        return categoryMatch && dateMatch;
      });
    };

    setFilteredBudgetItems(filterItems(budgetItems, selectedCategory, selectedDate));
    setFilteredExpenseItems(filterItems(expenseItems, selectedCategory, selectedDate));
  }, [selectedCategory, selectedDate, budgetItems, expenseItems]);

  return (
    <div className="summary-container">
      <h2>Özet</h2>
      <div className="filters">
        <Select
          style={{ width: 200, marginRight: 10 }}
          onChange={setSelectedCategory}
          value={selectedCategory}
          placeholder="Kategoriye Göre Filtrele"
        >
          <Option value="">Tümü</Option>
          {Object.entries(categoryMap).map(([key, value]) => (
            <Option key={key} value={key}>{value}</Option>
          ))}
        </Select>
        <DatePicker
          onChange={(date, dateString) => setSelectedDate(dateString)}
          value={selectedDate ? moment(selectedDate) : null}
          placeholder="Tarihe Göre Filtrele"
        />
      </div>
      {filteredBudgetItems.length > 0 && (
        <div className="summary-column">
          <h3>Gelirler</h3>
          <List
            dataSource={filteredBudgetItems}
            renderItem={item => (
              <List.Item className="summary-item">
                <Text className="amount">{item.amount} TL</Text> - <Text className="category">{categoryMap[item.category] || 'Diğer'}</Text> - <Text className="date">{item.date}</Text>
              </List.Item>
            )}
          />
        </div>
      )}
      {filteredExpenseItems.length > 0 && (
        <div className="summary-column">
          <h3>Giderler</h3>
          <List
            dataSource={filteredExpenseItems}
            renderItem={item => (
              <List.Item className="summary-item">
                <Text className="amount">{item.amount} TL</Text> - <Text className="category">{categoryMap[item.category] || 'Diğer'}</Text> - <Text className="date">{item.date}</Text>
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default Summary;
