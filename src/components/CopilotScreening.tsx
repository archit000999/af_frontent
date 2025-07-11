
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, X, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import LoadingScreen from './LoadingScreen';
import { useCopilotConfig } from '@/hooks/useCopilotConfig';
import { useToast } from '@/hooks/use-toast';

const CopilotScreening = () => {
  const navigate = useNavigate();
  const { config, updateConfig, saveConfig, uploadResume, isLoading: configLoading, isInitialized } = useCopilotConfig();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedIn: '',
    portfolio: '',
    coverLetter: '',
    resumeFile: null as File | null,
    resumeFileName: '',
    resumeFileUrl: ''
  });

  // Initialize form with existing data
  useEffect(() => {
    if (isInitialized && config.screeningData) {
      const screeningData = config.screeningData;
      setFormData({
        firstName: screeningData.firstName || '',
        lastName: screeningData.lastName || '',
        email: screeningData.email || '',
        phone: screeningData.phone || '',
        linkedIn: screeningData.linkedIn || '',
        portfolio: screeningData.portfolio || '',
        coverLetter: screeningData.coverLetter || '',
        resumeFile: null,
        resumeFileName: config.resumeFileName || '',
        resumeFileUrl: config.resumeFileUrl || ''
      });
    }
  }, [isInitialized, config]);

  // Form validation
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    resume: false
  });

  const validateForm = () => {
    const newErrors = {
      firstName: !formData.firstName.trim(),
      lastName: !formData.lastName.trim(),
      email: !formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email),
      phone: !formData.phone.trim(),
      resume: !formData.resumeFileName && !formData.resumeFile
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF or Word document",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      // Upload file to Supabase storage
      const uploadResult = await uploadResume(file);
      
      if (uploadResult) {
        setFormData(prev => ({
          ...prev,
          resumeFile: file,
          resumeFileName: uploadResult.fileName,
          resumeFileUrl: uploadResult.fileUrl
        }));
        
        // Update config with resume info
        updateConfig({
          resumeFileName: uploadResult.fileName,
          resumeFileUrl: uploadResult.fileUrl
        });

        setErrors(prev => ({ ...prev, resume: false }));
        
        toast({
          title: "Success",
          description: "Resume uploaded successfully"
        });
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFormData(prev => ({
      ...prev,
      resumeFile: null,
      resumeFileName: '',
      resumeFileUrl: ''
    }));
    updateConfig({
      resumeFileName: '',
      resumeFileUrl: ''
    });
  };

  const handleNext = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Prepare screening data
      const screeningData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        linkedIn: formData.linkedIn,
        portfolio: formData.portfolio,
        coverLetter: formData.coverLetter
      };

      // Save all data including screening data and resume info
      const success = await saveConfig({
        stepCompleted: 4,
        screeningData,
        resumeFileName: formData.resumeFileName,
        resumeFileUrl: formData.resumeFileUrl
      }, false);

      if (success) {
        setTimeout(() => {
          setIsLoading(false);
          navigate('/copilot-final');
        }, 1500);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error saving screening data:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to save your information. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleBack = () => {
    navigate('/copilot-filters');
  };

  const handleSaveAndClose = async () => {
    // Save current state
    const screeningData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      linkedIn: formData.linkedIn,
      portfolio: formData.portfolio,
      coverLetter: formData.coverLetter
    };

    const success = await saveConfig({
      stepCompleted: 3,
      screeningData,
      resumeFileName: formData.resumeFileName,
      resumeFileUrl: formData.resumeFileUrl
    }, false);
    
    if (success) {
      navigate('/home');
    }
  };

  // Show loading screen when transitioning or loading config
  if (isLoading || configLoading || !isInitialized) {
    return <LoadingScreen message="Processing your information..." />;
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-purple-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AF</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">ApplyFirst</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-2 text-purple-600 font-medium text-sm">
              <span>ApplyFirst</span>
            </div>
            <div 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer text-sm"
              onClick={() => navigate('/applications')}
            >
              <span>Applications</span>
            </div>
          </nav>

          <div className="flex items-center space-x-4">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                }
              }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden px-6 py-6">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="bg-white rounded-lg shadow-lg flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 px-8 pb-2 py-4">
              <div className="text-center">
                <h1 className="text-xl font-semibold text-gray-900">Personal Information & Resume</h1>
                <p className="text-sm text-gray-600 mt-2">Step 3 of 4</p>
                <p className="text-sm text-gray-700 mt-4">
                  Provide your personal information and upload your resume
                </p>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-8">
              <div className="space-y-6 pb-4">
                {/* Personal Information */}
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-4">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={errors.firstName ? 'border-red-500' : ''}
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-500 mt-1">First name is required</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={errors.lastName ? 'border-red-500' : ''}
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-500 mt-1">Last name is required</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={errors.email ? 'border-red-500' : ''}
                        placeholder="Enter your email"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500 mt-1">Valid email is required</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={errors.phone ? 'border-red-500' : ''}
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500 mt-1">Phone number is required</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn Profile
                      </label>
                      <Input
                        value={formData.linkedIn}
                        onChange={(e) => handleInputChange('linkedIn', e.target.value)}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Portfolio/Website
                      </label>
                      <Input
                        value={formData.portfolio}
                        onChange={(e) => handleInputChange('portfolio', e.target.value)}
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Resume Upload */}
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-4">Resume Upload</h3>
                  
                  {!formData.resumeFileName ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        Upload your resume (PDF or Word document)
                      </p>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={isUploading}
                        />
                        <Button 
                          type="button" 
                          variant="outline"
                          disabled={isUploading}
                          className="text-purple-600 border-purple-300 hover:bg-purple-50"
                        >
                          {isUploading ? 'Uploading...' : 'Choose File'}
                        </Button>
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        Maximum file size: 10MB
                      </p>
                    </div>
                  ) : (
                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-6 h-6 text-purple-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {formData.resumeFileName}
                            </p>
                            <p className="text-xs text-gray-500">
                              Resume uploaded successfully
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveFile}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {errors.resume && (
                    <p className="text-sm text-red-500 mt-2">Resume is required</p>
                  )}
                </div>

                {/* Cover Letter */}
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-4">Cover Letter (Optional)</h3>
                  <Textarea
                    value={formData.coverLetter}
                    onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                    placeholder="Write a brief cover letter or introduction about yourself..."
                    className="min-h-[120px]"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    This will be used as a template for your job applications
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex-shrink-0 p-8 pt-4">
              <div className="flex justify-between border-t pt-4">
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="px-6 py-2 text-sm flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSaveAndClose}
                    className="px-6 py-2 text-sm"
                    disabled={configLoading}
                  >
                    Save & Close
                  </Button>
                </div>
                <Button
                  onClick={handleNext}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 flex items-center space-x-2 text-sm"
                  disabled={
                    !formData.firstName || 
                    !formData.lastName || 
                    !formData.email || 
                    !formData.phone || 
                    (!formData.resumeFileName && !formData.resumeFile) ||
                    configLoading ||
                    isUploading
                  }
                >
                  <span>Next: Review & Launch</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CopilotScreening;
