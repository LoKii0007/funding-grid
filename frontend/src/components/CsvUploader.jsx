import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const CsvUploader = ({}) => {
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("fundingGridToken");
  const baseUrl = import.meta.env.VITE_BACKEND_URL;


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (result) => setCsvData(result.data),
      header: true,
    });
  };

  useEffect(() => {
    console.log(csvData);
  }, [csvData]);

  const handleUploadToServer = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${baseUrl}/upload-csv`, {
        data: csvData,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        toast.success("Data uploaded successfully");
        setCsvData([])
      }else{
        toast.error(response.data.error || "Error uploading data");
      }
    } catch (error) {
      toast.error("Error uploading data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-4 items-center">
      <input
        required
        className="border-2 border-gray-300 rounded-md p-2"
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
      />
      <button
        disabled={loading}
        className="bg-zinc-800 w-[170px] text-white p-2 rounded-md flex justify-center items-center cursor-pointer"
        onClick={handleUploadToServer}
      >
        {loading ? <Loader className="animate-spin" /> : "Upload to Database"}
      </button>
    </div>
  );
};

export default CsvUploader;
