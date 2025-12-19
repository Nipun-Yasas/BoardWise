"use client";

import { useState, useRef } from "react";
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
} from "lucide-react";
import Image from "next/image";
import Input from "@/app/_components/inputs/Input";
import Select from "@/app/_components/inputs/Select";
import { Button } from "@/app/_components/Button";

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  role: Yup.string().required("Role is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  university: Yup.string().required("University is required"),
  faculty: Yup.string().required("Faculty is required"),
  academicYear: Yup.string().required("Academic Year is required"),
});

export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: {
      name: "John Doe",
      role: "Student",
      email: "john.doe@example.com",
      university: "University of Colombo",
      faculty: "Faculty of Computing",
      academicYear: "3rd Year",
    },
    validationSchema: ProfileSchema,
    onSubmit: (values) => {
      console.log("Form values:", values);
      console.log("Image:", previewImage);
      setIsEditing(false);
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      formik.resetForm();
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 animate-fadeIn">
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
          <div className="bg-backgroundSecondary rounded-3xl p-8 shadow-sm border border-borderPrimary flex flex-col items-center text-center h-full">
            <div className="relative group">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-borderPrimary dark:border-neutral-800 shadow-lg relative">
                <Image
                  src={
                    previewImage ||
                    "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix"
                  }
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>

              {isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-hoverPrimary text-white p-3 rounded-full transition-colors shadow-lg"
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
              <p className="text-textSecondary font-medium bg-slate-100 dark:bg-neutral-800 px-4 py-1 rounded-full inline-block">
                {formik.values.role}
              </p>
            </div>

            {isEditing && (
              <div className="mt-8 pt-8 border-t border-borderPrimary w-full">
                <Button
                  onClick={toggleEdit}
                  frontIcon={<X size={18} />}
                  className=""
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
                <div
                  className={`relative transition-all duration-200 ${
                    isEditing ? "opacity-100" : "opacity-80"
                  }`}
                >
                  <Input
                    type="text"
                    name="name"
                    label="Full Name"
                    disabled={!isEditing}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-5 py-3 rounded-xl border border-borderPrimary outline-none transition-all ${
                      isEditing
                        ? "border-borderPrimary focus:border-borderPrimary focus:ring-1 focus:ring-borderPrimary"
                        : "border-borderPrimary focus:border-borderPrimary pl-3 "
                    }`}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                      {formik.errors.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div
                  className={`relative transition-all duration-200 ${
                    isEditing ? "opacity-100" : "opacity-80"
                  }`}
                >
                  <Input
                    type="text"
                    name="role"
                    label="Role"
                    icon={<Briefcase size={14} />}
                    disabled={!isEditing}
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-5 py-3 rounded-xl border border-borderPrimary outline-none transition-all ${
                      isEditing
                        ? "border-borderPrimary focus:border-borderPrimary focus:ring-1 focus:ring-borderPrimary"
                        : "border-borderPrimary focus:border-borderPrimary pl-3 "
                    }`}
                  />
                  {formik.touched.role && formik.errors.role && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                      {formik.errors.role}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <div
                  className={`relative transition-all duration-200 ${
                    isEditing ? "opacity-100" : "opacity-80"
                  }`}
                >
                  <Input
                    type="email"
                    name="email"
                    label="Email Address"
                    icon={<Mail size={14} />}
                    disabled={!isEditing}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-5 py-3 rounded-xl border border-borderPrimary outline-none transition-all ${
                      isEditing
                        ? "border-borderPrimary focus:border-borderPrimary focus:ring-1 focus:ring-borderPrimary"
                        : "border-borderPrimary focus:border-borderPrimary pl-3 "
                    }`}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                      {formik.errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 pt-6 border-t border-slate-100 dark:border-neutral-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <GraduationCap className="text-purple-500" />
                  Academic Details
                </h3>
              </div>

              <div className="space-y-2">
                <div
                  className={`relative transition-all duration-200 ${
                    isEditing ? "opacity-100" : "opacity-80"
                  }`}
                >
                  <Input
                    type="text"
                    name="university"
                    label="University"
                    icon={<Building2 size={14} />}
                    disabled={!isEditing}
                    value={formik.values.university}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-5 py-3 rounded-xl border border-borderPrimary outline-none transition-all ${
                      isEditing
                        ? "border-borderPrimary focus:border-borderPrimary focus:ring-1 focus:ring-borderPrimary"
                        : "border-borderPrimary focus:border-borderPrimary pl-3 "
                    }`}
                  />
                  {formik.touched.university && formik.errors.university && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                      {formik.errors.university}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div
                  className={`relative transition-all duration-200 ${
                    isEditing ? "opacity-100" : "opacity-80"
                  }`}
                >
                  <Input
                    type="text"
                    name="faculty"
                    label="Faculty"
                    icon={<BookOpen size={14} />}
                    disabled={!isEditing}
                    value={formik.values.faculty}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-5 py-3 rounded-xl border border-borderPrimary outline-none transition-all ${
                      isEditing
                        ? "border-borderPrimary focus:border-borderPrimary focus:ring-1 focus:ring-borderPrimary"
                        : "border-borderPrimary focus:border-borderPrimary pl-3 "
                    }`}
                  />
                  {formik.touched.faculty && formik.errors.faculty && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                      {formik.errors.faculty}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <div
                  className={`relative transition-all duration-200 ${
                    isEditing ? "opacity-100" : "opacity-80"
                  }`}
                >
                  <Select
                    name="academicYear"
                    label="Academic Year"
                    disabled={!isEditing}
                    value={formik.values.academicYear}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-5 py-3 rounded-xl border border-borderPrimary outline-none transition-all ${
                      isEditing
                        ? "border-borderPrimary focus:border-borderPrimary focus:ring-1 focus:ring-borderPrimary"
                        : "border-borderPrimary focus:border-borderPrimary pl-3 "
                    }`}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </Select>
                  {formik.touched.academicYear &&
                    formik.errors.academicYear && (
                      <p className="text-red-500 text-xs mt-1 ml-1">
                        {formik.errors.academicYear}
                      </p>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
