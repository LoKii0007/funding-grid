import { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

const industries = [
  "Food and Beverage",
  "Fashion",
  "Women",
  "Black Minority Investors",
  "CPG",
  "Saas",
  "B2B",
  "Crypto",
  "E-commerce",
  "Healthcare",
  "Consumer",
  "Agri",
  "Fintech",
  "Restaurants",
  "D2C",
];

const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "New Zealand",
  "India",
  "Brazil",
  "Argentina",
  "Chile",
  "Mexico",
  "Colombia",
];

export default function FiltersDialog({
  open,
  setOpen,
  filters,
  setFilters,
  handleApply,
}) {
  const [industry, setIndustry] = useState([]);

  function handleIndustry(item) {
    if (industry.includes(item)) {
      setIndustry(industry.filter((i) => i !== item));
    } else {
      setIndustry([...industry, item]);
    }

    setFilters((prev) => ({
      ...prev,
      industry: prev.industry.includes(item)
        ? prev.industry.filter((i) => i !== item) // Remove item if it exists
        : [...prev.industry, item], // Add item if it doesn't exist
    }));
  }

  function handleReset() {
    setFilters({
      industry: [],
      stages: "",
      country: "",
      programTypes: "",
    });
    setIndustry([])
  }

  useEffect(() => {
    console.log(filters);
  }, [industry]);

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden p-8 rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-5xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <DialogTitle className="flex justify-between gap-5 mb-5">
              <div className="font-bold text-2xl">Filters</div>
              <div className="flex gap-6" >
                <button className="bg-zinc-800 rounded-lg p-2 px-4 text-white cursor-pointer" onClick={() => handleReset()}>Reset</button>
                <button onClick={() => setOpen(false)} className="cursor-pointer p-2">
                  X
                </button>
              </div>
            </DialogTitle>
            <div className="flex flex-col gap-4">
              <div>Industry</div>
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-4 gap-4">
                  {industries.map((item) => (
                    <button
                      className={` text-white px-3 py-2 rounded-md cursor-pointer ${
                        industry.includes(item) ? "bg-zinc-700" : "bg-zinc-400"
                      }`}
                      onClick={() => handleIndustry(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full grid grid-cols-2 gap-6 mt-8">
              <button
                onClick={() => setOpen(false)}
                className="border border-zinc-600 rounded-lg p-2 text-xl cursor-pointer "
              >
                cancel
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  handleApply();
                }}
                className="border bg-zinc-800 cursor-pointer rounded-lg p-2 text-xl text-white"
              >
                Apply
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
