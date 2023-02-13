import React from 'react';

const Subheader = ({icon, children}) => {
  return (
    <div className="innpv-subheader">
        <span className={`icon icon-${icon}`} />
        {children}
      </div>
  )
}

export default Subheader;