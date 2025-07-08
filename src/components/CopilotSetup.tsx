
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Check, X, Edit, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CopilotSetup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [workLocation, setWorkLocation] = useState('remote');
  const [locationDetails, setLocationDetails] = useState('Worldwide');
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [tempLocation, setTempLocation] = useState('Worldwide');
  const [jobTypes, setJobTypes] = useState(['fulltime']);
  const [jobTitles, setJobTitles] = useState(['Software Developer']);
  const [newJobTitle, setNewJobTitle] = useState('');

  const handleJobTypeToggle = (type: string) => {
    setJobTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleLocationEdit = () => {
    setIsEditingLocation(true);
    setTempLocation(locationDetails);
  };

  const handleLocationSave = () => {
    setLocationDetails(tempLocation);
    setIsEditingLocation(false);
  };

  const handleLocationCancel = () => {
    setTempLocation(locationDetails);
    setIsEditingLocation(false);
  };

  const handleRemoveLocation = () => {
    setLocationDetails('');
  };

  const handleAddJobTitle = () => {
    if (newJobTitle.trim() && jobTitles.length < 5 && !jobTitles.includes(newJobTitle.trim())) {
      setJobTitles(prev => [...prev, newJobTitle.trim()]);
      setNewJobTitle('');
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

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button 
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CJ</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">JobCopilot</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center pb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Copilot Configuration
            </h1>
            <p className="text-gray-600 mt-2">Step {currentStep} of 4</p>
            <p className="text-gray-700 mt-4">
              First, select the Work Location and Jobs you are looking for
            </p>
          </div>

          <div className="space-y-8">
            {/* Work Location Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Work Location</h3>
              <p className="text-gray-600 text-sm mb-4">
                Are you looking for jobs that are remote, have a physical location, or both?
              </p>
              
              <RadioGroup value={workLocation} onValueChange={setWorkLocation} className="space-y-3">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="remote" id="remote" />
                  <label htmlFor="remote" className="flex items-center space-x-2 cursor-pointer">
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-900 font-medium">Remote Jobs</span>
                  </label>
                </div>
                
                {workLocation === 'remote' && (
                  <div className="ml-9 flex items-center space-x-2">
                    {!isEditingLocation ? (
                      <>
                        {locationDetails && (
                          <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                            <span>{locationDetails}</span>
                            <X 
                              className="w-3 h-3 cursor-pointer hover:text-purple-900" 
                              onClick={handleRemoveLocation}
                            />
                          </div>
                        )}
                        <Edit 
                          className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" 
                          onClick={handleLocationEdit}
                        />
                      </>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Input
                          value={tempLocation}
                          onChange={(e) => setTempLocation(e.target.value)}
                          placeholder="Enter location..."
                          className="w-48"
                          autoFocus
                        />
                        <Button 
                          size="sm" 
                          onClick={handleLocationSave}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Save
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={handleLocationCancel}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="onsite" id="onsite" />
                  <label htmlFor="onsite" className="flex items-center space-x-2 cursor-pointer">
                    <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                    <span className="text-gray-700">On-site Jobs / Hybrid</span>
                  </label>
                </div>
              </RadioGroup>
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
            </div>

            {/* Job Titles Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Job Titles</h3>
              <p className="text-gray-600 text-sm mb-4">
                What job titles are you looking for? Type in and select up to 5
              </p>
              
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
              
              <div className="flex space-x-2 mb-4">
                <Input 
                  placeholder="Type job title..."
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  onKeyPress={handleJobTitleKeyPress}
                  disabled={jobTitles.length >= 5}
                  className="flex-1"
                />
                <Button 
                  onClick={handleAddJobTitle}
                  disabled={!newJobTitle.trim() || jobTitles.length >= 5 || jobTitles.includes(newJobTitle.trim())}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Add
                </Button>
              </div>
              
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
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-between pt-8 border-t mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              className="px-6 py-2"
            >
              Save & Close
            </Button>
            <Button
              onClick={handleNext}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
              disabled={jobTypes.length === 0}
            >
              Next: Optional Filters
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CopilotSetup;
