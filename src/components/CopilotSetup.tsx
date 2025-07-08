
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Check, X, Edit } from 'lucide-react';

interface CopilotSetupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CopilotSetup = ({ open, onOpenChange }: CopilotSetupProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [workLocation, setWorkLocation] = useState('remote');
  const [locationDetails, setLocationDetails] = useState('Worldwide');
  const [jobTypes, setJobTypes] = useState(['fulltime']);
  const [jobTitles, setJobTitles] = useState(['Software Developer']);

  const handleJobTypeToggle = (type: string) => {
    setJobTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSaveAndClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-8">
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            Copilot Configuration
          </DialogTitle>
          <p className="text-gray-600 mt-2">Step {currentStep} of 4</p>
          <p className="text-gray-700 mt-4">
            First, select the Work Location and Jobs you are looking for
          </p>
        </DialogHeader>

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
                  <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                    <span>{locationDetails}</span>
                    <X className="w-3 h-3 cursor-pointer" />
                  </div>
                  <Edit className="w-4 h-4 text-gray-400 cursor-pointer" />
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
                  <X className="w-3 h-3 cursor-pointer" />
                </div>
              ))}
            </div>
            
            <Input 
              placeholder="Type job title..."
              className="mb-4"
            />
            
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
        <div className="flex justify-between pt-8 border-t">
          <Button
            variant="outline"
            onClick={handleSaveAndClose}
            className="px-6 py-2"
          >
            Save & Close
          </Button>
          <Button
            onClick={handleNext}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
          >
            Next: Optional Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CopilotSetup;
