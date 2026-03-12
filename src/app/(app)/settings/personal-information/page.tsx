"use client";
import { useState } from "react";
import { UserCircle, Bell, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1b3a5c]/30 focus:border-[#1b3a5c] transition";

export default function PersonalInformationPage() {
    const [name, setName] = useState("Fernando");
    const [email, setEmail] = useState("fernando@areafinder.com");
    const [notifications, setNotifications] = useState(true);

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
                <div className="flex items-start gap-5">
                    {/* Avatar */}
                    <div className="size-14 rounded-xl bg-heading flex items-center justify-center text-white text-2xl font-bold shrink-0">
                        {name.charAt(0).toUpperCase()}
                    </div>
                    {/* Fields */}
                    <div className="flex-1 space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={inputClass}
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputClass}
                                placeholder="Enter your email"
                            />
                        </div>
                        <Button className="bg-heading hover:bg-heading/90 text-white rounded-lg px-6">
                            Update Profile
                        </Button>
                    </div>
                </div>
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
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${notifications ? "bg-heading" : "bg-gray-300"
                            }`}
                    >
                        <span
                            className={`inline-block size-4 transform rounded-full bg-white shadow transition-transform ${notifications ? "translate-x-6" : "translate-x-1"
                                }`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
