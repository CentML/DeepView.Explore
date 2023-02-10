import React from 'react';

function isNumeric(candidate) {
  return !isNaN(parseFloat(candidate));
}

const NumericDisplay = ({precision=0,number,top,bottom}) => {
  const numberToDisplay = () => {
    if (!isNumeric(number)) {
      return number;
    }

    const fixed = number.toFixed(precision);
    const zero = (0).toFixed(precision);
    if (number > 0 && fixed === zero) {
      return '< 1';
    }

    return fixed;
  }

  return (
    <div className="innpv-numericdisplay">
        <div className="innpv-numericdisplay-top">{top}</div>
        <div className="innpv-numericdisplay-number">
          {numberToDisplay()}
        </div>
        <div className="innpv-numericdisplay-bottom">{bottom}</div>
      </div>
  )
}

export default NumericDisplay;