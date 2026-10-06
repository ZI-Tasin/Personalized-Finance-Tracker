import React, { useId, useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

const Input = ({ value, onChange, placeholder, label, type = 'text', required = false, min, max, maxLength, step, name, autoComplete }) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = useId();

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    return (
        <div>
            <label htmlFor={name || inputId} className="text-[13px] text-slate-800">{label}</label>
            
            <div className="input-box">
                <input
                    type={type === 'password' ? showPassword ? 'text' : 'password' : type}
                    placeholder={placeholder}
                    className="w-full bg-transparent outline-none"
                    required={required}
                    min={min}
                    max={max}
                    maxLength={maxLength}
                    step={step}
                    name={name}
                    autoComplete={autoComplete}
                    id={name || inputId}
                    aria-label={label}
                    value={value}
                    onChange={onChange}
                />

                {type === 'password' && (
                    <button type="button" className="text-primary" onClick={toggleShowPassword} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                        {showPassword ? <FaRegEye size={22} /> : <FaRegEyeSlash size={22} className="text-slate-400" />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Input;
