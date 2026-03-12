"use client";
import { useState } from "react";
import { KeyRound, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1b3a5c]/30 focus:border-[#1b3a5c] transition pr-11";

export default function ChangePasswordPage() {
    const [show, setShow] = useState({ current: false, newPass: false, confirm: false });

    const toggle = (field: keyof typeof show) =>
        setShow((prev) => ({ ...prev, [field]: !prev[field] }));

    

    return (
        <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-3">
                <Link href={"/settings"} className="cursor-pointer">
                    <ArrowLeft />
                </Link>
                <div>
                    <h1 className="text-2xl font-medium text-title">Change Password</h1>
                    <p className="text-description text-sm">Update your password to ensure account security.</p>
                </div>
            </div>
            <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center gap-2 mb-6">
                    <KeyRound className="size-5 text-description" />
                    <h2 className="font-semibold text-title">Security Settings</h2>
                </div>

                <form className="space-y-5">
                    {/* Current Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-1.5">Current Password</label>
                        <div className="relative">
                            <input
                                type={show.current ? "text" : "password"}
                                placeholder="Enter current password"
                                className={inputClass}
                            />
                            <button type="button" onClick={() => toggle("current")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {show.current ? <Eye size={17} /> : <EyeOff size={17} />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-1.5">New Password</label>
                        <div className="relative">
                            <input
                                type={show.newPass ? "text" : "password"}
                                placeholder="Enter new password"
                                className={inputClass}
                            />
                            <button type="button" onClick={() => toggle("newPass")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {show.newPass ? <Eye size={17} /> : <EyeOff size={17} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-1.5">Confirm New Password</label>
                        <div className="relative">
                            <input
                                type={show.confirm ? "text" : "password"}
                                placeholder="Confirm new password"
                                className={inputClass}
                            />
                            <button type="button" onClick={() => toggle("confirm")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {show.confirm ? <Eye size={17} /> : <EyeOff size={17} />}
                            </button>
                        </div>
                    </div>

                    <Button type="submit" className="bg-heading hover:bg-heading/90 text-white rounded-lg px-6">
                        Change Password
                    </Button>
                </form>
            </div>
        </div>
    );
}
