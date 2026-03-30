"use client";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserCircle, Bell, ArrowLeft, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/redux/features/settings/settings.api";
import { toast } from "react-toastify";

const schema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
});
type FormData = z.infer<typeof schema>;

const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1b3a5c]/30 focus:border-[#1b3a5c] transition";

export default function PersonalInformationPage() {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [notifications, setNotifications] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data: profile } = useGetProfileQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { name: "" },
    });

    useEffect(() => {
        if (!profile) return;

        reset({ name: profile.name || "" });
    }, [profile, reset]);

    const name = useWatch({ control, name: "name" });
    const email = profile?.email || "";
    const avatar = avatarPreview || profile?.image || null;

    const onSubmit = async (data: FormData) => {
        const formData = new FormData();
        formData.append("name", data.name);

        if (selectedImage) {
            formData.append("image", selectedImage);
        }

        try {
            const response = await updateProfile(formData).unwrap();
            toast.success(response.message || "Profile updated successfully.");
        } catch (error: unknown) {
            const message =
                typeof error === "object" &&
                error !== null &&
                "data" in error &&
                typeof (error as { data?: { message?: string; detail?: string } }).data === "object"
                    ? (error as { data?: { message?: string; detail?: string } }).data?.message ||
                    (error as { data?: { message?: string; detail?: string } }).data?.detail ||
                    "Failed to update profile."
                    : "Failed to update profile.";

            toast.error(message);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onload = () => setAvatarPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
                <Link href={"/settings"} className="cursor-pointer">
                    <ArrowLeft />
                </Link>
                <div>
                    <h1 className="text-2xl font-medium text-title">Personal Information</h1>
                    <p className="text-description text-sm">Manage your personal details and notification preferences.</p>
                </div>
            </div>

            {/* Admin Profile */}
            <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center gap-2 mb-5">
                    <UserCircle className="size-5 text-description" />
                    <h2 className="font-semibold text-title">Admin Profile</h2>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex items-start gap-5">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div
                                className="size-14 rounded-xl bg-heading flex items-center justify-center text-white text-2xl font-bold overflow-hidden cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {avatar ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={avatar} alt="avatar" className="size-full object-cover" />
                                ) : (
                                    (name).charAt(0).toUpperCase()
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-1.5 -right-1.5 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:bg-gray-50 transition"
                            >
                                <Camera className="size-3 text-heading" />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </div>

                        {/* Fields */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    {...register("name")}
                                    className={inputClass}
                                    placeholder="Your name"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    className={`${inputClass} cursor-not-allowed bg-gray-50 text-gray-400`}
                                    disabled
                                />
                            </div>
                            <Button type="submit" disabled={isUpdating} className="bg-heading hover:bg-heading/90 text-white rounded-lg px-6">
                                {isUpdating ? "Updating..." : "Update Profile"}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Notification Rules */}
            <div className="bg-white rounded-xl border px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Bell className="size-5 text-description" />
                        <span className="font-semibold text-title">Notification Rules</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setNotifications(!notifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${notifications ? "bg-heading" : "bg-gray-300"}`}
                    >
                        <span
                            className={`inline-block size-4 transform rounded-full bg-white shadow transition-transform ${notifications ? "translate-x-6" : "translate-x-1"}`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
