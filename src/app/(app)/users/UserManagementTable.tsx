"use client"
import CustomPagination from '@/components/shared/CustomPagination'
import { CircleCheck, Loader2, Search, UserRound } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { useGetUserQuery } from '@/redux/features/user/user.api'

const avatarColors = [
    "bg-blue-100 text-blue-600",
    "bg-purple-100 text-purple-600",
    "bg-orange-100 text-orange-600",
    "bg-green-100 text-green-600",
    "bg-pink-100 text-pink-600",
    "bg-teal-100 text-teal-600",
    "bg-yellow-100 text-yellow-700",
    "bg-red-100 text-red-600",
];

const UserManagementTable = () => {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const { data: users = [], isLoading, isError } = useGetUserQuery();

    

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        });
    };

    const filteredUsers = useMemo(() => {
        let result = users;

        if (search) {
            const query = search.toLowerCase();
            result = result.filter(
                (u) =>
                    u.name.toLowerCase().includes(query) ||
                    u.email.toLowerCase().includes(query)
            );
        }

        return result;
    }, [search, users]);

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedUsers = useMemo(() => {
        const startIndex = (safeCurrentPage - 1) * pageSize;

        return filteredUsers.slice(startIndex, startIndex + pageSize);
    }, [filteredUsers, pageSize, safeCurrentPage]);

    return (
        <div>
            <div className="mb-6 flex items-center gap-4 flex-col md:flex-row">

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full h-10 rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                    />
                </div>

            </div>


            <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
                <table className="w-full min-w-180">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="font-semibold text-description text-left px-5 py-4 text-sm">User</th>
                            <th className="font-semibold text-description text-left px-3 py-4 text-sm">Status</th>
                            <th className="font-semibold text-description text-left px-3 py-4 text-sm">Joined Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={4} className="text-center py-12 text-description">
                                    <div className="inline-flex items-center gap-2">
                                        <Loader2 className="size-4 animate-spin" />
                                        Loading users...
                                    </div>
                                </td>
                            </tr>
                        ) : isError ? (
                            <tr>
                                <td colSpan={4} className="text-center py-12 text-red-600">
                                    Failed to load users
                                </td>
                            </tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-12 text-description">
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            paginatedUsers.map((user, index) => (
                                <tr key={user.id} className="hover:bg-slate-50/70 border-b border-slate-200 last:border-b-0 align-top">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`size-9 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 ${avatarColors[((safeCurrentPage - 1) * pageSize + index) % avatarColors.length]}`}>
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-title text-sm">{user.name}</p>
                                                <p className="text-description text-xs mt-0.5">{user.email || "-"}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        {user.is_verified ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium px-2.5 py-1">
                                                <CircleCheck className="size-3.5" />
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium px-2.5 py-1">
                                                <UserRound className="size-3.5" />
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="text-description px-3 py-4 text-sm whitespace-nowrap">{formatDate(user.date_joined)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <CustomPagination
                    currentPage={safeCurrentPage}
                    totalItems={filteredUsers.length}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                    itemLabel="users"
                />
            </div>
        </div>
    )
}

export default UserManagementTable
