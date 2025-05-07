import React, { useState } from "react";
import axios from "axios";

const PopUploadForm = () => {
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        phone: "",
        studentName: "",
        amount: "",
        paymentDate: "",
        paymentMethod: "",
        bankName: "",
    });

    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handlesubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            return setMessage("Please upload a file.");
        }

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });
        data.append("file", file); // Must match backend upload.single('file')

        try {
            const response = await axios.post('https://youngeagles.org.za/api/public/pop-submission', data);
            setMessage(response.data.message || "File uploaded successfully!");
        } catch (error) {
            setMessage("Error uploading file. Please try again.");
        }
    };

    return (
        <form onSubmit={handlesubmit} encType="multipart/form-data" className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
            <h2 className="text-lg font-bold mb-4">Upload Payment Proof</h2>
            <input className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-pink-100 dark:border-pink-600 dark:text-gray dark:focus:ring-blue-500 dark:focus;border-blue-500" type="text" name="fullname" placeholder="Full Name" onChange={handleChange} required />
            <input className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-pink-100 dark:border-pink-600 dark:text-gray dark:focus:ring-blue-500 dark:focus;border-blue-500" type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-pink-100 dark:border-pink-600 dark:text-gray dark:focus:ring-blue-500 dark:focus;border-blue-500" type="text" name="phone" placeholder="Phone Number" onChange={handleChange} required />
            <input className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-pink-100 dark:border-pink-600 dark:text-gray dark:focus:ring-blue-500 dark:focus;border-blue-500" type="text" name="studentName" placeholder="Student Name (optional)" onChange={handleChange} />
            <input className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-pink-100 dark:border-pink-600 dark:text-gray dark:focus:ring-blue-500 dark:focus;border-blue-500" type="number" name="amount" placeholder="Amount Paid" onChange={handleChange} required />
            <input className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-pink-100 dark:border-pink-600 dark:text-gray dark:focus:ring-blue-500 dark:focus;border-blue-500" type="date" name="paymentDate" onChange={handleChange} required />
            <select className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-pink-100 dark:border-pink-600 dark:text-gray dark:focus:ring-blue-500 dark:focus;border-blue-500" name="paymentMethod" onChange={handleChange} required>
                <option value="">Select Payment Method</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="credit_card">Credit Card</option>
                <option value="cash">Cash</option>
            </select>
            <input className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-pink-100 dark:border-pink-600 dark:text-gray dark:focus:ring-blue-500 dark:focus;border-blue-500" type="text" name="bankName" placeholder="Bank Name (optional)" onChange={handleChange} />
            <input className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-pink-100 dark:border-pink-600 dark:text-gray dark:focus:ring-blue-500 dark:focus;border-blue-500" type="file" name="file" onChange={handleFileChange} required />
            <button className="bg-pink-600 p-2 rounded-lg w-full cursor-pointer text-white text-lg hover:bg-blue-500" type="submit">Submit POP</button>
            {message && <p className="text-red-500 text-lg">{message}</p>}
        </form>
    );
}

export default PopUploadForm;
