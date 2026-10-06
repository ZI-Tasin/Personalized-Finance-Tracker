import React, { useEffect, useRef, useState } from 'react';
import { LuUser, LuUpload } from 'react-icons/lu';
import { toast } from 'react-hot-toast';

const ProfilePicSelector = ({ setImage }) => {
    const fileInputRef = useRef(null);
    
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Choose an image smaller than 5 MB.');
                e.target.value = '';
                return;
            }
            if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
                toast.error('Choose a JPEG, PNG, GIF, or WebP image.');
                e.target.value = '';
                return;
            }
            setImage(file);

            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    return (
        <div className='flex flex-col items-center gap-2 mb-6'>
            <p className="text-sm text-slate-700">Select Profile Picture</p>
            <div className="relative">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="sr-only"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    aria-label="Choose profile image"
                />
                <button type="button" aria-label="Select profile picture" onClick={() => fileInputRef.current?.click()} className="relative w-28 h-28 flex items-center justify-center bg-violet-50 rounded-full cursor-pointer group hover:bg-violet-100 transition duration-300">
                    {previewUrl ? <img src={previewUrl} alt="Selected profile preview" className="w-full h-full rounded-full object-cover" /> : <LuUser size={40} className="text-primary" />}
                    <span className='absolute bottom-0 right-0 w-8 h-8 flex items-center justify-center bg-primary rounded-full border-2 border-white text-white group-hover:bg-violet-600 transition duration-300'>
                        <LuUpload size={16} />
                    </span>
                </button>
            </div>
        </div>
    );
};

export default ProfilePicSelector;
