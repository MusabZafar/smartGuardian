"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddEmployeeModal({ onClose, onSave, existingEmployee }) {
    const [employeeData, setEmployeeData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        username: '',
        birthDate: '',
        hireDate: '',
        terminationDate: '',
        annualSalary: '',
        userTypeId: '',
        additionalInfo: ''
    });

    const [userTypes, setUserTypes] = useState([]);

    useEffect(() => {
        const fetchUserTypes = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/user-types', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserTypes(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Failed to fetch user types", error);
            }
        };
        fetchUserTypes();
    }, []);

    useEffect(() => {
        if (existingEmployee) {
            setEmployeeData({
                firstName: existingEmployee.firstName || '',
                lastName: existingEmployee.lastName || '',
                email: existingEmployee.email || '',
                phoneNumber: existingEmployee.phoneNumber || '',
                username: existingEmployee.username || '',
                birthDate: existingEmployee.birthDate || '',
                hireDate: existingEmployee.hireDate || '',
                terminationDate: existingEmployee.terminationDate || '',
                annualSalary: existingEmployee.annualSalary || '',
                userTypeId: existingEmployee.userTypeId || '',
                additionalInfo: existingEmployee.additionalInfo || ''
            });
        }
    }, [existingEmployee]);
    

    const handleChange = (e) => {
        setEmployeeData({ ...employeeData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        onSave(employeeData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-4">
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Add Employee</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['firstName', 'lastName', 'email', 'phoneNumber', 'username'].map((field, index) => (
                        <div key={index} className="w-full h-12 relative flex rounded-xl">
                            <input
                                required
                                name={field}
                                value={employeeData[field]}
                                onChange={handleChange}
                                className="peer w-full bg-transparent outline-none px-4 text-base rounded-xl bg-white border border-[#4070f4] focus:shadow-md"
                                type={field === 'email' ? 'email' : 'text'}
                            />
                            <label
                                className="absolute top-1/2 translate-y-[-50%] bg-white left-4 px-2 peer-focus:top-0 peer-focus:left-3 font-light text-base peer-focus:text-sm peer-focus:text-[#4070f4] peer-valid:-top-0 peer-valid:left-3 peer-valid:text-sm peer-valid:text-[#4070f4] duration-150"
                                htmlFor={field}
                            >
                                {field === 'firstName' ? 'First Name' : 
                                 field === 'lastName' ? 'Last Name' : 
                                 field === 'email' ? 'Email Address' : 
                                 field === 'phoneNumber' ? 'Phone Number' : 
                                 'Username'}
                            </label>
                        </div>
                    ))}

                    <div className="w-full h-12 relative flex rounded-xl">
                        <input
                            name="birthDate"
                            type="date"
                            value={employeeData.birthDate}
                            onChange={handleChange}
                            className="peer w-full bg-transparent outline-none px-4 text-base rounded-xl bg-white border border-[#4070f4] focus:shadow-md"
                        />
                        <label
                            className="absolute top-1/2 translate-y-[-50%] bg-white left-4 px-2 peer-focus:top-0 peer-focus:left-3 font-light text-base peer-focus:text-sm peer-focus:text-[#4070f4] peer-valid:-top-0 peer-valid:left-3 peer-valid:text-sm peer-valid:text-[#4070f4] duration-150"
                        >
                            Birth Date
                        </label>
                    </div>

                    <div className="w-full h-12 relative flex rounded-xl">
                        <input
                            name="hireDate"
                            type="date"
                            value={employeeData.hireDate}
                            onChange={handleChange}
                            className="peer w-full bg-transparent outline-none px-4 text-base rounded-xl bg-white border border-[#4070f4] focus:shadow-md"
                        />
                        <label
                            className="absolute top-1/2 translate-y-[-50%] bg-white left-4 px-2 peer-focus:top-0 peer-focus:left-3 font-light text-base peer-focus:text-sm peer-focus:text-[#4070f4] peer-valid:-top-0 peer-valid:left-3 peer-valid:text-sm peer-valid:text-[#4070f4] duration-150"
                        >
                            Hire Date
                        </label>
                    </div>

                    <div className="w-full h-12 relative flex rounded-xl">
                        <input
                            name="terminationDate"
                            type="date"
                            value={employeeData.terminationDate}
                            onChange={handleChange}
                            className="peer w-full bg-transparent outline-none px-4 text-base rounded-xl bg-white border border-[#4070f4] focus:shadow-md"
                        />
                        <label
                            className="absolute top-1/2 translate-y-[-50%] bg-white left-4 px-2 peer-focus:top-0 peer-focus:left-3 font-light text-base peer-focus:text-sm peer-focus:text-[#4070f4] peer-valid:-top-0 peer-valid:left-3 peer-valid:text-sm peer-valid:text-[#4070f4] duration-150"
                        >
                            Termination Date
                        </label>
                    </div>

                    <div className="w-full h-12 relative flex rounded-xl">
                        <input
                            name="annualSalary"
                            type="number"
                            value={employeeData.annualSalary}
                            onChange={handleChange}
                            className="peer w-full bg-transparent outline-none px-4 text-base rounded-xl bg-white border border-[#4070f4] focus:shadow-md"
                        />
                        <label
                            className="absolute top-1/2 translate-y-[-50%] bg-white left-4 px-2 peer-focus:top-0 peer-focus:left-3 font-light text-base peer-focus:text-sm peer-focus:text-[#4070f4] peer-valid:-top-0 peer-valid:left-3 peer-valid:text-sm peer-valid:text-[#4070f4] duration-150"
                        >
                            Annual Salary
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">User Type</label>
                        <select
                            name="userTypeId"
                            value={employeeData.userTypeId}
                            onChange={handleChange}
                            className="mt-1 p-3 border border-[#4070f4] rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="">Select User Type</option>
                            {Array.isArray(userTypes) && userTypes.length > 0 ? (
                                userTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.typeName}
                                    </option>
                                ))
                            ) : (
                                <option value="">Loading User Types...</option>
                            )}
                        </select>
                    </div>
                </div>

                <div className="mt-4 w-full h-12 relative flex rounded-xl">
                    <textarea
                        name="additionalInfo"
                        value={employeeData.additionalInfo}
                        onChange={handleChange}
                        className="peer w-full bg-transparent outline-none px-4 text-base rounded-xl bg-white border border-[#4070f4] focus:shadow-md"
                        placeholder=" "
                    />
                    <label
                        className="absolute top-1/2 translate-y-[-50%] bg-white left-4 px-2 peer-focus:top-0 peer-focus:left-3 font-light text-base peer-focus:text-sm peer-focus:text-[#4070f4] peer-valid:-top-0 peer-valid:left-3 peer-valid:text-sm peer-valid:text-[#4070f4] duration-150"
                    >
                        Additional Information
                    </label>
                </div>

                <div className="mt-6 flex justify-end">
                    <button onClick={onClose} className="px-5 py-2 text-gray-600 bg-gray-200 rounded-lg mr-2 hover:bg-gray-300 transition">
                        Close
                    </button>
                    <button onClick={handleSave} className="px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                        {existingEmployee ? 'Update' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
}
