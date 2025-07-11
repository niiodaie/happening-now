import React from 'react';
import { Twitter, Linkedin, Facebook, ExternalLink } from 'lucide-react';

function Footer() {
  return (
    <footer className="text-center text-sm text-gray-500 mt-12 py-6 border-t border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <p className="mb-4">
          A{' '}
          <a 
            href="https://visnec.ai" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 underline inline-flex items-center gap-1 transition-colors"
          >
            VNX product
            <ExternalLink className="h-3 w-3" />
          </a>
          {' '}|{' '}
          Powered by{' '}
          <a 
            href="https://visnec.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 underline inline-flex items-center gap-1 transition-colors"
          >
            Visnec Global
            <ExternalLink className="h-3 w-3" />
          </a>
        </p>
        
        <div className="flex gap-6 justify-center items-center">
          <a 
            href="#" 
            className="text-gray-600 hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-blue-50"
            aria-label="Follow us on Twitter"
          >
            <Twitter className="h-5 w-5" />
          </a>
          <a 
            href="#" 
            className="text-gray-600 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-blue-50"
            aria-label="Connect on LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a 
            href="#" 
            className="text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50"
            aria-label="Like us on Facebook"
          >
            <Facebook className="h-5 w-5" />
          </a>
        </div>
        
        <div className="mt-4 text-xs text-gray-400">
          <p>&copy; 2024 Visnec Global. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export { Footer };

