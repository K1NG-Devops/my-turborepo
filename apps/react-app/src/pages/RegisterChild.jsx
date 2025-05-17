import React, { useState, useEffect } from 'react';

const RegisterChild = () => {
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        age: '',
        gender: '',
        grade: '',
        className: '',
        parent_id: '',
    });
    const [loading, setLoading] = useState(false); // Spinner state
    const [responseMessage, setResponseMessage] = useState(''); // Server response message

    useEffect(() => {
        const storedParentId = localStorage.getItem('parent_id');
        if (storedParentId) {
            setFormData((prev) => ({ ...prev, parent_id: storedParentId }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResponseMessage("");

        const parentId = localStorage.getItem("user_id");
        if (!parentId) {
            setResponseMessage("Parent ID is missing. Please log in again.");
            setLoading(false);
            return;
        }

        if (!formData.name || !formData.dob || !formData.gender) {
            setResponseMessage("Please fill out all required fields.");
            setLoading(false);
            return;
        }

        const data = new FormData();
        data.append("name", formData.name);
        data.append("dob", formData.dob);
        data.append("age", formData.age);
        data.append("gender", formData.gender);
        data.append("grade", formData.grade);
        data.append("className", formData.className);
        if (formData.birthCert) {
            data.append("birthCert", formData.birthCert);
        }
        data.append("parent_id", parentId);

        try {
            const response = await fetch("https://youngeagles-api-server-production-4b2e.up.railway.app/api/auth/register-child", {
                method: "POST",
                body: data,
            });

            if (response.ok) {
                setResponseMessage("Child registered successfully!");
            } else {
                const errorData = await response.json();
                setResponseMessage("Registration failed: " + JSON.stringify(errorData));
            }
        } catch (error) {
            setResponseMessage("Error submitting form: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 p-6">
            <div className="max-w-2xl mx-auto bg-white p-8 shadow-xl rounded-lg">
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Register My Child</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-semibold">Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Date of Birth</label>
                            <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Age</label>
                            <input type="number" name="age" value={formData.age} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md">
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Grade</label>
                            <input type="text" name="grade" value={formData.grade} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Class Name</label>
                            <input type="text" name="className" value={formData.className} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                    </div>
                    <button type="submit" className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition" disabled={loading}>
                        {loading ? "Registering..." : "Register Child"}
                    </button>
                </form>
                {responseMessage && (
                    <div className="mt-4 p-4 text-center text-white bg-blue-500 rounded-md">
                        {responseMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegisterChild;
