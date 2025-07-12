import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Settings, Check, ChevronRight, HelpCircle, Eye, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { useCopilotConfig } from '@/hooks/useCopilotConfig';
const CopilotFinalStep = () => {
  const navigate = useNavigate();
  const {
    config,
    saveConfig,
    isLoading: configLoading,
    isInitialized
  } = useCopilotConfig();
  const [selectedMode, setSelectedMode] = useState('auto-apply');
  const [sentenceLength, setSentenceLength] = useState('balanced-mix');
  const [tone, setTone] = useState('neutral-casual');
  const [vocabularyComplexity, setVocabularyComplexity] = useState('simple-everyday');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStep, setCurrentStep] = useState(4);

  // Initialize from saved config
  useEffect(() => {
    if (isInitialized && config) {
      setCurrentStep(Math.max(config.stepCompleted || 1, 4));
      // Load saved final config data if exists
      if (config.finalConfigData) {
        setSelectedMode(config.finalConfigData.selectedMode ?? 'auto-apply');
        setSentenceLength(config.finalConfigData.sentenceLength ?? 'balanced-mix');
        setTone(config.finalConfigData.tone ?? 'neutral-casual');
        setVocabularyComplexity(config.finalConfigData.vocabularyComplexity ?? 'simple-everyday');
        setIsExpanded(config.finalConfigData.isExpanded ?? false);
      }
    }
  }, [isInitialized, config]);
  const handleBack = () => {
    navigate('/copilot-screening');
  };
  const handleSaveConfiguration = async () => {
    setIsLoading(true);

    // Prepare final configuration data to save
    const finalConfigData = {
      selectedMode,
      sentenceLength,
      tone,
      vocabularyComplexity,
      isExpanded
    };

    // Save final configuration
    const success = await saveConfig({
      stepCompleted: 4,
      // Mark as completed
      finalConfigData
    });
    if (success) {
      setTimeout(() => {
        setIsLoading(false);
        navigate('/payment');
      }, 2000);
    } else {
      setIsLoading(false);
    }
  };
  return <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-purple-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">ApplyFirst</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-2 text-purple-600 font-medium text-sm">
              
              <span>ApplyFirst</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer text-sm" onClick={() => navigate('/applications')}>
              <div className="w-6 h-6 flex items-center justify-center">

              </div>
              <span>Applications</span>
            </div>
           
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            
            <UserButton appearance={{
            elements: {
              avatarBox: "w-8 h-8"
            }
          }} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden px-6 py-6">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="bg-white rounded-lg shadow-lg flex flex-col h-full overflow-hidden">
            {/* Header - Fixed */}
            <div className="flex-shrink-0 p-8 pb-6">
              <div className="text-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  ApplyFirst Configuration
                </h1>
                <p className="text-sm text-gray-600 mt-2">Step 4 of 4</p>
                <p className="text-sm text-gray-700 mt-2 font-medium">Final Step!</p>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-8 pb-8 overflow-y-auto">
              <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Main Selection */}
                <div>
                  
                  
                  {/* Auto Apply Option */}
                  <div className="space-y-4">
                    

                    {/* Auto Fill Option */}
                    
                  </div>
                </div>

                {/* Writing Style Section */}
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Writing Style</h3>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setIsExpanded(!isExpanded)}>
                    <span className="text-sm text-gray-700">Personalize how your ApplyFirst answers application questions and contact Hiring managers on your behalf.</span>
                    <svg className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {isExpanded && <div className="mt-6">
                      {/* Writing Style Options */}
                      <div className="space-y-6">
                        {/* Sentence Length */}
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-gray-700 font-medium">Sentence Length:</label>
                          <Select value={sentenceLength} onValueChange={setSentenceLength}>
                            <SelectTrigger className="w-64">
                              <SelectValue className="text-sm" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="short" className="text-sm">Short</SelectItem>
                              <SelectItem value="balanced-mix" className="text-sm">Balanced mix</SelectItem>
                              <SelectItem value="long" className="text-sm">Long</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Tone */}
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-gray-700 font-medium">Tone:</label>
                          <div className="flex items-center space-x-2">
                            <Select value={tone} onValueChange={setTone}>
                              <SelectTrigger className="w-64">
                                <SelectValue className="text-sm" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="formal" className="text-sm">Formal</SelectItem>
                                <SelectItem value="neutral-casual" className="text-sm">Neutral-casual</SelectItem>
                                <SelectItem value="casual" className="text-sm">Casual</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Vocabulary Complexity */}
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-gray-700 font-medium">Vocabulary Complexity:</label>
                          <div className="flex items-center space-x-2">
                            <Select value={vocabularyComplexity} onValueChange={setVocabularyComplexity}>
                              <SelectTrigger className="w-64">
                                <SelectValue className="text-sm" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="simple-everyday" className="text-sm">Simple, everyday words</SelectItem>
                                <SelectItem value="balanced" className="text-sm">Balanced</SelectItem>
                                <SelectItem value="advanced" className="text-sm">Advanced</SelectItem>
                              </SelectContent>
                            </Select>

                          </div>
                        </div>
                      </div>
                    </div>}
                </div>

                {/* Features List */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      Your ApplyFirst scans 50+ job boards — including LinkedIn and 20M+ company websites — to find roles that match your background and preferences.
                    </p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      Your ApplyFirst human agent team manually applies to each job using the info you provided — avoiding ATS bot blocking and ensuring tailored applications.
                    </p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      Your ApplyFirst contacts hiring managers within minutes, sending your resume and a personalized intro to help you land a screening call faster.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Fixed */}
            <div className="flex-shrink-0 p-8 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={handleBack} className="flex items-center space-x-2 px-6 py-3 text-sm" disabled={isLoading}>
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </Button>
                
                <Button onClick={handleSaveConfiguration} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-sm" disabled={isLoading}>
                  {isLoading ? <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Launching ApplyFirst...</span>
                    </div> : <span>Launch ApplyFirst</span>}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>;
};
export default CopilotFinalStep;