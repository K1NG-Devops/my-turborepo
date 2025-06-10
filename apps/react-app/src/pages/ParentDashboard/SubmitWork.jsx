import React, { useState, useEffect } from "react";
import { storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";

const SubmitWork = () => {
    const [file, setFile] = useState(null);
    const [subject, setSubject] = useState("");
    const [comment, setComment] = useState("");
    const [uploading, setUploading] = useState(false);
    const [homeworkList, setHomeworkList] = useState([]);
    const [selectedHomework, setSelectedHomework] = useState("");
    const [loading, setLoading] = useState(true);

    const parent_id = localStorage.getItem('parent_id');
    const token = localStorage.getItem('accessToken');

    // Fetch available homework on component mount
    useEffect(() => {
        const fetchHomework = async () => {
            try {
                const res = await axios.get(
                    `https://youngeagles-api-server.up.railway.app/api/homeworks/for-parent/${parent_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const hwList = Array.isArray(res.data) ? res.data : res.data.homeworks || [];
                setHomeworkList(hwList.filter(hw => !hw.submitted)); // Only show unsubmitted homework
            } catch (err) {
                toast.error('Failed to load homework.');
                console.error('Error loading homework:', err);
            } finally {
                setLoading(false);
            }
        };
        if (parent_id && token) {
            fetchHomework();
        }
    }, [parent_id, token]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file || !selectedHomework) {
            toast.error('Please select homework and upload a file.');
            return;
        }

        setUploading(true);
        const storageRef = ref(storage, `submissions/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            null,
            (error) => {
                toast(
                    <div>
                      <strong>Upload Failed:</strong>
                      <div>{error.message}</div>
                    </div>
                  );
                setUploading(false);
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                    // Submit to backend
                    await axios.post(
                        'https://youngeagles-api-server.up.railway.app/api/submissions',
                        {
                            homeworkId: selectedHomework,
                            fileURL: downloadURL,
                            comment,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    toast.success('Homework submitted successfully!');
                    setFile(null);
                    setSelectedHomework("");
                    setComment("");
                    setUploading(false);

                    // Remove submitted homework from list
                    setHomeworkList(prev => prev.filter(hw => hw.id !== parseInt(selectedHomework)));
                } catch (err) {
                    toast.error('Submission upload succeeded but saving failed.');
                    console.error(err);
                    setUploading(false);
                }
            }
        );
    };

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-2xl font-semibold">Submit Your Child's Work</h2>

            {loading ? (
                <p>Loading homework...</p>
            ) : (
                <div>
                    <Label htmlFor="homework">Select Homework</Label>
                    <Select value={selectedHomework} onValueChange={setSelectedHomework}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select homework to submit" />
                        </SelectTrigger>
                        <SelectContent>
                            {homeworkList.map((hw) => (
                                <SelectItem key={hw.id} value={hw.id.toString()}>
                                    {hw.title} - Due: {new Date(hw.due_date || hw.dueDate).toLocaleDateString()}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {homeworkList.length === 0 && (
                        <p className="text-gray-500 mt-2">No pending homework available for submission.</p>
                    )}
                </div>
            )}

            <div>
                <Label htmlFor="comment">Comments (optional)</Label>
                <Textarea
                    placeholder="Add any notes for the teacher..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </div>

            <div>
                <Label htmlFor="file">Upload File</Label>
                <Input
                    type="file"
                    accept="image/*,application/pdf,video/*"
                    onChange={handleFileChange}
                />
            </div>

            <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Submit Work"}
            </Button>
        </div>
    );
};

export default SubmitWork;
