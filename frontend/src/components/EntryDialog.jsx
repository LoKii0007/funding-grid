import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Loader } from "lucide-react";

export default function EntryDialog({ open, setOpen }) {
  const [formData, setFormData] = useState({
    companyName: "",
    date: "",
    email: "",
    firstName: "",
    formSubmission: "",
    industry: "",
    investingFields: "",
    lastName: "",
    linkedIn: "",
    title: "",
    website: "",
  });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("fundingGridToken");
  const baseUrl = import.meta.env.VITE_BACKEND_URL;


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        investingFields: formData.investingFields
          .split(",")
          .map((item) => item.trim()),
      };
      const res = await axios.post(
        `${baseUrl}/api/single-upload`,
        payload,
        {
          validateStatus: (s) => s < 500,
          headers: {
            Authorization: `Bearer ${token}`
          }
        },
      );
      if (res.status !== 200) {
        toast.error(res.data.message || "error adding data.");
        return;
      }
      toast.success("data added");
      setOpen(false)
      setFormData({
        companyName: "",
        date: "",
        email: "",
        firstName: "",
        formSubmission: "",
        industry: "",
        investingFields: "",
        lastName: "",
        linkedIn: "",
        title: "",
        website: "",
      });
    } catch (error) {
      toast.error("Error adding company");
    }finally{
        setLoading(false)
    }
  };

  return (
    <>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden p-8 rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-3xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <DialogTitle className="text-2xl font-bold text-center mb-5">
                Add company
              </DialogTitle>
              <div className="bg-[#ffffff] p-6 max-w-2xl">
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-2 gap-4"
                >
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Company Name"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="text"
                    name="date"
                    placeholder="Date"
                    value={formData.date}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="text"
                    name="industry"
                    placeholder="Industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="text"
                    name="investingFields"
                    placeholder="Investing Fields (comma separated)"
                    value={formData.investingFields}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="text"
                    name="website"
                    placeholder="Website"
                    value={formData.website}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="text"
                    name="linkedIn"
                    placeholder="LinkedIn"
                    value={formData.linkedIn}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />
                  <textarea
                    name="formSubmission"
                    placeholder="Form Submission"
                    value={formData.formSubmission}
                    onChange={handleChange}
                    className="border p-2 rounded w-full col-span-2"
                  />

                  <button
                    type="submit"
                    className="bg-zinc-800 text-white py-2 px-4 rounded col-span-2 hover:bg-zinc-700 transition flex justify-center items-center"
                  >
                    {loading ? <Loader className="animate-spin" /> : "submit"}
                  </button>
                </form>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
