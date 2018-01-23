import React from 'react';

import './Select.css';

const Select = ({
  label,
  elements,
  selected,
  onSelect,
  defaultSelected,
  emptyOption
}) => (
  <label className="select-wrapper">
    <span className="select-label">{label}</span>
    {elements && elements.length ? (
      <select
        className="select"
        onChange={e => onSelect(e.target.value)}
        value={selected}
      >
        {emptyOption && <option className="select-option" value="" />}
        {elements.map(el => (
          <option
            className="select-option"
            key={el.id}
            value={el.label}
            selected={defaultSelected === el.id}
          >
            {el.label}
          </option>
        ))}
      </select>
    ) : (
      <span className="select-empty">No elements to select.</span>
    )}
  </label>
);

export default Select;
