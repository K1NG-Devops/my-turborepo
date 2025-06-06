'use client';

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { storage, ref, uploadBytesResumable, getDownloadURL } from '../firebase.js';

const HomeworkList = () => {
  const [homeworks, setHomeworks] = useState([]);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const fileInputRef = useRef();

  const parent_id = localStorage.getItem('parent_id');
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchHomeworks = async () => {
      try {
        const res = await axios.get(
          `https://youngeagles-api-server.up.railway.app/api/homeworks/for-parent/${parent_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
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
    console.log('file:', file, 'selectedHomework:', selectedHomework);

    if (!file || !selectedHomework || !selectedHomework.id || !file.name) {
      toast.error('Please select a valid file and homework.');
      return;
    }

    try {
      setUploading(true);
      const storageRef = ref(storage, `submissions/${selectedHomework.id}/${file.name}`);
      console.log('file:', file);
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
              'https://youngeagles-api-server.up.railway.app/api/homework/submit',
              {
                homeworkId: selectedHomework?.id,
                parentId: parent_id,
                fileUrl: downloadURL,
                comment,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success('Homework submitted successfully.');
            setFile(null);
            setComment('');
            setSelectedHomework(null);
            setSubmitDialogOpen(false);

            // ✅ Update the submitted status
            const updatedHomeworks = homeworks.map((hw) =>
              hw?.id === selectedHomework?.id ? { ...hw, submitted: true, file_url: downloadURL } : hw
            );
            setHomeworks(updatedHomeworks);
          } catch (err) {
            toast.error('Upload succeeded, but saving failed.');
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

  return (
    <div className="w-full bg-slate-300 mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-center mb-6">Homework List</h2>
      <div className="w-full bg-card grid lg:grid-cols-2 justify-center">
        {homeworks.length === 0 ? (
          <p className="text-center text-gray-500">No homework available.</p>
        ) : (
          homeworks.map((hw) => (
            <Card key={hw?.id || Math.random()} className="w-100 px-4 flex flex-row shadow-lg m-2 border border-gray-200">
              <CardContent className="p-4">
                <CardTitle className="text-lg font-semibold mb-2">{hw?.title}</CardTitle>
                {hw?.className && (
                  <p className="text-sm text-muted-foreground mb-1">Class: {hw?.className}</p>
                )}
                <p className="text-sm text-muted-foreground mb-1">
                  Due: {hw?.due_date ? new Date(hw.due_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }) : 'N/A'}
                </p>
                <p className={`text-sm ${hw?.submitted ? 'text-green-600' : 'text-red-600'}`}>
                  {hw?.submitted ? 'Submitted' : 'Not Submitted'}
                </p>
                <p className="mt-2 text-gray-700 whitespace-pre-line">{hw?.description}</p>

                {/* Teacher's assigned homework file preview/download */}
                {hw.teacher_file_url && !hw.submitted && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="hover:bg-blue-600 hover:text-white"
                          variant="outline"
                          onClick={() => setPreviewUrl(hw.teacher_file_url)}
                        >
                          Preview Homework
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-3xl" aria-describedby="preview-description">
                        <DialogHeader>
                          <DialogTitle>{hw.title} - Homework Preview</DialogTitle>
                        </DialogHeader>
                        <div className="w-full h-[75vh] overflow-hidden">
                          <iframe
                            src={previewUrl}
                            title="Homework Preview"
                            className="w-full h-full border rounded"
                          ></iframe>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <a href={hw.teacher_file_url} target="_blank" rel="noopener noreferrer">
                      <Button>Download Homework</Button>
                    </a>
                  </div>
                )}

                <div className="mt-4 flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2">
                    {hw?.file_url && (
                      <>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              className="hover:bg-pink-600 hover:text-white"
                              variant="outline"
                              onClick={() => setPreviewUrl(hw?.file_url)}
                            >
                              Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-3xl" aria-describedby="preview-description">
                            <DialogHeader>
                              <DialogTitle>{hw?.title} - Preview</DialogTitle>
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
                        <a href={hw?.file_url} target="_blank" rel="noopener noreferrer">
                          <Button>Download</Button>
                        </a>
                        {hw.file_url && hw.submission_id && (
                          <Button
                            variant="destructive"
                            onClick={async () => {
                              console.log('Deleting submission:', hw.submission_id);
                              await axios.delete(
                                `https://youngeagles-api-server.up.railway.app/api/submissions/${hw.submission_id}`,
                                { headers: { Authorization: `Bearer ${token}` } }
                              );
                              toast.success('Submission deleted successfully.');
                              setHomeworks((prev) =>
                                prev.map((h) => h?.id === hw?.id ? { ...h, submitted: false, file_url: null } : h)
                              );
                            }}
                          >
                            Delete Submission
                          </Button>
                        )}
                      </>
                    )}
                    {!hw?.submitted && (
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                          setSelectedHomework(hw);
                          setSubmitDialogOpen(true);
                        }}
                      >
                        Submit Work
                      </Button>
                    )}
                  </div>
                  {!hw?.file_url && <p className="text-gray-500 italic">No file attached</p>}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      {/* Single Dialog for Submit Work */}
      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogContent className="sm:max-w-lg" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Submit Work for: {selectedHomework?.title}</DialogTitle>
            <DialogDescription>
              Please upload your homework file and add any comments for the teacher.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="comment">Comment (optional)</Label>
              <Textarea
                id="comment"
                name="comment"
                placeholder="Add notes for the teacher..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="file">Upload File</Label>
              <Input
                id="file"
                name="file"
                type="file"
                accept="image/*,application/pdf,video/*"
                onChange={handleFileChange}
                required
                ref={fileInputRef}
              />
            </div>
            {uploading && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
            <Button onClick={handleSubmitWork} disabled={uploading || !file}>
              {uploading ? 'Uploading...' : 'Submit'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomeworkList;
