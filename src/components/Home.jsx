import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFiles } from '../store/fileSlice';
import FileList from './FileList';

function Home() {
  return (
    <div className="p-4">
      <FileList/>
    </div>
  );
}

export default Home;
