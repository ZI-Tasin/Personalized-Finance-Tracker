import React from 'react';

const ProfilePicSelector = ({ image, setImage }) => {
  return (
    <div>
      <h2>Select Profile Picture</h2>
      <input type="file" accept="image/*" onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))} />
      <button type="button">Upload</button>
    </div>
  );
}

export default ProfilePicSelector;
