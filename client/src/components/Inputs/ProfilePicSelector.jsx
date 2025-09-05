import React, { useRef, useState } from 'react';
import { LuUser, LuUpload } from 'react-icons/lu';

const ProfilePicSelector = ({ image, setImage }) => {
    const fileInputRef = useRef(null);
    
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);

            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleDivClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className='flex flex-col items-center gap-2 mb-6'>
            <p className="text-sm text-slate-700">Select Profile Picture</p>
            <div 
                className='relative w-28 h-28 flex items-center justify-center bg-violet-50 rounded-full cursor-pointer group hover:bg-violet-100 transition duration-300'
                onClick={handleDivClick}
            >
                {/* 1. Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />

                {/* 2. Image Preview or Placeholder Icon */}
                {previewUrl ? (
                    <img 
                        src={previewUrl} 
                        alt="Profile Preview" 
                        className="w-full h-full rounded-full object-cover"
                    />
                ) : (
                    <LuUser size={40} className="text-primary" />
                )}

                {/* 3. Upload Icon Button */}
                <div className='absolute bottom-0 right-0 w-8 h-8 flex items-center justify-center bg-primary rounded-full border-2 border-white text-white group-hover:bg-violet-600 transition duration-300'>
                    <LuUpload size={16} />
                </div>
            </div>
        </div>
    );
};

export default ProfilePicSelector;
