import React from 'react';
import PageContent from '../docs/PageContent';

const LatestVersion = () => {
   return (
      <PageContent title='Latest Version'>
         <blockquote>
            <a
               href="https://irysup.xyz"
               target="_blank"
               rel="noreferrer"
               style={{ color: 'var(--irysup-color-primary)', fontWeight: '500', textDecoration: 'underline' }}
            >
               v0.1.0 -- IrysUp Beta App
            </a>
         </blockquote>

         <ul >
            <li style={{ color: 'var(--irysup-color-text-muted)' }}>
               IrysUp Creator Uploader
            </li>
            <li style={{ color: 'var(--irysup-color-text-muted)' }}>
               Irys Storage
            </li>
         </ul>
      </PageContent>
   );
};

export default LatestVersion;