import React, { useState, useEffect } from "react";
import axios from "axios";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const TeacherUploadHomework = () => {
    const [formData, setFormData] = useState({
        title: "",
        dueDate: "",
        className: "",
        grade: "",
    });

    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();
    const teacherId = localStorage.getItem("teacherId");

    useEffect(() => {
        if (!teacherId) {
            navigate("/login");
        }
    }, [teacherId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert("Select a file first!");

        try {
            setUploading(true);

            const fileRef = ref(storage, `homeworks/${Date.now()}-${file.name}`);
            await uploadBytes(fileRef, file);
            const fileUrl = await getDownloadURL(fileRef);

            // Submit data to backend
            const token = localStorage.getItem("accessToken");
            await axios.post(
                "https://youngeagles-api-server.up.railway.app/api/homeworks/upload",
                {
                    ...formData,
                    uploadedBy: teacherId,
                    fileUrl,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Homework uploaded!");
            navigate("/teacher-dashboard");
        } catch (error) {
            console.error("Upload error:", error);
            alert(error.response?.data?.error || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto mt-12 bg-white shadow-lg rounded-2xl">
            <h2 className="text-3xl font-bold mb-6 text-center">📤 Upload Homework</h2>
            <form onSubmit={handleUpload} className="space-y-4">
                <input
                    type="text"
                    name="title"
                    placeholder="Homework Title"
                    className="w-full p-3 border rounded-md"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <input
                    type="date"
                    name="dueDate"
                    className="w-full p-3 border rounded-md"
                    value={formData.dueDate}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="className"
                    placeholder="Class Name"
                    className="w-full p-3 border rounded-md"
                    value={formData.className}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="grade"
                    placeholder="Grade"
                    className="w-full p-3 border rounded-md"
                    value={formData.grade}
                    onChange={handleChange}
                    required
                />
                <div className="border border-dashed border-gray-400 rounded-lg p-3">
                    <label className="block mb-2 font-semibold">📎 Select File</label>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        className="w-full"
                        onChange={handleFileChange}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={uploading}
                    className={`w-full py-3 text-white rounded-md ${uploading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                        }`}
                >
                    {uploading ? "Uploading..." : "Upload Homework"}
                </button>
            </form>
        </div>
    );
};

export default TeacherUploadHomework;
