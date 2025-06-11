'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useConfigData } from '@/lib/hooks/useConfigData';

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export default function SettingsPage() {
  // Use the config hook for real data
  const { config, isLoading, error, isUpdating, updateError, refetch, updateConfig } = useConfigData();
  
  // Local state for form values
  const [syncInterval, setSyncInterval] = useState('300');
  const [selectedTests, setSelectedTests] = useState({
    http: true,
    ping: true,
    dns: true,
    web: false,
    sms: false,
  });

  // Update local state when config is loaded
  useEffect(() => {
    if (config) {
      setSyncInterval(config.samplingIntervalSeconds.toString());
      
      // Convert backend test types to local state format
      const testState = {
        http: config.testTypes.includes('http'),
        ping: config.testTypes.includes('ping'),
        dns: config.testTypes.includes('dns'),
        web: config.testTypes.includes('web'),
        sms: config.testTypes.includes('sms'),
      };
      setSelectedTests(testState);
    }
  }, [config]);

  // User management state
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      email: 'admin@example.com',
      role: 'admin',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      email: 'user1@example.com',
      role: 'user',
      createdAt: '2024-01-20',
    },
    {
      id: '3',
      email: 'user2@example.com',
      role: 'user',
      createdAt: '2024-01-22',
    },
  ]);

  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    role: 'user' as 'user' | 'admin',
  });

  const handleTestChange = (testType: keyof typeof selectedTests) => {
    setSelectedTests(prev => ({
      ...prev,
      [testType]: !prev[testType]
    }));
  };

  const handleAddUser = () => {
    if (!newUser.email || !newUser.password) {
      alert('Please fill in all required fields');
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      email: newUser.email,
      role: newUser.role,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setUsers(prev => [...prev, user]);
    setNewUser({ email: '', password: '', role: 'user' });
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const handleSaveSettings = async () => {
    // Validate sync interval
    const intervalValue = parseInt(syncInterval);
    if (isNaN(intervalValue) || intervalValue < 60 || intervalValue > 3600) {
      alert('Sampling interval must be between 60 and 3600 seconds');
      return;
    }

    // Get selected test types
    const testTypes = Object.entries(selectedTests)
      .filter(([_, enabled]) => enabled)
      .map(([testType, _]) => testType);

    if (testTypes.length === 0) {
      alert('At least one test type must be selected');
      return;
    }

    try {
      const success = await updateConfig({
        samplingIntervalSeconds: intervalValue,
        testTypes: testTypes
      });

      if (success) {
        alert('Settings saved successfully!');
      } else {
        alert(updateError || 'Failed to save settings');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Failed to save settings. Please try again.');
    }
  };

  const inputClasses = "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
  const selectClasses = "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900";

  const testOptions = [
    { id: 'http', label: 'HTTP Tests', description: 'Monitor HTTP endpoint response times and availability' },
    { id: 'ping', label: 'Ping Tests', description: 'Check network connectivity and latency' },
    { id: 'dns', label: 'DNS Tests', description: 'Test DNS resolution performance' },
    { id: 'web', label: 'Web Tests', description: 'Monitor web page loading performance' },
    { id: 'sms', label: 'SMS Tests', description: 'Monitor SMS delivery and response times' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={refetch}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <svg className={`-ml-1 mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={isUpdating}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isUpdating && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            Save Changes
          </button>
        </div>
      </div>

      {/* Show error messages */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading configuration</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {updateError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error saving configuration</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{updateError}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Data Collection Settings</h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-2 text-gray-600">Loading configuration...</span>
            </div>
          ) : (
            <div className="max-w-xl space-y-6">
              <div>
                <label className={labelClasses}>
                  Data Synchronization Interval (seconds)
                </label>
                <input
                  type="number"
                  value={syncInterval}
                  onChange={(e) => setSyncInterval(e.target.value)}
                  min="60"
                  max="3600"
                  step="60"
                  className={inputClasses}
                  placeholder="Enter interval in seconds"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Minimum: 60 seconds, Maximum: 3600 seconds (1 hour)
                </p>
              </div>

              <div>
                <label className={labelClasses}>
                  Active Test Types
                </label>
                <div className="mt-2 space-y-3">
                  {testOptions.map((test) => (
                    <label key={test.id} className="flex items-start">
                      <input
                        type="checkbox"
                        checked={selectedTests[test.id as keyof typeof selectedTests]}
                        onChange={() => handleTestChange(test.id as keyof typeof selectedTests)}
                        className="mt-0.5 rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      <div className="ml-3">
                        <span className="text-sm font-medium text-gray-700">{test.label}</span>
                        <p className="text-sm text-gray-500">{test.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Select which types of tests should be automatically executed during data collection.
                </p>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Export Settings</h2>
          <div className="max-w-xl space-y-4">
            <div>
              <label className={labelClasses}>
                Default Export Format
              </label>
              <select
                defaultValue="csv"
                className={selectClasses}
              >
                <option value="csv">CSV</option>
                <option value="kml">KML</option>
                <option value="json">JSON</option>
              </select>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Include device information in exports
                </span>
              </label>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">User Settings</h2>
          
          {/* Add New User Form */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-md font-medium text-gray-900 mb-4">Add New User</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className={labelClasses}>Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  className={inputClasses}
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className={labelClasses}>Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  className={inputClasses}
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className={labelClasses}>Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as 'user' | 'admin' }))}
                  className={selectClasses}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAddUser}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>

          {/* Users List */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
} 