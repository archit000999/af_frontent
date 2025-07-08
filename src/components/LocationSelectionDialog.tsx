
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronRight, X } from 'lucide-react';

interface LocationSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (locations: string[]) => void;
  selectedLocations: string[];
}

const REGIONS_DATA = {
  'Central America': {
    countries: ['Barbados', 'Belize', 'Costa Rica', 'Curacao', 'Dominica', 'Dominican Republic', 'El Salvador', 'Grenada', 'Guatemala', 'Haiti', 'Honduras', 'Jamaica', 'Nicaragua', 'Panama', 'Saint Lucia', 'Trinidad and Tobago']
  },
  'Central Asia': {
    countries: ['Afghanistan', 'Kazakhstan', 'Kyrgyzstan', 'Tajikistan', 'Turkmenistan', 'Uzbekistan']
  },
  'East Asia': {
    countries: ['China', 'Japan', 'Mongolia', 'North Korea', 'South Korea', 'Taiwan']
  },
  'Europe': {
    countries: ['Albania', 'Andorra', 'Austria', 'Belarus', 'Belgium', 'Bosnia and Herzegovina', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta', 'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'North Macedonia', 'Norway', 'Poland', 'Portugal', 'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Ukraine', 'United Kingdom', 'Vatican City']
  },
  'Middle East': {
    countries: ['Bahrain', 'Iran', 'Iraq', 'Israel', 'Jordan', 'Kuwait', 'Lebanon', 'Oman', 'Palestine', 'Qatar', 'Saudi Arabia', 'Syria', 'Turkey', 'United Arab Emirates', 'Yemen']
  },
  'North Africa': {
    countries: ['Algeria', 'Egypt', 'Libya', 'Morocco', 'Sudan', 'Tunisia']
  },
  'North America': {
    countries: ['Canada', 'Mexico', 'United States']
  },
  'Oceania': {
    countries: ['Australia', 'Fiji', 'Kiribati', 'Marshall Islands', 'Micronesia', 'Nauru', 'New Zealand', 'Palau', 'Papua New Guinea', 'Samoa', 'Solomon Islands', 'Tonga', 'Tuvalu', 'Vanuatu']
  },
  'South America': {
    countries: ['Argentina', 'Bolivia', 'Brazil', 'Chile', 'Colombia', 'Ecuador', 'French Guiana', 'Guyana', 'Paraguay', 'Peru', 'Suriname', 'Uruguay', 'Venezuela']
  },
  'South Asia': {
    countries: ['Bangladesh', 'Bhutan', 'India', 'Maldives', 'Nepal', 'Pakistan', 'Sri Lanka']
  },
  'Southeast Asia': {
    countries: ['Brunei', 'Cambodia', 'East Timor', 'Indonesia', 'Laos', 'Malaysia', 'Myanmar', 'Philippines', 'Singapore', 'Thailand', 'Vietnam']
  },
  'Sub-Saharan Africa': {
    countries: ['Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cameroon', 'Cape Verde', 'Central African Republic', 'Chad', 'Comoros', 'Democratic Republic of the Congo', 'Republic of the Congo', 'Djibouti', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Ivory Coast', 'Kenya', 'Lesotho', 'Liberia', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'Sao Tome and Principe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Tanzania', 'Togo', 'Uganda', 'Zambia', 'Zimbabwe']
  }
};

export const LocationSelectionDialog: React.FC<LocationSelectionDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedLocations
}) => {
  const [tempSelectedLocations, setTempSelectedLocations] = useState<string[]>(selectedLocations);
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set());
  const [isWorldwideSelected, setIsWorldwideSelected] = useState(selectedLocations.includes('Worldwide'));

  const handleWorldwideToggle = (checked: boolean) => {
    setIsWorldwideSelected(checked);
    if (checked) {
      setTempSelectedLocations(['Worldwide']);
    } else {
      setTempSelectedLocations([]);
    }
  };

  const handleRegionToggle = (region: string) => {
    const newExpanded = new Set(expandedRegions);
    if (newExpanded.has(region)) {
      newExpanded.delete(region);
    } else {
      newExpanded.add(region);
    }
    setExpandedRegions(newExpanded);
  };

  const handleSelectAllInRegion = (region: string, checked: boolean) => {
    if (isWorldwideSelected) return;
    
    const countries = REGIONS_DATA[region as keyof typeof REGIONS_DATA].countries;
    if (checked) {
      const newSelections = [...new Set([...tempSelectedLocations, ...countries])];
      setTempSelectedLocations(newSelections);
    } else {
      const newSelections = tempSelectedLocations.filter(loc => !countries.includes(loc));
      setTempSelectedLocations(newSelections);
    }
  };

  const handleCountryToggle = (country: string, checked: boolean) => {
    if (isWorldwideSelected) return;
    
    if (checked) {
      setTempSelectedLocations([...tempSelectedLocations, country]);
    } else {
      setTempSelectedLocations(tempSelectedLocations.filter(loc => loc !== country));
    }
  };

  const isRegionFullySelected = (region: string) => {
    const countries = REGIONS_DATA[region as keyof typeof REGIONS_DATA].countries;
    return countries.every(country => tempSelectedLocations.includes(country));
  };

  const handleSave = () => {
    onSave(tempSelectedLocations);
  };

  const handleCancel = () => {
    setTempSelectedLocations(selectedLocations);
    setIsWorldwideSelected(selectedLocations.includes('Worldwide'));
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Filter the countries in which the remote jobs are posted
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 overflow-y-auto flex-1">
          {/* Worldwide Option */}
          <div className="flex items-center space-x-3 pb-4 border-b">
            <Checkbox
              id="worldwide"
              checked={isWorldwideSelected}
              onCheckedChange={handleWorldwideToggle}
            />
            <label htmlFor="worldwide" className="text-sm font-medium cursor-pointer">
              Worldwide
            </label>
          </div>

          <div className="text-center text-gray-500 text-sm py-2">OR</div>

          <div>
            <h3 className="text-lg font-medium mb-4">Select specific regions or countries</h3>
            
            <div className="space-y-2">
              {Object.entries(REGIONS_DATA).map(([region, data]) => (
                <div key={region} className="border border-gray-200 rounded-lg">
                  <div 
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleRegionToggle(region)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-700">{region}</span>
                      <ChevronRight 
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          expandedRegions.has(region) ? 'rotate-90' : ''
                        }`}
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={isRegionFullySelected(region)}
                        onCheckedChange={(checked) => handleSelectAllInRegion(region, checked as boolean)}
                        disabled={isWorldwideSelected}
                      />
                      <span className="text-sm text-gray-500">
                        Select all in {region}
                      </span>
                    </div>
                  </div>
                  
                  {expandedRegions.has(region) && (
                    <div className="px-6 pb-3 space-y-2 border-t border-gray-100">
                      {data.countries.map((country) => (
                        <div key={country} className="flex items-center space-x-3">
                          <Checkbox
                            id={country}
                            checked={tempSelectedLocations.includes(country)}
                            onCheckedChange={(checked) => handleCountryToggle(country, checked as boolean)}
                            disabled={isWorldwideSelected}
                          />
                          <label htmlFor={country} className="text-sm cursor-pointer">
                            {country}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
