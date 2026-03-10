"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Card } from "@/components/ui/Card";
import { UserPlus, Mail, ShieldCheck, Loader2, ArrowRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import apiClient from "@/services/apiClient";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const isPrimary = user?.role === "primary";
  console.log(isPrimary);
  console.log(user);

  const inviteMutation = useMutation({
    mutationFn: async (inviteEmail: string) => {
      const { data } = await apiClient.post(`/api/auth/invite`, { email: inviteEmail });
      return data;
    },
    onSuccess: () => {
      setMessage({ type: "success", text: "Invitation sent successfully!" });
      setEmail("");
    },
    onError: (err: any) => {
      setMessage({ type: "error", text: err?.response?.data?.error || "Failed to send invite." });
    }
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setMessage(null);
    inviteMutation.mutate(email);
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
             <div className="p-2 bg-blue-100 rounded-xl"><ShieldCheck className="w-6 h-6 text-blue-600" /></div>
             Settings & Team
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium italic">Manage your clinic preferences and staff access.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
        {/* Profile Card */}
        <Card className="p-8 border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-blue-50 to-transparent rounded-bl-full pointer-events-none opacity-40" />
          <h3 className="text-xs font-black text-blue-500 uppercase tracking-[0.3em] flex items-center gap-3 mb-8">
             <div className="w-8 h-px bg-blue-500 opacity-30" /> My Profile
          </h3>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-slate-100 border-4 border-white shadow-xl rounded-full overflow-hidden shrink-0">
              {user?.profileImage ? (
                <Image src={user.profileImage} alt={user.name || "User"} width={80} height={80} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 font-black text-2xl uppercase tracking-widest">{user?.name?.charAt(0) || "U"}</div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">{user?.name}</h2>
              <p className="text-sm font-medium text-slate-500">{user?.email}</p>
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
                 <div className={`w-2 h-2 rounded-full ${isPrimary ? "bg-orange-500" : "bg-blue-500"}`} />
                 <span className="text-[10px] uppercase font-black tracking-widest text-slate-600">{user?.role || "Doctor"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-100">
             <div>
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Clinic Association</span>
                <p className="font-bold text-slate-900">{typeof user?.clinic === 'object' ? user.clinic.name : 'Carewell Clinic'}</p>
             </div>
          </div>
        </Card>

        {/* Invite Card - Only for Primary Doctors */}
        {isPrimary && (
          <Card className="p-8 border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-emerald-50 to-transparent rounded-bl-full pointer-events-none opacity-40" />
            
            <h3 className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em] flex items-center gap-3 mb-8">
               <div className="w-8 h-px bg-emerald-500 opacity-30" /> Invite Doctors
            </h3>

            <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
              As the primary doctor, you can invite associate doctors to join this clinic. They will receive an email linking them to this clinic's workspace.
            </p>

            <form onSubmit={handleInvite} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Doctor's Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="doctor@example.com"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {message && (
                <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-3 ${
                  message.type === "success" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"
                }`}>
                  <span className="text-lg">{message.type === "success" ? "✓" : "✖"}</span> {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={inviteMutation.isPending || !email}
                className={`w-full py-4 px-8 flex items-center justify-center gap-3 rounded-2xl text-sm font-black uppercase tracking-widest text-white transition-all shadow-xl active:scale-95
                  ${inviteMutation.isPending || !email 
                    ? "bg-slate-300 cursor-not-allowed shadow-none" 
                    : "bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/20 hover:shadow-emerald-500/40"
                  }`}
              >
                {inviteMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending Invite...
                  </>
                ) : (
                  <>
                    Send Email Invitation
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
