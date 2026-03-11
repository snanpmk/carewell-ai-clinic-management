"use client";

import { Input } from "@/components/ui/Input";
import { acceptInviteWithGoogle, loginWithGoogle, registerWithGoogle } from "@/services/authService";
import { uploadImage } from "@/services/patientService";
import { useAuthStore } from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { Loader2, UploadCloud, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

const authSchema = z.object({
  clinicName: z.string().min(2, "Clinic name is required").optional(),
  clinicAddress: z.string().optional(),
  doctorPhone: z.string().min(5, "Phone number is required"),
  doctorLicense: z.string().min(2, "Medical license is required"),
});

type AuthFormValues = z.infer<typeof authSchema>;

function AuthContent() {
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("inviteToken");
  const isInvite = !!inviteToken;

  const [isLogin, setIsLogin] = useState(!isInvite);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    getValues,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      clinicName: "",
      clinicAddress: "",
      doctorPhone: "",
      doctorLicense: "",
    },
  });

  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  // Mutations
  const loginMutation = useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: (data) => {
      const { token, ...user } = data.data;
      login(user, token);
      router.push("/");
    }
  });

  const registerMutation = useMutation({
    mutationFn: registerWithGoogle,
    onSuccess: (data) => {
      const { token, ...user } = data.data;
      login(user, token);
      router.push("/");
    }
  });

  const acceptInviteMutation = useMutation({
    mutationFn: acceptInviteWithGoogle,
    onSuccess: (data) => {
      const { token, ...user } = data.data;
      login(user, token);
      router.push("/");
    }
  });

  const uploadMutation = useMutation({
    mutationFn: uploadImage,
  });

  // Global Error Handler for Mutations
  useEffect(() => {
    const error = loginMutation.error?.message || registerMutation.error?.message || acceptInviteMutation.error?.message || uploadMutation.error?.message;
    if (error) {
      toast.error(error);
      // Reset mutations to clear error state and prevent infinite loops
      loginMutation.reset();
      registerMutation.reset();
      acceptInviteMutation.reset();
      uploadMutation.reset();
    }
  }, [loginMutation.error, registerMutation.error, acceptInviteMutation.error, uploadMutation.error, loginMutation, registerMutation, acceptInviteMutation, uploadMutation]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    const credential = credentialResponse.credential;
    if (!credential) return;
    
    const values = getValues();

    if (isInvite) {
      acceptInviteMutation.mutate({
        credential,
        inviteToken: inviteToken!,
        doctorPhone: values.doctorPhone,
        doctorLicense: values.doctorLicense,
      });
    } else if (isLogin) {
      loginMutation.mutate(credential);
    } else {
      // Registration
      let uploadedImageUrl = null;
      if (profileImage) {
        try {
          uploadedImageUrl = await uploadMutation.mutateAsync(profileImage);
        } catch {
          console.error("Image upload failed, continuing without image");
        }
      }

      registerMutation.mutate({
        clinicName: values.clinicName,
        clinicAddress: values.clinicAddress,
        doctorPhone: values.doctorPhone,
        doctorLicense: values.doctorLicense,
        credential,
        profileImage: uploadedImageUrl,
      });
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending || acceptInviteMutation.isPending || uploadMutation.isPending;

  return (
    <div className="flex w-full min-h-screen bg-white font-sans text-slate-900">
      {/* Left Panel: High-End Marketing Section */}
      <div className="hidden lg:flex flex-col flex-1 bg-slate-950 relative overflow-hidden text-white p-16 justify-between border-r border-slate-900">
        {/* Modern Abstract Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden border border-white/20 shadow-2xl shrink-0 p-0">
              <Image src="/logo.svg" alt="Carewell Logo" width={40} height={40} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-white tracking-tight leading-none">Carewell</span>
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mt-1">Advanced AI Clinical</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2   text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em] mb-8">
            Practitioner-Centric Design
          </div>

          <h1 className="text-5xl font-bold leading-[1.1] tracking-tight mb-8 text-white">
            Experience the <span className="text-brand-accent text-glow-accent">Next Era</span> of Clinical Precision.
          </h1>
          <p className="text-lg text-white/60 font-medium leading-relaxed mb-12">
            Automate your documentation and unlock deep medical insights with the world's most advanced AI clinical assistant. Designed to think with you, not for you.
          </p>

          <div className="flex items-center gap-10 pt-4">
             <div>
               <p className="text-3xl font-bold text-white tracking-tighter">98%</p>
               <p className="text-[10px] text-white/40 font-semibold uppercase tracking-widest mt-1">Synthesis Accuracy</p>
             </div>
             <div className="w-px h-12 bg-white/10" />
             <div>
               <p className="text-3xl font-bold text-white tracking-tighter">15m</p>
               <p className="text-[10px] text-white/40 font-semibold uppercase tracking-widest mt-1">Saved per Session</p>
             </div>
             <div className="w-px h-12 bg-white/10" />
             <div>
               <p className="text-3xl font-bold text-white tracking-tighter">Secure</p>
               <p className="text-[10px] text-white/40 font-semibold uppercase tracking-widest mt-1">Enterprise Grade</p>
             </div>
          </div>
        </div>

        <div className="relative z-10 border-t border-white/5 pt-8 flex items-center justify-between text-[11px] font-medium text-slate-500 uppercase tracking-widest">
           <span>© 2026 Carewell Systems</span>
           <div className="flex items-center gap-6">
             <Link href="/privacy" className="hover:text-white cursor-pointer transition-colors">Privacy</Link>
             <Link href="/protocol" className="hover:text-white cursor-pointer transition-colors">Protocol</Link>
           </div>
        </div>
      </div>

      {/* Right Panel: Clean, Professional Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative overflow-y-auto bg-slate-50/30">
        <div className="w-full max-w-md mx-auto py-12">
          {/* Mobile Branding */}
          <div className="lg:hidden flex items-center gap-3 mb-12 justify-center">
             <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center bg-white">
               <Image src="/logo.svg" alt="Carewell" width={40} height={40} className="w-full h-full object-cover" />
             </div>
             <span className="font-bold text-2xl tracking-tight text-slate-900">Carewell</span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
              {isInvite ? "Accept Invitation" : isLogin ? "Welcome Back" : "Register Clinic"}
            </h2>
            <p className="text-sm text-slate-500 font-medium mb-10 leading-relaxed">
              {isInvite 
                ? "Accept your secure invitation to join the clinical network."
                : isLogin 
                ? "Enter your credentials to access your clinical dashboard." 
                : "Initialize your clinic registry and administrative profile."}
            </p>
          </div>

          {!isLogin && (
            <form className="space-y-6 mb-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {!isInvite && (
                <div className="space-y-4">
                  <Input
                    label="Clinic Name"
                    {...register("clinicName")}
                    error={errors.clinicName?.message}
                    placeholder="Carewell Wellness Center"
                    className="h-12"
                  />
                  <Input
                    label="Full Clinic Address"
                    {...register("clinicAddress")}
                    placeholder="Street, City, Zip Code"
                    className="h-12"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Contact Phone"
                  {...register("doctorPhone")}
                  error={errors.doctorPhone?.message}
                  placeholder="+1 (555) 000-0000"
                  className="h-12"
                />
                <Input
                  label="Medical License #"
                  {...register("doctorLicense")}
                  error={errors.doctorLicense?.message}
                  placeholder="MD-00000"
                  className="h-12"
                />
              </div>

              {!isInvite && (
                <div className="pt-2">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 block ml-1">Profile Identification</label>
                  <label className="flex items-center gap-4 w-full bg-white border border-slate-200 rounded-xl p-4 cursor-pointer hover:border-brand-primary transition-all group shadow-sm">
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-inner group-hover:scale-105 transition-transform relative">
                      {imagePreview ? (
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                      ) : (
                        <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-brand-primary transition-colors" />
                      )}
                    </div>
                    <div className="text-[11px] font-bold text-slate-600 flex-1 min-w-0">
                      <p className="truncate">{profileImage ? profileImage.name : "Select Profile Image"}</p>
                      <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-tight">Optional • JPG, PNG</p>
                    </div>
                  </label>
                </div>
              )}
            </form>
          )}

          <div className="relative mb-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              <span className="px-4 bg-slate-50/30 backdrop-blur-sm">
                Secure Authentication
              </span>
            </div>
          </div>

          <div className="flex justify-center w-full mb-10" style={{ minHeight: '44px' }}>
             {isLoading ? (
                <div className="text-sm font-semibold text-brand-primary bg-brand-primary/5 border border-brand-primary/10 h-12 rounded-xl w-full flex justify-center items-center gap-3">
                   <Loader2 className="w-5 h-5 animate-spin" />
                   Processing Request...
                </div>
             ) : (
                <div className="w-full hover:scale-[1.01] transition-transform">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {}}
                    useOneTap={false}
                    theme="filled_blue"
                    shape="pill"
                    width="100%"
                    text={isLogin ? "signin_with" : "signup_with"}
                    size="large"
                  />
                </div>
             )}
          </div>

          {!isInvite && (
            <div className="text-center pt-8 border-t border-slate-200">
              <p className="text-sm font-medium text-slate-500">
                {isLogin ? "New to Carewell AI? " : "Already have a clinic? "}
                <button
                  onClick={() => {
                    clearErrors();
                    reset();
                    setIsLogin(!isLogin);
                    setProfileImage(null);
                    setImagePreview(null);
                  }}
                  className="text-brand-primary font-bold hover:underline underline-offset-4 decoration-2 transition-all"
                >
                  {isLogin ? "Establish Registry" : "Secure Sign-in"}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
