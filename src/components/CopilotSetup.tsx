
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Check, X, Edit, ArrowLeft, Settings, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { LocationSelectionDialog } from './LocationSelectionDialog';
import LoadingScreen from './LoadingScreen';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Famous job titles for suggestions
const POPULAR_JOB_TITLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Product Manager",
  "Data Scientist",
  "UX Designer",
  "UI Designer",
  "DevOps Engineer",
  "Marketing Manager",
  "Sales Manager",
  "Business Analyst",
  "Project Manager",
  "Scrum Master",
  "Quality Assurance Engineer",
  "Mobile Developer",
  "React Developer",
  "Python Developer",
  "Java Developer",
  "JavaScript Developer",
  "Machine Learning Engineer",
  "Cloud Engineer",
  "Security Engineer",
  "Database Administrator",
  "System Administrator",
  "Network Engineer",
  "Technical Writer",
  "Content Manager",
  "Digital Marketing Specialist",
  "SEO Specialist",
  "Social Media Manager",
  "Graphic Designer",
  "Web Designer",
  "Solutions Architect",
  "Team Lead",
  "Engineering Manager",
  "HR Manager",
  "Recruiter",
  "Financial Analyst",
  "Accountant",
  "Operations Manager",
  "Customer Success Manager",
  "Sales Representative",
  "Account Manager",
  "Technical Support",
  "IT Support",
  "Consultant",
  "Data Analyst",
  "Research Scientist",
  "Product Designer"
];

const CopilotSetup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [workLocationTypes, setWorkLocationTypes] = useState<string[]>([]);
  const [remoteLocations, setRemoteLocations] = useState<string[]>([]);
  const [onsiteLocations, setOnsiteLocations] = useState<string[]>([]);
  const [currentLocationDialogType, setCurrentLocationDialogType] = useState<'remote' | 'onsite'>('remote');
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [isJobTitlePopoverOpen, setIsJobTitlePopoverOpen] = useState(false);
  
  // Form validation states
  const [errors, setErrors] = useState({
    workLocation: false,
    jobTypes: false,
    jobTitles: false,
    locations: false
  });

  const handleJobTypeToggle = (type: string) => {
    setJobTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
    setErrors(prev => ({ ...prev, jobTypes: false }));
  };

  const handleAddJobTitle = (title?: string) => {
    const titleToAdd = title || newJobTitle.trim();
    if (titleToAdd && jobTitles.length < 5 && !jobTitles.includes(titleToAdd)) {
      setJobTitles(prev => [...prev, titleToAdd]);
      setNewJobTitle('');
      setIsJobTitlePopoverOpen(false);
      setErrors(prev => ({ ...prev, jobTitles: false }));
    }
  };

  const handleRemoveJobTitle = (titleToRemove: string) => {
    setJobTitles(prev => prev.filter(title => title !== titleToRemove));
  };

  const handleJobTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddJobTitle();
    }
  };

  const handleLocationSave = (locations: string[]) => {
    if (currentLocationDialogType === 'remote') {
      setRemoteLocations(locations);
    } else {
      setOnsiteLocations(locations);
    }
    setErrors(prev => ({ ...prev, locations: false }));
    setIsLocationDialogOpen(false);
  };

  const handleWorkLocationTypeToggle = (type: 'remote' | 'onsite', checked: boolean) => {
    if (checked) {
      setWorkLocationTypes(prev => [...prev, type]);
    } else {
      setWorkLocationTypes(prev => prev.filter(t => t !== type));
      // Clear specific locations when unchecking a type
      if (type === 'remote') {
        setRemoteLocations([]);
      } else {
        setOnsiteLocations([]);
      }
    }
    setErrors(prev => ({ ...prev, workLocation: false }));
  };

  const validateForm = () => {
    const newErrors = {
      workLocation: workLocationTypes.length === 0,
      jobTypes: jobTypes.length === 0,
      jobTitles: jobTitles.length === 0,
      locations: workLocationTypes.length > 0 && 
        ((workLocationTypes.includes('remote') && remoteLocations.length === 0) ||
         (workLocationTypes.includes('onsite') && onsiteLocations.length === 0))
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleNext = () => {
    if (validateForm()) {
      setIsLoading(true);
      
      // Simulate loading time
      setTimeout(() => {
        setIsLoading(false);
        if (currentStep < 4) {
          setCurrentStep(currentStep + 1);
          // Navigate to filters page
          navigate('/copilot-filters');
        }
      }, 2000); // 2 second loading screen
    }
  };

  const handleBack = () => {
    navigate('/home');
  };

  // Show loading screen when transitioning
  if (isLoading) {
    return <LoadingScreen message="Processing your preferences..." />;
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-purple-50 overflow-hidden">
      {/* Header - Same as Home page */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CJ</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">JobCopilot</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-2 text-purple-600 font-medium">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xs">◯</span>
              </div>
              <span>Copilot</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer">
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-gray-600 text-xs">📋</span>
              </div>
              <span>Applications</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer">
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-gray-600 text-xs">🔧</span>
              </div>
              <span>Tools</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer">
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-gray-600 text-xs">❓</span>
              </div>
              <span>Support</span>
            </div>
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            <Settings className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
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
            {/* Header - Fixed */}
            <div className="flex-shrink-0 p-8 pb-4">
              <div className="text-center">
                <h1 className="text-lg font-semibold text-gray-900">
                  Copilot Configuration
                </h1>
                <p className="text-gray-600 mt-2">Step {currentStep} of 4</p>
                <p className="text-gray-700 mt-4">
                  First, select the Work Location and Jobs you are looking for
                </p>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-8">
              <div className="space-y-8 pb-4">
                {/* Work Location Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Work Location</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Are you looking for jobs that are remote, have a physical location, or both?
                  </p>
                  
                  {/* Work Location Type Selection */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="remote"
                        checked={workLocationTypes.includes('remote')}
                        onChange={(e) => handleWorkLocationTypeToggle('remote', e.target.checked)}
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <label htmlFor="remote" className="text-sm font-medium text-gray-900">
                        Remote Jobs
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="onsite"
                        checked={workLocationTypes.includes('onsite')}
                        onChange={(e) => handleWorkLocationTypeToggle('onsite', e.target.checked)}
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <label htmlFor="onsite" className="text-sm font-medium text-gray-900">
                        On-site Jobs / Hybrid
                      </label>
                    </div>
                  </div>
                  
                  {errors.workLocation && (
                    <p className="text-red-500 text-sm mt-2">Please select at least one work location type.</p>
                  )}
                  
                  {/* Location Selection - Show for selected work location types */}
                  {workLocationTypes.length > 0 && (
                    <div className="mt-4 space-y-4">
                      {errors.locations && (
                        <p className="text-red-500 text-sm">Please select locations for your chosen work types.</p>
                      )}
                      
                      {/* Remote locations section */}
                      {workLocationTypes.includes('remote') && (
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <h4 className="font-medium text-gray-900 mb-3">Remote Job Locations</h4>
                          <div className="flex items-center space-x-3 mb-4">
                            <Button
                              variant={remoteLocations.includes('Worldwide') ? 'default' : 'outline'}
                              onClick={() => {
                                if (remoteLocations.includes('Worldwide')) {
                                  setRemoteLocations([]);
                                } else {
                                  setRemoteLocations(['Worldwide']);
                                  setErrors(prev => ({ ...prev, locations: false }));
                                }
                              }}
                              className={`${
                                remoteLocations.includes('Worldwide')
                                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                  : 'text-purple-600 border-purple-300 hover:bg-purple-50'
                              }`}
                            >
                              {remoteLocations.includes('Worldwide') && <Check className="w-4 h-4 mr-2" />}
                              Worldwide
                            </Button>
                            
                            {!remoteLocations.includes('Worldwide') && (
                              <>
                                <span className="text-gray-500 text-sm">or</span>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setCurrentLocationDialogType('remote');
                                    setIsLocationDialogOpen(true);
                                  }}
                                  className="flex items-center space-x-2 text-purple-600 border-purple-300 hover:bg-purple-50"
                                >
                                  <span>Select specific locations</span>
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                          
                          {/* Show selected remote locations */}
                          {remoteLocations.length > 0 && !remoteLocations.includes('Worldwide') && (
                            <div className="flex flex-wrap gap-2">
                              {remoteLocations.map((location, index) => (
                                <div key={index} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                                  <span>{location}</span>
                                  <X 
                                    className="w-3 h-3 cursor-pointer hover:text-purple-900" 
                                    onClick={() => {
                                      setRemoteLocations(prev => prev.filter(loc => loc !== location));
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Onsite locations section */}
                      {workLocationTypes.includes('onsite') && (
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <h4 className="font-medium text-gray-900 mb-3">On-site / Hybrid Job Locations</h4>
                          <div className="flex items-center space-x-3 mb-3">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setCurrentLocationDialogType('onsite');
                                setIsLocationDialogOpen(true);
                              }}
                              className="flex items-center space-x-2 text-purple-600 border-purple-300 hover:bg-purple-50"
                            >
                              <span>Select locations</span>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          {onsiteLocations.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {onsiteLocations.map((location, index) => (
                                <div key={index} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                                  <span>{location}</span>
                                  <X 
                                    className="w-3 h-3 cursor-pointer hover:text-purple-900" 
                                    onClick={() => {
                                      setOnsiteLocations(prev => prev.filter(loc => loc !== location));
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Job Types Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Job Types</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    What job types are you looking for? Select at least one.
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    {[
                      { id: 'fulltime', label: 'Fulltime' },
                      { id: 'parttime', label: 'Part-Time' },
                      { id: 'contractor', label: 'Contractor / Temp' },
                      { id: 'internship', label: 'Internship' }
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => handleJobTypeToggle(type.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors ${
                          jobTypes.includes(type.id)
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {jobTypes.includes(type.id) && (
                          <Check className="w-4 h-4" />
                        )}
                        <span>{type.label}</span>
                      </button>
                    ))}
                  </div>
                  
                  {errors.jobTypes && (
                    <p className="text-red-500 text-sm mt-2">Please select at least one job type.</p>
                  )}
                </div>

                {/* Job Titles Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Job Titles</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    What job titles are you looking for? Type in and select up to 5
                  </p>
                  
                  {jobTitles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {jobTitles.map((title, index) => (
                        <div key={index} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                          <span>{title}</span>
                          <X 
                            className="w-3 h-3 cursor-pointer hover:text-purple-900" 
                            onClick={() => handleRemoveJobTitle(title)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex space-x-2 mb-4">
                    <Popover open={isJobTitlePopoverOpen} onOpenChange={setIsJobTitlePopoverOpen}>
                      <PopoverTrigger asChild>
                        <div className="flex-1">
                          <Input 
                            placeholder="Type job title..."
                            value={newJobTitle}
                            onChange={(e) => {
                              setNewJobTitle(e.target.value);
                              setIsJobTitlePopoverOpen(e.target.value.length > 0);
                            }}
                            onKeyPress={handleJobTitleKeyPress}
                            disabled={jobTitles.length >= 5}
                            className="flex-1"
                            onFocus={() => newJobTitle.length > 0 && setIsJobTitlePopoverOpen(true)}
                          />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput 
                            placeholder="Search job titles..." 
                            value={newJobTitle}
                            onValueChange={setNewJobTitle}
                          />
                          <CommandList>
                            <CommandEmpty>No job titles found.</CommandEmpty>
                            <CommandGroup>
                              {POPULAR_JOB_TITLES
                                .filter(title => 
                                  title.toLowerCase().includes(newJobTitle.toLowerCase()) &&
                                  !jobTitles.includes(title)
                                )
                                .slice(0, 8)
                                .map((title) => (
                                  <CommandItem
                                    key={title}
                                    value={title}
                                    onSelect={(currentValue) => {
                                      handleAddJobTitle(currentValue);
                                    }}
                                  >
                                    {title}
                                  </CommandItem>
                                ))
                              }
                              {newJobTitle.trim() && 
                               !POPULAR_JOB_TITLES.some(title => 
                                 title.toLowerCase() === newJobTitle.toLowerCase()
                               ) &&
                               !jobTitles.includes(newJobTitle.trim()) && (
                                <CommandItem
                                  value={newJobTitle.trim()}
                                  onSelect={(currentValue) => {
                                    handleAddJobTitle(currentValue);
                                  }}
                                >
                                  Add "{newJobTitle.trim()}"
                                </CommandItem>
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <Button 
                      onClick={() => handleAddJobTitle()}
                      disabled={!newJobTitle.trim() || jobTitles.length >= 5 || jobTitles.includes(newJobTitle.trim())}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Add
                    </Button>
                  </div>
                  
                  {errors.jobTitles && (
                    <p className="text-red-500 text-sm mb-4">Please add at least one job title.</p>
                  )}
                  
                  {jobTitles.length > 0 && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <span className="text-yellow-400">💡</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            To ensure you don't miss out on jobs, we recommend adding more job titles. Consider adding synonyms or related job titles.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Buttons - Fixed */}
            <div className="flex-shrink-0 p-8 pt-4">
              <div className="flex justify-between border-t pt-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="px-6 py-2"
                >
                  Save & Close
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 flex items-center space-x-2"
                  disabled={
                    workLocationTypes.length === 0 || 
                    jobTypes.length === 0 || 
                    jobTitles.length === 0 || 
                    (workLocationTypes.includes('remote') && remoteLocations.length === 0) ||
                    (workLocationTypes.includes('onsite') && onsiteLocations.length === 0)
                  }
                >
                  <span>Next: Optional Filters</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Location Selection Dialog */}
      <LocationSelectionDialog
        isOpen={isLocationDialogOpen}
        onClose={() => setIsLocationDialogOpen(false)}
        onSave={handleLocationSave}
        selectedLocations={currentLocationDialogType === 'remote' ? remoteLocations : onsiteLocations}
      />
    </div>
  );
};

export default CopilotSetup;
