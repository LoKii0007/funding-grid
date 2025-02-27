import React, { useState, useEffect } from "react";
import CsvUploader from "../components/CsvUploader";
import Table from "../components/Table";
import FiltersDialog from "../components/FiltersDialog";
import { SearchIcon } from "lucide-react";
import { useDebounce } from "use-debounce";
import axios from "axios";
import toast from "react-hot-toast";
import EntryDialog from "../components/EntryDialog";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [entryOpen, setEntryOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const token = localStorage.getItem("fundingGridToken");
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const [filters, setFilters] = useState({
    industry : [],
    stages : '',
    country : '',
    programTypes : ''
  });

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useDebounce(
    searchTerm,
    500
  );

  const fetchPage = async ({ page, searchTerm, industry }) => {
    const ft = {}
    if(searchTerm){
      ft.searchTerm = searchTerm
    }
    if(industry){
      ft.industry = industry
    }
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/data`, {
        params: {
          page,
          limit,
          ...ft
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setData(response.data.data);
        setTotalCount(response.data.totalCount);
      }else{
        toast.error(response.data.error || "Error fetching data");
      }
    } catch (error) {
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage({ page: currentPage, searchTerm: debouncedSearchTerm, filters });
  }, [debouncedSearchTerm]);

  function handleFilter(){
    fetchPage({page: currentPage, searchTerm : searchTerm, ...filters})
  }

  const downloadCSV = () => {
    if (data.length === 0) {
      toast.error("No data available to download");
      return;
    }

    const headers = [
      "Company Name",
      "Website",
      "Industry",
      "Investing Fields",
      "First Name",
      "Last Name",
      "Title",
      "Email",
      "LinkedIn",
      "Date",
    ];
    
    const csvRows = data.map(row =>
      [
        row.companyName,
        row.website,
        row.industry,
        row.investingFields,
        row.firstName,
        row.lastName,
        row.title,
        row.email,
        row.linkedIn,
        row.date,
      ]
        .map(value => `"${value}"`) // Wrap values in double quotes
        .join(",")
    );

    const csvString = [headers.join(","), ...csvRows].join("\n");

    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownload = () => {
    toast.promise(
      Promise.resolve(downloadCSV()), 
      {
        loading: "Downloading...",
        success: "Downloaded successfully",
        error: "Error downloading"
      }
    )
  }

  useEffect(() => {
    const token = localStorage.getItem("fundingGridToken");
    if(!token) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-12 p-12 h-screen w-screen">
      <h1 className="text-4xl font-bold">Funding grid</h1>
      <div className="flex justify-end items-center w-full px-5">
        <CsvUploader />
      </div>
      <div className="grid grid-cols-2 gap-12 justify-between items-center w-full px-5">
        <div className="flex items-center gap-2 w-full bg-gray-100 rounded-lg p-2">
          <SearchIcon height={16} width={16} />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search"
            className="w-full focus:outline-none"
          />
        </div>
        <div className="w-full flex gap-5 justify-end items-center">
          <button
            className="bg-zinc-800 text-white py-2 rounded-md px-8 cursor-pointer"
            onClick={() => setEntryOpen(true)}
          >
            Add new
          </button>
          <button
            className="bg-zinc-800 text-white py-2 rounded-md px-8 cursor-pointer"
            onClick={() => setOpen(true)}
          >
            Filters
          </button>
          <button 
            onClick={handleDownload} 
            className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition cursor-pointer"
          >
            Download CSV
          </button>
        </div>

         {/* dailogs  */}
         <EntryDialog 
          open={entryOpen}
          setOpen={setEntryOpen}
         />
        <FiltersDialog
          filters={filters}
          setFilters={setFilters}
          open={open}
          setOpen={setOpen}
          handleApply={handleFilter}
        />
      </div>
      <div className="w-full px-5">
        <Table fetchPage={fetchPage} data={data} totalCount={totalCount} loading={loading} setData={setData} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
};

export default Home;
