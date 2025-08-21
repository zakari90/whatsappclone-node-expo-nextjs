"use client"
import React, { useState, useRef, useEffect } from 'react';

interface EditableInputProps {
    initialValue: string;
    onSave?: (value: string) => void;
    className?: string;
    placeholder?: string;
}

const EditableInput: React.FC<EditableInputProps> = ({
    initialValue,
    onSave,
    className = '',
    placeholder = 'Click to edit'
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (onSave && value !== initialValue) {
            onSave(value);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleBlur();
        } else if (e.key === 'Escape') {
            setValue(initialValue);
            setIsEditing(false);
        }
    };

    return isEditing ? (
        <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={`px-2 py-1 border rounded ${className}`}
        />
    ) : (
        <div
            onDoubleClick={handleDoubleClick}
            className={`px-2 py-1 cursor-pointer ${className}`}
        >
            {value || placeholder}
        </div>
    );
};

export default EditableInput;