import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Download, RefreshCw } from 'lucide-react';
import Logo from '../components/Logo';

const BatchAnalysis = () => {
  const [metadataFile, setMetadataFile] = useState<File | null>(null);
  const [config, setConfig] = useState({
    bucket_name: 'prodloop_porter',
    project_id: 'prodloop',
    model_name: 'gemini-1.5-pro-002',
    input_folder: 'gemini_test',
    output_folder: 'gemini_test_output',
    temperature: 0,
    prompt_template: 'Analyze the following customer service call for Porter:\n\nTicket ID: {CRT_ID}\nCRN: {CRN}\nIssue: {ISSUE_V2}\nRaised By: {RAISED_BY}\n\nPlease provide the following analysis in JSON format:\n1. sentiment\n2. call_mood\n3. call_summary\n4. categories\n5. short_summary',
    location: 'us-central1',
    metadata_config: {
      enabled: true,
      crt_id_column: 'CRT_ID',
      selected_columns: ['CRT_ID', 'CRN', 'ISSUE_V2', 'RAISED_BY'],
    },
    run_name: '',
    num_files: 0,
  });
  const [jobId, setJobId] = useState('');
  const [jobStatus, setJobStatus] = useState('');
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [outputUrl, setOutputUrl] = useState('');

  const handleMetadataUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMetadataFile(file);
    }
  };

  const handleConfigChange = (key: string, value: any) => {
    setConfig((prevConfig) => {
      const newConfig = { ...prevConfig };
      newConfig[key] = value;
      return newConfig;
    });
  };

  const handleSubmit = async () => {
    if (!metadataFile) {
      alert('Please upload a metadata file.');
      return;
    }

    const formData = new FormData();
    formData.append('config', JSON.stringify(config));
    formData.append('run_name', config.run_name);
    formData.append('num_files', config.num_files.toString());
    formData.append('metadata_file', metadataFile);

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/gemini_batch/batch/submit-with-metadata',
        formData
      );
      const { job_id } = response.data;
      setJobId(job_id);
      setJobStatus('Job submitted successfully. Tracking status...');
    } catch (error) {
      console.error('Error submitting job:', error);
      alert('Failed to submit the job. Please check the logs.');
    }
  };

  const checkJobStatus = async () => {
    if (!jobId) return;

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/gemini_batch/batch/status/${jobId}`
      );
      const { status, message, details } = response.data;
      setJobStatus(message);

      if (status === 'COMPLETED') {
        setAvailableFields(details.available_fields);
      }
    } catch (error) {
      console.error('Error checking job status:', error);
      alert('Failed to check job status. Please check the logs.');
    }
  };

  const downloadCSV = async () => {
    if (selectedFields.length === 0) {
      alert('Please select at least one field.');
      return;
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/gemini_batch/batch/export',
        { job_id: jobId, fields: selectedFields },
        { responseType: 'blob' }
      );
      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'results.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Failed to download the CSV. Please check the logs.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0627] text-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <Logo />
          <button className="px-4 py-2 bg-[#1a0847] rounded-lg hover:bg-[#2a1163]">
            Light Mode
          </button>
        </div>
        <div className="space-y-6">
          <div className="bg-[#1a0847] rounded-lg p-6">
            <h2 className="text-xl">Configuration</h2>
            <div className="mt-4">
              {Object.entries(config).map(([key, value]) => (
                <div key={key} className="mb-4">
                  <label>{key}</label>
                  <input
                    type="text"
                    value={value as string}
                    onChange={(e) => handleConfigChange(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#1a0847] rounded-lg p-4">
            <label>Upload Metadata</label>
            <input type="file" onChange={handleMetadataUpload} />
          </div>
          <button onClick={handleSubmit} className="bg-blue-500">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default BatchAnalysis;
