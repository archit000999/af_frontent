import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker for pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

export interface ExtractedResumeData {
  name?: string;
  email?: string;
  phone?: string;
  phoneCountryCode?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  jobTitle?: string;
  experience?: string[];
  skills?: string[];
  education?: string[];
  linkedin?: string;
  salary?: string;
  nationality?: string;
}

// Common patterns for extraction
const patterns = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi,
  phone: /(?:\+91[-.\s]?)?(?:\+1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})|(?:\+91[-.\s]?)?[6-9]\d{9}/g,
  indianPhone: /(?:\+91[-.\s]?)?[6-9]\d{9}/g,
  usPhone: /(?:\+1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g,
  linkedin: /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[A-Za-z0-9-_]+/gi,
  salary: /(?:\$|USD|INR|₹|Rs\.?)\s*[\d,]+(?:\.\d{2})?(?:\s*(?:per\s+year|annually|pa|yearly|lpa|lakhs?|k|thousand))?/gi,
  zipCode: /\b\d{5,6}(?:-\d{4})?\b/g,
  name: /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)$/gm,
};

// Job title keywords to identify current position
const jobTitleKeywords = [
  'developer', 'engineer', 'manager', 'analyst', 'designer', 'consultant',
  'specialist', 'coordinator', 'director', 'lead', 'senior', 'junior',
  'software', 'web', 'frontend', 'backend', 'fullstack', 'data', 'product',
  'project', 'marketing', 'sales', 'hr', 'finance', 'operations'
];

// Location keywords for cities and countries
const locationKeywords = {
  cities: [
    'mumbai', 'delhi', 'bangalore', 'bengaluru', 'hyderabad', 'chennai', 'kolkata', 'pune', 'ahmedabad', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore', 'thane', 'bhopal', 'visakhapatnam', 'pimpri', 'patna', 'vadodara', 'ghaziabad', 'ludhiana', 'agra', 'nashik', 'faridabad', 'meerut', 'rajkot', 'kalyan', 'vasai', 'varanasi', 'srinagar', 'aurangabad', 'dhanbad', 'amritsar', 'navi mumbai', 'allahabad', 'ranchi', 'howrah', 'coimbatore', 'jabalpur', 'gwalior', 'vijayawada', 'jodhpur', 'madurai', 'raipur', 'kota', 'guwahati', 'chandigarh', 'solapur', 'hubli', 'bareilly', 'moradabad', 'mysore', 'gurgaon', 'aligarh', 'jalandhar', 'tiruchirappalli', 'bhubaneswar', 'salem', 'warangal', 'mira', 'bhiwandi', 'saharanpur', 'gorakhpur', 'bikaner', 'amravati', 'noida', 'jamshedpur', 'bhilai', 'cuttack', 'firozabad', 'kochi', 'nellore', 'bhavnagar', 'dehradun', 'durgapur', 'asansol', 'rourkela', 'nanded', 'kolhapur', 'ajmer', 'akola', 'gulbarga', 'jamnagar', 'ujjain', 'loni', 'siliguri', 'jhansi', 'ulhasnagar', 'jammu', 'sangli', 'mangalore', 'erode', 'belgaum', 'ambattur', 'tirunelveli', 'malegaon', 'gaya', 'jalgaon', 'udaipur', 'maheshtala',
    'new york', 'san francisco', 'los angeles', 'chicago', 'seattle', 'boston', 'austin', 'denver', 'atlanta', 'phoenix', 'philadelphia', 'houston', 'dallas', 'miami', 'washington', 'detroit', 'portland', 'las vegas', 'minneapolis', 'san diego', 'charlotte', 'tampa', 'orlando', 'pittsburgh', 'cincinnati', 'kansas city', 'cleveland', 'indianapolis', 'columbus', 'milwaukee', 'sacramento', 'san jose', 'baltimore', 'memphis', 'louisville', 'nashville', 'richmond', 'new orleans', 'buffalo', 'raleigh', 'virginia beach', 'norfolk', 'birmingham', 'tulsa', 'honolulu', 'anchorage', 'tucson', 'fresno', 'mesa', 'long beach', 'virginia beach', 'oakland', 'colorado springs', 'omaha', 'wichita', 'arlington',
    'london', 'manchester', 'birmingham', 'glasgow', 'liverpool', 'bristol', 'sheffield', 'leeds', 'edinburgh', 'leicester', 'coventry', 'bradford', 'cardiff', 'belfast', 'nottingham', 'kingston', 'hull', 'plymouth', 'stoke', 'wolverhampton', 'derby', 'swansea', 'southampton', 'salford', 'aberdeen', 'westminster', 'portsmouth', 'york', 'peterborough', 'dundee', 'lancaster', 'oxford', 'newport', 'preston', 'st albans', 'norwich', 'chester', 'cambridge', 'salisbury', 'exeter', 'gloucester', 'lisburn', 'chichester', 'winchester', 'londonderry', 'carlisle', 'worcester', 'bath', 'durham', 'lincoln', 'hereford', 'armagh', 'inverness', 'stirling', 'canterbury', 'lichfield', 'newry', 'ripon', 'bangor', 'truro', 'ely', 'wells', 'st asaph', 'st davids',
    'toronto', 'vancouver', 'montreal', 'calgary', 'edmonton', 'ottawa', 'winnipeg', 'quebec city', 'hamilton', 'kitchener', 'london', 'st catharines', 'halifax', 'oshawa', 'victoria', 'windsor', 'saskatoon', 'regina', 'sherbrooke', 'kelowna', 'barrie', 'abbotsford', 'kingston', 'trois-rivières', 'guelph', 'cambridge', 'whitby', 'ajax', 'langley', 'saanich', 'terrebonne', 'milton', 'st johns', 'moncton', 'thunder bay', 'dieppe', 'waterloo', 'delta', 'chatham', 'red deer', 'kamloops', 'brantford', 'cape breton', 'lethbridge', 'saint-jean-sur-richelieu', 'clarington', 'pickering', 'nanaimo', 'sudbury', 'north vancouver', 'prince george', 'sault ste marie', 'lévis', 'sarnia', 'welland', 'fort mcmurray', 'medicine hat', 'fredericton', 'granby', 'shawinigan', 'drummondville', 'saint john',
    'sydney', 'melbourne', 'brisbane', 'perth', 'adelaide', 'gold coast', 'newcastle', 'canberra', 'central coast', 'wollongong', 'logan city', 'geelong', 'hobart', 'townsville', 'cairns', 'darwin', 'toowoomba', 'ballarat', 'bendigo', 'albury', 'launceston', 'mackay', 'rockhampton', 'bunbury', 'bundaberg', 'coffs harbour', 'wagga wagga', 'hervey bay', 'mildura', 'shepparton', 'port macquarie', 'gladstone', 'tamworth', 'traralgon', 'orange', 'dubbo', 'geraldton', 'bowral', 'bathurst', 'nowra', 'warrnambool', 'kalgoorlie', 'devonport', 'mount gambier', 'warragul', 'kempsey', 'taree', 'burnie', 'alice springs', 'broken hill', 'sunbury', 'goulburn'
  ],
  states: [
    'andhra pradesh', 'arunachal pradesh', 'assam', 'bihar', 'chhattisgarh', 'goa', 'gujarat', 'haryana', 'himachal pradesh', 'jharkhand', 'karnataka', 'kerala', 'madhya pradesh', 'maharashtra', 'manipur', 'meghalaya', 'mizoram', 'nagaland', 'odisha', 'punjab', 'rajasthan', 'sikkim', 'tamil nadu', 'telangana', 'tripura', 'uttar pradesh', 'uttarakhand', 'west bengal',
    'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut', 'delaware', 'florida', 'georgia', 'hawaii', 'idaho', 'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota', 'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'new hampshire', 'new jersey', 'new mexico', 'new york', 'north carolina', 'north dakota', 'ohio', 'oklahoma', 'oregon', 'pennsylvania', 'rhode island', 'south carolina', 'south dakota', 'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington', 'west virginia', 'wisconsin', 'wyoming',
    'ontario', 'quebec', 'british columbia', 'alberta', 'manitoba', 'saskatchewan', 'nova scotia', 'new brunswick', 'newfoundland and labrador', 'prince edward island', 'northwest territories', 'nunavut', 'yukon',
    'new south wales', 'victoria', 'queensland', 'western australia', 'south australia', 'tasmania', 'northern territory', 'australian capital territory'
  ],
  countries: [
    'india', 'united states', 'usa', 'united kingdom', 'uk', 'britain', 'england', 'scotland', 'wales', 'canada', 'australia', 'germany', 'france', 'singapore', 'netherlands', 'switzerland', 'sweden', 'norway', 'denmark', 'finland', 'ireland', 'new zealand', 'japan', 'south korea', 'china', 'brazil', 'mexico', 'spain', 'italy', 'portugal', 'belgium', 'austria', 'poland', 'czech republic', 'hungary', 'greece', 'turkey', 'israel', 'uae', 'saudi arabia', 'south africa', 'egypt', 'nigeria', 'kenya', 'ghana', 'morocco', 'tunisia', 'argentina', 'chile', 'colombia', 'peru', 'venezuela', 'russia', 'ukraine', 'belarus', 'lithuania', 'latvia', 'estonia', 'romania', 'bulgaria', 'serbia', 'croatia', 'slovenia', 'slovakia', 'luxembourg', 'malta', 'cyprus', 'iceland', 'liechtenstein', 'monaco', 'san marino', 'andorra', 'vatican city'
  ]
};

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    console.log('Starting PDF text extraction...');
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
          
          const loadingTask = pdfjsLib.getDocument({ data: typedArray });
          const pdf = await loadingTask.promise;
          
          console.log('PDF loaded successfully, pages:', pdf.numPages);
          
          let fullText = '';
          
          // Extract text from all pages
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(' ');
              
            fullText += pageText + '\n';
            console.log(`Page ${pageNum} extracted, text length:`, pageText.length);
          }
          
          console.log('Total extracted text length:', fullText.length);
          console.log('Sample text:', fullText.substring(0, 200));
          
          if (fullText.trim().length === 0) {
            reject(new Error('No text content found in PDF'));
          } else {
            resolve(fullText);
          }
          
        } catch (error) {
          console.error('Error processing PDF:', error);
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read PDF file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
    
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
}

export async function extractTextFromImage(file: File): Promise<string> {
  try {
    console.log('Starting OCR for image...');
    const worker = await createWorker('eng');
    console.log('Tesseract worker created');
    
    const { data: { text } } = await worker.recognize(file);
    console.log('OCR completed, text length:', text.length);
    console.log('OCR sample text:', text.substring(0, 200));
    
    await worker.terminate();
    
    if (text.trim().length === 0) {
      throw new Error('No text extracted from image');
    }
    
    return text;
  } catch (error) {
    console.error('Error extracting text from image:', error);
    throw error;
  }
}

export function parseResumeText(text: string): ExtractedResumeData {
  const extractedData: ExtractedResumeData = {};
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const lowerText = text.toLowerCase();

  console.log('Parsing resume text, first 500 chars:', text.substring(0, 500));

  // Extract email
  const emailMatches = text.match(patterns.email);
  if (emailMatches && emailMatches.length > 0) {
    extractedData.email = emailMatches[0];
    console.log('Found email:', extractedData.email);
  }

  // Extract phone number with improved patterns and country code detection
  let phoneMatches = text.match(patterns.phone);
  if (!phoneMatches) {
    phoneMatches = text.match(patterns.indianPhone);
  }
  if (!phoneMatches) {
    phoneMatches = text.match(patterns.usPhone);
  }
  
  if (phoneMatches && phoneMatches.length > 0) {
    const originalPhone = phoneMatches[0];
    let phone = originalPhone.replace(/\D/g, '');
    
    // Detect country code based on pattern
    if (originalPhone.includes('+91') || (phone.startsWith('91') && phone.length === 12)) {
      extractedData.phoneCountryCode = '+91';
      phone = phone.startsWith('91') ? phone.substring(2) : phone;
    } else if (originalPhone.includes('+1') || (phone.startsWith('1') && phone.length === 11)) {
      extractedData.phoneCountryCode = '+1';
      phone = phone.startsWith('1') ? phone.substring(1) : phone;
    } else if (originalPhone.includes('+44') || (phone.startsWith('44') && phone.length >= 12)) {
      extractedData.phoneCountryCode = '+44';
      phone = phone.startsWith('44') ? phone.substring(2) : phone;
    } else if (originalPhone.includes('+61') || (phone.startsWith('61') && phone.length >= 11)) {
      extractedData.phoneCountryCode = '+61';
      phone = phone.startsWith('61') ? phone.substring(2) : phone;
    } else {
      // Default to US if no country code detected
      extractedData.phoneCountryCode = '+1';
    }
    
    // Take last 10 digits for standard formatting
    if (phone.length >= 10) {
      extractedData.phone = phone.slice(-10);
      console.log('Found phone:', extractedData.phone, 'with country code:', extractedData.phoneCountryCode);
    }
  }

  // Extract LinkedIn profile
  const linkedinMatches = text.match(patterns.linkedin);
  if (linkedinMatches && linkedinMatches.length > 0) {
    extractedData.linkedin = linkedinMatches[0];
    if (!extractedData.linkedin.startsWith('http')) {
      extractedData.linkedin = 'https://' + extractedData.linkedin;
    }
    console.log('Found LinkedIn:', extractedData.linkedin);
  }

  // Extract salary information with better parsing
  const salaryMatches = text.match(patterns.salary);
  if (salaryMatches && salaryMatches.length > 0) {
    // Take the largest salary number found (likely current salary)
    let maxSalary = '';
    for (const match of salaryMatches) {
      const numbers = match.replace(/[^\d]/g, '');
      if (numbers && (!maxSalary || parseInt(numbers) > parseInt(maxSalary))) {
        maxSalary = numbers;
      }
    }
    if (maxSalary) {
      extractedData.salary = maxSalary;
      console.log('Found salary:', extractedData.salary);
    }
  }

  // Extract name - improved logic
  // Look for name in first few lines, avoiding common resume headers
  for (let i = 0; i < Math.min(lines.length, 8); i++) {
    const line = lines[i];
    
    // Skip obvious non-name lines
    if (line.includes('@') || line.includes('http') || line.includes('+') || 
        line.toLowerCase().includes('resume') || line.toLowerCase().includes('cv') ||
        line.toLowerCase().includes('curriculum') || line.toLowerCase().includes('vitae') ||
        line.length < 3 || line.length > 50 ||
        /\d/.test(line) || // Contains numbers
        line.includes('.') || line.includes(',')) {
      continue;
    }
    
    // Check if line looks like a name
    const words = line.split(' ').filter(w => w.length > 1);
    if (words.length >= 2 && words.length <= 4) {
      // Check if all words start with capital letter
      const isValidName = words.every(word => 
        /^[A-Z][a-z]+$/.test(word) || /^[A-Z][a-z]+\.$/.test(word) || /^[A-Z]\.?$/.test(word)
      );
      if (isValidName) {
        extractedData.name = line;
        console.log('Found name:', extractedData.name);
        break;
      }
    }
  }

  // Extract location information with improved accuracy
  extractedData.location = {};
  
  // Find cities with better context matching
  for (const city of locationKeywords.cities) {
    const cityPattern = new RegExp(`\\b${city}\\b`, 'i');
    if (cityPattern.test(lowerText)) {
      // Check if it's in a location context (not just mentioned)
      const cityIndex = lowerText.indexOf(city.toLowerCase());
      const contextBefore = lowerText.substring(Math.max(0, cityIndex - 50), cityIndex);
      const contextAfter = lowerText.substring(cityIndex, Math.min(lowerText.length, cityIndex + 50));
      
      // Look for location indicators
      const locationIndicators = ['address', 'location', 'based', 'city', 'live', 'residence', 'from'];
      const hasLocationContext = locationIndicators.some(indicator => 
        contextBefore.includes(indicator) || contextAfter.includes(indicator)
      );
      
      if (hasLocationContext || contextAfter.includes(',') || contextAfter.includes('state') || contextAfter.includes('country')) {
        extractedData.location.city = city.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        console.log('Found city:', extractedData.location.city);
        break;
      }
    }
  }

  // Find states with context
  for (const state of locationKeywords.states) {
    const statePattern = new RegExp(`\\b${state}\\b`, 'i');
    if (statePattern.test(lowerText)) {
      extractedData.location.state = state.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      console.log('Found state:', extractedData.location.state);
      break;
    }
  }

  // Find countries with context
  for (const country of locationKeywords.countries) {
    const countryPattern = new RegExp(`\\b${country}\\b`, 'i');
    if (countryPattern.test(lowerText)) {
      let countryName = country;
      if (country === 'usa') countryName = 'United States';
      else if (country === 'uk' || country === 'britain') countryName = 'United Kingdom';
      else countryName = country.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      extractedData.location.country = countryName;
      console.log('Found country:', extractedData.location.country);
      break;
    }
  }

  // Extract zip code
  const zipMatches = text.match(patterns.zipCode);
  if (zipMatches && zipMatches.length > 0) {
    // Find zip code that's likely in address context
    for (const zip of zipMatches) {
      const zipIndex = text.indexOf(zip);
      const contextBefore = text.substring(Math.max(0, zipIndex - 100), zipIndex).toLowerCase();
      
      if (contextBefore.includes('address') || contextBefore.includes('location') || 
          contextBefore.includes(',') || extractedData.location.city) {
        extractedData.location.zipCode = zip;
        console.log('Found zip code:', extractedData.location.zipCode);
        break;
      }
    }
  }

  // Extract job title with improved context recognition
  const experienceSection = lowerText.includes('experience') ? 
    text.substring(lowerText.indexOf('experience')) : text;
  
  // Look for current/recent job title patterns
  const jobTitlePatterns = [
    /current(?:ly)?\s*[:\-]?\s*(.+?)(?:\n|at|with)/gi,
    /position\s*[:\-]?\s*(.+?)(?:\n|at|with)/gi,
    /role\s*[:\-]?\s*(.+?)(?:\n|at|with)/gi,
    /working\s+as\s+(.+?)(?:\n|at|with)/gi,
    /(?:^|\n)\s*([a-z\s]+(?:developer|engineer|manager|analyst|designer|consultant|specialist|coordinator|director|lead).*?)(?:\n|at)/gi
  ];
  
  for (const pattern of jobTitlePatterns) {
    const matches = experienceSection.match(pattern);
    if (matches) {
      for (const match of matches) {
        const cleanMatch = match.replace(/^(current|position|role|working as)[:\-\s]*/i, '').trim();
        if (cleanMatch.length > 3 && cleanMatch.length < 80 && 
            !cleanMatch.toLowerCase().includes('experience') && 
            !cleanMatch.toLowerCase().includes('skills')) {
          extractedData.jobTitle = cleanMatch;
          console.log('Found job title:', extractedData.jobTitle);
          break;
        }
      }
      if (extractedData.jobTitle) break;
    }
  }

  // Fallback job title search in first 20 lines
  if (!extractedData.jobTitle) {
    for (const line of lines.slice(0, 20)) {
      const lowerLine = line.toLowerCase();
      const hasJobKeyword = jobTitleKeywords.some(keyword => lowerLine.includes(keyword));
      
      if (hasJobKeyword && line.length > 5 && line.length < 100 &&
          !line.includes('@') && !line.includes('http') && !line.includes('+') &&
          !lowerLine.includes('experience') && !lowerLine.includes('skills') &&
          !lowerLine.includes('education') && !lowerLine.includes('university')) {
        extractedData.jobTitle = line;
        console.log('Found job title (line search):', extractedData.jobTitle);
        break;
      }
    }
  }

  // Extract experience entries
  extractedData.experience = [];
  const experienceKeywords = ['experience', 'work history', 'employment', 'professional experience'];
  let experienceStartIndex = -1;
  
  for (const keyword of experienceKeywords) {
    const index = lowerText.indexOf(keyword);
    if (index !== -1) {
      experienceStartIndex = index;
      break;
    }
  }
  
  if (experienceStartIndex !== -1) {
    const experienceText = text.substring(experienceStartIndex);
    const experienceLines = experienceText.split('\n').slice(1, 10); // Skip header, take next 10 lines
    
    for (const line of experienceLines) {
      if (line.trim().length > 20 && line.trim().length < 200 &&
          (line.includes('Ltd') || line.includes('Inc') || line.includes('Corp') || 
           line.includes('Company') || line.includes('at ') || 
           /\d{4}/.test(line))) { // Contains year
        extractedData.experience.push(line.trim());
      }
    }
  }

  // Extract skills
  extractedData.skills = [];
  const skillsIndex = lowerText.indexOf('skills');
  if (skillsIndex !== -1) {
    const skillsText = text.substring(skillsIndex, skillsIndex + 1000).toLowerCase();
    const skillKeywords = [
      'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
      'react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring', 'laravel',
      'html', 'css', 'scss', 'sass', 'bootstrap', 'tailwind',
      'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'github', 'gitlab',
      'agile', 'scrum', 'devops', 'ci/cd', 'testing', 'leadership', 'management'
    ];
    
    for (const skill of skillKeywords) {
      if (skillsText.includes(skill)) {
        extractedData.skills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
      }
    }
  }

  // Extract education
  extractedData.education = [];
  const educationIndex = lowerText.indexOf('education');
  if (educationIndex !== -1) {
    const educationText = text.substring(educationIndex, educationIndex + 500);
    const educationLines = educationText.split('\n').slice(1, 5); // Take next few lines after "Education"
    
    for (const line of educationLines) {
      if (line.trim().length > 10 && line.trim().length < 200 &&
          (line.toLowerCase().includes('university') || line.toLowerCase().includes('college') ||
           line.toLowerCase().includes('bachelor') || line.toLowerCase().includes('master') ||
           line.toLowerCase().includes('degree') || /\d{4}/.test(line))) {
        extractedData.education.push(line.trim());
      }
    }
  }

  console.log('Final extracted data:', extractedData);
  return extractedData;
}

export async function extractResumeData(file: File): Promise<ExtractedResumeData> {
  console.log(`Starting resume analysis for: ${file.name} Type: ${file.type}`);
  
  let text = '';
  
  if (file.type === 'application/pdf') {
    text = await extractTextFromPDF(file);
  } else if (file.type.startsWith('image/')) {
    text = await extractTextFromImage(file);
  } else {
    throw new Error(`Unsupported file type: ${file.type}. Please use PDF or image files.`);
  }

  console.log('Extracted text preview:', text.substring(0, 300));
  
  if (text.trim().length === 0) {
    throw new Error('No text content could be extracted from the file');
  }
  
  return parseResumeText(text);
}
