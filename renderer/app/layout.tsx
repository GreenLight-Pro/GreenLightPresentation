import React from 'react';
import './globals.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html unselectable='on'>
      <body>
        <div id='appContainer'>
          {children}
        </div>
      </body>
    </html>
  )
}
