import React, { useState } from 'react';
import { Button, Checkbox, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import axios from 'axios';

const CsvUpload = () => {
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [message, setMessage] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = () => {
        if (!file) {
            setMessage('Please select a file to upload');
            return;
        }

        // Read the file as text and parse manually
        const reader = new FileReader();
        reader.onload = (event) => {
            const csvData = event.target.result;
            const rows = csvData.trim().split('\n').map(row => row.split(','));
            const headers = rows[0];
            const records = rows.slice(1).map(row => row.reduce((obj, value, i) => {
                obj[headers[i]] = value;
                return obj;
            }, {}));
            setData(records);
            setMessage('CSV data loaded successfully');
        };
        reader.onerror = (error) => {
            console.error('Error reading file:', error);
            setMessage('Error reading file');
        };
        reader.readAsText(file);
    };

    const handleRowSelection = (index) => {
        setSelectedRows((prevSelected) => {
            if (prevSelected.includes(index)) {
                // Deselect row if already selected
                return prevSelected.filter((i) => i !== index);
            } else {
                // Select row
                return [...prevSelected, index];
            }
        });
    };

    const handleAssignSelected = async () => {
        if (selectedRows.length === 0) {
            setMessage('Please select at least one row to assign');
            return;
        }

        // Prepare data to send based on selected rows
        const selectedData = selectedRows.map((index) => data[index]);

        try {
            const response = await axios.post('/api/assign-selected', { data: selectedData });
            setMessage(response.data.message || 'Data assigned successfully');
        } catch (error) {
            console.error('Error assigning data:', error);
            setMessage('Error assigning data');
        }
    };

    return (
        <div>
            <Typography variant="h6">Upload CSV File</Typography>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <Button variant="contained" color="primary" onClick={handleUpload}>
                Load Data
            </Button>

            {message && <Typography>{message}</Typography>}

            {data.length > 0 && (
                <div>
                    <Typography variant="h6">CSV Data</Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Select</TableCell>
                                {Object.keys(data[0]).map((header) => (
                                    <TableCell key={header}>{header}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedRows.includes(index)}
                                            onChange={() => handleRowSelection(index)}
                                        />
                                    </TableCell>
                                    {Object.values(row).map((value, i) => (
                                        <TableCell key={i}>{value}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Button variant="contained" color="primary" onClick={handleAssignSelected}>
                        Assign Selected
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CsvUpload;
