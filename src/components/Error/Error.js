import React from 'react';

import './Error.css';

const Error = ({ level = 3, children }) => (
  <div className={`error error-level-${level}`}>{children}</div>
);

export default Error;
