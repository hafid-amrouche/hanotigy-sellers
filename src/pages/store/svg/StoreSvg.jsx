import React from 'react';

const StoreSvg = ({
  primaryColor,  // Main color, e.g., for the shirt icon
  backgroundColor = 'var(--backgroundColor)', // Background color, almost white
  containerColor = 'var(--containerColor)',  // Container color, pure white
  textColor = 'var(--textColor)',        // Dark text color
  bordersRounded
}) => {
  return (
    <svg
      viewBox="0 0 400 500"
      xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: bordersRounded ? 4 : 0, width:'300' }}
      className='container'
    >
      {/* Background */}
      <rect width="100%" y="0" height="100%" fill={backgroundColor} />

      <rect x="0" y="0" width="400" height="60" fill={primaryColor} />
      
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        x="360"
        y="-220"
        width="30"
        fill="var(--containerColor)"
      >
        <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" />
      </svg>

      {/* Container */}
      <rect
        x="10"
        y="70"
        width="380"
        height="415"
        fill={containerColor}
        rx={ bordersRounded ? "5" : undefined}
        ry={ bordersRounded ? "5" : undefined}
      />

      {/* Main Image Placeholder with Border */}
      <rect
        x="40"
        y="90"
        width="150"
        height="150"
        fill="none"
        stroke="var(--borderColor)"
        strokeWidth="1"
        rx={ bordersRounded ? "5" : undefined}
        ry={ bordersRounded ? "5" : undefined}
      />

      {/* Shirt Icon in the Main Image Placeholder */}
      <svg
        x="65"
        y="-90"
        width="100"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 512"
      >
        <path
          fill='grey'
          d="M211.8 0c7.8 0 14.3 5.7 16.7 13.2C240.8 51.9 277.1 80 320 80s79.2-28.1 91.5-66.8C413.9 5.7 420.4 0 428.2 0l12.6 0c22.5 0 44.2 7.9 61.5 22.3L628.5 127.4c6.6 5.5 10.7 13.5 11.4 22.1s-2.1 17.1-7.8 23.6l-56 64c-11.4 13.1-31.2 14.6-44.6 3.5L480 197.7 480 448c0 35.3-28.7 64-64 64l-192 0c-35.3 0-64-28.7-64-64l0-250.3-51.5 42.9c-13.3 11.1-33.1 9.6-44.6-3.5l-56-64c-5.7-6.5-8.5-15-7.8-23.6s4.8-16.6 11.4-22.1L137.7 22.3C155 7.9 176.7 0 199.2 0l12.6 0z"
        />
      </svg>

      {/* Product Description */}
      <rect
        x="210"
        y="90"
        width="100"
        height="10"
        fill={textColor}
        rx={ bordersRounded ? "5" : undefined}
        ry={ bordersRounded ? "5" : undefined}
      />
      <rect
        x="210"
        y="110"
        width="40"
        height="15"
        fill={primaryColor}
        rx={ bordersRounded ? "5" : undefined}
        ry={ bordersRounded ? "5" : undefined}
      />
      <rect
        x="260"
        y="110"
        width="42"
        height="15"
        fill={primaryColor}
        rx={ bordersRounded ? "5" : undefined}
        ry={ bordersRounded ? "5" : undefined}
      />
      <rect
        x="310"
        y="110"
        width="42"
        height="15"
        fill={primaryColor}
        rx={ bordersRounded ? "5" : undefined}
        ry={ bordersRounded ? "5" : undefined}
      />

      <rect
        x="210"
        y="140"
        width="100"
        height="10"
        fill={textColor}
        rx={ bordersRounded ? "5" : undefined}
        ry={ bordersRounded ? "5" : undefined}
      />
      <rect
        x="210"
        y="160"
        width="30"
        height="30"
        fill={primaryColor}
        rx={ bordersRounded ? "5" : undefined}
        ry={ bordersRounded ? "5" : undefined}
      />
      <rect
        x="245"
        y="160"
        width="30"
        height="30"
        fill={primaryColor}
        rx={ bordersRounded ? "5" : undefined}
        ry={ bordersRounded ? "5" : undefined}
      />
      <rect
        x="280"
        y="160"
        width="30"
        height="30"
        fill={primaryColor}
        rx={ bordersRounded ? "5" : undefined}
        ry={ bordersRounded ? "5" : undefined}
      />

      <rect
        x="210"
        y="200"
        width="150"
        height="30"
        fill={primaryColor}
        rx={ bordersRounded ? "5" : undefined}
        ry={ bordersRounded ? "5" : undefined}
      />

      {/* Price Tag */}

      {/* Reviews Section */}
      <rect
        x="210"
        y="260"
        width="150"
        height="200"
        fill="none"
        stroke={ primaryColor }
        strokeWidth="1"
        rx={ bordersRounded ? "5" : undefined}
        ry={ bordersRounded ? "5" : undefined}
      ></rect>
      <rect
        x="220"
        y="270"
        width="100"
        height="10"
        fill={textColor}
        rx={ bordersRounded ? "5" : undefined}
        ry={ bordersRounded ? "5" : undefined}
      />
      <rect
        x="220"
        y="290"
        width="40"
        height="50"
        fill="none"
        stroke={ primaryColor }
        strokeWidth="1"
        rx={ bordersRounded ? "5" : undefined}
        ry={ bordersRounded ? "5" : undefined}
      ></rect>
      <rect
        x="220"
        y="360"
        width="100"
        height="10"
        fill={textColor}
        rx={ bordersRounded ? "5" : undefined}
        ry={ bordersRounded ? "5" : undefined}
      />
      <rect
        x="220"
        y="380"
        width="130"
        height="50"
        fill="none"
        stroke={ primaryColor }
        strokeWidth="1"
        rx={ bordersRounded ? "5" : undefined}
        ry={ bordersRounded ? "5" : undefined}
      ></rect>
    </svg>
  );
};

export default StoreSvg;
