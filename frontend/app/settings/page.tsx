"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Card } from "@/components/ui/Card";
import { Mail, ShieldCheck, ArrowRight, User as UserIcon, Loader2 } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import apiClient from "@/services/apiClient";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

import { useForm } from "react-hook-form";
import * as z from "zod";

// Invitation Schema
const inviteSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const isPrimary = user?.role === "primary";

  const { data: teamResponse, isLoading: isLoadingTeam } = useQuery({
    queryKey: ["clinic-doctors"],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/auth/clinic-doctors');
      return data;
    },
    enabled: !!user,
  });

  const team = teamResponse?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "" },
  });

  const inviteMutation = useMutation({
    mutationFn: async (inviteEmail: string) => {
      const { data } = await apiClient.post(`/api/auth/invite`, { email: inviteEmail });
      return data;
    },
    onSuccess: () => {
      setMessage({ type: "success", text: "Invitation sent successfully!" });
      reset();
    },
    onError: (err: unknown) => {
      const errorMsg = err instanceof Error ? err.message : "Failed to send invite.";
      setMessage({ type: "error", text: errorMsg });
    }
  });

  const onSubmit = (data: { email: string }) => { // Kept original type, it's more specific and correct
    setMessage(null);
    inviteMutation.mutate(data.email);
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
              <div className="mt-2 inline-flex items-center gap-2">
                 <Badge 
                   label={user?.role === "primary" ? "Primary Doctor" : "Doctor"} 
                   variant={user?.role === "primary" ? "warning" : "primary"} 
                 />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-100">
             <div>
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Clinic Association</span>
                <p className="font-bold text-slate-900">{typeof user?.clinic === 'object' ? (user.clinic.name as React.ReactNode) : 'Carewell Clinic'}</p>
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
              As the primary doctor, you can invite associate doctors to join this clinic. They will receive an email linking them to this clinic&apos;s workspace.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-1">
                <Input
                  label="Doctor's Email Address"
                  type="email"
                  {...register("email")}
                  placeholder="doctor@example.com"
                  leftIcon={<Mail className="w-4 h-4" />}
                  error={errors.email?.message}
                />
              </div>

              {message && (
                <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-3 ${
                  message.type === "success" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"
                }`}>
                  <span className="text-lg">{message.type === "success" ? "✓" : "✖"}</span> {message.text}
                </div>
              )}

              <Button
                type="submit"
                variant="secondary"
                size="lg"
                isLoading={inviteMutation.isPending}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Send Email Invitation
              </Button>
            </form>
          </Card>
        )}
      </div>

      {/* Team List Card */}
      <Card className="p-8 border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 bg-white relative overflow-hidden">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3 mb-8">
           <div className="w-8 h-px bg-slate-500 opacity-30" /> Clinic Team
        </h3>

        {isLoadingTeam ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((doc: { _id: string; profileImage?: string; name: string; email: string; role: string }) => ( // Explicit type for doc
              <div key={doc._id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-slate-200 shrink-0 flex items-center justify-center">
                  {doc.profileImage ? (
                    <Image src={doc.profileImage} alt={doc.name} width={48} height={48} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm tracking-tight">{doc.name}</h4>
                  <p className="text-xs font-medium text-slate-500 truncate">{doc.email}</p>
                  <div className="mt-2">
                    <Badge 
                      label={doc.role === "primary" ? "Primary" : "Doctor"} 
                      variant={doc.role === "primary" ? "warning" : "primary"} 
                    />
                  </div>
                </div>
              </div>
            ))}
            {team.length === 0 && (
               <div className="col-span-full text-center py-8 text-slate-500 text-sm font-medium">No other team members found.</div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
