import React, { useState } from 'react';
import { MessageSquare, Settings, History, BarChart3, Send } from 'lucide-react';
import SMSSettings from './SMSSettings';
import SMSLogs from './SMSLogs';
import SMSStatistics from './SMSStatistics';
import SendTestSMS from './SendTestSMS';
import SMSBalance from './SMSBalance';
import DashHeader from '@/assets/component/DashboardComponents.jsx/DashHeader';
import DashMenu from '@/assets/component/DashboardComponents.jsx/DashMenu';
import { Helmet } from 'react-helmet';

export default function SMSDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'balance', label: 'Balance & Test', icon: Send },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'logs', label: 'SMS Logs', icon: History },
    { id: 'statistics', label: 'Statistics', icon: BarChart3 },
  ];

  return (
    <>
        <Helmet>
            <title>Manage Message Slides - Cargo Realm and Logistics</title>
        </Helmet>
        <DashHeader />
        <div className='flex flex-row justify-start gap-4'>
            <div className='hidden lg:block w-[20%]'>
            <DashMenu />
            </div>
            <div className="space-y-6 overflow-x-hidden">
            {/* Header */}
            <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
                <MessageSquare className="w-12 h-12 text-blue-600" />
                <div>
                <h1 className="text-2xl font-bold">SMS Management</h1>
                <p className="text-gray-600">
                    Configure and monitor SMS notifications for shipment updates
                </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow">
                <div className="flex border-b overflow-x-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 px-4 py-3 font-medium border-b-2 transition ${
                        activeTab === tab.id
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                    </button>
                    );
                })}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-900 mb-2">SMS Integration Active</h3>
                        <p className="text-blue-800 text-sm">
                        Your Cargo Realm Logistics system is connected to BulkSMS Nigeria for automated
                        shipment notifications. SMS messages will be automatically sent to senders and
                        recipients when shipments are created or their status changes.
                        </p>
                    </div>

                    <SMSBalance />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold mb-3">Quick Actions</h4>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-start space-x-2">
                            <span className="text-blue-600 font-bold">•</span>
                            <span>
                                <strong>Send Test SMS:</strong> Verify your SMS connection with a test
                                message
                            </span>
                            </li>
                            <li className="flex items-start space-x-2">
                            <span className="text-blue-600 font-bold">•</span>
                            <span>
                                <strong>Configure Settings:</strong> Customize when and to whom SMS are sent
                            </span>
                            </li>
                            <li className="flex items-start space-x-2">
                            <span className="text-blue-600 font-bold">•</span>
                            <span>
                                <strong>View SMS Logs:</strong> Track all SMS sent to customers
                            </span>
                            </li>
                            <li className="flex items-start space-x-2">
                            <span className="text-blue-600 font-bold">•</span>
                            <span>
                                <strong>Monitor Statistics:</strong> Analyze SMS performance and usage
                            </span>
                            </li>
                        </ul>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold mb-3">Supported Events</h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                            <li>✓ Shipment Creation</li>
                            <li>✓ Status Updates</li>
                            <li>✓ Out for Delivery</li>
                            <li>✓ Delivery Confirmation</li>
                            <li>✓ Shipment Delays</li>
                            <li>✓ Cancellations</li>
                            <li>✓ Exception/Issue Alerts</li>
                        </ul>
                        </div>
                    </div>
                    </div>
                )}

                {activeTab === 'balance' && (
                    <div className="space-y-6">
                    <SMSBalance />
                    <SendTestSMS />
                    </div>
                )}

                {activeTab === 'settings' && <SMSSettings />}

                {activeTab === 'logs' && <SMSLogs />}

                {activeTab === 'statistics' && <SMSStatistics />}
                </div>
            </div>

            {/* Footer Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                <p>
                <strong>Note:</strong> SMS charges will be deducted from your BulkSMS Nigeria account
                balance. Monitor your balance and logs regularly to track usage and costs.
                </p>
            </div>
            </div>
        </div>
    </>
  );
}
