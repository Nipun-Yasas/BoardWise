"use client";

import useSWR, { mutate } from "swr";

import { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    Camera,
    Edit2,
    Save,
    X,
    User,
    Mail,
    GraduationCap,
    Building2,
    BookOpen,
    Briefcase,
    Phone,
} from "lucide-react";
import Image from "next/image";
import Input from "@/app/_components/inputs/Input";
import Select from "@/app/_components/inputs/Select";
import { Button } from "@/app/_components/Button";
import axiosInstance, { API_PATHS } from "@/lib/axios";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";
import { Hourglass } from 'ldrs/react'
import 'ldrs/react/Hourglass.css'

const ProfileSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    role: Yup.string().required("Role is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    mobile_number: Yup.string().required("Phone number is required"),
    university: Yup.string().optional(),
    faculty: Yup.string().optional(),
    academicYear: Yup.string().optional(),
});

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

export default function UserProfile() {
    const { user } = useAuth();
    const { resolvedTheme } = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: profileData, error, isLoading } = useSWR(API_PATHS.PROFILE.GET, fetcher);

    const formik = useFormik({
        initialValues: {
            name: "",
            role: "",
            email: "",
            mobile_number: "",
            university: "",
            faculty: "",
            academicYear: "",
            image: null,
        },
        validationSchema: ProfileSchema,
        onSubmit: async (values) => {
            try {
                const response = await axiosInstance.put(API_PATHS.PROFILE.UPDATE, {
                    ...values,
                    image: previewImage || values.image
                });

                if (response.data.success) {
                    toast.success("Profile updated successfully");
                    setIsEditing(false);
                    mutate(API_PATHS.PROFILE.GET); // Revalidate SWR
                }
            } catch (error: any) {
                console.error("Error updating profile:", error);
                if (error.response) {
                    toast.error(error.response?.data?.error || `Failed: ${error.response.statusText}`);
                } else {
                    toast.error("Failed to update profile. Network error or server unreachable.");
                }
            }
        },
    });

    // Sync SWR data with Formik
    useEffect(() => {
        if (profileData?.user) {
            const userData = profileData.user;
            const formattedData = {
                name: userData.name || "",
                role: userData.role || "",
                email: userData.email || "",
                mobile_number: userData.mobile_number || "",
                university: userData.university || "",
                faculty: userData.faculty || "",
                academicYear: userData.academicYear || "",
                image: userData.image || null,
            };
            formik.setValues(formattedData);
            if (!isEditing) {
                setPreviewImage(userData.image || null);
            }
        }
    }, [profileData, isEditing]); // Re-sync when data changes or editing mode toggles off (cancel)


    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Check file size (limit to 2MB)
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image size should be less than 2MB");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleEdit = () => {
        if (isEditing) {
            // Revert changes using SWR data
            if (profileData?.user) {
                const userData = profileData.user;
                formik.setValues({
                    name: userData.name || "",
                    role: userData.role || "",
                    email: userData.email || "",
                    mobile_number: userData.mobile_number || "",
                    university: userData.university || "",
                    faculty: userData.faculty || "",
                    academicYear: userData.academicYear || "",
                    image: userData.image || null,
                });
                setPreviewImage(userData.image || null);
            }
        }
        setIsEditing(!isEditing);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Hourglass
            size="40"
            bgOpacity="0.1"
            speed="1.75"
            color={resolvedTheme === "dark" ? "white" : "black"}
        /></div>
    }

    return (
        <div className="p-6 lg:p-10 space-y-8 animate-fadeIn h-full overflow-y-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-textPrimary">My Profile</h1>
                    <p className="text-textSecondary font-light mt-1">
                        Manage your personal information
                    </p>
                </div>

                <Button
                    onClick={isEditing ? formik.submitForm : () => setIsEditing(true)}
                    frontIcon={isEditing ? <Save size={18} /> : <Edit2 size={18} />}
                >
                    {isEditing ? "Save" : "Edit"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="col-span-1">
                    <div className="bg-backgroundSecondary rounded-3xl p-8 border border-borderPrimary flex flex-col items-center text-center ">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-full overflow-hidden relative flex items-center justify-center bg-hoverPrimary">
                                {previewImage ? (
                                    <Image
                                        src={previewImage}
                                        alt="Profile"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <span className="text-textSecondary text-sm font-medium">
                                        No profile photo
                                    </span>
                                )}
                            </div>

                            {isEditing && (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-2 right-2 text-white bg-primary p-3 rounded-full transition-colors cursor-pointer"
                                >
                                    <Camera size={20} />
                                </button>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>

                        <div className="mt-6 space-y-2">
                            <h2 className="text-2xl font-bold text-textPrimary">
                                {formik.values.name}
                            </h2>
                            <p className="text-textSecondary font-medium bg-slate-100 dark:bg-neutral-800 px-4 py-1 rounded-full inline-block capitalize">
                                {formik.values.role}
                            </p>
                        </div>

                        {isEditing && (
                            <div className="mt-8 pt-8 border-t border-borderPrimary w-full">
                                <Button
                                    onClick={toggleEdit}
                                    frontIcon={<X size={18} />}
                                >
                                    Cancel Editing
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-span-1 lg:col-span-2">
                    <div className="bg-backgroundSecondary rounded-3xl p-8 shadow-sm border border-borderPrimary">
                        <h3 className="text-xl font-bold text-textPrimary mb-6 flex items-center gap-2">
                            <User className="text-blue-500" />
                            Personal Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-2">
                                <Input
                                    type="text"
                                    name="name"
                                    label="Full Name"
                                    disabled={!isEditing}
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`w-full ${isEditing ? "" : "bg-transparent border-none p-0"}`}
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">
                                        {formik.errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Input
                                    type="text"
                                    name="role"
                                    label="Role"
                                    icon={<Briefcase size={14} />}
                                    disabled={true} // Role usually shouldn't be editable by user
                                    value={formik.values.role}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`w-full ${isEditing ? "" : "bg-transparent border-none p-0 capitalize"}`}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Input
                                    type="email"
                                    name="email"
                                    label="Email Address"
                                    icon={<Mail size={14} />}
                                    disabled={true} // Email usually shouldn't be editable
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`w-full ${isEditing ? "" : "bg-transparent border-none p-0"}`}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Input
                                    type="text"
                                    name="mobile_number"
                                    label="Mobile Number"
                                    icon={<Phone size={14} />}
                                    disabled={!isEditing}
                                    value={formik.values.mobile_number}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`w-full ${isEditing ? "" : "bg-transparent border-none p-0"}`}
                                />
                                {formik.touched.mobile_number && formik.errors.mobile_number && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">
                                        {formik.errors.mobile_number}
                                    </p>
                                )}
                            </div>

                            {formik.values.role !== "Owner" && (
                                <>
                                    <div className="col-span-1 md:col-span-2 pt-6 border-t border-slate-100 dark:border-neutral-800">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                            <GraduationCap className="text-purple-500" />
                                            Academic Details
                                        </h3>
                                    </div>

                                    <div className="space-y-2">
                                        <Input
                                            type="text"
                                            name="university"
                                            label="University"
                                            icon={<Building2 size={14} />}
                                            disabled={!isEditing}
                                            value={formik.values.university}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`w-full ${isEditing ? "" : "bg-transparent border-none p-0"}`}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Input
                                            type="text"
                                            name="faculty"
                                            label="Faculty"
                                            icon={<BookOpen size={14} />}
                                            disabled={!isEditing}
                                            value={formik.values.faculty}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`w-full ${isEditing ? "" : "bg-transparent border-none p-0"}`}
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Select
                                            name="academicYear"
                                            label="Academic Year"
                                            disabled={!isEditing}
                                            value={formik.values.academicYear}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`w-full ${isEditing ? "" : "bg-transparent border-none p-0"}`}
                                        >
                                            <option value="">Select Year</option>
                                            <option value="1st Year">1st Year</option>
                                            <option value="2nd Year">2nd Year</option>
                                            <option value="3rd Year">3rd Year</option>
                                            <option value="4th Year">4th Year</option>
                                        </Select>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
