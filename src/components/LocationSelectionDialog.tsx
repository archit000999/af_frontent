
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronRight, X } from 'lucide-react';
import { Country, State, City } from 'country-state-city';

interface LocationSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (locations: string[]) => void;
  selectedLocations: string[];
}

interface LocationData {
  [key: string]: {
    name: string;
    cities: string[];
  };
}

export const LocationSelectionDialog: React.FC<LocationSelectionDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedLocations
}) => {
  const [tempSelectedLocations, setTempSelectedLocations] = useState<string[]>(selectedLocations);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set());
  const [isAnywhere, setIsAnywhere] = useState(false);
  const [locationData, setLocationData] = useState<LocationData>({});
  const [countries, setCountries] = useState<any[]>([]);

  useEffect(() => {
    // Load countries
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
    
    // Set default country to India (as shown in image)
    if (allCountries.length > 0) {
      const india = allCountries.find(country => country.name === 'India');
      if (india) {
        setSelectedCountry(india.isoCode);
        loadStatesAndCities(india.isoCode);
      }
    }
  }, []);

  useEffect(() => {
    setTempSelectedLocations(selectedLocations);
  }, [selectedLocations]);

  const loadStatesAndCities = (countryCode: string) => {
    const states = State.getStatesOfCountry(countryCode);
    const newLocationData: LocationData = {};
    
    states.forEach(state => {
      const cities = City.getCitiesOfState(countryCode, state.isoCode);
      newLocationData[state.isoCode] = {
        name: state.name,
        cities: cities.map(city => city.name)
      };
    });
    
    setLocationData(newLocationData);
  };

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    loadStatesAndCities(countryCode);
    setExpandedStates(new Set());
    setIsAnywhere(false);
  };

  const handleAnywhereToggle = (checked: boolean) => {
    setIsAnywhere(checked);
    if (checked) {
      const countryName = countries.find(c => c.isoCode === selectedCountry)?.name || '';
      setTempSelectedLocations([`Anywhere in ${countryName}`]);
    } else {
      setTempSelectedLocations([]);
    }
  };

  const handleStateToggle = (stateCode: string) => {
    // Only allow one state to be expanded at a time (as shown in image)
    if (expandedStates.has(stateCode)) {
      setExpandedStates(new Set());
    } else {
      setExpandedStates(new Set([stateCode]));
    }
  };

  const handleSelectAllInState = (stateCode: string, checked: boolean) => {
    if (isAnywhere) return;
    
    const stateName = locationData[stateCode]?.name || '';
    const stateLocation = `All in ${stateName}`;
    const stateCities = locationData[stateCode]?.cities || [];
    
    if (checked) {
      // Remove any individual cities from this state and add the "All in State" option
      const newSelections = tempSelectedLocations.filter(loc => !stateCities.includes(loc));
      newSelections.push(stateLocation);
      setTempSelectedLocations(newSelections);
    } else {
      // Remove the "All in State" option and any individual cities from this state
      const newSelections = tempSelectedLocations.filter(loc => 
        loc !== stateLocation && !stateCities.includes(loc)
      );
      setTempSelectedLocations(newSelections);
    }
  };

  const handleCityToggle = (city: string, stateCode: string, checked: boolean) => {
    if (isAnywhere) return;
    
    const stateName = locationData[stateCode]?.name || '';
    const stateLocation = `All in ${stateName}`;
    
    if (checked) {
      // Remove "All in State" if it exists and add the individual city
      const newSelections = tempSelectedLocations.filter(loc => loc !== stateLocation);
      newSelections.push(city);
      setTempSelectedLocations(newSelections);
    } else {
      setTempSelectedLocations(tempSelectedLocations.filter(loc => loc !== city));
    }
  };

  const isStateFullySelected = (stateCode: string) => {
    const stateName = locationData[stateCode]?.name || '';
    return tempSelectedLocations.some(loc => loc.includes(`All in ${stateName}`));
  };

  const handleSave = () => {
    onSave(tempSelectedLocations);
    onClose();
  };

  const handleCancel = () => {
    setTempSelectedLocations(selectedLocations);
    setIsAnywhere(false);
    onClose();
  };

  const selectedCountryName = countries.find(c => c.isoCode === selectedCountry)?.name || '';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[93vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Filter locations where you want to apply for jobs
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 overflow-y-auto flex-1">
          {/* Country Selection */}
          <div className="space-y-5">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Select Country</label>
              <Select value={selectedCountry} onValueChange={handleCountryChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Anywhere in Country Option */}
            <div className="flex items-center space-x-3 pb-4 border-b">
              <Checkbox
                id="anywhere"
                checked={isAnywhere}
                onCheckedChange={handleAnywhereToggle}
              />
              <label htmlFor="anywhere" className="text-sm font-medium cursor-pointer text-purple-600">
                Anywhere in {selectedCountryName}
              </label>
            </div>

            <div className="text-center text-gray-500 text-sm py-2">OR</div>

            {/* States/Cities Selection */}
            <div>
              <h3 className="text-sm font-medium mb-4 text-gray-700">Select Cities</h3>
              
              <div className="flex gap-4 h-80">
                {/* States List */}
                <div className="w-1/2 space-y-2 overflow-y-auto border-r pr-4">
                  {Object.entries(locationData).map(([stateCode, stateData]) => (
                    <div 
                      key={stateCode} 
                      className={`p-3 cursor-pointer hover:bg-gray-50 rounded border ${
                        expandedStates.has(stateCode) ? 'bg-purple-50 border-purple-200' : 'border-gray-200'
                      }`}
                      onClick={() => handleStateToggle(stateCode)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{stateData.name}</span>
                        <ChevronRight 
                          className={`w-4 h-4 text-gray-400 transition-transform ${
                            expandedStates.has(stateCode) ? 'rotate-90' : ''
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cities List */}
                <div className="w-1/2 space-y-2 overflow-y-auto pl-4">
                  {Array.from(expandedStates).map(stateCode => {
                    const stateData = locationData[stateCode];
                    if (!stateData) return null;
                    
                    return (
                      <div key={stateCode} className="space-y-3">
                        {/* Select all in state option */}
                        <div className="flex items-center space-x-3 pb-2 border-b">
                          <Checkbox
                            id={`select-all-${stateCode}`}
                            checked={isStateFullySelected(stateCode)}
                            onCheckedChange={(checked) => handleSelectAllInState(stateCode, checked as boolean)}
                            disabled={isAnywhere}
                          />
                          <label htmlFor={`select-all-${stateCode}`} className="text-sm font-medium cursor-pointer text-gray-900">
                            Select all in {stateData.name}
                          </label>
                        </div>

                        {/* Individual cities */}
                        <div className="space-y-2">
                          {stateData.cities.slice(0, 20).map((city) => (
                            <div key={city} className="flex items-center space-x-3">
                              <Checkbox
                                id={`${stateCode}-${city}`}
                                checked={tempSelectedLocations.includes(city) || isStateFullySelected(stateCode)}
                                onCheckedChange={(checked) => handleCityToggle(city, stateCode, checked as boolean)}
                                disabled={isAnywhere || isStateFullySelected(stateCode)}
                              />
                              <label htmlFor={`${stateCode}-${city}`} className="text-sm cursor-pointer text-gray-700">
                                {city}
                              </label>
                            </div>
                          ))}
                          {stateData.cities.length > 20 && (
                            <div className="text-xs text-gray-500 italic pt-2">
                              Showing first 20 cities. Select "Select all in {stateData.name}" for all cities.
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  {expandedStates.size === 0 && (
                    <div className="text-center text-gray-500 text-sm py-8">
                      Select a state from the left to see cities
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-4 border-t">
          <Button 
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2"
            disabled={tempSelectedLocations.length === 0}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
