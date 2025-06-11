'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { FaFileAlt, FaEdit, FaUpload, FaCheck, FaTrash, FaEye } from 'react-icons/fa';
import ColorMatchActivity from '../ColorMatchHomework';
import MemoryActivity from '../components/activities/MemoryActivity';
import SortActivity from '../components/activities/SortActivity';
import QuizActivity from '../components/activities/QuizActivity';
import PuzzleActivity from '../components/activities/PuzzleActivity';
import ColorActivity from '../components/activities/ColorActivity';
import RoboticsActivity from '../components/activities/RoboticsActivity';
import MatchActivity from '../components/activities/MatchActivity';

// Mapping of interactive homework types to components
const INTERACTIVE_COMPONENTS = {
  'color-match': ColorMatchActivity,
  'match': MatchActivity,
  'memory': MemoryActivity,
  'sort': SortActivity,
  'quiz': QuizActivity,
  'puzzle': PuzzleActivity,
  'color': ColorActivity,
  'robotics': RoboticsActivity,
};

const HomeworkList = ({ onProgressUpdate }) => {
  const [homeworks, setHomeworks] = useState([]);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState('');
  const [uploading, setUploading] = useState(false);
  const [completionAnswers, setCompletionAnswers] = useState({});
  const [activeTab, setActiveTab] = useState({});
  const [completedActivities, setCompletedActivities] = useState({});
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [editingHomework, setEditingHomework] = useState({});
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false);

  const parent_id = localStorage.getItem('parent_id');
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchHomeworks();
  }, [parent_id]);

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
      
      // Initialize completion answers for each homework
      const initialAnswers = {};
      hwList.forEach(hw => {
        initialAnswers[hw.id] = hw.completion_answer || '';
      });
      setCompletionAnswers(initialAnswers);
      
      // Call progress update callback if provided
      if (onProgressUpdate) {
        onProgressUpdate();
      }
    } catch (err) {
      toast.error('Failed to load homework.');
      console.error('Error loading homeworks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleCompletionChange = (hwId, value) => {
    setCompletionAnswers(prev => ({
      ...prev,
      [hwId]: value
    }));
  };

  const saveCompletion = async (hwId) => {
    try {
      await axios.post(
        `https://youngeagles-api-server.up.railway.app/api/homeworks/${hwId}/complete`,
        {
          completion_answer: completionAnswers[hwId]
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Assignment completed and saved!');
    } catch (err) {
      toast.error('Failed to save completion.');
      console.error('Error saving completion:', err);
    }
  };

  const handleSubmitWork = async () => {
    if (!selectedHomework) {
      toast.error('Please select a homework first.');
      return;
    }
    
    const hasAttempt = completionAnswers[selectedHomework.id]?.trim() || completedActivities[selectedHomework.id];
    const isInteractive = selectedHomework.type && INTERACTIVE_COMPONENTS[selectedHomework.type];
    
    // For interactive activities, check if they have been completed
    if (isInteractive) {
      if (!hasAttempt) {
        toast.error('Please complete the interactive activity first.');
        return;
      }
    } else {
      // For non-interactive homework, require file upload or written answer
      const hasCompletion = completionAnswers[selectedHomework.id]?.trim();
      if (!hasCompletion && !file) {
        toast.error('Please complete the assignment or upload a file.');
        return;
      }
    }

    try {
      setUploading(true);
      let downloadURL = null;

      // Upload file if provided
      if (file) {
        const filePath = `submissions/${selectedHomework.id}/${file.name}`;
        const storageRef = ref(storage, filePath);
        const uploadTask = uploadBytesResumable(storageRef, file);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            null,
            (error) => reject(error),
            async () => {
              downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      // Submit to backend using the correct endpoint
      await axios.post(
        'https://youngeagles-api-server.up.railway.app/api/homeworks/submit',
        {
          homeworkId: selectedHomework.id,
          parentId: parent_id,
          fileURL: downloadURL,
          comment: comment,
          completion_answer: completionAnswers[selectedHomework.id] || '',
          activity_result: completedActivities[selectedHomework.id] || null,
          isInteractive: !!(selectedHomework.type && INTERACTIVE_COMPONENTS[selectedHomework.type])
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

      // Refresh homework list
      fetchHomeworks();
    } catch (err) {
      toast.error('Submission failed.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const deleteSubmission = async (hw) => {
    try {
      await axios.delete(`https://youngeagles-api-server.up.railway.app/api/homeworks/submissions/${hw.submission_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Submission deleted successfully.');
      fetchHomeworks();
    } catch (err) {
      toast.error('Error deleting submission.');
      console.error(err);
    }
  };

  const setTab = (hwId, tab) => {
    setActiveTab(prev => ({ ...prev, [hwId]: tab }));
  };

  if (!parent_id) return <p className="text-center py-4">Please log in to view homework.</p>;
  if (loading) return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2">Loading homework...</span>
    </div>
  );

  const totalHomework = homeworks.length;
  const submittedHomework = homeworks.filter(hw => hw.submitted).length;
  const progressPercentage = totalHomework > 0 ? (submittedHomework / totalHomework) * 100 : 0;

  return (
    <div className="w-full bg-gray-50 mx-auto px-2 sm:px-4 py-6 mobile-container">
      <div className="max-w-7xl mx-auto parent-dashboard-mobile">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800 mobile-heading">📚 Homework Dashboard</h2>
        
        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">Progress Overview</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm sm:text-base text-gray-600">Homework Completion</span>
            <span className="font-semibold text-gray-800">{submittedHomework}/{totalHomework}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 mb-4">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-3 sm:h-4 rounded-full transition-all duration-500" 
              style={{width: `${progressPercentage}%`}}
            ></div>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">{progressPercentage.toFixed(0)}% of assignments completed</p>
        </div>
        
        {/* Homework Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {homeworks.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <FaFileAlt className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500">No homework available.</p>
            </div>
          ) : (
            homeworks.map((hw) => {
              const currentTab = activeTab[hw.id] || 'view';
              const hasWrittenWork = completionAnswers[hw.id]?.trim();
              const hasActivityResult = completedActivities[hw.id];
              const isAttempted = hasWrittenWork || hasActivityResult;
              const isEditing = editingHomework[hw.id];
              const isReadyToSubmit = isAttempted && !isEditing;
              
              return (
                <Card 
                  key={hw.id} 
                  className="shadow-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-xl transition-shadow homework-card-mobile"
                  onClick={() => setSelectedHomework(hw)}
                >
                  <CardContent className="p-0">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
                      <CardTitle className="text-lg sm:text-xl font-semibold mb-2">{hw.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 text-sm">
                        {hw.className && (
                          <span className="bg-white/20 px-2 py-1 rounded">Class: {hw.className}</span>
                        )}
                        <span className="bg-white/20 px-2 py-1 rounded">
                          Due: {hw.due_date ? new Date(hw.due_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          }) : 'No due date'}
                        </span>
                        {hw.type && (
                          <span className="bg-white/20 px-2 py-1 rounded flex items-center gap-1">
                            🎮 {hw.type.charAt(0).toUpperCase() + hw.type.slice(1)} Activity
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded ${
                          hw.submitted 
                            ? 'bg-green-500' 
                            : isEditing
                            ? 'bg-orange-500'
                            : isAttempted 
                            ? 'bg-blue-500' 
                            : 'bg-red-500'
                        }`}>
                          {hw.submitted ? '✅ Submitted' : isEditing ? '📝 Editing' : isAttempted ? '✅ Done' : '⏳ Pending'}
                        </span>
                      </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex border-b">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTab(hw.id, 'view');
                        }}
                        className={`flex-1 px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium flex items-center justify-center gap-1 sm:gap-2 ${
                          currentTab === 'view' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        <FaEye className="text-xs sm:text-sm" /> <span className="hidden sm:inline">View</span>
                      </button>
                      {!hw.submitted && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTab(hw.id, 'complete');
                          }}
                          className={`flex-1 px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium flex items-center justify-center gap-1 sm:gap-2 ${
                            currentTab === 'complete' ? 'bg-green-50 text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-gray-800'
                          }`}
                        >
                        {hw.type && INTERACTIVE_COMPONENTS[hw.type] ? '🎮' : <FaEdit className="text-xs sm:text-sm" />} 
                        <span className="hidden sm:inline">
                          {hw.type && INTERACTIVE_COMPONENTS[hw.type] ? 'Start' : 'Complete'}
                        </span>
                        </button>
                      )}
                    </div>

                    {/* Tab Content */}
                    <div className="p-4">
                      {currentTab === 'view' && (
                        <div className="space-y-4">
                          {hw.instructions && (
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">Instructions:</h4>
                              <p className="text-gray-600 text-sm">{hw.instructions}</p>
                            </div>
                          )}
                          
                          {/* Show activity type info */}
                          {hw.type && INTERACTIVE_COMPONENTS[hw.type] && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <h4 className="font-medium text-green-800 mb-1 flex items-center gap-2">
                                🎮 Interactive Activity Available!
                              </h4>
                              <p className="text-sm text-green-700">
                                This is a fun {hw.type} activity! Click the 'Complete' tab to start playing.
                              </p>
                            </div>
                          )}
                          
                          {/* Teacher's Assignment File */}
                          {hw.teacher_file_url && (
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">Assignment File:</h4>
                              <div className="flex flex-wrap gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setPreviewUrl(hw.teacher_file_url)}
                                    >
                                      <FaEye className="mr-2" /> Preview
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl w-[95vw] h-[90vh]">
                                    <DialogHeader>
                                      <DialogTitle>{hw.title} - Assignment Preview</DialogTitle>
                                      <DialogDescription>
                                        Preview the assignment file provided by your teacher.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="w-full h-full overflow-hidden">
                                      <iframe
                                        src={previewUrl}
                                        title="Preview"
                                        className="w-full h-full border rounded"
                                      ></iframe>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <a href={hw.teacher_file_url} target="_blank" rel="noopener noreferrer">
                                  <Button size="sm" variant="outline">
                                    <FaFileAlt className="mr-2" /> Download
                                  </Button>
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {currentTab === 'complete' && (
                        <div className="space-y-4">
                          {/* Render interactive activity if this homework is an interactive type */}
                          {(hw.type && INTERACTIVE_COMPONENTS[hw.type]) ? (
                            <div className="my-4">
                              {React.createElement(INTERACTIVE_COMPONENTS[hw.type], {
                                items: hw.items || [],
                                instructions: hw.instructions || '',
                                title: hw.title || '',
                                onSubmit: async (result) => {
                                  console.log('Activity result:', result);
                                  toast.success('Activity completed! Great job! 🎉');
                                  
                                  // Mark activity as completed
                                  setCompletedActivities(prev => ({
                                    ...prev,
                                    [hw.id]: result
                                  }));
                                  
                                  // Mark as not editing when activity is completed
                                  setEditingHomework(prev => ({
                                    ...prev,
                                    [hw.id]: false
                                  }));
                                  
                                  // Auto-save completion for interactive activities
                                  try {
                                    await axios.post(
                                      `https://youngeagles-api-server.up.railway.app/api/homeworks/${hw.id}/complete`,
                                      {
                                        completion_answer: JSON.stringify(result),
                                        activity_result: result
                                      },
                                      {
                                        headers: {
                                          Authorization: `Bearer ${token}`,
                                        },
                                      }
                                    );
                                    
                                  } catch (err) {
                                    console.error('Error saving activity result:', err);
                                    toast.error('Failed to save your progress.');
                                  }
                                },
                                disabled: hw.submitted
                              })}
                            </div>
                          ) : (
                            <div>
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                <h4 className="font-medium text-blue-800 mb-2">📝 Written Assignment</h4>
                                <p className="text-sm text-blue-700 mb-3">
                                  This assignment doesn't have an interactive component. Please write your answer below.
                                </p>
                              </div>
                              
                              <Label htmlFor={`completion-${hw.id}`} className="text-gray-700 font-medium">
                                Complete your assignment:
                              </Label>
                              <Textarea
                                id={`completion-${hw.id}`}
                                placeholder="Type your answer/solution here..."
                                value={completionAnswers[hw.id] || ''}
                                onChange={(e) => handleCompletionChange(hw.id, e.target.value)}
                                className="mt-2"
                                rows={6}
                              />
                              <div className="flex gap-2 mt-4">
                                <Button
                                  onClick={() => saveCompletion(hw.id)}
                                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                                  disabled={!completionAnswers[hw.id]?.trim()}
                                >
                                  <FaCheck className="mr-2" /> Save Completion
                                </Button>
                                <Button
                                onClick={() => {
                                    setCompletedActivities(prev => ({
                                      ...prev,
                                      [hw.id]: { text: completionAnswers[hw.id], attempted: true }
                                    }));
                                    // Mark as not editing when saving
                                    setEditingHomework(prev => ({
                                      ...prev,
                                      [hw.id]: false
                                    }));
                                    toast.success('Written work saved! You can now submit.');
                                  }}
                                  className="flex-1 bg-green-600 hover:bg-green-700"
                                  disabled={!completionAnswers[hw.id]?.trim()}
                                >
                                  <FaCheck className="mr-2" /> Save Work
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Submit Button - Only show on Complete tab when attempted */}
                    {!hw.submitted && currentTab === 'complete' && (
                      <div className={`p-4 border-t ${
                        isReadyToSubmit 
                          ? 'bg-gradient-to-r from-green-50 to-blue-50' 
                          : 'bg-gray-50'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {isReadyToSubmit ? (
                              <FaCheck className="text-green-600" />
                            ) : isEditing ? (
                              <FaEdit className="text-orange-500" />
                            ) : (
                              <span className="text-gray-400">🔒</span>
                            )}
                            <span className={`font-medium ${
                              isReadyToSubmit ? 'text-green-800' : isEditing ? 'text-orange-600' : 'text-gray-600'
                            }`}>
                              {isReadyToSubmit ? 'Homework Ready to Submit!' : isEditing ? 'Editing in Progress...' : 'Complete homework first'}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {isReadyToSubmit ? 'Ready to submit (teacher will review)' : isEditing ? 'Finish editing to submit' : 'Attempt required'}
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="comment" className="text-sm font-medium">Comments for Teacher (optional)</Label>
                            <Textarea
                              placeholder="Add any notes or questions for your teacher..."
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              className="mt-1"
                              rows={2}
                            />
                          </div>
                          
                          {/* Only show file upload for non-interactive homework */}
                          {!(hw.type && INTERACTIVE_COMPONENTS[hw.type]) && (
                            <div>
                              <Label htmlFor="file" className="text-sm font-medium">Upload Additional Files (optional)</Label>
                              <Input
                                type="file"
                                accept="image/*,application/pdf,video/*,.doc,.docx,.txt"
                                onChange={handleFileChange}
                                className="mt-1"
                              />
                            </div>
                          )}
                          
                          <Button 
                            onClick={() => {
                              setSelectedHomework(hw);
                              setShowSubmissionDialog(true);
                            }}
                            disabled={uploading || !isReadyToSubmit}
                            className={`w-full font-semibold py-3 transition-all mb-3 ${
                              isReadyToSubmit 
                                ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white cursor-pointer'
                                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            }`}
                          >
                            {uploading ? (
                              <>📤 Submitting... Please wait</>
                            ) : isReadyToSubmit ? (
                              <><FaUpload className="mr-2" /> Submit Homework</>
                            ) : isEditing ? (
                              <>📝 Finish editing first</>
                            ) : (
                              <>🔒 Complete homework first</>
                            )}
                          </Button>
                          
                          {/* Edit Button - Show when homework is attempted and not submitted */}
                          {isAttempted && !hw.submitted && (
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => {
                                  setEditingHomework(prev => ({
                                    ...prev,
                                    [hw.id]: !prev[hw.id]
                                  }));
                                  if (!isEditing) {
                                    // Switch to complete tab when starting to edit
                                    setTab(hw.id, 'complete');
                                    toast.info('You can now edit your work in the Complete tab.');
                                  }
                                }}
                                disabled={hw.submitted}
                                className={`flex-1 font-semibold py-2 transition-all ${
                                  hw.submitted
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : isEditing 
                                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                }`}
                              >
                                {hw.submitted ? (
                                  <><FaCheck className="mr-2" /> Submitted</>
                                ) : isEditing ? (
                                  <><FaCheck className="mr-2" /> Finish Editing</>
                                ) : (
                                  <><FaEdit className="mr-2" /> Edit Work</>
                                )}
                              </Button>
                              
                              {/* Submitted Status Button */}
                              {hw.submitted && (
                                <Button 
                                  disabled
                                  className="flex-1 bg-green-500 text-white cursor-not-allowed font-semibold py-2"
                                >
                                  <FaCheck className="mr-2" /> Submitted
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Show submission status if already submitted */}
                    {hw.submitted && (
                      <div className="p-4 bg-green-50 border-t border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <FaCheck className="text-green-600" />
                          <span className="font-medium text-green-800">Homework Submitted Successfully!</span>
                        </div>
                        {hw.file_url && (
                          <div className="flex gap-2 mt-3">
                            <a href={hw.file_url} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="outline">
                                <FaEye className="mr-2" /> View Submission
                              </Button>
                            </a>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteSubmission(hw)}
                            >
                              <FaTrash className="mr-2" /> Delete Submission
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
        
        {/* Submission Confirmation Dialog */}
        <Dialog open={showSubmissionDialog} onOpenChange={setShowSubmissionDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Homework Submission</DialogTitle>
              <DialogDescription>
                Please review your submission before confirming.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">📋 Submitting:</h4>
                <div className="flex items-center gap-2">
                  <input 
                    type="radio" 
                    id="selected-homework" 
                    checked 
                    readOnly 
                    className="text-blue-600"
                  />
                  <label htmlFor="selected-homework" className="text-sm font-medium text-blue-700">
                    {selectedHomework?.title}
                  </label>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Due: {selectedHomework?.due_date ? new Date(selectedHomework.due_date).toLocaleDateString() : 'No due date'}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="final-comment">Final Comments (optional)</Label>
                <Textarea
                  id="final-comment"
                  placeholder="Any final notes for your teacher..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowSubmissionDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    handleSubmitWork();
                    setShowSubmissionDialog(false);
                  }}
                  disabled={uploading}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {uploading ? 'Submitting...' : 'Confirm Submit'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default HomeworkList;
