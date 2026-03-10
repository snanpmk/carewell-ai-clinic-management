"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAuthStore } from "@/store/useAuthStore";
import { HeartPulse, UploadCloud, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { loginWithGoogle, registerWithGoogle, acceptInviteWithGoogle } from "@/services/authService";
import { uploadImage } from "@/services/patientService";
import Image from "next/image";

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
      login(data.data, data.data.token);
      router.push("/");
    }
  });

  const registerMutation = useMutation({
    mutationFn: registerWithGoogle,
    onSuccess: (data) => {
      login(data.data, data.data.token);
      router.push("/");
    }
  });

  const acceptInviteMutation = useMutation({
    mutationFn: acceptInviteWithGoogle,
    onSuccess: (data) => {
      login(data.data, data.data.token);
      router.push("/");
    }
  });

  const uploadMutation = useMutation({
    mutationFn: uploadImage,
  });

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
  const error = loginMutation.error?.message || registerMutation.error?.message || acceptInviteMutation.error?.message || uploadMutation.error?.message;

  return (
    <div className="flex w-full h-screen bg-white">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col flex-1 bg-slate-900 border-r border-slate-800 relative overflow-hidden text-white pt-10 px-16 pb-20 justify-between">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon fill="currentColor" points="0,0 100,0 50,100" className="text-blue-500" />
            <polygon fill="currentColor" points="0,100 100,50 100,100" className="text-indigo-500" />
            <polygon fill="currentColor" points="0,0 50,100 0,100" className="text-blue-900" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <span className="font-black text-xl tracking-tight">Carewell AI</span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg mb-10 mt-auto">
          <h1 className="mb-6">
            Smarter Healing.<br />
            Faster Insights.<br />
            Care Anywhere.
          </h1>
          <p className="text-lg text-slate-300 font-medium leading-relaxed">
            From quick symptom notes to full AI analysis, our intelligent clinic software lets you work seamlessly across your entire practice.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 relative overflow-y-auto w-full">
        <div className="w-full max-w-md mx-auto relative z-10 my-auto py-10">
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
             <div className="p-2 bg-brand-primary rounded-xl">
               <HeartPulse className="w-6 h-6 text-white" />
             </div>
             <span className="font-black text-2xl tracking-tight text-slate-900">Carewell AI</span>
          </div>

          <h2 className="mb-2">
            {isInvite ? "Join Clinic!" : isLogin ? "Welcome Back!" : "Register Clinic"}
          </h2>
          <p className="text-slate-500 font-medium mb-10">
            {isInvite 
              ? "Accept your invitation to join the clinic on Carewell AI."
              : isLogin 
              ? "Log in to start managing your daily clinic tasks." 
              : "Set up your clinic and primary doctor account."}
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-600 border border-red-100 font-bold text-sm flex items-center gap-3">
              <span className="text-lg">✖</span> {error}
            </div>
          )}

          {!isLogin && (
            <form className="space-y-6 mb-8 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {!isInvite && (
                <>
                  <Input
                    label="Clinic Name"
                    {...register("clinicName")}
                    error={errors.clinicName?.message}
                    placeholder="e.g. HealthFirst Clinic"
                  />
                  <Input
                    label="Clinic Address"
                    {...register("clinicAddress")}
                    placeholder="Complete Address"
                  />
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Doctor Phone"
                  {...register("doctorPhone")}
                  error={errors.doctorPhone?.message}
                  placeholder="+1 234 567 890"
                />
                <Input
                  label="Medical License #"
                  {...register("doctorLicense")}
                  error={errors.doctorLicense?.message}
                  placeholder="MD-12345"
                />
              </div>

              {!isInvite && (
                <div>
                  <label className="eyebrow mb-2 ml-1 block">Doctor Profile Picture</label>
                  <label className="flex items-center gap-4 w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-4 cursor-pointer hover:bg-slate-100 transition-colors">
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-sm relative">
                      {imagePreview ? (
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                      ) : (
                        <UploadCloud className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="text-sm font-bold text-slate-600 block flex-1">
                      {profileImage ? profileImage.name : "Upload Image to Cloudinary"}
                      <div className="text-xs font-medium text-slate-400 mt-1">Optional. JPG, PNG (Max 5MB)</div>
                    </div>
                  </label>
                </div>
              )}
            </form>
          )}

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white eyebrow">
                {isInvite ? "Sign In to Accept" : isLogin ? "Authenticate" : "Complete Registration"}
              </span>
            </div>
          </div>

          <div className="flex justify-center w-full mb-8" style={{ minHeight: '44px' }}>
             {isLoading ? (
                <div className="text-sm font-bold text-brand-primary bg-brand-primary/10 py-3 px-6 rounded-2xl w-full flex justify-center items-center gap-2">
                   <Loader2 className="w-5 h-5 animate-spin" />
                   Authenticating...
                </div>
             ) : (
                <div className="w-full  transition-all">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {}}
                    useOneTap={false}
                    theme="outline"
                    shape="rectangular"
                    width="100%"
                    text={isLogin ? "signin_with" : "signup_with"}
                    size="large"
                  />
                </div>
             )}
          </div>

          {!isInvite && (
            <p className="text-center text-sm font-medium text-slate-500 mt-10">
              {isLogin ? "Don't have a clinic account? " : "Already registered? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  reset();
                  setProfileImage(null);
                  setImagePreview(null);
                }}
                className="text-slate-900 font-black hover:text-brand-primary transition-colors underline decoration-2 underline-offset-4 pointer-events-auto"
              >
                {isLogin ? "Sign up here" : "Log in here"}
              </button>
            </p>
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
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
