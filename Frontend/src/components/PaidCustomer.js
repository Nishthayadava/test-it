import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Modal, TextField, Paper } from '@mui/material';

const PaidCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    sale_date: '',
    customer_id: '',
    full_name: '',
    package: '',
    expiry_date: '',
    payment_mode: '',
    total_received: '',
    company_amount: '',
    tax: '',
    agent: '',
    percentage: '',
    shared_amount: '',
    remark: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [previousAmount, setPreviousAmount] = useState(0); // Store previous amount when editing

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/paid-customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetFormData();
    setIsEditing(false);
    setPreviousAmount(0); // Reset previous amount
  };

  const resetFormData = () => {
    setFormData({
      sale_date: '',
      customer_id: '',
      full_name: '',
      package: '',
      expiry_date: '',
      payment_mode: '',
      total_received: '',
      company_amount: '',
      tax: '',
      agent: '',
      percentage: '',
      shared_amount: '',
      remark: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };

    if (name === 'total_received') {
      const newAmount = parseFloat(value) || 0;
      const updatedTotalAmount = (previousAmount + newAmount).toFixed(2);
      const tax = (updatedTotalAmount * 0.18).toFixed(2);  // 18% tax
      const companyAmount = (updatedTotalAmount * 0.82).toFixed(2);  // 82% company amount

      updatedFormData = {
        ...updatedFormData,
        total_received: updatedTotalAmount,
        tax,
        company_amount: companyAmount
      };
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/paid-customers/${editId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/paid-customers', formData);
      }
      fetchCustomers();
      handleClose();
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const handleEdit = (customer) => {
    setFormData(customer);
    setEditId(customer.id);
    setIsEditing(true);
    setPreviousAmount(parseFloat(customer.total_received) || 0); // Set previous amount from existing data
    handleOpen();
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Customer
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sale Date</TableCell>
              <TableCell>Customer ID</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Package</TableCell>
              <TableCell>Expiry Date</TableCell>
              <TableCell>Payment Mode</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Tax</TableCell>
              <TableCell>Company Amount</TableCell>
              <TableCell>Agent</TableCell>
              <TableCell>Percentage</TableCell>
              <TableCell>Shared Amount</TableCell>
              <TableCell>Remark</TableCell>
              <TableCell>Update</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.sale_date}</TableCell>
                <TableCell>{customer.customer_id}</TableCell>
                <TableCell>{customer.full_name}</TableCell>
                <TableCell>{customer.package}</TableCell>
                <TableCell>{customer.expiry_date}</TableCell>
                <TableCell>{customer.payment_mode}</TableCell>
                <TableCell>{customer.total_received}</TableCell>
                <TableCell>{customer.tax}</TableCell>
                <TableCell>{customer.company_amount}</TableCell>
                <TableCell>{customer.agent}</TableCell>
                <TableCell>{customer.percentage}</TableCell>
                <TableCell>{customer.shared_amount}</TableCell>
                <TableCell>{customer.remark}</TableCell>
                <TableCell>
                  <Button variant="contained" color="secondary" onClick={() => handleEdit(customer)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          margin: '100px auto',
          width: '80%',
          maxHeight: '80vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h2>{isEditing ? 'Edit Customer' : 'Add Customer'}</h2>
          <TextField
            name="sale_date"
            label="Sale Date"
            type="date"
            value={formData.sale_date}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="total_received"
            label="Amount"
            value={formData.total_received}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="tax"
            label="Tax"
            value={formData.tax}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            name="company_amount"
            label="Company Amount"
            value={formData.company_amount}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            margin="normal"
          />
          {/* Additional Fields */}
          {Object.keys(formData).filter(key => !['sale_date', 'total_received', 'tax', 'company_amount'].includes(key)).map((key) => (
            <TextField
              key={key}
              name={key}
              label={key.replace(/_/g, ' ')}
              value={formData[key]}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          ))}
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default PaidCustomer;


// Sale , expiry date, agent name, amount
// agent options - agent 1, agent 2(login agent)
// agent 1 - agent 2 - agent 3 - agent 4