import React from 'react';
import './globals.css';

export default function Layout({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <html unselectable='on'>
      <head>
        <title>GreenLight Presentation</title>
      </head>
      <body>
        <div id='appContainer'>
          {children}
        </div>
      </body>
    </html>
  );
}
