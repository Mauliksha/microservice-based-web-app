import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Clock, Server } from 'lucide-react'
import { api } from '../services/api'

export function Home() {
  const [apiStatus, setApiStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkApiStatus()
  }, [])

  const checkApiStatus = async () => {
    try {
      setLoading(true)
      const response = await api.get('/status')
      setApiStatus(response.data)
    } catch (error) {
      console.error('Failed to fetch API status:', error)
      setApiStatus(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to MicroService App
        </h1>
        <p className="text-xl text-blue-100 mb-6">
          A modern, scalable web application built with microservices architecture
        </p>
        <div className="flex space-x-4">
          <button
            onClick={checkApiStatus}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Check API Status
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* API Status Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">API Status</p>
              {loading ? (
                <div className="flex items-center mt-2">
                  <Clock className="h-5 w-5 text-yellow-500 animate-spin" />
                  <span className="ml-2 text-sm text-yellow-600">Checking...</span>
                </div>
              ) : apiStatus ? (
                <div className="flex items-center mt-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="ml-2 text-sm text-green-600">Online</span>
                </div>
              ) : (
                <div className="flex items-center mt-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="ml-2 text-sm text-red-600">Offline</span>
                </div>
              )}
            </div>
            <Server className="h-8 w-8 text-gray-400" />
          </div>
          {apiStatus && (
            <div className="mt-4 text-xs text-gray-500">
              <p>Version: {apiStatus.version}</p>
              <p>Environment: {apiStatus.environment}</p>
              <p>Last check: {new Date(apiStatus.timestamp).toLocaleTimeString()}</p>
            </div>
          )}
        </div>

        {/* Features Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Features</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              User Management
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Admin Dashboard
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              API Health Monitoring
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Responsive Design
            </li>
          </ul>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-3 py-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors text-sm">
              View Users
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors text-sm">
              Admin Panel
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors text-sm">
              API Documentation
            </button>
          </div>
        </div>
      </div>

      {/* Architecture Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Architecture Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <Server className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900">Frontend</h3>
            <p className="text-sm text-gray-600">React + Vite</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="w-12 h-12 mx-auto bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <Server className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900">API Gateway</h3>
            <p className="text-sm text-gray-600">Load Balancer</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="w-12 h-12 mx-auto bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <Server className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900">Microservices</h3>
            <p className="text-sm text-gray-600">ECS Fargate</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="w-12 h-12 mx-auto bg-yellow-100 rounded-lg flex items-center justify-center mb-3">
              <Server className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="font-medium text-gray-900">Database</h3>
            <p className="text-sm text-gray-600">Aurora Serverless</p>
          </div>
        </div>
      </div>
    </div>
  )
}