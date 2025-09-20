import { useState, useEffect } from 'react'
import { Users, Activity, Clock, Server, TrendingUp, Shield } from 'lucide-react'
import { api } from '../services/api'

export function Admin() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/dashboard')
      setDashboardData(response.data)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatUptime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const metrics = dashboardData?.metrics || {
    totalUsers: 0,
    activeUsers: 0,
    totalRequests: 0,
    uptime: 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor and manage your application</p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
        >
          <Activity className="h-4 w-4 mr-2" />
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.activeUsers}</p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalRequests}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Uptime</p>
              <p className="text-2xl font-bold text-gray-900">{formatUptime(metrics.uptime)}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">System Health</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Server className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-sm font-medium text-gray-700">API Server</span>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Healthy
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-sm font-medium text-gray-700">Database</span>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-sm font-medium text-gray-700">Load Balancer</span>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Operational
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Manage Users</div>
                  <div className="text-xs text-gray-500">View and edit user accounts</div>
                </div>
              </div>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-900">View Logs</div>
                  <div className="text-xs text-gray-500">Check application logs</div>
                </div>
              </div>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <Server className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-900">System Settings</div>
                  <div className="text-xs text-gray-500">Configure application settings</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">System started</span>
            </div>
            <span className="text-xs text-gray-500">Just now</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">Database connection established</span>
            </div>
            <span className="text-xs text-gray-500">2 minutes ago</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-yellow-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">Load balancer health check passed</span>
            </div>
            <span className="text-xs text-gray-500">5 minutes ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}