import React from 'react';


export default function DataSelector(props) {
  const { name = 'dataselector', items, handleChange, selection } = props;

  return (
    <>
      {items.map((item, i) => {
        const itemName = `${name}-${item}-selector`;

        return (
          <div key={itemName}>
            <input
              type="radio"
              id={itemName}
              name={itemName}
              value={item}
              checked={selection === item}
              onChange={handleChange}
            />
            <label className="text-capitalize" htmlFor={itemName}>{item}</label>
          </div>
        );
      })}
    </>
  );
}
