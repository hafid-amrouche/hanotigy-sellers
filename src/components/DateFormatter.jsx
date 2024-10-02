import React from 'react';

// Helper function to format the date and time
const formatDate = (date, lang) => {
  // Ensure 'en' is used if no valid language is provided
  const supportedLanguages = ['ar', 'fr', 'en'];
  const language = supportedLanguages.includes(lang) ? lang : 'en';

  // Options for formatting with month in short form, along with hour and minute
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  };

  // Format the date using the provided language
  return new Intl.DateTimeFormat(language, options).format(date);
};

// React component
const DateFormatter = ({ date, lang, ...props}) => {
  // Validate that the input is a Date object
  if (!(date instanceof Date)) {
    return <span>Invalid Date</span>;
  }

  // Format the date and return it
  const formattedDate = formatDate(date, lang);

  return <span {...props}>{formattedDate}</span>;
};

// Usage example:
// <DateFormatter date={new Date()} lang="en" />

export default DateFormatter;
