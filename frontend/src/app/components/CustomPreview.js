import React from 'react';

const CustomPreview = ({ src, title = "Frontend Preview" }) => (
  <div style={{ width: '100%', height: '500px', border: '1px solid #ccc' }}>
    <iframe
      src={src}
      title={title}
      style={{ width: '100%', height: '100%', border: 'none' }}
      allowFullScreen
    />
  </div>
);

export default CustomPreview;