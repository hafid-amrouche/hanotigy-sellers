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
const getScrollableAncestor = (element) => {
  let currentNode = element.parentElement;

  while (currentNode && currentNode !== document.body) {
    const style = window.getComputedStyle(currentNode);
    const overflow = style.overflow;
    const overflowY = style.overflowY;

    // Check if the element is scrollable
    if ( overflow  === 'auto' || overflowY  === 'auto' ) {
      if (currentNode.scrollHeight > currentNode.clientHeight) {
        return currentNode;
      }
    }

    // Move to the parent node
    currentNode = currentNode.parentElement;
  }

  // Default to the body or documentElement if no scrollable ancestor is found
  return document.scrollingElement || document.documentElement;
};
export function adjustScrollPosition(element, delta= 0) {
  // Get the element's bounding box relative to the viewport
  const rect = element.getBoundingClientRect();
  const scrollingContainer = getScrollableAncestor(element)
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
  const scrollingContainer = getScrollableAncestor(element)
  // Calculate the amount of space needed to ensure the dropdown is fully visible

  scrollingContainer.scrollBy({
    top: rect.top + delta,
    behavior: 'smooth'
  });

}

export async function reduceImageQuality(fileList, quality = 0.7, resolution = 1080, outputFormat = null, fixHeight=true) {
  const filesArray = Array.from(fileList);
  const promises = filesArray.map((inputFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (readerEvent) => {
        try {
          const imgBitmap = await createImageBitmap(new Blob([readerEvent.target.result]));

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          let width = imgBitmap.width;
          let height = imgBitmap.height;

          if (fixHeight){
            if (width > height) {
              if (width > resolution) {
                height = height * (resolution / width);
                width = resolution;
                console.log(height, width)
              }
            } else {
              if (height > resolution) {
                width = width * (resolution / height);
                height = resolution;
              }
            }
          } 
          else{
            if (width > resolution) {
              width = resolution;
              height *= resolution / width;
            }
          } 

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(imgBitmap, 0, 0, width, height);

          // Determine the output format and mime type based on input or the provided outputFormat
          let mimeType;
          let extension;

          if (outputFormat) {
            if (outputFormat === 'webp') {
              mimeType = 'image/webp';
              extension = 'webp';
            } else if (outputFormat === 'jpeg' || outputFormat === 'jpg') {
              mimeType = 'image/jpeg';
              extension = 'jpg';
            } else if (outputFormat === 'png') {
              mimeType = 'image/png';
              extension = 'png';
            } else {
              mimeType = inputFile.type; // Fall back to input file type if unknown
              extension = inputFile.name.split('.').pop();
            }
          } else {
            // Use the original file's type
            mimeType = inputFile.type;
            extension = inputFile.name.split('.').pop();
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

export const deleteImage = async(url, type)=>{
  try{
    await axios.post(
        filesUrl + '/delete-image',
        {
            image: url,
            type,
            store_id: localStorage.getItem('storeId')
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

export const componentLoader = async(importFunction)=>{
  const loading = document.getElementById('loading__div')
  const header = document.getElementById('Header')
  if (loading) loading.style.display='block'
  if (header) header.style.marginTop = '4px'
  await importFunction()
  if (loading) loading.style.display='none'
  if (header) header.style.removeProperty('margin-top')
  return null
}

export function extractImageUrls(htmlString) {
  // Create a temporary DOM element to parse the HTML string
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;

  // Select all image elements within the HTML
  const imgTags = tempDiv.getElementsByTagName('img');

  // Extract the src attribute from each image tag
  const imgUrls = Array.from(imgTags).map(img => img.src);

  return imgUrls;
}
export function addLazyLoadingToImages(htmlString) {
  // Step 1: Create a template element to hold the HTML string
  const template = document.createElement('template');
  
  // Step 2: Assign the HTML string to the template's innerHTML
  template.innerHTML = htmlString;

  // Step 3: Select all <img> tags inside the template
  const imgTags = template.content.querySelectorAll('img');

  // Step 4: Loop through all <img> tags and add loading="lazy" if not already present
  imgTags.forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
  });

  // Step 5: Return the updated HTML as a string
  return template.innerHTML;
}

export function cleanHtml(htmlString) {
  // Create a temporary DOM element to parse the HTML string
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;

  // Function to recursively check if a node is empty
  function checkNode(node) {
      // Skip <img> tag check - it should be considered as content
      if (node.tagName === 'IMG') return false;

      // Check if the node contains non-empty text content
      if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '') {
          return false;
      }

      // Recursively check child nodes
      for (let child of node.childNodes) {
          if (!checkNode(child)) {
              return false;
          }
      }

      return true;
  }

  // Start checking from the body of the parsed HTML
  return checkNode(tempDiv) ? '' : htmlString;
}

export function createArray(n) {
  return Array.from({ length: n }, (v, i) => i);
}

export const scrollToTop=(elem)=>{
  elem.scrollIntoView({
    behavior: 'smooth',  // Optional: Add smooth scrolling
    block: 'start',      // Align the element to the top of the scrollable container
    inline: 'nearest'    // For horizontal scroll (if needed)
  });
}

export function numberToHex(number) {
  if (number < 0 || number > 99) {
      throw new Error("Number must be between 0 and 99");
  }
  // Convert the number to a value between 0 and 255
  const hexValue = Math.round(number * 255 / 99);
  // Convert to hexadecimal and pad with '0' if necessary
  return hexValue.toString(16).padStart(2, '0').toUpperCase();
}

export function hexToNumber(hex) {
  if (!/^[0-9A-Fa-f]{2}$/.test(hex)) {
      throw new Error("Input must be a valid two-digit hexadecimal string (00 to FF)");
  }
  // Convert the hex to an integer
  const decimalValue = parseInt(hex, 16);
  // Scale the value back to 0-99 range
  return Math.round(decimalValue * 99 / 255);
}