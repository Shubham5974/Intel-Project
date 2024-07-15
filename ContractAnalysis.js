import React, { useState } from 'react';
import { Box, Button, Typography, Grid, Paper } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [extractedText, setExtractedText] = useState('');
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    }
  });

  const handleFileUpload = async () => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('file', file);
    });

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setExtractedText(response.data.output);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Upload PDF or Word Documents
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper
            {...getRootProps()}
            sx={{
              padding: 2,
              textAlign: 'center',
              color: 'text.secondary',
              border: '2px dashed grey'
            }}
          >
            <input {...getInputProps()} />
            <Typography>
              Drag 'n' drop some files here, or click to select files
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          {files.length > 0 && (
            <Box>
              <Typography variant="h6" component="h2">
                Files:
              </Typography>
              <ul>
                {files.map((file, index) => (
                  <li key={index}>
                    {file.name}
                  </li>
                ))}
              </ul>
              <Button
                variant="contained"
                color="primary"
                onClick={handleFileUpload}
              >
                Upload Files
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>
      {extractedText && (
        <Box mt={4}>
          <Typography variant="h5" component="h2">
            Extracted Text:
          </Typography>
          <Typography variant="body1" component="p">
            {extractedText}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;