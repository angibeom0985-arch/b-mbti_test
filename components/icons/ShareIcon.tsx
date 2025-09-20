import React from 'react';

const ShareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.217 10.907a2.25 2.25 0 100 4.186m0-4.186a2.25 2.25 0 010 4.186m0-4.186L14.05 7.653m-6.833 7.454l6.833-3.254m0 0a2.25 2.25 0 100-4.186m0 4.186a2.25 2.25 0 110-4.186"
    />
  </svg>
);

export default ShareIcon;
