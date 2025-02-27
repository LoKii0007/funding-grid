import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import { Loader } from "lucide-react";

const Table = ({
  fetchPage,
  loading,
  totalCount,
  currentPage,
  setCurrentPage,
  data,
  setdata,
}) => {
  useEffect(() => {
    fetchPage({ page: currentPage });
  }, [currentPage]);

  useEffect(() => {
    console.log(data);
  }, [data, loading]);

  return (
    <>
      {loading ? (
        <div className="p-12 flex justify-center items-center w-full" >
          <Loader className="animate-spin" />
        </div>
      ) : data.length > 0 ? (
        <div className="w-full justify-between items-center flex flex-col gap-6">
          <table>
            <thead>
              <tr className="gap-6 grid grid-cols-11 text-left pb-4">
                <th>Company Name</th>
                <th>Website</th>
                <th>Form Submission</th>
                <th>Industry</th>
                <th>Investing Fields</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Title</th>
                <th>Email</th>
                <th>LinkedIn</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody className="text-left space-y-4">
              {data.map((row, index) => (
                <tr key={index} className="gap-6 grid grid-cols-11">
                  <td className="text-ellipsis overflow-hidden text-nowrap">
                    {row.companyName}
                  </td>
                  <td className="text-ellipsis overflow-hidden text-nowrap">
                    {row.website}
                  </td>
                  <td onClick={() => window.open(row.formSubmission, "_blank")} className="cursor-pointer text-ellipsis overflow-hidden text-nowrap underline">
                    {row.formSubmission}
                  </td>
                  <td className="text-ellipsis overflow-hidden text-nowrap">
                    {row.industry}
                  </td>
                  <td className="text-ellipsis overflow-hidden text-nowrap">
                    {row.investingFields}
                  </td>
                  <td className="text-ellipsis overflow-hidden text-nowrap">
                    {row.firstName}
                  </td>
                  <td className="text-ellipsis overflow-hidden text-nowrap">
                    {row.lastName}
                  </td>
                  <td className="text-ellipsis overflow-hidden text-nowrap">
                    {row.title}
                  </td>
                  <td className="text-ellipsis overflow-hidden text-nowrap">
                    {row.email}
                  </td>
                  <td className="text-ellipsis overflow-hidden text-nowrap">
                    {row.linkedIn}
                  </td>
                  <td className="text-ellipsis overflow-hidden text-nowrap">
                    {row.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            fetchPage={fetchPage}
            totalCount={totalCount}
          />
        </div>
      ) : (
        <div className="w-full justify-center items-center flex flex-col gap-6">
          <h1 className="text-2xl font-bold">No data found</h1>
        </div>
      )}
    </>
  );
};

export default Table;
