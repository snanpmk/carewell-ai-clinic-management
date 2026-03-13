"use client";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Card } from "@/components/ui/Card";
import { Mail, ArrowRight, User as UserIcon, Loader2, CheckCircle2, Trash2, Users, Sparkles, Power, Phone, Shield, Building, MapPin, UploadCloud, Save } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import apiClient from "@/services/apiClient";
import { updateClinicDetails, updateProfile } from "@/services/authService";
import { uploadImage } from "@/services/patientService";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { useForm } from "react-hook-form";
import clsx from "clsx";

export default function SettingsPage() {
  const { user, updateClinic, updateUser } = useAuthStore();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const isPrimary = user?.role === "primary";
  const aiEnabled = user?.clinic?.aiEnabled ?? true;

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      licenseNumber: user?.licenseNumber || "",
    },
  });

  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name || "",
        phone: user.phone || "",
        licenseNumber: user.licenseNumber || "",
      });
    }
  }, [user, resetProfile]);

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const uploadMutation = useMutation({
    mutationFn: ({ file, type }: { file: File; type: string }) => uploadImage(file, type),
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (res) => {
      updateUser(res.data);
      toast.success("Profile updated successfully.");
      setProfileImage(null);
      setImagePreview(null);
    },
    onError: () => {
      toast.error("Failed to update profile.");
    }
  });

  const onProfileSubmit = async (data: { name: string; phone: string; licenseNumber: string }) => {
    let uploadedImageUrl = user?.profileImage;
    if (profileImage) {
      try {
        uploadedImageUrl = await uploadMutation.mutateAsync({ file: profileImage, type: "users" });
      } catch {
        return;
      }
    }

    updateProfileMutation.mutate({
      ...data,
      profileImage: uploadedImageUrl,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Clinic Form
  const {
    register: registerClinicForm,
    handleSubmit: handleSubmitClinic,
    reset: resetClinicForm,
    formState: { errors: clinicErrors },
  } = useForm({
    defaultValues: {
      name: user?.clinic?.name || "",
      address: user?.clinic?.address || "",
    },
  });

  useEffect(() => {
    if (user?.clinic) {
      resetClinicForm({
        name: user.clinic.name || "",
        address: user.clinic.address || "",
      });
    }
  }, [user?.clinic, resetClinicForm]);

  const updateClinicDetailsMutation = useMutation({
    mutationFn: updateClinicDetails,
    onSuccess: (res) => {
      updateClinic(res.data);
      toast.success("Clinic details updated successfully.");
    },
    onError: () => {
      toast.error("Failed to update clinic details.");
    }
  });

  const onClinicSubmit = (data: { name: string; address: string }) => {
    updateClinicDetailsMutation.mutate(data);
  };

  const toggleAIMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      const { data } = await apiClient.put(`/api/auth/toggle-ai`, { aiEnabled: enabled });
      return data;
    },
    onSuccess: (res) => {
      updateClinic(res.data);
      toast.success(`AI Tools ${res.data.aiEnabled ? 'enabled' : 'disabled'} successfully.`);
    },
    onError: () => {
      toast.error("Failed to update AI settings.");
    }
  });

  const handleToggleAI = () => {
    toggleAIMutation.mutate(!aiEnabled);
  };

  const { data: teamResponse, isLoading: isLoadingTeam } = useQuery({
    queryKey: ["clinic-members"],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/auth/clinic-members');
      return data;
    },
    enabled: !!user,
  });

  const team = teamResponse?.data || [];
  const queryClient = useQueryClient();

  const removeMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const { data } = await apiClient.delete(`/api/auth/members/${memberId}`);
      return data;
    },
    onSuccess: (res) => {
      toast.success(res.message || "Member removed successfully.");
      queryClient.invalidateQueries({ queryKey: ["clinic-members"] });
    },
    onError: (err: unknown) => {
      const errorMsg = (err as { response?: { data?: { error?: string } } }).response?.data?.error || (err as Error).message || "Failed to remove member.";
      toast.error(errorMsg);
    }
  });

  const handleRemoveMember = (memberId: string, memberName: string) => {
    if (window.confirm(`Are you sure you want to remove ${memberName} from the clinic? They will lose access immediately.`)) {
      removeMemberMutation.mutate(memberId);
    }
  };

  const {
    register: registerInvite,
    handleSubmit: handleSubmitInvite,
    reset: resetInvite,
    formState: { errors: inviteErrors },
  } = useForm({
    defaultValues: { email: "", role: "doctor" as "doctor" | "staff" },
  });

  const inviteMutation = useMutation({
    mutationFn: async (payload: { email: string; role: "doctor" | "staff" }) => {
      const { data } = await apiClient.post(`/api/auth/invite`, payload);
      return data;
    },
    onSuccess: () => {
      setMessage({ type: "success", text: "Invitation sent successfully!" });
      resetInvite();
    },
    onError: (err: unknown) => {
      const errorMsg = (err as { response?: { data?: { error?: string } } }).response?.data?.error || (err as Error).message || "Failed to send invite.";
      setMessage({ type: "error", text: errorMsg });
    }
  });

  const onInviteSubmit = (data: { email: string; role: "doctor" | "staff" }) => {
    setMessage(null);
    inviteMutation.mutate(data);
  };

  return (
    <div className="w-full space-y-12 animate-in fade-in duration-700 pb-12 px-4 md:px-0">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-[1px] w-8 bg-brand-primary/40" />
            <span className="eyebrow text-brand-primary/70">Configuration</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-light text-slate-900 tracking-tight">
            Settings & <span className="font-semibold text-brand-primary">Team</span>
          </h1>
          <p className="text-sm text-slate-500 max-w-md leading-relaxed mt-1">Manage your clinic preferences and staff access.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-4">
        {/* Profile Card */}
        <Card className="p-10 border-slate-200 rounded-2xl shadow-2xl shadow-slate-200/40 bg-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-brand-primary/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          <div className="eyebrow text-brand-primary mb-10 flex items-center gap-4 uppercase tracking-[0.2em] text-[10px] font-bold">
             <div className="w-10 h-px bg-brand-primary/30" /> Personal Identity
          </div>
          
          <div className="flex items-center gap-8 mb-10">
            <div className="relative w-24 h-24 shrink-0">
              <div className="absolute -inset-1.5 bg-linear-to-tr from-brand-primary to-brand-accent rounded-full opacity-25 blur-sm" />
              <label className="relative w-24 h-24 bg-white border-4 border-white shadow-2xl rounded-full overflow-hidden flex items-center justify-center cursor-pointer group/img">
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                {imagePreview || user?.profileImage ? (
                  <Image src={imagePreview || user?.profileImage || ""} alt={user?.name || "User"} width={96} height={96} className="w-full h-full object-cover transition-transform group-hover/img:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300 font-semibold text-3xl group-hover/img:text-brand-primary transition-colors">
                    <UserIcon className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                  <UploadCloud className="w-6 h-6 text-white" />
                </div>
              </label>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 tracking-tight uppercase">{user?.name}</h2>
              <p className="text-sm font-bold text-slate-500 mt-1">{user?.email}</p>
              <div className="mt-4">
                 <Badge 
                   label={user?.role === "primary" ? "Primary Administrator" : user?.role === 'staff' ? 'Reception Staff' : 'Practitioner'} 
                   variant={user?.role === "primary" ? "warning" : "primary"} 
                   className="px-3 py-1"
                 />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-6 pt-8 border-t border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                {...registerProfile("name", { required: "Name is required" })}
                error={profileErrors.name?.message}
                leftIcon={<UserIcon className="w-4 h-4" />}
              />
              <Input
                label="Contact Phone"
                {...registerProfile("phone")}
                leftIcon={<Phone className="w-4 h-4" />}
              />
              {user?.role !== 'staff' && (
                <Input
                  label="Medical License #"
                  {...registerProfile("licenseNumber")}
                  disabled={user?.role === 'staff'}
                  leftIcon={<Shield className="w-4 h-4" />}
              />
              )}
            </div>
            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                variant="primary" 
                size="sm" 
                className="px-8 rounded-xl"
                isLoading={updateProfileMutation.isPending || uploadMutation.isPending}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Card>

        {/* Clinic Details Card - Only for Primary Doctors */}
        {isPrimary && (
          <Card className="p-10 border-slate-200 rounded-2xl shadow-2xl shadow-slate-200/40 bg-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-brand-accent/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            
            <div className="eyebrow text-brand-accent mb-10 flex items-center gap-4 uppercase tracking-[0.2em] text-[10px] font-bold">
               <div className="w-10 h-px bg-brand-accent/30" /> Clinic Registry
            </div>

            <form onSubmit={handleSubmitClinic(onClinicSubmit)} className="space-y-6">
              <Input
                label="Clinic Name"
                {...registerClinicForm("name", { required: "Clinic name is required" })}
                error={clinicErrors.name?.message}
                leftIcon={<Building className="w-4 h-4" />}
              />
              <Input
                label="Clinic Address"
                {...registerClinicForm("address")}
                leftIcon={<MapPin className="w-4 h-4" />}
              />
              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="sm" 
                  className="px-8 rounded-xl bg-brand-accent hover:bg-brand-accent/90 border-brand-accent hover:border-brand-accent/90"
                  isLoading={updateClinicDetailsMutation.isPending}
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Update Registry
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* AI Control Card - Only for Primary Doctors */}
        {isPrimary && (
          <Card className="p-10 border-slate-200 rounded-2xl shadow-2xl shadow-slate-200/40 bg-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-brand-primary/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            
            <div className="eyebrow text-brand-primary mb-10 flex items-center gap-4 uppercase tracking-[0.2em] text-[10px] font-bold">
               <div className="w-10 h-px bg-brand-primary/30" /> Intelligence & Automation
            </div>

            <div className="flex items-center justify-between gap-6 mb-8">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-semibold text-slate-900 tracking-tight uppercase">AI Clinical Assistance</h2>
                <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">
                  Toggle AI features including smart symptom analysis, clinical drafting, and automated history summarization for all practitioners.
                </p>
              </div>
              <div 
                onClick={handleToggleAI}
                className={clsx(
                  "w-20 h-10 rounded-full p-1 cursor-pointer transition-all duration-500 relative shrink-0",
                  aiEnabled ? "bg-brand-primary shadow-lg shadow-brand-primary/30" : "bg-slate-200"
                )}
              >
                <div className={clsx(
                  "w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-500 transform",
                  aiEnabled ? "translate-x-10" : "translate-x-0"
                )}>
                  <Power className={clsx("w-4 h-4", aiEnabled ? "text-brand-primary" : "text-slate-400")} />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
              <div className={clsx(
                "p-3 rounded-2xl",
                aiEnabled ? "bg-brand-primary/10 text-brand-primary" : "bg-slate-200/50 text-slate-400"
              )}>
                <Sparkles className={clsx("w-6 h-6", aiEnabled && "animate-pulse")} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                  Status: {aiEnabled ? "Active & Synthesizing" : "Disabled"}
                </p>
                <p className="text-xs font-medium text-slate-500">
                  {aiEnabled ? "Practitioners can use AI insights." : "AI analysis is currently restricted."}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Invite Card - Only for Primary Doctors */}
        {isPrimary && (
          <Card className="p-10 border-slate-200 rounded-2xl shadow-2xl shadow-slate-200/40 bg-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-brand-accent/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            
            <div className="eyebrow text-brand-accent mb-10 flex items-center gap-4 uppercase tracking-[0.2em] text-[10px] font-bold">
               <div className="w-10 h-px bg-brand-accent/30" /> Expansion & Team
            </div>

            <p className="text-sm font-medium text-slate-500 mb-10 leading-relaxed max-w-sm">
              Empower your clinic by inviting associate doctors or reception staff to join your clinical workspace.
            </p>

            <form onSubmit={handleSubmitInvite(onInviteSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Member Email"
                  type="email"
                  {...registerInvite("email")}
                  placeholder="name@carewell.com"
                  leftIcon={<Mail className="w-5 h-5" />}
                  error={inviteErrors.email?.message}
                />
                <Select
                  label="Role Selection"
                  options={[
                    { label: "Associate Doctor", value: "doctor" },
                    { label: "Reception / Staff", value: "staff" },
                  ]}
                  {...registerInvite("role")}
                />
              </div>

              {message && (
                <div className={`p-5 rounded-2xl text-sm font-bold uppercase tracking-widest flex items-center gap-4 animate-in fade-in slide-in-from-top-2 ${
                  message.type === "success" ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20" : "bg-red-50 text-red-600 border border-red-100"
                }`}>
                  {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <div className="text-lg">✖</div>} {message.text}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={inviteMutation.isPending}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Send Secure Invitation
              </Button>
            </form>
          </Card>
        )}
      </div>

      {/* Team List Card */}
      <div className="px-4">
        <Card className="p-10 border-slate-200 rounded-2xl shadow-2xl shadow-slate-200/40 bg-white relative overflow-hidden">
          <div className="eyebrow text-slate-400 mb-10 flex items-center gap-4 uppercase tracking-[0.2em] text-[10px] font-bold">
             <div className="w-10 h-px bg-slate-200" /> Active Clinic Members
          </div>

          {isLoadingTeam ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
              <p className="eyebrow text-slate-400 uppercase tracking-[0.2em] text-[10px] font-bold">Syncing member registry...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {team.map((member: { _id: string; profileImage?: string; name: string; email: string; role: string }) => (
                <div key={member._id} className="flex flex-col p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-primary/20 hover:bg-white transition-all duration-300 group shadow-sm hover:shadow-xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-14 h-14 shrink-0">
                      <div className="absolute inset-0 bg-linear-to-tr from-brand-primary to-brand-accent rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity" />
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center group-hover:rotate-3 transition-transform">
                        {member.profileImage ? (
                          <Image src={member.profileImage} alt={member.name} width={56} height={56} className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon className="w-6 h-6 text-slate-300" />
                        )}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 text-base tracking-tight truncate uppercase">{member.name}</h4>
                      <p className="text-xs font-bold text-slate-400 truncate">{member.email}</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                    <Badge 
                      label={member.role === "primary" ? "Admin" : member.role === "staff" ? "Staff" : "Doctor"} 
                      variant={member.role === "primary" ? "warning" : member.role === "staff" ? "secondary" : "primary"} 
                      className="px-2 py-0.5"
                    />
                    <div className="flex items-center gap-3">
                      {isPrimary && member.role !== "primary" && (
                        <button
                          onClick={() => handleRemoveMember(member._id, member.name)}
                          disabled={removeMemberMutation.isPending}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 disabled:opacity-50"
                          title="Remove Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    </div>
                  </div>
                </div>
              ))}
              {team.length === 0 && (
                 <div className="col-span-full text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="eyebrow text-slate-400 uppercase tracking-[0.2em] text-[10px] font-bold">No clinic members found.</p>
                 </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}