import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const UploadImage = async (imageFile) => {
    const formData = new FormData();
    // Append the image file to the FormData object
    formData.append('image', imageFile);

    // Make a POST request to upload the image
    try {
        const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data for file uploads
            },
        });
        return response.data;   // Return the response data which should contain the image URL or other relevant information
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

export default UploadImage;
// This function uploads an image file to the server and returns the response data.
// It uses FormData to handle the file upload and Axios for making the HTTP request.