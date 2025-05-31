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

const HomeworkList = () => {
  const [homeworks, setHomeworks] = useState([]);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);

  const parent_id = localStorage.getItem('parent_id');
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchHomeworks = async () => {
      try {
        const response = await axios.get(
          `https://youngeagles-api-server.up.railway.app/api/homeworks/for-parent/${parent_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setHomeworks(response.data.homeworks || []);
      } catch (err) {
        console.error('Error loading homeworks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeworks();
  }, [parent_id]);

  if (loading) return <p className="text-center py-4">Loading homework...</p>;
  if (!parent_id) return <p className="text-center py-4">Please log in to view homework.</p>;

  return (
    <div className="w-full bg-slate-300 mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-center mb-6">Homework List</h2>
      <div className="w-full mx-auto grid md:grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {homeworks.length === 0 ? (
          <p className="text-center text-gray-500">No homework available.</p>
        ) : (
          homeworks.map((hw) => (
            <Card key={hw.id} className="w-72 shadow-lg m-2 border border-gray-200">
              <CardContent className="p-4">
                <CardTitle className="text-lg font-semibold mb-2">{hw.title}</CardTitle>
                <p className="text-sm text-muted-foreground mb-1">Class: {hw.className}</p>
                <p className="text-sm text-muted-foreground mb-1">Due: {new Date(hw.dueDate).toLocaleDateString()}</p>
                <p className={`text-sm ${hw.submitted ? "text-green-600" : "text-red-600"}`}>
                  {hw.submitted ? "Submitted" : "Not Submitted"}
                </p>
                  <p className="mt-2 text-gray-700">{hw.description}</p>

                  <div className="mt-4 flex gap-3">
                    {hw.file_url ? (
                      <>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" onClick={() => setPreviewUrl(hw.file_url)}>
                              Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-3xl">
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

                        <a
                          href={hw.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button>Download</Button>
                        </a>
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
  );
};

export default HomeworkList;
