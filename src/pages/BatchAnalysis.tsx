import React, { useState } from 'react';
import { Upload, Download, RefreshCw } from 'lucide-react';
import Logo from '../components/Logo';
import axios from 'axios';

const mockConfig = {
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
};

const BatchAnalysis = () => {
  const [metadataFile, setMetadataFile] = useState<File | null>(null);
  const [metadataResult, setMetadataResult] = useState('');
  const [config, setConfig] = useState(mockConfig);
  const [runName, setRunName] = useState('');
  const [numFiles, setNumFiles] = useState(1);
  const [jobId, setJobId] = useState('');
  const [jobStatus, setJobStatus] = useState('');
  const [jobOutput, setJobOutput] = useState('');
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [existingJobId, setExistingJobId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMetadataUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMetadataFile(file);
      setTimeout(() => {
        setMetadataResult('Metadata processed successfully');
      }, 1000);
    }
  };

  const handleConfigChange = (key: string, value: any) => {
    setConfig((prevConfig) => {
      const newConfig = { ...prevConfig };
      if (key.includes('.')) {
        const keys = key.split('.');
        newConfig[keys[0]][keys[1]] = value;
      } else {
        newConfig[key] = value;
      }
      return newConfig;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!metadataFile) return alert('Please upload a metadata file.');

    const formData = new FormData();
    formData.append('config', JSON.stringify(config));
    formData.append('run_name', runName);
    formData.append('num_files', numFiles.toString());
    formData.append('metadata_file', metadataFile);

    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/gemini_batch/batch/submit-with-metadata', formData);
      setJobId(response.data.job_id);
      setJobStatus(response.data.status);
    } catch (error) {
      console.error('Error submitting job:', error);
    } finally {
      setLoading(false);
    }
  };

  const proceedWithJobId = () => {
    if (existingJobId) {
      setJobId(existingJobId);
      checkJobStatus();
    }
  };

  const checkJobStatus = async () => {
    if (!jobId) return;

    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/gemini_batch/batch/status/${jobId}`);
      const { status, details } = response.data;
      setJobStatus(status);

      if (status === 'COMPLETED') {
        fetchJobOutput();
      }
    } catch (error) {
      console.error('Error checking job status:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobOutput = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/gemini_batch/batch/output/${jobId}`);
      const { available_fields } = response.data;
      setAvailableFields(available_fields);
      setJobOutput('Job completed successfully. You can now select fields and download the results.');
    } catch (error) {
      console.error('Error fetching job output:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldSelection = (field: string) => {
    setSelectedFields((prevSelected) => {
      if (prevSelected.includes(field)) {
        return prevSelected.filter((f) => f !== field);
      } else {
        return [...prevSelected, field];
      }
    });
  };

  const downloadResults = async () => {
    if (!selectedFields.length) {
      alert('Please select at least one field to download.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/gemini_batch/export/',
        selectedFields,
        {
          headers: { 'Content-Type': 'application/json' },
          responseType: 'blob',
        }
      );

      const blob = new Blob([response.data], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'results.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading the file:', error);
      alert('An error occurred. Please check the console for more details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#110232] text-gray-100">
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-[#1a0847] rounded-xl p-8 space-y-8">
          <div className="flex justify-between items-center mb-6">
            <Logo />
            <h1 className="text-2xl font-semibold text-white">Batch Analysis</h1>
          </div>

          {loading && (
            <div className="mt-4">
              <div className="text-sm text-gray-300 mb-2">Processing...</div>
              <div className="w-full bg-[#110232] rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full w-3/4 transition-all duration-1000"></div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Configuration Inputs */}
            <div className="bg-[#110232] rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold mb-4 text-white">Configuration</h2>
              {Object.entries(config)
                .filter(([key]) => !['bucket_name', 'project_id', 'model_name', 'input_folder', 'output_folder', 'temperature', 'location', 'metadata_config'].includes(key))
                .map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    {key === 'prompt_template' ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-400">{key}</label>
                        <textarea
                          rows={5}
                          value={value as string}
                          onChange={(e) => handleConfigChange(key, e.target.value)}
                          className="w-full bg-[#1a0847] border border-[#3d1f8a] rounded-lg px-4 py-2 text-gray-100"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-400">{key}</label>
                        <input
                          type="text"
                          value={value as string}
                          onChange={(e) => handleConfigChange(key, e.target.value)}
                          className="w-full bg-[#1a0847] border border-[#3d1f8a] rounded-lg px-4 py-2 text-gray-100"
                        />
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Additional Fields */}
            <div className="bg-[#110232] rounded-lg p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Run Name</label>
                <input
                  type="text"
                  value={runName}
                  onChange={(e) => setRunName(e.target.value)}
                  className="w-full bg-[#1a0847] border border-[#3d1f8a] rounded-lg px-4 py-2 text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Number of Files</label>
                <input
                  type="number"
                  value={numFiles}
                  onChange={(e) => setNumFiles(Number(e.target.value))}
                  className="w-full bg-[#1a0847] border border-[#3d1f8a] rounded-lg px-4 py-2 text-gray-100"
                />
              </div>
            </div>

            {/* Existing Job ID */}
            <div className="bg-[#110232] rounded-lg p-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">Proceed with Existing Job ID</label>
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={existingJobId}
                  onChange={(e) => setExistingJobId(e.target.value)}
                  className="flex-1 bg-[#1a0847] border border-[#3d1f8a] rounded-lg px-4 py-2 text-gray-100"
                />
                <button
                  onClick={proceedWithJobId}
                  className="bg-[#3d1f8a] px-4 py-2 rounded-lg hover:bg-[#4a3183] transition font-medium"
                >
                  Proceed
                </button>
              </div>
            </div>

            {/* File Upload */}
            <div className="bg-[#110232] rounded-lg p-4 flex justify-between items-center">
              <div className="flex-1">
                <p className="text-gray-400">Upload input CSV file</p>
                {metadataFile && (
                  <p className="text-sm text-purple-300 mt-1">
                    Selected: {metadataFile.name}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <Upload className="w-5 h-5 text-gray-400" />
                <label className="cursor-pointer">
                  <span className="bg-[#3d1f8a] px-4 py-2 rounded-lg hover:bg-[#4a3183] transition">
                    Upload
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleMetadataUpload}
                    accept=".csv,.xlsx"
                  />
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#3d1f8a] py-3 rounded-lg hover:bg-[#4a3183] transition font-medium disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Submit'}
            </button>

            {/* Job Status */}
            {jobId && (
              <div className="bg-[#110232] rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Job Status</h2>
                <div className="flex space-x-4 mb-4">
                  <input
                    type="text"
                    value={jobId}
                    readOnly
                    className="flex-1 bg-[#1a0847] border border-[#3d1f8a] rounded-lg px-4 py-2 text-gray-100"
                  />
                  <button
                    onClick={checkJobStatus}
                    className="bg-[#3d1f8a] p-2 rounded-lg hover:bg-[#4a3183] transition"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
                {jobStatus && (
                  <div className="bg-[#1a0847] p-4 rounded-lg">
                    <p className="text-purple-200">{jobStatus}</p>
                  </div>
                )}
                {availableFields.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-200 mb-2">Select Fields to Download:</h3>
                    <div className="space-y-2">
                      {availableFields.map((field) => (
                        <label key={field} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            value={field}
                            checked={selectedFields.includes(field)}
                            onChange={() => handleFieldSelection(field)}
                            className="form-checkbox text-purple-500"
                          />
                          <span className="text-gray-300">{field}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Download Button */}
            {jobStatus === 'COMPLETED' && availableFields.length > 0 && (
              <button
                onClick={downloadResults}
                className="w-full bg-[#3d1f8a] py-3 rounded-lg hover:bg-[#4a3183] transition font-medium flex items-center justify-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Results
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchAnalysis;