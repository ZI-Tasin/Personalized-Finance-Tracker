import React, { useState, useContext } from 'react';
import ProfilePicSelector from './Inputs/ProfilePicSelector';
import UploadImage from '../utils/uploadImage';
import { UserContext } from '../context/userContext';
import { toast } from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const UpdateProfilePic = ({ onClose }) => {
    const [profilePic, setProfilePic] = useState(null);
    const { updateUser } = useContext(UserContext);

    const handleUpdate = async () => {
        if (!profilePic) {
            toast.error("Please select an image first.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('image', profilePic);
            
            const response = await axiosInstance.post(API_PATHS.AUTH.UPDATE_PROFILE_PIC, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data) {
                updateUser(response.data);
                toast.success("Profile picture updated successfully!");
                onClose();
            }

        } catch (error) {
            toast.error("Failed to update profile picture.");
            console.error(error);
        }
    };

    return (
        <div>
            <ProfilePicSelector image={profilePic} setImage={setProfilePic} />
            <button className="btn-primary mt-4" onClick={handleUpdate}>
                Update Picture
            </button>
        </div>
    );
};

export default UpdateProfilePic;
