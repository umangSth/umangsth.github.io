'use client';

import React, { CSSProperties, useState } from 'react';
import Image from 'next/image';

const ContactSection = () => {
  const email = 'umang.sth099@gmail.com';
  // const linkedIn = 'https://www.linkedin.com/in/umanga-shrestha-299570261/';
  // const github = 'https://github.com/umangSth';

  const [copyStatus, setCopyStatus] = useState('');
  const [showLinkedinText, setShowLinkedinText] = useState(false);
  const [showGithubText, setShowGithubText] = useState(false);
  const [showEmailText, setShowEmailText] = useState(false);

  const copyToClipboard = async () => {
    try {
        setShowEmailText(false);
      await navigator.clipboard.writeText(email);
      setCopyStatus('Email Copied!');
      setTimeout(() => setCopyStatus(''), 1500);
    } catch (err) {
      console.error('Failed to copy: ', err);
      setCopyStatus('Failed to copy!');
      setTimeout(() => setCopyStatus(''), 1500);
    }
  };

  const textStyle = "text-sm text-gray-600 mt-2"; // Common text style

  const popupStyle: CSSProperties = {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '4px 8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    zIndex: 10, 
    bottom: '8rem', // Position below the icon
    left: '50%',
    transform: 'translateX(-50%)',
  };

  return (
    <>
      <section className="p-10 rounded-lg bg-white w-full">
        <div className="grid gap-6 md:grid-cols-3 justify-center">
          {/* Email */}
          <div
            className="text-center relative" // Make this a positioning context
            onMouseEnter={() => setShowEmailText(true)}
            onMouseLeave={() => setShowEmailText(false)}
          >
            <a
              onClick={(e) => {
                e.preventDefault();
                copyToClipboard();
              }}
              className="cursor-pointer border-1 inline-block shadow-lg shadow-gray-500 hover:shadow-xl transition-shadow duration-300 rounded-full p-4 bg-white hover:bg-red-100"
            >
              <div className="w-20 h-20 relative">
                <Image
                  src="/images/contact-logos/lightMode/gmail.png"
                  alt="Email"
                  fill
                  sizes="80px"
                  className="object-contain"
                />
              </div>
            </a>
            {copyStatus && (
              <p
                style={popupStyle}
                className={`${
                  copyStatus.startsWith('Failed') ? 'text-red-500' : 'text-green-800'
                }`}
              >
                {copyStatus}
              </p>
            )}
            {showEmailText && (
              <div style={popupStyle}>
                <p className={textStyle}>{email}</p>
              </div>
            )}
          </div>

          {/* LinkedIn */}
          <div
            className="text-center relative" // Make this a positioning context
            onMouseEnter={() => setShowLinkedinText(true)}
            onMouseLeave={() => setShowLinkedinText(false)}
          >
            <a
              href="https://www.linkedin.com/in/umanga-shrestha-299570261/"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer border-1 inline-block shadow-lg shadow-gray-500 hover:shadow-xl transition-shadow duration-300 rounded-full p-4 bg-white hover:bg-blue-100"
            >
              <div className="w-20 h-20 relative">
                <Image
                  src="/images/contact-logos/lightMode/linkedin.png"
                  alt="LinkedIn"
                  fill
                  sizes="80px"
                  className="object-contain pl-1"
                />
              </div>
            </a>
            {showLinkedinText && (
              <div style={popupStyle}>
                <p className={textStyle}>Click me</p>
              </div>
            )}
          </div>

          {/* GitHub */}
          <div
            className="text-center relative" // Make this a positioning context
            onMouseEnter={() => setShowGithubText(true)}
            onMouseLeave={() => setShowGithubText(false)}
          >
            <a
              href="https://github.com/umangSth"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer border-1 inline-block shadow-lg shadow-gray-500 hover:shadow-xl transition-shadow duration-300 rounded-full p-4 bg-white hover:bg-gray-100"
            >
              <div className="w-20 h-20 relative">
                <Image
                  src="/images/contact-logos/lightMode/github-mark.png"
                  alt="GitHub"
                  fill
                  sizes="80px"
                  className="object-contain color-black"
                />
              </div>
            </a>
            {showGithubText && (
              <div style={popupStyle} className="text-xs mt-1">
                <p className={textStyle}>Click me</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white p-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Umanga Shrestha. All rights reserved. |
          This website is currently under development.
        </p>
        <p className="text-xs mt-2">
          Disclaimer: The information provided on this site is for general
          informational purposes only.
        </p>
      </footer>
    </>
  );
};

export default ContactSection;