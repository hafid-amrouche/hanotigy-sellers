import axios from "axios";
import { filesUrl } from "constants/urls";

const dict ={
}

export function translate(key, values={}) {
  // Get the translated string from the translations object
  let translation = dict[key] || key;

  // If the translation doesn't exist, return the key itself
  if (!translation) {
    return key;
  }

  // Replace the placeholders with actual values
  Object.keys(values).forEach((placeholder) => {
    const regex = new RegExp(`{${placeholder}}`, 'g');
    translation = translation.replace(regex, values[placeholder]);
  });

  return translation;
}
export function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');  
    let r = parseInt(hex.slice(0, 2), 16);
    let g = parseInt(hex.slice(2, 4), 16);
    let b = parseInt(hex.slice(4, 6), 16);
  
    // Return the formatted RGB string
    return `${r}, ${g}, ${b}`;
}

export function isArabicOrLatinLetter(char) {
  const combinedRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFA-Za-z \u00C0-\u00FF\u0100-\u017F\u0180-\u024F]/;
  return combinedRegex.test(char);
}

export function isAccaptableCharacter(char) {
  // Regular expression for allowed characters in a username
  const regex = /^[A-Za-z0-9@\-_.]$/;
  // Test the character against the regular expression
  return regex.test(char);
}

export function adjustScrollPosition(element, delta= 0) {
  // Get the element's bounding box relative to the viewport
  const rect = element.getBoundingClientRect();
  const scrollingContainer = document.documentElement
  // Calculate the amount of space needed to ensure the dropdown is fully visible
  const spaceBelow = scrollingContainer.clientHeight - rect.bottom + delta;

  if (spaceBelow < 0) { // If there's not enough space below
    // Scroll the window to make the drop-down fully visible
    scrollingContainer.scrollBy({
      top: -spaceBelow,
      behavior: 'smooth'
    });
  }
}

export function adjustScrollToTop(element, delta= 0) {
  // Get the element's bounding box relative to the viewport
  const rect = element.getBoundingClientRect();
  const scrollingContainer = document.documentElement
  // Calculate the amount of space needed to ensure the dropdown is fully visible

  scrollingContainer.scrollBy({
    top: rect.top + delta,
    behavior: 'smooth'
  });

}

export async function reduceImageQuality(fileList, quality = 0.7, dim = 1080, outputFormat = 'webp') {
  const filesArray = Array.from(fileList);
  const promises = filesArray.map((inputFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (readerEvent) => {
        try {
          const imgBitmap = await createImageBitmap(new Blob([readerEvent.target.result]));

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          const MAX_WIDTH = dim;
          const MAX_HEIGHT = dim;
          let width = imgBitmap.width;
          let height = imgBitmap.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(imgBitmap, 0, 0, width, height);

          let mimeType = 'image/jpeg';
          let extension = 'jpg';
          if (outputFormat === 'webp') {
            mimeType = 'image/webp';
            extension = 'webp';
          }

          canvas.toBlob((blob) => {
            const fileName = inputFile.name.replace(/\.[^/.]+$/, ''); // Extracting filename without extension
            const newFile = new File([blob], `${fileName}_reduced.${extension}`, { type: mimeType });

            resolve(newFile);
          }, mimeType, quality);
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(inputFile);
    });
  });

  return Promise.all(promises);
}

export function trimStart(str, char=' ') {
  let startIndex = 0;
  while (startIndex < str.length && str[startIndex] === char) {
    startIndex++;
  }
  return str.slice(startIndex);
}

export function slugify(text) {
  return text
    .toLowerCase()               // Convert to lowercase
    .replace(/\s+/g, '-')        // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '')    // Remove all non-alphanumeric characters except hyphens
    .replace(/\-\-+/g, '-')      // Replace multiple hyphens with a single hyphen
    .replace(/^-+/, '')          // Remove leading hyphens
}

export function isValidHexColor(hex) {
  // Regular expression to check if the string is a valid hex color code
  const hexPattern = /^#([0-9A-Fa-f]{3}){1,2}$/;
  return hexPattern.test(hex);
}

export async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
          const base64String = reader.result.split(',')[1]; // Remove data URL prefix
          const dataUrl = `data:${file.type};base64,${base64String}`;
          resolve(dataUrl);
      };

      reader.onerror = (error) => {
          reject(error);
      };

      reader.readAsDataURL(file);
  });
}

export const deleteImage = async(url)=>{
  try{
    await axios.post(
        filesUrl + '/delete-image',
        {
            image: url
        },
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }
    )
    return true
  }catch{
    return false
  }
    
}

export function getCombinations(variants) {
  const variantOptions = variants.map(variant => Object.values(variant.options));
  if (variantOptions.length === 0) {
    return [];
  }
  function combine(optionsArray) {
    if (optionsArray.length === 0) {
      return [[]];
    }

    const result = [];
    const firstOptionSet = optionsArray[0];
    const remainingOptionSets = optionsArray.slice(1);

    const remainingCombinations = combine(remainingOptionSets);

    for (const option of firstOptionSet) {
      for (const combination of remainingCombinations) {
        result.push([option, ...combination]);
      }
    }

    return result;
  }

  const combinations = combine(variantOptions);

  return combinations.map(combination => {
    const combinedObject = {};

    combination.forEach((option, index) => {
      const variantName = variants[index].name;
      combinedObject[variantName] = option;
    });

    return combinedObject;
  });
}

export function TimeElapsed(time, language='en') {
    const languagePhrases = {
        ar: 'الآن',
        fr: 'juste maintenant',
        en: 'just now'
    };
    const calculateElapsedTime = () => {
        const units = {
            ar: ['ثانية', 'دقيقة', 'ساعة', 'يوم', 'أسبوع', 'سنة'],
            fr: ['secs', 'mins', 'heures', 'jours', 'semaines', 'an'],
            en: ['secs', 'mins', 'hours', 'days', 'weeks', 'years']
        };

        const unitsInSeconds = [1, 60, 3600, 86400, 604800, 31536000];

        const timeDiff = Math.floor((new Date() - new Date(time)) / 1000);

        if (timeDiff < 60) {
            return languagePhrases[language] || languagePhrases.en;
        }

        for (let i = unitsInSeconds.length - 1; i >= 0; i--) {
            const unitInSeconds = unitsInSeconds[i];
            if (timeDiff >= unitInSeconds) {
                const value = Math.floor(timeDiff / unitInSeconds);
                const unit = units[language] ? units[language][i] : units.en[i];
                const languagePhrases = {
                    ar: 'منذ',
                    fr: 'depuis',
                    en: 'ago'
                };
                const phrase = languagePhrases[language] || languagePhrases.en;
                return language !== 'en' ? `${phrase} ${value} ${unit}` : `${value} ${unit} ${phrase}`;
            }
        }

        return languagePhrases[language];
    };


    return calculateElapsedTime();
}

export function formatDate(dateString) {
  const date = new Date(dateString);

  // Get individual components
  const day = String(date.getDate()).padStart(2, '0'); // Get day and add leading zero if necessary
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-based, so add 1) and add leading zero if necessary
  const year = date.getFullYear(); // Get full year
  const hours = String(date.getHours()).padStart(2, '0'); // Get hours and add leading zero if necessary
  const minutes = String(date.getMinutes()).padStart(2, '0'); // Get minutes and add leading zero if necessary

  // Format the date as "day-month year hour:minutes"
  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export function capitalizeFirstLetter(word) {
  if (typeof word !== 'string' || word.length === 0) {
      return word;
  }
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function objectToCsv(dataObject) {
  const headers = Object.keys(dataObject[0]).join(","); // Extract headers from the object keys
  const rows = dataObject.map(obj => Object.values(obj).join(",")).join("\n"); // Convert each object to a CSV row
  return `${headers}\n${rows}`;
}
export function downloadCsv(csvData, filename) {
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.click();
  URL.revokeObjectURL(url); // Clean up the URL object after the download
}

export function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
      console.log("Text copied to clipboard.");
  }).catch(err => {
      console.error("Failed to copy text: ", err);
  });
}