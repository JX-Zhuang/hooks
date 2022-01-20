import React from 'react';
import useIndexedDB from '../index';

export default function () {
  const {} = useIndexedDB({
    name: 'toDoList',
    version: 4,
  });

  return (
    <>
      <input
        placeholder="Please enter some words..."
        onChange={(e) => setMessage(e.target.value)}
      />
      <button style={{ margin: '0 8px' }} type="button" onClick={() => setMessage('Hello~')}>
        Reset
      </button>
      <button type="button" onClick={() => setMessage()}>
        Clear
      </button>
    </>
  );
}
