import React from 'react';
import { Wallet, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function SMSBalance() {
  const token = localStorage.getItem('token');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['smsBalance'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/sms/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">Failed to load balance information</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow p-6 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Wallet className="w-12 h-12 opacity-80" />
          <div>
            <p className="text-blue-100 text-sm">Current Balance</p>
            <p className="text-3xl font-bold">
              {isLoading ? 'Loading...' : (data?.balance?.total_balance ? data.balance.total_balance.toLocaleString() : '0')}
            </p>
            {data?.currency && <p className="text-blue-100 text-sm">{data.currency}</p>}
          </div>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isLoading}
          className="p-2 bg-white/20 hover:bg-white/30 rounded-full disabled:opacity-50"
          title="Refresh balance"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {data?.balance && (
        <div className="mt-4 pt-4 border-t border-blue-400 grid grid-cols-3 gap-4 text-xs">
          {data.balance.universal_wallet && (
            <div>
              <span className="text-blue-100 block mb-1">Universal Wallet</span>
              <p className="font-medium">{parseFloat(data.balance.universal_wallet).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</p>
            </div>
          )}
          {data.balance.sms_bonus && (
            <div>
              <span className="text-blue-100 block mb-1">SMS Bonus</span>
              <p className="font-medium">{parseFloat(data.balance.sms_bonus).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</p>
            </div>
          )}
          {data.balance.sms_wallet && (
            <div>
              <span className="text-blue-100 block mb-1">SMS Wallet</span>
              <p className="font-medium">{parseFloat(data.balance.sms_wallet).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
