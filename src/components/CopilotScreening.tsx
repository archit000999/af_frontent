import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Settings, ChevronRight, ChevronDown, Upload, HelpCircle, X, Check, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { extractResumeData, ExtractedResumeData } from '@/utils/resumeExtractor';

const CopilotScreening = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedResumeData | null>(null);
  
  // Form states
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvAnalysis, setCvAnalysis] = useState({
    length: false,
    content: false,
    atsOptimized: false
  });
  const [coverLetterOption, setCoverLetterOption] = useState('generate');
  const [customCoverLetter, setCustomCoverLetter] = useState<File | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+1');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [stateRegion, setStateRegion] = useState('');
  const [postCode, setPostCode] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [availability, setAvailability] = useState('');
  const [workCountries, setWorkCountries] = useState<string[]>([]);
  const [sponsorship, setSponsorship] = useState('');
  const [nationality, setNationality] = useState('');
  const [currentSalary, setCurrentSalary] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [linkedinProfile, setLinkedinProfile] = useState('');
  const [showAdditionalQuestions, setShowAdditionalQuestions] = useState(false);

  // Additional screening questions state
  const [experienceSummary, setExperienceSummary] = useState('');
  const [comfortableWithTravelling, setComfortableWithTravelling] = useState('');
  const [openToRelocation, setOpenToRelocation] = useState('');
  const [languagesSpoken, setLanguagesSpoken] = useState<string[]>([]);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gpaScore, setGpaScore] = useState('');
  const [isAtLeast18, setIsAtLeast18] = useState('');
  const [genderIdentity, setGenderIdentity] = useState('');
  const [hasDisability, setHasDisability] = useState('');
  const [drivingLicenses, setDrivingLicenses] = useState<string[]>([]);
  const [securityClearance, setSecurityClearance] = useState('');

  const availabilityOptions = ['Immediately', 'in 1 Week', 'in 2 Weeks', 'in 1 Month', 'in 2 Months'];
  const countries = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Singapore'];
  const currencyCodes = ['$', '₹', '£', '€', '¥'];

  const phoneCountryCodes = [
    { code: '+1', country: 'US/Canada', flag: '🇺🇸' },
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+65', country: 'Singapore', flag: '🇸🇬' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' },
    { code: '+82', country: 'South Korea', flag: '🇰🇷' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
    { code: '+55', country: 'Brazil', flag: '🇧🇷' },
    { code: '+34', country: 'Spain', flag: '🇪🇸' },
    { code: '+39', country: 'Italy', flag: '🇮🇹' },
    { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
    { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
    { code: '+46', country: 'Sweden', flag: '🇸🇪' },
    { code: '+47', country: 'Norway', flag: '🇳🇴' },
    { code: '+45', country: 'Denmark', flag: '🇩🇰' },
    { code: '+358', country: 'Finland', flag: '🇫🇮' },
    { code: '+353', country: 'Ireland', flag: '🇮🇪' },
    { code: '+64', country: 'New Zealand', flag: '🇳🇿' }
  ];

  const languageOptions = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese (Mandarin)',
    'Japanese', 'Korean', 'Arabic', 'Hindi', 'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish',
    'Polish', 'Czech', 'Hungarian', 'Romanian', 'Bulgarian', 'Greek', 'Turkish', 'Hebrew', 'Thai',
    'Vietnamese', 'Indonesian', 'Malay'
  ];

  const genderOptions = [
    'Male', 'Female', 'Non-binary', 'Prefer not to say', 'Other'
  ];

  const drivingLicenseOptions = [
    'Car', 'Motorcycle', 'Commercial (CDL)', 'Bus', 'Truck', 'Taxi/Rideshare'
  ];

  // Resume analysis function with OCR
  const analyzeResume = async (file: File) => {
    setIsAnalyzing(true);
    
    try {
      console.log('Starting resume analysis for:', file.name, 'Type:', file.type);
      
      // Extract text and parse resume data
      const data = await extractResumeData(file);
      console.log('Extracted resume data:', data);
      setExtractedData(data);
      
      // Set analysis badges
      setCvAnalysis({
        length: true,
        content: true,
        atsOptimized: true
      });
      
      // Auto-fill form fields with extracted data
      let fieldsUpdated = 0;
      
      if (data.phone) {
        setPhoneNumber(data.phone);
        fieldsUpdated++;
        console.log('Auto-filled phone:', data.phone);
      }
      
      if (data.phoneCountryCode) {
        setPhoneCountryCode(data.phoneCountryCode);
        fieldsUpdated++;
        console.log('Auto-filled phone country code:', data.phoneCountryCode);
      }
      
      if (data.location?.city) {
        setCity(data.location.city);
        fieldsUpdated++;
        console.log('Auto-filled city:', data.location.city);
      }
      
      if (data.location?.state) {
        setStateRegion(data.location.state);
        fieldsUpdated++;
        console.log('Auto-filled state:', data.location.state);
      }
      
      if (data.location?.zipCode) {
        setPostCode(data.location.zipCode);
        fieldsUpdated++;
        console.log('Auto-filled zip code:', data.location.zipCode);
      }
      
      if (data.location?.country) {
        // Map country to our country list
        const countryMapping: { [key: string]: string } = {
          'united states': 'United States',
          'united kingdom': 'United Kingdom',
          'india': 'India',
          'canada': 'Canada',
          'australia': 'Australia',
          'germany': 'Germany',
          'france': 'France',
          'singapore': 'Singapore'
        };
        const mappedCountry = countryMapping[data.location.country.toLowerCase()];
        if (mappedCountry && countries.includes(mappedCountry)) {
          setCountry(mappedCountry);
          fieldsUpdated++;
          console.log('Auto-filled country:', mappedCountry);
        }
      }
      
      if (data.jobTitle) {
        setJobTitle(data.jobTitle);
        fieldsUpdated++;
        console.log('Auto-filled job title:', data.jobTitle);
      }
      
      if (data.linkedin) {
        setLinkedinProfile(data.linkedin);
        fieldsUpdated++;
        console.log('Auto-filled LinkedIn:', data.linkedin);
      }
      
      if (data.salary) {
        // Set both current and expected salary if only one is found
        setCurrentSalary(data.salary);
        setExpectedSalary(data.salary);
        fieldsUpdated += 2;
        console.log('Auto-filled salary:', data.salary);
      }
      
      if (data.location?.country) {
        setNationality(data.location.country);
        setWorkCountries([data.location.country]);
        fieldsUpdated += 2;
        console.log('Auto-filled nationality and work countries:', data.location.country);
      }
      
      // Set some defaults based on extracted data
      if (!availability) {
        setAvailability('in 2 Weeks');
        fieldsUpdated++;
        console.log('Set default availability: in 2 Weeks');
      }
      
      if (!sponsorship) {
        setSponsorship('No');
        fieldsUpdated++;
        console.log('Set default sponsorship: No');
      }
      
      console.log(`Successfully auto-filled ${fieldsUpdated} fields from resume`);
      
    } catch (error) {
      console.error('Error analyzing resume:', error);
      // Still set basic analysis if extraction fails
      setCvAnalysis({
        length: true,
        content: true,
        atsOptimized: false
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'cv' | 'coverLetter') => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'cv') {
        setCvFile(file);
        analyzeResume(file);
      } else {
        setCustomCoverLetter(file);
      }
    }
  };

  const handleRemoveFile = (type: 'cv' | 'coverLetter') => {
    if (type === 'cv') {
      setCvFile(null);
      setCvAnalysis({ length: false, content: false, atsOptimized: false });
      setExtractedData(null);
      // Clear auto-filled data
      setPhoneNumber('');
      setPhoneCountryCode('+1');
      setCity('');
      setStateRegion('');
      setPostCode('');
      setCountry('');
      setJobTitle('');
      setLinkedinProfile('');
      setCurrentSalary('');
      setExpectedSalary('');
      setNationality('');
      setWorkCountries([]);
      setAvailability('');
      setSponsorship('');
    } else {
      setCustomCoverLetter(null);
    }
  };

  const handleBack = () => {
    navigate('/copilot-filters');
  };

  const handleSaveAndClose = () => {
    navigate('/home');
  };

  const handleNext = () => {
    setIsLoading(true);
    // Simulate processing time
    setTimeout(() => {
      setIsLoading(false);
      navigate('/copilot-final-step');
    }, 1500);
  };

  // Check if form is valid
  const isFormValid = () => {
    return cvFile && 
           phoneNumber && 
           country && 
           city && 
           jobTitle && 
           availability && 
           workCountries.length > 0 && 
           sponsorship && 
           nationality && 
           currentSalary && 
           expectedSalary;
  };

  // Get required fields status for better UX
  const getRequiredFieldsStatus = () => {
    const fields = [
      { name: 'CV/Resume', completed: !!cvFile, label: 'Upload your CV/Resume' },
      { name: 'Phone Number', completed: !!phoneNumber, label: 'Enter your phone number' },
      { name: 'Country', completed: !!country, label: 'Select your country' },
      { name: 'City', completed: !!city, label: 'Enter your city' },
      { name: 'Job Title', completed: !!jobTitle, label: 'Enter your job title' },
      { name: 'Availability', completed: !!availability, label: 'Select your availability' },
      { name: 'Work Countries', completed: workCountries.length > 0, label: 'Select work countries' },
      { name: 'Sponsorship', completed: !!sponsorship, label: 'Select sponsorship status' },
      { name: 'Nationality', completed: !!nationality, label: 'Enter your nationality' },
      { name: 'Current Salary', completed: !!currentSalary, label: 'Enter current salary' },
      { name: 'Expected Salary', completed: !!expectedSalary, label: 'Enter expected salary' }
    ];
    
    const completed = fields.filter(field => field.completed).length;
    const total = fields.length;
    const missing = fields.filter(field => !field.completed);
    
    return { fields, completed, total, missing };
  };

  // Helper component for required field indicator
  const RequiredIndicator = () => (
    <span className="text-red-500 ml-1">*</span>
  );

  // Helper component for field validation feedback
  const FieldValidation = ({ isValid, fieldName }: { isValid: boolean; fieldName: string }) => (
    <div className="mt-1 flex items-center text-sm">
      {isValid ? (
        <div className="flex items-center text-green-600">
          <CheckCircle className="w-4 h-4 mr-1" />
          <span>Completed</span>
        </div>
      ) : (
        <div className="flex items-center text-red-600">
          <AlertCircle className="w-4 h-4 mr-1" />
          <span>{fieldName} is required</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-purple-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AF</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">ApplyFirst</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-2 text-purple-600 font-medium">
             
              <span>ApplyFirst</span>
            </div>
            <div 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer"
              onClick={() => navigate('/applications')}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-gray-600 text-xs">📋</span>
              </div>
              <span>Applications</span>
            </div>
           
          </nav>

          {/* User Section */}
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
      <main className="flex-1 overflow-hidden px-6 py-2">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="bg-white rounded-lg shadow-lg flex flex-col h-full overflow-hidden">
            {/* Header - Fixed */}
            <div className="flex-shrink-0 p-8 pb-1">
              <div className="text-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  ApplyFirst Configuration
                </h1>
                <p className="text-gray-600 mt-2 text-sm">Step {currentStep} of 4</p>
                
                <p className="text-gray-600 mt-2 text-sm">
                  Now let's complete screening questions
                </p>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-8">
              <div className="space-y-2 pb-4">
                
                {/* Introduction Text */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 text-sm">
                    In order for your ApplyFirst to answer job application questions on your behalf, 
                    it needs your resume as well as your answers to commonly asked screening questions.
                  </p>
                  {extractedData && (
                    <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                      ✓ Information has been automatically extracted from your resume and pre-filled below. Please review and update as needed.
                    </div>
                  )}
                  {isAnalyzing && (
                    <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing your resume and extracting information...
                    </div>
                  )}
                </div>

                {/* CV/Resume Upload */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      Confirm the CV/Resume you would like to use
                      <RequiredIndicator />
                    </h3>
                    {cvFile && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  
                  {!cvFile ? (
                    <div className="relative">
                      <input
                        type="file"
                        id="cv-upload"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileUpload(e, 'cv')}
                        className="hidden"
                      />
                      <label
                        htmlFor="cv-upload"
                        className="flex items-center justify-center w-full max-w-sm px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <Upload className="w-4 h-4 mr-2 text-gray-600" />
                        <span className="text-gray-700 text-sm">Upload CV in PDF or Word</span>
                      </label>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg max-w-md">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                            <span className="text-blue-600 text-xs">📄</span>
                          </div>
                          <span className="text-gray-900 font-medium text-sm">{cvFile.name}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveFile('cv')}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge 
                          variant={cvAnalysis.length ? "default" : "secondary"}
                          className={cvAnalysis.length ? "bg-green-100 text-green-800" : ""}
                        >
                          {cvAnalysis.length && <Check className="w-3 h-3 mr-1" />}
                          {isAnalyzing ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : null}
                          Length: {isAnalyzing ? 'Analyzing...' : 'Good'}
                        </Badge>
                        <Badge 
                          variant={cvAnalysis.content ? "default" : "secondary"}
                          className={cvAnalysis.content ? "bg-green-100 text-green-800" : ""}
                        >
                          {cvAnalysis.content && <Check className="w-3 h-3 mr-1" />}
                          {isAnalyzing ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : null}
                          Content: {isAnalyzing ? 'Analyzing...' : 'Good'}
                        </Badge>
                        <Badge 
                          variant={cvAnalysis.atsOptimized ? "default" : "secondary"}
                          className={cvAnalysis.atsOptimized ? "bg-green-100 text-green-800" : ""}
                        >
                          {cvAnalysis.atsOptimized && <Check className="w-3 h-3 mr-1" />}
                          {isAnalyzing ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : null}
                          ATS-friendly: {isAnalyzing ? 'Analyzing...' : 'Good'}
                        </Badge>
                      </div>
                    </div>
                  )}
                  <FieldValidation isValid={!!cvFile} fieldName="CV/Resume" />
                </div>

                {/* Cover Letter */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Cover Letter</h3>
                  <div className='flex items-center space-x-6 mb-3'>
                  <div className="flex space-x-2 ">
                    <button
                      onClick={() => setCoverLetterOption('generate')}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-colors ${
                        coverLetterOption === 'generate'
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                     
                      <span className="text-sm px-2">Automatically generate cover letter (recommended)</span>
                    </button>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setCoverLetterOption('upload')}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-colors ${
                        coverLetterOption === 'upload'
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                     
                      <span className="text-sm">Upload my own generic Cover Letter</span>
                    </button>
                  </div>
                  </div>

                  {coverLetterOption === 'upload' && (
                    <div className="mt-4">
                      {!customCoverLetter ? (
                        <>
                          <input
                            type="file"
                            id="cover-letter-upload"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileUpload(e, 'coverLetter')}
                            className="hidden"
                          />
                          <label
                            htmlFor="cover-letter-upload"
                            className="flex items-center justify-center w-full max-w-sm px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            <Upload className="w-4 h-4 mr-2 text-gray-600" />
                            <span className="text-gray-700 text-sm">Upload Cover Letter</span>
                          </label>
                        </>
                      ) : (
                        <div className="bg-gray-50 p-3 rounded-lg max-w-sm flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                              <span className="text-blue-600 text-xs">📄</span>
                            </div>
                            <span className="text-gray-900 text-sm">{customCoverLetter.name}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveFile('coverLetter')}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      Please enter your mobile number for employers to contact you
                      <RequiredIndicator />
                    </h3>
                    {extractedData?.phone && phoneNumber && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                        Auto-filled
                      </Badge>
                    )}
                    {phoneNumber && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select value={phoneCountryCode} onValueChange={setPhoneCountryCode}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {phoneCountryCodes.map((item) => (
                          <SelectItem key={item.code} value={item.code}>
                            <div className="flex items-center space-x-2">
                              <span>{item.flag}</span>
                              <span>{item.code}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className={`flex-1 max-w-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm ${
                        phoneNumber ? 'border-green-300 bg-green-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter your mobile number"
                      required
                    />
                  </div>
                  <FieldValidation isValid={!!phoneNumber} fieldName="Phone number" />
                </div>

                {/* Location */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Where are you currently based?
                      <RequiredIndicator />
                    </h3>
                    {extractedData?.location && (city || country) && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                        Auto-filled
                      </Badge>
                    )}
                    {country && city && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country <RequiredIndicator />
                      </label>
                      <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger className={country ? 'border-green-300 bg-green-50' : 'border-gray-300'}>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City <RequiredIndicator />
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Type in your city/town, ex: Chicago"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm ${
                          city ? 'border-green-300 bg-green-50' : 'border-gray-300'
                        }`}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State or Region</label>
                      <input
                        type="text"
                        value={stateRegion}
                        onChange={(e) => setStateRegion(e.target.value)}
                        placeholder="Type in your region/state, ex: California"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Post code</label>
                      <input
                        type="text"
                        value={postCode}
                        onChange={(e) => setPostCode(e.target.value)}
                        placeholder="Post code, ex: NW1 4NP"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                  <FieldValidation isValid={!!(country && city)} fieldName="Location (Country and City)" />
                </div>

                {/* Job Title */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      What is your current (or previous) job title?
                      <RequiredIndicator />
                    </h3>
                    {extractedData?.jobTitle && jobTitle && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                        Auto-filled
                      </Badge>
                    )}
                    {jobTitle && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Enter your current or previous job title"
                    className={`w-full max-w-md px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm ${
                      jobTitle ? 'border-green-300 bg-green-50' : 'border-gray-300'
                    }`}
                    required
                  />
                  <FieldValidation isValid={!!jobTitle} fieldName="Job title" />
                </div>

                {/* Availability */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      What is your availability / notice period?
                      <RequiredIndicator />
                    </h3>
                    {availability && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {availabilityOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => setAvailability(option)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors ${
                          availability === option
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          availability === option ? 'bg-white' : 'bg-gray-400'
                        }`}></div>
                        <span className="text-sm">{option}</span>
                      </button>
                    ))}
                  </div>
                  <FieldValidation isValid={!!availability} fieldName="Availability" />
                </div>

                {/* Work Countries */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      In which countries are you eligible to work in?
                      <RequiredIndicator />
                    </h3>
                    {workCountries.length > 0 && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Note: your ApplyFirst will only apply to jobs in countries where you have the legal right to work in.
                  </p>
                  
                  <Select 
                    value={workCountries[0] || ''} 
                    onValueChange={(value) => setWorkCountries([value])}
                  >
                    <SelectTrigger className={`w-full max-w-sm ${
                      workCountries.length > 0 ? 'bg-green-50 border-green-300' : 'border-gray-300'
                    }`}>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldValidation isValid={workCountries.length > 0} fieldName="Work countries" />
                </div>

                {/* Sponsorship */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Will you now or in the future require sponsorship for an employment visa?
                      <RequiredIndicator />
                    </h3>
                    {sponsorship && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setSponsorship('Yes')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors ${
                        sponsorship === 'Yes'
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        sponsorship === 'Yes' ? 'bg-white' : 'bg-gray-400'
                      }`}></div>
                      <span className="text-sm">Yes</span>
                    </button>
                    
                    <button
                      onClick={() => setSponsorship('No')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors ${
                        sponsorship === 'No'
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        sponsorship === 'No' ? 'bg-white' : 'bg-gray-400'
                      }`}></div>
                      <span className="text-sm">No</span>
                    </button>
                  </div>
                  <FieldValidation isValid={!!sponsorship} fieldName="Sponsorship status" />
                </div>

         

                {/* Salary Information */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        What is your current (or previous) yearly salary?
                        <RequiredIndicator />
                      </h3>
                      
                      {extractedData?.salary && currentSalary && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                          Auto-filled
                        </Badge>
                      )}
                      {currentSalary && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600 px-3 py-1.5 border border-gray-300 rounded-lg bg-gray-50">
                        $
                      </span>
                      <input
                        type="text"
                        value={currentSalary}
                        onChange={(e) => setCurrentSalary(e.target.value)}
                        className={`flex-1 max-w-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm ${
                          currentSalary ? 'border-green-300 bg-green-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter current salary"
                        required
                      />
                    </div>
                    <FieldValidation isValid={!!currentSalary} fieldName="Current salary" />
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        What is your expected yearly salary for a fulltime position?
                        <RequiredIndicator />
                      </h3>
                      
                      {extractedData?.salary && expectedSalary && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                          Auto-filled
                        </Badge>
                      )}
                      {expectedSalary && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600 px-3 py-1.5 border border-gray-300 rounded-lg bg-gray-50">
                        $
                      </span>
                      <input
                        type="text"
                        value={expectedSalary}
                        onChange={(e) => setExpectedSalary(e.target.value)}
                        className={`flex-1 max-w-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm ${
                          expectedSalary ? 'border-green-300 bg-green-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter expected salary"
                        required
                      />
                    </div>
                    <FieldValidation isValid={!!expectedSalary} fieldName="Expected salary" />
                  </div>
                </div>

                {/* LinkedIn Profile */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      Enter your LinkedIn profile link (if you have one)
                    </h3>
                    {extractedData?.linkedin && linkedinProfile && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                        Auto-filled
                      </Badge>
                    )}
                  </div>
                  <input
                    type="url"
                    value={linkedinProfile}
                    onChange={(e) => setLinkedinProfile(e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full max-w-lg px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Additional Screening Questions */}
                <div>
                  <button
                    onClick={() => setShowAdditionalQuestions(!showAdditionalQuestions)}
                    className="flex items-center space-x-2 text-gray-900 font-medium hover:text-purple-600 transition-colors text-sm"
                  >
                    <span>Additional Screening Questions</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showAdditionalQuestions ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showAdditionalQuestions && (
                    <div className="mt-6 space-y-6">
                      <div className="p-4 border rounded-lg bg-gray-50">
                        <p className="text-gray-600 text-sm mb-2">
                          These questions are less often asked on job applications or sometimes optional.
                        </p>
                        <p className="text-gray-600 text-sm">
                          We still recommend you answer them to make your applications more complete.
                        </p>
                      </div>

                      {/* Experience Summary */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Experience Summary</h3>
                        <textarea
                          value={experienceSummary}
                          onChange={(e) => setExperienceSummary(e.target.value)}
                          placeholder="Please ensure the summary is at least 100 characters in length"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                          rows={4}
                          maxLength={500}
                        />
                        <div className="text-right text-sm text-gray-500 mt-1">
                          {experienceSummary.length}/500
                        </div>
                      </div>

                      {/* Are you comfortable with travelling? */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Are you comfortable with travelling?</h3>
                        <div className="flex space-x-4">
                          <button
                            onClick={() => setComfortableWithTravelling('Yes')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors ${
                              comfortableWithTravelling === 'Yes'
                                ? 'bg-purple-600 text-white border-purple-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${
                              comfortableWithTravelling === 'Yes' ? 'bg-white' : 'bg-gray-400'
                            }`}></div>
                            <span className="text-sm">Yes</span>
                          </button>
                          
                          <button
                            onClick={() => setComfortableWithTravelling('No')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors ${
                              comfortableWithTravelling === 'No'
                                ? 'bg-purple-600 text-white border-purple-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${
                              comfortableWithTravelling === 'No' ? 'bg-white' : 'bg-gray-400'
                            }`}></div>
                            <span className="text-sm">No</span>
                          </button>
                        </div>
                      </div>

                      {/* Are you open to relocation? */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Are you open to relocation?</h3>
                        <div className="flex space-x-4">
                          <button
                            onClick={() => setOpenToRelocation('Yes')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors ${
                              openToRelocation === 'Yes'
                                ? 'bg-purple-600 text-white border-purple-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${
                              openToRelocation === 'Yes' ? 'bg-white' : 'bg-gray-400'
                            }`}></div>
                            <span className="text-sm">Yes</span>
                          </button>
                          
                          <button
                            onClick={() => setOpenToRelocation('No')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors ${
                              openToRelocation === 'No'
                                ? 'bg-purple-600 text-white border-purple-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${
                              openToRelocation === 'No' ? 'bg-white' : 'bg-gray-400'
                            }`}></div>
                            <span className="text-sm">No</span>
                          </button>
                        </div>
                      </div>

                      {/* Which languages do you speak fluently? */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Which languages do you speak fluently?</h3>
                        <p className="text-gray-600 text-sm mb-3">You can select up to 5</p>
                        <Select 
                          value={languagesSpoken[0] || ''} 
                          onValueChange={(value) => {
                            if (value && !languagesSpoken.includes(value) && languagesSpoken.length < 5) {
                              setLanguagesSpoken([...languagesSpoken, value]);
                            }
                          }}
                        >
                          <SelectTrigger className="w-full max-w-sm">
                            <SelectValue placeholder="Select languages" />
                          </SelectTrigger>
                          <SelectContent>
                            {languageOptions.map((lang) => (
                              <SelectItem key={lang} value={lang} disabled={languagesSpoken.includes(lang)}>
                                {lang}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {languagesSpoken.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {languagesSpoken.map((lang) => (
                              <span
                                key={lang}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                              >
                                {lang}
                                <button
                                  onClick={() => setLanguagesSpoken(languagesSpoken.filter(l => l !== lang))}
                                  className="ml-2 text-purple-600 hover:text-purple-800"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* What is your date of birth? */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">What is your date of birth?</h3>
                        <input
                          type="date"
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                        />
                      </div>

                      {/* What is your latest GPA score? */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">What is your latest GPA score?</h3>
                        <p className="text-gray-600 text-sm mb-3">This is mainly used in the US and Canada</p>
                        <input
                          type="text"
                          value={gpaScore}
                          onChange={(e) => setGpaScore(e.target.value)}
                          placeholder="e.g., 3.8"
                          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                        />
                      </div>

                      {/* Are you at least 18 years of age? */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Are you at least 18 years of age?</h3>
                        <div className="flex space-x-4">
                          <button
                            onClick={() => setIsAtLeast18('Yes')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors ${
                              isAtLeast18 === 'Yes'
                                ? 'bg-purple-600 text-white border-purple-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${
                              isAtLeast18 === 'Yes' ? 'bg-white' : 'bg-gray-400'
                            }`}></div>
                            <span className="text-sm">Yes</span>
                          </button>
                          
                          <button
                            onClick={() => setIsAtLeast18('No')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors ${
                              isAtLeast18 === 'No'
                                ? 'bg-purple-600 text-white border-purple-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${
                              isAtLeast18 === 'No' ? 'bg-white' : 'bg-gray-400'
                            }`}></div>
                            <span className="text-sm">No</span>
                          </button>
                        </div>
                      </div>

                      {/* How would you describe your gender identity? */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">How would you describe your gender identity?</h3>
                        <Select value={genderIdentity} onValueChange={setGenderIdentity}>
                          <SelectTrigger className="w-full max-w-sm">
                            <SelectValue placeholder="Select gender identity" />
                          </SelectTrigger>
                          <SelectContent>
                            {genderOptions.map((gender) => (
                              <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Do you consider yourself a person with a disability? */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Do you consider yourself a person with a disability?</h3>
                        <div className="flex space-x-4">
                          <button
                            onClick={() => setHasDisability('Yes')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors ${
                              hasDisability === 'Yes'
                                ? 'bg-purple-600 text-white border-purple-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${
                              hasDisability === 'Yes' ? 'bg-white' : 'bg-gray-400'
                            }`}></div>
                            <span className="text-sm">Yes</span>
                          </button>
                          
                          <button
                            onClick={() => setHasDisability('No')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors ${
                              hasDisability === 'No'
                                ? 'bg-purple-600 text-white border-purple-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${
                              hasDisability === 'No' ? 'bg-white' : 'bg-gray-400'
                            }`}></div>
                            <span className="text-sm">No</span>
                          </button>

                          <button
                            onClick={() => setHasDisability('Prefer not to say')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors ${
                              hasDisability === 'Prefer not to say'
                                ? 'bg-purple-600 text-white border-purple-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${
                              hasDisability === 'Prefer not to say' ? 'bg-white' : 'bg-gray-400'
                            }`}></div>
                            <span className="text-sm">Prefer not to say</span>
                          </button>
                        </div>
                      </div>

                      {/* Which driving licenses do you have? */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Which driving licenses do you have?</h3>
                        <div className="space-y-3">
                          {drivingLicenseOptions.map((license) => (
                            <label key={license} className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={drivingLicenses.includes(license)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setDrivingLicenses([...drivingLicenses, license]);
                                  } else {
                                    setDrivingLicenses(drivingLicenses.filter(l => l !== license));
                                  }
                                }}
                                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                              />
                              <span className="text-sm text-gray-700">{license}</span>
                            </label>
                          ))}
                          <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={drivingLicenses.includes('None')}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setDrivingLicenses(['None']);
                                } else {
                                  setDrivingLicenses([]);
                                }
                              }}
                              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700">I do not have a driving license</span>
                          </label>
                        </div>
                      </div>

                      {/* Enter any Security Clearance information */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Enter any Security Clearance information</h3>
                        <input
                          type="text"
                          value={securityClearance}
                          onChange={(e) => setSecurityClearance(e.target.value)}
                          placeholder="Enter security clearance level if applicable"
                          className="w-full max-w-lg px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Progress and Requirements Summary */}
            <div className="flex-shrink-0 px-8 py-4 bg-gray-50 border-t">
              {(() => {
                const status = getRequiredFieldsStatus();
                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">Form Progress:</span>
                        <span className="text-sm text-purple-600 font-semibold">
                          {status.completed} of {status.total} required fields completed
                        </span>
                      </div>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(status.completed / status.total) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    {status.missing.length > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-amber-800">
                              Please complete the following required fields:
                            </p>
                            <ul className="text-xs text-amber-700 space-y-0.5">
                              {status.missing.slice(0, 3).map((field, index) => (
                                <li key={index}>• {field.label}</li>
                              ))}
                              {status.missing.length > 3 && (
                                <li>• And {status.missing.length - 3} more...</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Footer Buttons - Fixed */}
            <div className="flex-shrink-0 p-8 pt-4">
              <div className="flex justify-between border-t pt-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="px-6 py-2 text-sm"
                >
                  Back
                </Button>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleSaveAndClose}
                    className="px-6 py-2 text-sm"
                  >
                    Save & Close
                  </Button>
                  <div className="relative">
                    <Button
                      onClick={handleNext}
                      disabled={!isFormValid() || isLoading}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 flex items-center space-x-2 disabled:opacity-50 text-sm"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span>Next: Final Configuration</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CopilotScreening;
