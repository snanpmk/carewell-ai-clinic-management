"use client";

import { Settings as SettingsIcon, Shield, User, Bell } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both max-w-4xl mx-auto">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-6 mb-8">
        <div className="p-3 bg-slate-100 rounded-xl">
          <SettingsIcon className="w-8 h-8 text-slate-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your clinic preferences and profile.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Doctor Profile</h3>
              <p className="text-sm text-slate-500 mt-0.5">Update your personal and professional details.</p>
            </div>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            Edit
          </button>
        </div>

        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Security & Privacy</h3>
              <p className="text-sm text-slate-500 mt-0.5">Manage passwords and patient data privacy settings.</p>
            </div>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors">
            Configure
          </button>
        </div>

        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Notifications</h3>
              <p className="text-sm text-slate-500 mt-0.5">Alerts for upcoming appointments and reminders.</p>
            </div>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors">
            Manage
          </button>
        </div>
      </div>
    </div>
  );
}
