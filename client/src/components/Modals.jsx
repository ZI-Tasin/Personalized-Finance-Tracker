import React from 'react';
import { LuX } from 'react-icons/lu';

const Modal = ({ isOpen, onClose, title, children }) => {
    // If the modal is not open, render nothing.
    if (!isOpen) {
        return null;
    }

    // This function stops the click event from bubbling up and closing the modal
    // when you click inside the modal content.
    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        // The modal backdrop: a semi-transparent overlay that covers the page
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose} // Clicking the backdrop closes the modal
        >
            {/* The modal content container */}
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative"
                onClick={handleContentClick}
            >
                {/* Modal Header with Title and Close Button */}
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button
                        className="p-1 rounded-full hover:bg-gray-200"
                        onClick={onClose}
                    >
                        <LuX size={20} />
                    </button>
                </div>

                {/* The content of the modal, passed in from the parent */}
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
