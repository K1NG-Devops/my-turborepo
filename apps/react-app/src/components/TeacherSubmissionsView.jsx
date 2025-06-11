import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FaEye, FaDownload, FaUser, FaClock, FaCheckCircle, FaTimesCircle, FaFileAlt } from 'react-icons/fa';
import { toast } from 'sonner';

const TeacherSubmissionsView = ({ homeworkId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [homework, setHomework] = useState(null);
  const [studentsWithStatus, setStudentsWithStatus] = useState([]);
  const [stats, setStats] = useState({ total: 0, submitted: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (homeworkId) {
      fetchSubmissions();
    }
  }, [homeworkId]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://youngeagles-api-server.up.railway.app/api/homeworks/${homeworkId}/submissions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { homework, submissions, studentsWithStatus, totalStudents, submittedCount, pendingCount } = response.data;
      
      setHomework(homework);
      setSubmissions(submissions);
      setStudentsWithStatus(studentsWithStatus);
      setStats({
        total: totalStudents,
        submitted: submittedCount,
        pending: pendingCount
      });
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading submissions...</span>
      </div>
    );
  }

  if (!homework) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No homework found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mobile-container">
      {/* Homework Info Header */}
      <Card className="mobile-card">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardTitle className="mobile-heading">{homework.title}</CardTitle>
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant="secondary" className="bg-white/20 text-white">
              Class: {homework.class_name}
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white">
              Due: {formatDate(homework.due_date)}
            </Badge>
            {homework.type && (
              <Badge variant="secondary" className="bg-white/20 text-white">
                Type: {homework.type}
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="mobile-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Students</div>
          </CardContent>
        </Card>
        <Card className="mobile-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.submitted}</div>
            <div className="text-sm text-gray-600">Submitted</div>
          </CardContent>
        </Card>
        <Card className="mobile-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
      </div>

      {/* Students List with Submission Status */}
      <Card className="mobile-card">
        <CardHeader>
          <CardTitle className="mobile-subheading">Student Submission Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {studentsWithStatus.map((student) => (
              <div
                key={student.id}
                className={`p-4 rounded-lg border transition-all ${
                  student.hasSubmitted 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      student.hasSubmitted ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="font-medium mobile-body">
                        {student.first_name} {student.last_name}
                      </p>
                      <p className="text-sm text-gray-600 mobile-caption">
                        Class: {student.className}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {student.hasSubmitted ? (
                      <>
                        <Badge className="bg-green-100 text-green-800">
                          <FaCheckCircle className="mr-1" />
                          Submitted
                        </Badge>
                        {student.submission && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedSubmission(student.submission)}
                            className="touch-target"
                          >
                            <FaEye className="mr-1" />
                            View
                          </Button>
                        )}
                      </>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">
                        <FaTimesCircle className="mr-1" />
                        Not Submitted
                      </Badge>
                    )}
                  </div>
                </div>
                
                {student.submission && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Submitted:</span>
                        <p className="text-gray-600">
                          {formatDate(student.submission.submitted_at)}
                        </p>
                      </div>
                      {student.submission.completion_answer && (
                        <div>
                          <span className="font-medium">Answer:</span>
                          <p className="text-gray-600 truncate">
                            {student.submission.completion_answer.substring(0, 50)}...
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {student.submission.file_url && (
                      <div className="mt-2">
                        <a
                          href={student.submission.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <FaFileAlt className="mr-1" />
                          View Submitted File
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Submission View Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Submission Details</h3>
                <Button
                  variant="outline"
                  onClick={() => setSelectedSubmission(null)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="font-medium">Student:</label>
                  <p>{selectedSubmission.student_name} {selectedSubmission.student_last_name}</p>
                </div>
                
                <div>
                  <label className="font-medium">Submitted At:</label>
                  <p>{formatDate(selectedSubmission.submitted_at)}</p>
                </div>
                
                {selectedSubmission.completion_answer && (
                  <div>
                    <label className="font-medium">Answer/Work:</label>
                    <div className="mt-2 p-3 bg-gray-50 rounded border">
                      <pre className="whitespace-pre-wrap">
                        {selectedSubmission.completion_answer}
                      </pre>
                    </div>
                  </div>
                )}
                
                {selectedSubmission.comment && (
                  <div>
                    <label className="font-medium">Student Comment:</label>
                    <p className="mt-1 p-3 bg-blue-50 rounded border">
                      {selectedSubmission.comment}
                    </p>
                  </div>
                )}
                
                {selectedSubmission.file_url && (
                  <div>
                    <label className="font-medium">Submitted File:</label>
                    <div className="mt-2">
                      <a
                        href={selectedSubmission.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        <FaDownload className="mr-2" />
                        Download File
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherSubmissionsView;

