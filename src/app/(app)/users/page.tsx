'use client'

import React from 'react'
import Stats from './Stats'
import UserManagementTable from './UserManagementTable'
import { useGetUserQuery, useUserStatsQuery } from '@/redux/features/user/user.api'
import { Skeleton } from '@/components/ui/skeleton'

const UserManagementPage = () => {
  const { isLoading: isUsersLoading } = useGetUserQuery()
  const { isLoading: isStatsLoading } = useUserStatsQuery()
  const isLoading = isUsersLoading || isStatsLoading

  return (
    <div>
      <div className="mb-6">
        {isLoading ? (
          <div>
            <Skeleton className="h-8 w-48 mb-2 animate-pulse" />
            <Skeleton className="h-4 w-96 animate-pulse" />
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold text-title">
              User Management
            </h1>
            <p className="text-sm text-description mt-1">
              View and manage app users and their activity
            </p>
          </div>
        )}
      </div>

      <Stats />

      <UserManagementTable />
    </div>
  )
}

export default UserManagementPage
