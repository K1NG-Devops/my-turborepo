import React, { useState } from "react";
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

const SubmitWork = () => {
    const [file, setFile] = useState(null);
    const [subject, setSubject] = useState("");
    const [comment, setComment] = useState("");
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file || !subject) {
            toast(
                <div>
                    <strong>"Missing Fields:</strong>
                    <div>Please fill in all fields.</div>
                </div>
            );
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
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                // Normally you'd send the download URL + subject + comment to your backend
                // await axios.post('/api/submit-work', { fileURL: downloadURL, subject, comment });

                toast(
                    <div className="text-green-600">
                        <strong>Upload Successful:</strong>
                        <div className="text-success">Your work has been submitted.</div>
                    </div>
                );

                setFile(null);
                setSubject("");
                setComment("");
                setUploading(false);
            }
        );
    };

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-2xl font-semibold">Submit Your Child's Work</h2>

            <div>
                <Label htmlFor="subject">Subject</Label>
                <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Science">Science</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Robotics">Robotics</SelectItem>
                    </SelectContent>
                </Select>
            </div>

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
