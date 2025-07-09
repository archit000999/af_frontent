import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Settings, ChevronRight, ChevronDown, X, HelpCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { useCopilotConfig } from '@/hooks/useCopilotConfig';

const CopilotFilters = () => {
  const navigate = useNavigate();
  const { config, updateConfig, saveConfig, isLoading: configLoading, isInitialized } = useCopilotConfig();
  const [currentStep, setCurrentStep] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter states
  const [increaseJobMatch, setIncreaseJobMatch] = useState(true);
  const [jobMatchLevel, setJobMatchLevel] = useState('High');
  const [seniorityLevels, setSeniorityLevels] = useState(['Entry Level']);
  const [timeZone, setTimeZone] = useState('Flexible');
  const [industry, setIndustry] = useState('Information Technology (IT)');
  const [includeUnknownIndustry, setIncludeUnknownIndustry] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Advanced filters states
  const [jobDescriptionLanguage, setJobDescriptionLanguage] = useState('');
  const [locationRadius, setLocationRadius] = useState('');
  const [includeKeywords, setIncludeKeywords] = useState('');
  const [excludeKeywords, setExcludeKeywords] = useState('');
  const [excludeCompanies, setExcludeCompanies] = useState('');

  const seniorityOptions = [
    'Entry Level',
    'Associate Level', 
    'Mid-to-Senior Level',
    'Director Level and above'
  ];

  const timezoneOptions = [
    'Flexible',
    'UTC-12:00 - Baker Island Time',
    'UTC-11:00 - Samoa Standard Time',
    'UTC-10:00 - Hawaii Standard Time',
    'UTC-09:00 - Alaska Standard Time',
    'UTC-08:00 - Pacific Standard Time (PST)',
    'UTC-07:00 - Mountain Standard Time (MST)',
    'UTC-06:00 - Central Standard Time (CST)',
    'UTC-05:00 - Eastern Standard Time (EST)',
    'UTC-04:00 - Atlantic Standard Time',
    'UTC-03:00 - Argentina Time',
    'UTC-02:00 - South Georgia Time',
    'UTC-01:00 - Azores Time',
    'UTC+00:00 - Greenwich Mean Time (GMT)',
    'UTC+01:00 - Central European Time (CET)',
    'UTC+02:00 - Eastern European Time (EET)',
    'UTC+03:00 - Moscow Time',
    'UTC+04:00 - Gulf Standard Time',
    'UTC+05:00 - Pakistan Standard Time',
    'UTC+05:30 - India Standard Time (IST)',
    'UTC+06:00 - Bangladesh Standard Time',
    'UTC+07:00 - Indochina Time',
    'UTC+08:00 - China Standard Time',
    'UTC+09:00 - Japan Standard Time',
    'UTC+10:00 - Australian Eastern Time',
    'UTC+11:00 - Solomon Islands Time',
    'UTC+12:00 - New Zealand Standard Time'
  ];

  const industryOptions = [
    'Information Technology (IT)',
    'Software Development',
    'Healthcare & Medical',
    'Finance & Banking',
    'Insurance',
    'Education & Training',
    'Manufacturing',
    'Retail & E-commerce',
    'Consulting',
    'Marketing & Advertising',
    'Media & Entertainment',
    'Real Estate',
    'Construction',
    'Automotive',
    'Aerospace & Defense',
    'Energy & Utilities',
    'Telecommunications',
    'Transportation & Logistics',
    'Food & Beverage',
    'Fashion & Apparel',
    'Pharmaceuticals',
    'Biotechnology',
    'Government & Public Sector',
    'Non-Profit',
    'Legal Services',
    'Accounting',
    'Human Resources',
    'Sales',
    'Customer Service',
    'Operations',
    'Research & Development',
    'Design & Creative',
    'Agriculture',
    'Mining',
    'Hospitality & Tourism',
    'Sports & Recreation',
    'Environmental Services',
    'Security',
    'Architecture',
    'Engineering'
  ];

  const languageOptions = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Russian',
    'Chinese (Mandarin)',
    'Japanese',
    'Korean',
    'Arabic',
    'Hindi',
    'Dutch',
    'Swedish',
    'Norwegian',
    'Danish',
    'Finnish',
    'Polish',
    'Czech',
    'Hungarian',
    'Romanian',
    'Bulgarian',
    'Greek',
    'Turkish',
    'Hebrew',
    'Thai',
    'Vietnamese',
    'Indonesian',
    'Malay'
  ];

  const radiusOptions = [
    '5 miles',
    '10 miles',
    '25 miles',
    '50 miles',
    '100 miles',
    '5 km',
    '10 km',
    '25 km',
    '50 km',
    '100 km'
  ];

  // Initialize from saved config
  useEffect(() => {
    if (isInitialized && config) {
      setCurrentStep(Math.max(config.stepCompleted || 1, 2));
      // Load saved filter data if exists
      if (config.filtersData) {
        setIncreaseJobMatch(config.filtersData.increaseJobMatch ?? true);
        setJobMatchLevel(config.filtersData.jobMatchLevel ?? 'High');
        setSeniorityLevels(config.filtersData.seniorityLevels ?? ['Entry Level']);
        setTimeZone(config.filtersData.timeZone ?? 'Flexible');
        setIndustry(config.filtersData.industry ?? 'Information Technology (IT)');
        setIncludeUnknownIndustry(config.filtersData.includeUnknownIndustry ?? true);
        setShowAdvancedFilters(config.filtersData.showAdvancedFilters ?? false);
        setJobDescriptionLanguage(config.filtersData.jobDescriptionLanguage ?? '');
        setLocationRadius(config.filtersData.locationRadius ?? '');
        setIncludeKeywords(config.filtersData.includeKeywords ?? '');
        setExcludeKeywords(config.filtersData.excludeKeywords ?? '');
        setExcludeCompanies(config.filtersData.excludeCompanies ?? '');
      }
    }
  }, [isInitialized, config]);

  const handleSeniorityToggle = (level: string) => {
    setSeniorityLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    // Required fields: seniorityLevels, timeZone, industry
    return (
      seniorityLevels.length > 0 &&
      timeZone !== '' &&
      industry !== ''
    );
  };

  const handleNext = async () => {
    if (!isFormValid()) return;
    
    setIsLoading(true);
    
    // Prepare filter data to save
    const filtersData = {
      increaseJobMatch,
      jobMatchLevel,
      seniorityLevels,
      timeZone,
      industry,
      includeUnknownIndustry,
      showAdvancedFilters,
      jobDescriptionLanguage,
      locationRadius,
      includeKeywords,
      excludeKeywords,
      excludeCompanies
    };
    
    // Save current step progress with filter data
    const nextStep = Math.min(currentStep + 1, 4);
    const success = await saveConfig({ 
      stepCompleted: nextStep,
      filtersData
    });
    
    if (success) {
      setTimeout(() => {
        setIsLoading(false);
        navigate('/copilot-screening');
      }, 1500);
    } else {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/copilot-setup');
  };

  const handleSaveAndClose = async () => {
    // Prepare filter data to save
    const filtersData = {
      increaseJobMatch,
      jobMatchLevel,
      seniorityLevels,
      timeZone,
      industry,
      includeUnknownIndustry,
      showAdvancedFilters,
      jobDescriptionLanguage,
      locationRadius,
      includeKeywords,
      excludeKeywords,
      excludeCompanies
    };

    const success = await saveConfig({ 
      stepCompleted: Math.max(currentStep, config.stepCompleted || 1),
      filtersData
    });
    if (success) {
      navigate('/home');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-purple-50 overflow-hidden">
      {/* Header - Same as previous page */}
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
             
              <span>Copilot</span>
            </div>
            <div 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer"
              onClick={() => navigate('/applications')}
            >
              <div className="w-6 h-6 flex items-center justify-center">
              </div>
              <span>Applications</span>
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
                  Next, narrow your search with optional filters
                </p>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-8">
              <div className="space-y-8 pb-4">
                
                {/* Increase Job Match Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 text-sm">🎯</span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">Increase Job Match</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <HelpCircle className="w-4 h-4 text-gray-400 cursor-pointer" />
                      <Switch
                        checked={increaseJobMatch}
                        onCheckedChange={setIncreaseJobMatch}
                        className="data-[state=checked]:bg-purple-600"
                      />
                    </div>
                  </div>
                  
                  {increaseJobMatch && (
                    <div className="rounded-lg p-4">
                      {/* Progress Bar */}
                      <div className="relative mb-6">
                        <div className="w-full bg-gray-200 h-2 rounded-full relative">
                          <div 
                            className={`h-2 bg-purple-600 rounded-full transition-all duration-500 ease-out ${
                              jobMatchLevel === 'High' ? 'w-[33%]' :
                              jobMatchLevel === 'Higher' ? 'w-[66%]' : 'w-full'
                            }`}
                          ></div>
                          {/* Progress indicator dot */}
                          <div 
                            className={`absolute top-1/2 w-3 h-3 rounded-full border-2 border-white transition-all duration-500 ease-out transform -translate-y-1/2 ${
                              jobMatchLevel === 'High' ? 'left-[calc(33%-6px)] bg-purple-600' :
                              jobMatchLevel === 'Higher' ? 'left-[calc(66%-6px)] bg-purple-600' : 
                              'left-[calc(100%-6px)] bg-purple-600'
                            }`}
                          ></div>
                        </div>
                      </div>

                      {/* Level Labels */}
                      <div className="flex justify-between mb-6">
                        <button
                          onClick={() => setJobMatchLevel('High')}
                          className={`text-sm font-medium cursor-pointer transition-colors ${
                            jobMatchLevel === 'High' ? 'text-purple-600 font-bold' : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          High
                        </button>
                        <button
                          onClick={() => setJobMatchLevel('Higher')}
                          className={`text-sm font-medium cursor-pointer transition-colors ${
                            jobMatchLevel === 'Higher' ? 'text-purple-600 font-bold' : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          Higher
                        </button>
                        <button
                          onClick={() => setJobMatchLevel('Highest')}
                          className={`text-sm font-medium cursor-pointer transition-colors ${
                            jobMatchLevel === 'Highest' ? 'text-black font-bold' : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          Highest
                        </button>
                      </div>
                      
                      {/* Dynamic Message */}
                      <div className="flex items-start space-x-2 text-sm text-gray-600">
                        <span className="text-yellow-500 mt-0.5">💡</span>
                        <div>
                          {jobMatchLevel === 'High' && (
                            <span>Your copilot will <strong>only</strong> apply to jobs where you meet <strong>more than half</strong> of the key requirements.</span>
                          )}
                          {jobMatchLevel === 'Higher' && (
                            <div>
                              <div className="mb-2">
                                <span>Your copilot will <strong>only</strong> apply to jobs where you meet <strong>most</strong> of the key requirements.</span>
                              </div>
                              <div className="text-gray-600">
                                If your copilot doesn't apply to enough jobs, then try lowering this threshold and/or adding more information in your CV related to the jobs you are searching for.
                              </div>
                            </div>
                          )}
                          {jobMatchLevel === 'Highest' && (
                            <div>
                              <div className="mb-2">
                                <span>Your copilot will <strong>only</strong> apply to jobs where you meet <strong>all</strong> of the key requirements.</span>
                              </div>
                              <div className="text-gray-600">
                                If your copilot doesn't apply to enough jobs, then try lowering this threshold and/or adding more information in your CV related to the jobs you are searching for.
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Seniority Section */}
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-sm">📊</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Seniority</h3>
                    <span className="text-sm text-gray-500">(optional)</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    Filter jobs by seniority. <span className="text-purple-600 cursor-pointer hover:underline">View an explanation of each level.</span>
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    {seniorityOptions.map((level) => (
                      <button
                        key={level}
                        onClick={() => handleSeniorityToggle(level)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors ${
                          seniorityLevels.includes(level)
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {seniorityLevels.includes(level) && (
                          <span className="w-4 h-4 bg-white text-purple-600 rounded-full flex items-center justify-center text-xs">✓</span>
                        )}
                        <span>{level}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Zones Section */}
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-sm">🕐</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Time Zones</h3>
                    <span className="text-sm text-gray-500">(optional)</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    Filter remote jobs by time zone
                  </p>
                  
                  <Select value={timeZone} onValueChange={setTimeZone}>
                    <SelectTrigger className="w-full max-w-xs bg-purple-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {timezoneOptions.map((tz) => (
                        <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Industry/Sector Section */}
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-sm">🏢</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Industry / Sector</h3>
                    <span className="text-sm text-gray-500">(optional)</span>
                  </div>
                  
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger className="w-full max-w-md bg-purple-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {industryOptions.map((ind) => (
                        <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center space-x-3 mt-4">
                    <Checkbox 
                      id="unknown-industry"
                      checked={includeUnknownIndustry}
                      onCheckedChange={(checked) => setIncludeUnknownIndustry(checked === true)}
                    />
                    <label htmlFor="unknown-industry" className="text-sm text-gray-700">
                      Include jobs that don't have industry / sector information
                    </label>
                  </div>
                </div>

                {/* Advanced Filters Section */}
                <div>
                  <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="flex items-center space-x-2 text-gray-900 font-medium hover:text-purple-600 transition-colors"
                  >
                    <span>Advanced Filters</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showAdvancedFilters && (
                    <div className="mt-6 space-y-6">
                      
                      {/* Job Description Language */}
                      <div>
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 text-sm">🗣️</span>
                          </div>
                          <h4 className="text-lg font-medium text-gray-900">Job Description Language</h4>
                          <span className="text-sm text-gray-500">(optional)</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          Only apply to jobs in the following languages:
                        </p>
                        <Select value={jobDescriptionLanguage} onValueChange={setJobDescriptionLanguage}>
                          <SelectTrigger className="w-full max-w-xs">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {languageOptions.map((lang) => (
                              <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Location Radius */}
                      <div>
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 text-sm">📍</span>
                          </div>
                          <h4 className="text-lg font-medium text-gray-900">Location Radius</h4>
                          <span className="text-sm text-gray-500">(optional)</span>
                        </div>
                        <Select value={locationRadius} onValueChange={setLocationRadius}>
                          <SelectTrigger className="w-full max-w-xs">
                            <SelectValue placeholder="Select radius" />
                          </SelectTrigger>
                          <SelectContent>
                            {radiusOptions.map((radius) => (
                              <SelectItem key={radius} value={radius}>{radius}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Job Description Keywords */}
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Job Description Keywords</h4>
                        <span className="text-sm text-gray-500">(optional)</span>
                        
                        {/* Include Keywords */}
                        <div className="mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-purple-600">INCLUDE</span>
                            <HelpCircle className="w-4 h-4 text-gray-400 cursor-pointer" />
                          </div>
                          <p className="text-gray-600 text-sm mb-3">
                            Only apply to jobs that include <strong>ANY</strong> of these keywords in the job description.
                          </p>
                          <textarea
                            value={includeKeywords}
                            onChange={(e) => setIncludeKeywords(e.target.value)}
                            placeholder="Type in keywords separated by commas"
                            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            rows={3}
                          />
                        </div>

                        {/* Exclude Keywords */}
                        <div className="mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-red-600">EXCLUDE</span>
                            <HelpCircle className="w-4 h-4 text-gray-400 cursor-pointer" />
                          </div>
                          <p className="text-gray-600 text-sm mb-3">
                            Exclude jobs that contain <strong>ANY</strong> of these keywords in the job description.
                          </p>
                          <textarea
                            value={excludeKeywords}
                            onChange={(e) => setExcludeKeywords(e.target.value)}
                            placeholder="Type in keywords separated by commas"
                            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            rows={3}
                          />
                        </div>
                      </div>

                      {/* Exclude Companies */}
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-3">Exclude Companies</h4>
                        <span className="text-sm text-gray-500">(optional)</span>
                        <p className="text-gray-600 text-sm mb-3 mt-2">
                          Select companies to exclude so that your copilot doesn't apply for any jobs at these companies.
                        </p>
                        <textarea
                          value={excludeCompanies}
                          onChange={(e) => setExcludeCompanies(e.target.value)}
                          placeholder="Type in and select companies to exclude"
                          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          rows={3}
                        />
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
                  Back
                </Button>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleSaveAndClose}
                    className="px-6 py-2"
                  >
                    Save & Close
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!isFormValid() || isLoading}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <span>Next: Profile Information</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CopilotFilters;
