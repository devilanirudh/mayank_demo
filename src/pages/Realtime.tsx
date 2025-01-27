// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Save, Upload, RefreshCw, Copy, Check, Loader2 } from 'lucide-react';
// import Logo from '../components/Logo';
// import { Bar } from "react-chartjs-2";

// const Realtime = () => {
//   const [prompt, setPrompt] = useState('');
//   const [response, setResponse] = useState<string | object | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [runName, setRunName] = useState('');
//   const [description, setDescription] = useState('');
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [promptVersion, setPromptVersion] = useState('');
//   const [availableVersions, setAvailableVersions] = useState<string[]>([]);
//   const [isLoadingVersions, setIsLoadingVersions] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const [numFiles, setNumFiles] = useState(0);
//   const [graphData, setGraphData] = useState(null);

//   const fetchVersions = async () => {
//     if (!runName) {
//       alert('Please enter a run name first');
//       return;
//     }
  
//     setIsLoadingVersions(true);
  
//     try {
//       const response = await axios.get(
//         `http://127.0.0.1:8000/fetch-versions/?runname=${encodeURIComponent(runName)}`
//       );
  
//       console.log("Server response:", response.data); // Log the server response
  
//       // Verify the response format
//       if (response.data?.status === "success" && Array.isArray(response.data.versions)) {
//         setAvailableVersions(response.data.versions); // Use the versions array
//         console.log("Versions set:", response.data.versions);
//       } else {
//         console.error('Unexpected response format:', response.data);
//         alert('Failed to fetch versions. Unexpected response format.');
//       }
//     } catch (error) {
//       console.error('Error fetching versions:', error.message || error);
//       alert('Failed to fetch versions. Please check your backend server.');
//     } finally {
//       setIsLoadingVersions(false);
//     }
//   };
  

//   const fetchPromptVersion = async (version: string) => {
//     try {
//       const response = await axios.get(`http://localhost:8000/fetch-prompt/`, {
//         params: {
//           runname: runName, // Ensure runName is defined correctly in your context
//           prompt_version: version, // Use 'prompt_version' as required by the API
//         },
//       });
//       const { prompt, description } = response.data;
  
//       setPrompt(prompt || ""); // Update prompt, fallback to empty string if not available
//       setDescription(description || ""); // Update description, fallback to empty string if not available
//       setPromptVersion(version); // Update the selected version
//     } catch (error) {
//       console.error('Error fetching prompt version:', error);
//       alert('Failed to fetch prompt version');
//     }
//   };
  
  
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files) {
//       setSelectedFile(event.target.files[0]); // Only set the selected file
//     }
//   };

//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   setIsProcessing(true);
//   //   setResponse(null);
  
//   //   if (!selectedFile) {
//   //     alert('Please upload a CSV file.');
//   //     setIsProcessing(false);
//   //     return;
//   //   }
  
//   //   const formData = new FormData();
//   //   // formData.append('run_name', runName);
//   //   formData.append('csv_file', selectedFile);
//   //   // formData.append('prompt_name', prompt); // Use correct field name
//   //   // formData.append('num_files', numFiles); // Ensure this is sent as an integer
  
//   //   try {
//   //     const result = await axios.post(
//   //       'http://20.42.96.119:8003/upload',
//   //       formData,
//   //       {
//   //         headers: {
//   //           'Content-Type': 'multipart/form-data', // Let the browser set this automatically
//   //         },
//   //       }
//   //     );
//   //     setResponse(result.data);
//   //   } catch (error) {
//   //     console.error('Error:', error.response ? error.response.data : error.message);
//   //     setResponse('Error processing request');
//   //   } finally {
//   //     setIsProcessing(false);
//   //   }
//   // };
//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   setIsProcessing(true);
//   //   setGraphData(null);

//   //   if (!selectedFile) {
//   //     alert("Please upload a CSV file.");
//   //     setIsProcessing(false);
//   //     return;
//   //   }

//   //   try {
//   //     // Step 1: Upload the CSV file and get session_id
//   //     const formData = new FormData();
//   //     formData.append("file", selectedFile);

//   //     const uploadResponse = await axios.post(
//   //       "http://20.42.96.119:8003/upload",
//   //       formData,
//   //       {
//   //         headers: {
//   //           "Content-Type": "multipart/form-data",
//   //         },
//   //       }
//   //     );

//   //     const sessionId = uploadResponse.data.session_id;

//   //     if (!sessionId) {
//   //       throw new Error("Failed to retrieve session_id.");
//   //     }

//   //     // Step 2: Analyze the uploaded file with a question
//   //     const question = "What are the batting averages of the players?";
//   //     const analyzeResponse = await axios.post(
//   //       "http://20.42.96.119:8003/analyze",
//   //       {
//   //         question,
//   //         session_id: sessionId,
//   //       },
//   //       {
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //         },
//   //       }
//   //     );

//   //     // Step 3: Parse and display graph data
//   //     const analysis = analyzeResponse.data.analysis;
//   //     const { title, x_label, y_label, elements } = analysis;

//   //     const labels = elements.map((el: any) => el.group);
//   //     const values = elements.map((el: any) => el.value);

//   //     const chartData = {
//   //       labels,
//   //       datasets: [
//   //         {
//   //           label: title,
//   //           data: values,
//   //           backgroundColor: "rgba(75, 192, 192, 0.6)",
//   //           borderColor: "rgba(75, 192, 192, 1)",
//   //           borderWidth: 1,
//   //         },
//   //       ],
//   //     };

//   //     setGraphData({ chartData, x_label, y_label, title });
//   //   } catch (error) {
//   //     console.error("Error:", error.response ? error.response.data : error.message);
//   //     alert("An error occurred while processing the request.");
//   //   } finally {
//   //     setIsProcessing(false);
//   //   }
//   // };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault(); // Prevent page refresh
//     setIsProcessing(true);
//     setGraphData(null);
  
//     if (!selectedFile) {
//       alert("Please upload a CSV file.");
//       setIsProcessing(false);
//       return;
//     }
  
//     try {
//       console.log("Uploading file...");
  
//       // Step 1: Upload the CSV file and get session_id
//       const formData = new FormData();
//       formData.append("file", selectedFile);
  
//       const uploadResponse = await axios.post(
//         "http://20.42.96.119:8003/upload",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
  
//       const sessionId = uploadResponse.data.session_id;
//       console.log("Session ID:", sessionId);
  
//       if (!sessionId) {
//         throw new Error("Failed to retrieve session_id.");
//       }
  
//       // Step 2: Analyze the uploaded file with a question
//       const question = "What are the batting averages of the players?";
//       const analyzeResponse = await axios.post(
//         "http://20.42.96.119:8003/analyze",
//         {
//           question,
//           session_id: sessionId,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
  
//       // Step 3: Parse and display graph data
//       const analysis = analyzeResponse.data.analysis;
//       const { title, x_label, y_label, elements } = analysis;
  
//       const labels = elements.map((el: any) => el.group);
//       const values = elements.map((el: any) => el.value);
  
//       const chartData = {
//         labels,
//         datasets: [
//           {
//             label: title,
//             data: values,
//             backgroundColor: "rgba(75, 192, 192, 0.6)",
//             borderColor: "rgba(75, 192, 192, 1)",
//             borderWidth: 1,
//           },
//         ],
//       };
  
//       setGraphData({ chartData, x_label, y_label, title });
//       console.log("Graph Data:", chartData);
//     } catch (error) {
//       console.error("Error:", error.response ? error.response.data : error.message);
//       alert("An error occurred while processing the request.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };
  

//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   setIsProcessing(true);
//   //   setResponse(null);
  
//   //   if (!selectedFile) {
//   //     alert('Please upload a CSV file.');
//   //     setIsProcessing(false);
//   //     return;
//   //   }
  
//   //   const formData = new FormData();
//   //   formData.append('file', selectedFile); // Update to match API's expected parameter name
  
//   //   try {
//   //     const result = await axios.post(
//   //       'http://20.42.96.119:8003/upload', // Endpoint URL
//   //       formData,
//   //       {
//   //         headers: {
//   //           'Content-Type': 'multipart/form-data', // Let the browser set this automatically
//   //         },
//   //       }
//   //     );
//   //     setResponse(result.data); // Handle success response
//   //   } catch (error) {
//   //     console.error('Error:', error.response ? error.response.data : error.message);
//   //     setResponse('Error processing request'); // Display error message
//   //   } finally {
//   //     setIsProcessing(false); // Reset processing state
//   //   }
//   // };
  
  

//   const copyToClipboard = async () => {
//     try {
//       await navigator.clipboard.writeText(
//         response ? (typeof response === 'object' ? JSON.stringify(response, null, 2) : response) : ''
//       );
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch (err) {
//       console.error('Failed to copy text:', err);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <div className="bg-[#110232] rounded-xl p-8 space-y-8">
//         <div className="flex items-center justify-between mb-6">
//           <Logo />
//         </div>

//         {/* Run Information */}
//         <div className="space-y-4">
//           <div>
//             <input
//               type="text"
//               placeholder="Enter run name"
//               className="w-full p-3 bg-[#1a0847] rounded-lg border border-[#3d1f8a] focus:border-purple-500 focus:ring-purple-500 text-white"
//               value={runName}
//               onChange={(e) => setRunName(e.target.value)}
//             />
//           </div>
//           <div>
//             <input
//               type="text"
//               placeholder="Enter description (optional)"
//               className="w-full p-3 bg-[#1a0847] rounded-lg border border-[#3d1f8a] focus:border-purple-500 focus:ring-purple-500 text-white"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//           </div>
//           <div>
//             <input
//               type="number"
//               placeholder="Enter number of files"
//               className="w-full p-3 bg-[#1a0847] rounded-lg border border-[#3d1f8a] focus:border-purple-500 focus:ring-purple-500 text-white"
//               value={numFiles}
//               onChange={(e) => setNumFiles(Number(e.target.value))}
//               min="0"
//               max="1000"
//             />
//           </div>
//         </div>

//         {/* File Upload Section */}
//         <div className="flex items-center gap-4">
//           <div className="flex-1">
//             <label className="block w-full p-3 bg-[#1a0847] rounded-lg border border-[#3d1f8a] cursor-pointer hover:bg-[#2a1163] transition-colors">
//               <div className="flex items-center justify-between">
//                 <span className="text-white">
//                   {selectedFile ? selectedFile.name : 'Upload input CSV file'}
//                 </span>
//                 <Upload className="w-5 h-5 text-white" />
//               </div>
//               <input
//                 type="file"
//                 className="hidden"
//                 accept=".csv"
//                 onChange={handleFileChange}
//               />
//             </label>
//           </div>
//           <div>
//             <span className="text-white">
//               {selectedFile ? 'File selected' : 'No file selected'}
//             </span>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <div className="flex items-center justify-between mb-2">
//               <label className="text-sm font-medium text-white">Write a prompt</label>
//               <div className="flex items-center gap-2">
//                 <button
//                   type="button"
//                   onClick={fetchVersions}
//                   className="bg-[#1a0847] text-white text-sm rounded-lg border border-[#3d1f8a] px-3 py-1 hover:bg-[#2a1163]"
//                 >
//                   {isLoadingVersions ? (
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                   ) : (
//                     'Fetch Versions'
//                   )}
//                 </button>
//                 <select
//                   className="bg-[#1a0847] text-white text-sm rounded-lg border border-[#3d1f8a] px-3 py-1"
//                   value={promptVersion}
//                   onChange={(e) => fetchPromptVersion(e.target.value)}
//                 >
//                   <option value="">Select version</option>
//                   {availableVersions.map((version) => (
//                     <option key={version} value={version}>
//                       {version}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//             <textarea
//               rows={12}
//               className="w-full p-4 bg-[#1a0847] rounded-lg border border-[#3d1f8a] focus:border-purple-500 focus:ring-purple-500 text-white resize-none"
//               value={prompt}
//               onChange={(e) => setPrompt(e.target.value)}
//               placeholder="Prompt will be populated when a version is selected..."
//             />
//           </div>
          

//           {/* Action Buttons */}
//           <div className="flex justify-end gap-4">
//             <button
//               type="submit"
//               disabled={isProcessing}
//               className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
//             >
//               {isProcessing ? (
//                 <div className="flex items-center">
//                   <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
//                   Processing...
//                 </div>
//               ) : (
//                 'Process'
//               )}
//             </button>
//           </div>
//         </form>
        


//         {/* Response Display */}
//         {response !== null && (
//           <div className="mt-8">
//             <div className="flex items-center justify-between mb-2">
//               <h3 className="text-lg font-medium text-white">Output</h3>
//               <button
//                 onClick={copyToClipboard}
//                 className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[#2a1163] text-white rounded-lg hover:bg-[#3d1f8a] transition-colors"
//               >
//                 {copied ? (
//                   <>
//                     <Check className="w-4 h-4" />
//                     Copied!
//                   </>
//                 ) : (
//                   <>
//                     <Copy className="w-4 h-4" />
//                     Copy
//                   </>
//                 )}
//               </button>
//             </div>
//             <div className="p-6 bg-[#1a0847] rounded-lg border border-[#3d1f8a]">
//               <pre className="whitespace-pre-wrap text-gray-300 font-mono text-sm">
//                 {typeof response === 'object' ? JSON.stringify(response, null, 2) : response}
//               </pre>
//             </div>
//           </div>
//         )}
//         <div className="p-4">
//           <h1 className="text-xl font-bold mb-4">Upload and Analyze CSV</h1>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               type="file"
//               accept=".csv"
//               onChange={handleFileChange}
//               className="block w-full p-2 border rounded"
//             />
//             <button
//               type="submit"
//               disabled={isProcessing}
//               className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
//             >
//               {isProcessing ? "Processing..." : "Upload and Analyze"}
//             </button>
//           </form>

//           {graphData && (
//             <div className="mt-6">
//               <h2 className="text-lg font-semibold">{graphData.title}</h2>
//               <Bar
//                 data={graphData.chartData}
//                 options={{
//                   responsive: true,
//                   plugins: {
//                     legend: { display: true, position: "top" },
//                     title: {
//                       display: true,
//                       text: graphData.title,
//                     },
//                   },
//                   scales: {
//                     x: { title: { display: true, text: graphData.x_label } },
//                     y: { title: { display: true, text: graphData.y_label } },
//                   },
//                 }}
//               />
//             </div>
//           )}
//         </div>
        

//         {/* Progress Bar (when processing) */}
//         {isProcessing && (
//           <div className="mt-4">
//             <div className="text-sm text-gray-300 mb-2">Results being processed...</div>
//             <div className="w-full bg-[#1a0847] rounded-full h-2">
//               <div className="bg-blue-600 h-2 rounded-full w-3/4 transition-all duration-1000"></div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Realtime;


// // // import axios from "axios";
// // // import { useState } from "react";
// // // import { Bar } from "react-chartjs-2";

// // // const App = () => {
// // //   const [selectedFile, setSelectedFile] = useState<File | null>(null);
// // //   const [isProcessing, setIsProcessing] = useState(false);
// // //   const [graphData, setGraphData] = useState(null);

// // //   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     if (e.target.files) {
// // //       setSelectedFile(e.target.files[0]);
// // //     }
// // //   };

// // //   const handleSubmit = async (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     setIsProcessing(true);
// // //     setGraphData(null);

// // //     if (!selectedFile) {
// // //       alert("Please upload a CSV file.");
// // //       setIsProcessing(false);
// // //       return;
// // //     }

// // //     try {
// // //       // Step 1: Upload the CSV file and get session_id
// // //       const formData = new FormData();
// // //       formData.append("file", selectedFile);

// // //       const uploadResponse = await axios.post(
// // //         "http://20.42.96.119:8003/upload",
// // //         formData,
// // //         {
// // //           headers: {
// // //             "Content-Type": "multipart/form-data",
// // //           },
// // //         }
// // //       );

// // //       const sessionId = uploadResponse.data.session_id;

// // //       if (!sessionId) {
// // //         throw new Error("Failed to retrieve session_id.");
// // //       }

// // //       // Step 2: Analyze the uploaded file with a question
// // //       const question = "What are the batting averages of the players?";
// // //       const analyzeResponse = await axios.post(
// // //         "http://20.42.96.119:8003/analyze",
// // //         {
// // //           question,
// // //           session_id: sessionId,
// // //         },
// // //         {
// // //           headers: {
// // //             "Content-Type": "application/json",
// // //           },
// // //         }
// // //       );

// // //       // Step 3: Parse and display graph data
// // //       const analysis = analyzeResponse.data.analysis;
// // //       const { title, x_label, y_label, elements } = analysis;

// // //       const labels = elements.map((el: any) => el.group);
// // //       const values = elements.map((el: any) => el.value);

// // //       const chartData = {
// // //         labels,
// // //         datasets: [
// // //           {
// // //             label: title,
// // //             data: values,
// // //             backgroundColor: "rgba(75, 192, 192, 0.6)",
// // //             borderColor: "rgba(75, 192, 192, 1)",
// // //             borderWidth: 1,
// // //           },
// // //         ],
// // //       };

// // //       setGraphData({ chartData, x_label, y_label, title });
// // //     } catch (error) {
// // //       console.error("Error:", error.response ? error.response.data : error.message);
// // //       alert("An error occurred while processing the request.");
// // //     } finally {
// // //       setIsProcessing(false);
// // //     }
// // //   };

// //   return (
// //     <div className="p-4">
// //       <h1 className="text-xl font-bold mb-4">Upload and Analyze CSV</h1>
// //       <form onSubmit={handleSubmit} className="space-y-4">
// //         <input
// //           type="file"
// //           accept=".csv"
// //           onChange={handleFileChange}
// //           className="block w-full p-2 border rounded"
// //         />
// //         <button
// //           type="submit"
// //           disabled={isProcessing}
// //           className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
// //         >
// //           {isProcessing ? "Processing..." : "Upload and Analyze"}
// //         </button>
// //       </form>

// //       {graphData && (
// //         <div className="mt-6">
// //           <h2 className="text-lg font-semibold">{graphData.title}</h2>
// //           <Bar
// //             data={graphData.chartData}
// //             options={{
// //               responsive: true,
// //               plugins: {
// //                 legend: { display: true, position: "top" },
// //                 title: {
// //                   display: true,
// //                   text: graphData.title,
// //                 },
// //               },
// //               scales: {
// //                 x: { title: { display: true, text: graphData.x_label } },
// //                 y: { title: { display: true, text: graphData.y_label } },
// //               },
// //             }}
// //           />
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default App;


// import React, { useState } from 'react';
// import axios from 'axios';
// import { Bar } from "recharts";

// const Realtime = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [graphData, setGraphData] = useState(null);

//   const handleFileChange = (event) => {
//     if (event.target.files) {
//       setSelectedFile(event.target.files[0]);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsProcessing(true);
//     setGraphData(null);

//     if (!selectedFile) {
//       alert("Please upload a CSV file.");
//       setIsProcessing(false);
//       return;
//     }

//     try {
//       // Step 1: Upload CSV file
//       const formData = new FormData();
//       formData.append("file", selectedFile);

//       const uploadResponse = await axios.post(
//         "http://20.42.96.119:8003/upload",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       const sessionId = uploadResponse.data.session_id;

//       if (!sessionId) {
//         throw new Error("Failed to retrieve session_id.");
//       }

//       // Step 2: Analyze the data
//       const analyzeResponse = await axios.post(
//         "http://20.42.96.119:8003/analyze",
//         {
//           question: "What are the batting averages of the players?",
//           session_id: sessionId,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       // Step 3: Prepare chart data
//       const analysis = analyzeResponse.data.analysis;
//       const { title, x_label, y_label, elements } = analysis;

//       const chartData = {
//         labels: elements.map(el => el.group),
//         datasets: [{
//           label: title,
//           data: elements.map(el => el.value),
//           backgroundColor: "rgba(75, 192, 192, 0.6)",
//           borderColor: "rgba(75, 192, 192, 1)",
//           borderWidth: 1
//         }]
//       };

//       setGraphData({ chartData, x_label, y_label, title });
//     } catch (error) {
//       console.error("Error:", error);
//       alert("An error occurred while processing the request.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#110232] text-white p-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-2xl font-bold mb-6">CSV Analysis Chart</h1>
        
//         <form onSubmit={handleSubmit} className="mb-8 space-y-4">
//           <div className="flex flex-col space-y-2">
//             <label className="text-sm font-medium">Upload CSV File</label>
//             <input
//               type="file"
//               accept=".csv"
//               onChange={handleFileChange}
//               className="p-2 bg-[#1a0847] rounded-lg border border-[#3d1f8a] text-white"
//             />
//           </div>
          
//           <button
//             type="submit"
//             disabled={isProcessing}
//             className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
//           >
//             {isProcessing ? "Processing..." : "Analyze Data"}
//           </button>
//         </form>

//         {graphData && (
//           <div className="bg-[#1a0847] p-6 rounded-lg border border-[#3d1f8a]">
//             <h2 className="text-xl font-semibold mb-4">{graphData.title}</h2>
//             <Bar
//               data={graphData.chartData}
//               options={{
//                 responsive: true,
//                 plugins: {
//                   legend: { 
//                     display: true, 
//                     position: "top",
//                     labels: { color: "white" }
//                   },
//                   title: {
//                     display: true,
//                     text: graphData.title,
//                     color: "white"
//                   }
//                 },
//                 scales: {
//                   x: { 
//                     title: { 
//                       display: true, 
//                       text: graphData.x_label,
//                       color: "white"
//                     },
//                     ticks: { color: "white" }
//                   },
//                   y: { 
//                     title: { 
//                       display: true, 
//                       text: graphData.y_label,
//                       color: "white"
//                     },
//                     ticks: { color: "white" }
//                   }
//                 }
//               }}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Realtime;

import React, { useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Realtime = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!selectedFile) {
      alert("Please upload a CSV file.");
      setIsProcessing(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadResponse = await axios.post(
        "http://20.42.96.119:8003/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const sessionId = uploadResponse.data.session_id;

      if (!sessionId) {
        throw new Error("Failed to retrieve session_id.");
      }

      const analyzeResponse = await axios.post(
        "http://20.42.96.119:8003/analyze",
        {
          question: "What are the batting averages of the players?",
          session_id: sessionId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const analysis = analyzeResponse.data.analysis;
      const { elements } = analysis;

      // Transform data for dashboard
      setDashboardData({
        pieData: {
          labels: elements.slice(0, 3).map(el => el.group),
          datasets: [{
            data: elements.slice(0, 3).map(el => el.value),
            backgroundColor: ['#4F46E5', '#818CF8', '#C7D2FE'],
          }]
        },
        lineData: {
          labels: elements.map(el => el.group),
          datasets: [{
            label: 'Trend',
            data: elements.map(el => el.value),
            borderColor: '#4F46E5',
            tension: 0.4,
          }]
        },
        barData: {
          labels: elements.map(el => el.group),
          datasets: [{
            label: 'Volume',
            data: elements.map(el => el.value),
            backgroundColor: '#4F46E5',
          }]
        },
      });
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing the request.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-indigo-600"></div>
            <h1 className="text-xl font-semibold">prodloop</h1>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 text-gray-600">Dashboard</button>
            <button className="px-4 py-2 text-gray-600">Feedbacks</button>
            <button className="px-4 py-2 text-gray-600">Alerts</button>
          </div>
        </div>

        <div className="mb-6">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="flex-1 p-2 border rounded-lg"
            />
            <button
              type="submit"
              disabled={isProcessing}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Analyze Data"}
            </button>
          </form>
        </div>

        {dashboardData && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold mb-2">NPS Breakup</h2>
              <div className="h-64">
                <Pie 
                  data={dashboardData.pieData}
                  options={{
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    },
                    maintainAspectRatio: false
                  }}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold mb-2">NPS Score Trend</h2>
              <div className="h-64">
                <Line 
                  data={dashboardData.lineData}
                  options={{
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    },
                    maintainAspectRatio: false
                  }}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Volume Trend</h2>
              <div className="h-64">
                <Bar 
                  data={dashboardData.barData}
                  options={{
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    },
                    maintainAspectRatio: false
                  }}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold mb-2">NPS Breakup By Cohort</h2>
              <div className="h-64">
                <Line 
                  data={{
                    ...dashboardData.lineData,
                    datasets: [
                      {
                        ...dashboardData.lineData.datasets[0],
                        borderColor: '#4F46E5',
                      },
                      {
                        ...dashboardData.lineData.datasets[0],
                        borderColor: '#818CF8',
                        data: dashboardData.lineData.datasets[0].data.map(v => v * 0.8)
                      },
                      {
                        ...dashboardData.lineData.datasets[0],
                        borderColor: '#C7D2FE',
                        data: dashboardData.lineData.datasets[0].data.map(v => v * 0.6)
                      }
                    ]
                  }}
                  options={{
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    },
                    maintainAspectRatio: false
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Realtime;