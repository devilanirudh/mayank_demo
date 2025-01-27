import React, { useState } from "react";
import axios from "axios";
import { Upload, RefreshCw, Copy, Check } from 'lucide-react';
import Logo from '../components/Logo';

const Summary = () => {
  const [selectedColumns, setSelectedColumns] = useState("call_summary, categories");
  const [prompt, setPrompt] = useState("Please analyze the following information and provide insights: {text}");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | object | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        response ? (typeof response === 'object' ? JSON.stringify(response, null, 2) : response) : ''
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a file.");
      return;
    }
  
    if (!selectedColumns.trim()) {
      setError("Please specify selected columns.");
      return;
    }
  
    if (!prompt.trim()) {
      setError("Prompt cannot be empty.");
      return;
    }
  
    setError(null);
    setLoading(true);
    setResponse(null);
  
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("selected_columns", JSON.stringify(selectedColumns.split(",").map((col) => col.trim())));
      formData.append("prompt", prompt);
      formData.append("temperature", "0.3");
      formData.append("model_type", "gemini");
      formData.append("system_message", "string");
  
      // Call the API to generate the summary
      const result = await axios.post(
        "http://127.0.0.1:8000/generate_call_summary/call_summary",
        formData
      );
  
      if (result.status === 200 && result.data.success && result.data.gcs_uri) {
        const gcsUri = result.data.gcs_uri;
  
        // Pass the GCS URI to the frontend
        // setResponse({ gcsUri });
  
        // Call the /download/ endpoint to fetch the file
        const downloadResponse = await axios.get(
          "http://127.0.0.1:8000/generate_call_summary/download/",
          { params: { gcs_uri: gcsUri }, responseType: "blob" } // Use responseType: "blob" for file download
        );
  
        if (downloadResponse.status === 200) {
          // Create a Blob URL for downloading the file
          const blob = new Blob([downloadResponse.data], { type: "text/csv" });
          const downloadUrl = window.URL.createObjectURL(blob);
  
          // Trigger file download
          const anchor = document.createElement("a");
          anchor.href = downloadUrl;
          anchor.download = gcsUri.split("/").pop(); // Extract filename from the URI
          anchor.click();
  
          // Clean up Blob URL
          window.URL.revokeObjectURL(downloadUrl);
        } else {
          throw new Error("Failed to fetch the download URL.");
        }
      } else {
        throw new Error(result.data.message || "API call failed.");
      }
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-[#110232] rounded-xl p-8 space-y-8">
        <div className="flex items-center justify-between mb-6">
          <Logo />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Selected Columns (comma-separated):</label>
            <input
              type="text"
              value={selectedColumns}
              onChange={(e) => setSelectedColumns(e.target.value)}
              className="w-full p-3 bg-[#1a0847] rounded-lg border border-[#3d1f8a] focus:border-purple-500 focus:ring-purple-500 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Prompt:</label>
            <textarea
              rows={6}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-4 bg-[#1a0847] rounded-lg border border-[#3d1f8a] focus:border-purple-500 focus:ring-purple-500 text-white resize-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block w-full p-3 bg-[#1a0847] rounded-lg border border-[#3d1f8a] cursor-pointer hover:bg-[#2a1163] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-white">
                    {file ? file.name : 'Upload CSV file'}
                  </span>
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <div>
              <span className="text-white">
                {file ? 'File selected' : 'No file selected'}
              </span>
            </div>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <div className="flex justify-end gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </div>
              ) : (
                'Generate Summary'
              )}
            </button>
          </div>
        </form>

        {/* Response Display */}
        {response !== null && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-white">Output</h3>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[#2a1163] text-white rounded-lg hover:bg-[#3d1f8a] transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="p-6 bg-[#1a0847] rounded-lg border border-[#3d1f8a]">
              {typeof response === 'string' && response.includes('gs://') ? (
                <div>
                  <a
                    href={`https://storage.googleapis.com/${response.replace('gs://', '')}`}
                    download
                    className="text-blue-500"
                  >
                    Download Audio File
                  </a>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap text-gray-300 font-mono text-sm">
                  {typeof response === 'object' ? JSON.stringify(response, null, 2) : response}
                </pre>
              )}
            </div>
          </div>
        )}


        {/* Progress Bar (when processing) */}
        {loading && (
          <div className="mt-4">
            <div className="text-sm text-gray-300 mb-2">Summary being processed...</div>
            <div className="w-full bg-[#1a0847] rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full w-3/4 transition-all duration-1000"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Summary;
