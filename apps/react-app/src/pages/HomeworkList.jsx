'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

const HomeworkList = () => {
  const [homeworks, setHomeworks] = useState([]);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState(null);

  const parent_id = localStorage.getItem('parent_id');
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchHomeworks = async () => {
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
        setHomeworks(hwList);
      } catch (err) {
        toast.error('Failed to load homework.');
        console.error('Error loading homeworks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeworks();
  }, [parent_id]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmitWork = async () => {
    if (!file || !selectedHomework) {
      toast.error('Please select a file and homework.');
      return;
    }

    try {
      setUploading(true);
      const filePath = `submissions/${selectedHomework.id}/${file.name}`;
      const storageRef = ref(storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          toast.error('Upload failed: ' + error.message);
          setUploading(false);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            await axios.post(
              'https://youngeagles-api-server.up.railway.app/api/submissions',
              {
                homeworkId: selectedHomework.id,
                fileURL: downloadURL,
                comment,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            toast.success('Homework submitted successfully.');
            setFile(null);
            setComment('');
            setSelectedHomework(null);

            const updatedHomeworks = homeworks.map((hw) =>
              hw.id === selectedHomework.id ? { ...hw, submitted: true } : hw
            );
            setHomeworks(updatedHomeworks);
          } catch (err) {
            toast.error('Submission upload succeeded but saving failed.');
            console.error(err);
          }
        }
      );
    } catch (err) {
      toast.error('Submission error.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (!parent_id) return <p className="text-center py-4">Please log in to view homework.</p>;
  if (loading) return <p className="text-center py-4">Loading homework...</p>;

  const totalHomework = homeworks.length;
  const submittedHomework = homeworks.filter(hw => hw.submitted).length;
  const progressPercentage = totalHomework > 0 ? (submittedHomework / totalHomework) * 100 : 0;

  return (
    <div className="w-full bg-slate-50 mx-auto px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">📚 Homework Dashboard</h2>
        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Progress Overview</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Homework Completion</span>
            <span className="font-semibold text-gray-800">{submittedHomework}/{totalHomework}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500" 
              style={{width: `${progressPercentage}%`}}
            ></div>
          </div>
          <p className="text-sm text-gray-500">{progressPercentage.toFixed(0)}% of assignments completed</p>
        </div>
        <div className="grid lg:grid-cols-1 xl:grid-cols-2 gap-4">
        {homeworks.length === 0 ? (
          <p className="text-center text-gray-500">No homework available.</p>
        ) : (
          homeworks.map((hw) => (
            <Card key={hw.id} className="w-100 px-4 flex flex-row shadow-lg m-2 border border-gray-200">
              <CardContent className="p-4">
                <CardTitle className="text-lg font-semibold mb-2">{hw.title}</CardTitle>
                {hw.className && (
                  <p className="text-sm text-muted-foreground mb-1">Class: {hw.className}</p>
                )}
                <p className="text-sm text-muted-foreground mb-1">Due: {new Date(hw.dueDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</p>
                <p className={`text-sm ${hw.submitted ? 'text-green-600' : 'text-red-600'}`}>
                  {hw.submitted ? 'Submitted' : 'Not Submitted'}
                </p>
                <p className="mt-2 text-gray-700 whitespace-pre-line">{hw.description}</p>

                <div className="mt-4 flex flex-col gap-3">
                  {hw.file_url ? (
                    <>
                      <div className="flex flex-wrap gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              className="hover:bg-pink-600 hover:text-white"
                              variant="outline"
                              onClick={() => setPreviewUrl(hw.file_url)}
                            >
                              Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-3xl" aria-describedby="preview-description">
                            <DialogHeader>
                              <DialogTitle>{hw.title} - Preview</DialogTitle>
                            </DialogHeader>
                            <div className="w-full h-[75vh] overflow-hidden">
                              <iframe
                                src={previewUrl}
                                title="Preview"
                                className="w-full h-full border rounded"
                              ></iframe>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <a href={hw.file_url} target="_blank" rel="noopener noreferrer">
                          <Button>Download</Button>
                        </a>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="destructive"
                          onClick={async () => {
                            try {
                              await axios.delete(`https://youngeagles-api-server.up.railway.app/api/submissions/${hw.id}`, {
                                headers: { Authorization: `Bearer ${token}` },
                                data: { homeworkId: hw.id },
                              });
                              toast.success('Submission deleted successfully.');
                              setHomeworks((prev) => prev.map((h) => h.id === hw.id ? { ...h, submitted: false } : h));
                            } catch (err) {
                              toast.error('Error deleting submission.');
                              console.error(err);
                            }
                          }}
                        >
                          Delete Submission
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => setSelectedHomework(hw)}
                            >
                              Submit Work
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Submit Work for: {hw.title}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="comment">Comment (optional)</Label>
                                <Textarea
                                  placeholder="Add notes for the teacher..."
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
                              <Button onClick={handleSubmitWork} disabled={uploading}>
                                {uploading ? 'Uploading...' : 'Submit'}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500 italic">No file attached</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
        </div>
      </div>
    </div>
  );
};

export default HomeworkList;
