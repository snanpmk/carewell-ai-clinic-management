"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "@/store/useAuthStore";
import { HeartPulse, UploadCloud, Loader2 } from "lucide-react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function AuthContent() {
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("inviteToken");
  const isInvite = !!inviteToken;

  const [isLogin, setIsLogin] = useState(!isInvite);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clinicName, setClinicName] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [doctorPhone, setDoctorPhone] = useState("");
  const [doctorLicense, setDoctorLicense] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  useEffect(() => {
    if (isInvite) {
      setIsLogin(false);
    }
  }, [isInvite]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImageToCloudinaryFallback = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const { data } = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.url;
    } catch (err) {
      console.error("Upload failed", err);
      // Even if upload fails, we don't strictly require it so we return null rather than breaking the flow
      return null;
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setError(null);
    try {
      const credential = credentialResponse.credential;

      if (isInvite) {
        // ACCEPT INVITE FLOW
        const { data } = await axios.post(`${API_URL}/api/auth/accept-invite`, {
          credential,
          inviteToken,
          doctorPhone,
          doctorLicense,
        });

        if (data.success) {
          login(data.data, data.data.token);
          router.push("/");
        }
      } else if (isLogin) {
        // LOGIN FLOW
        const { data } = await axios.post(`${API_URL}/api/auth/login`, { credential });
        if (data.success) {
          login(data.data, data.data.token);
          router.push("/");
        }
      } else {
        // SIGNUP FLOW
        if (!clinicName) {
          throw new Error("Clinic name is required for registration.");
        }
        
        let uploadedImageUrl = null;
        if (profileImage) {
          uploadedImageUrl = await uploadImageToCloudinaryFallback(profileImage);
        }

        const { data } = await axios.post(`${API_URL}/api/auth/register`, {
          clinicName,
          clinicAddress,
          doctorPhone,
          doctorLicense,
          credential,
          profileImage: uploadedImageUrl,
        });

        if (data.success) {
          login(data.data, data.data.token);
          router.push("/");
        }
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full h-screen bg-white">
      {/* Left Panel - Dark Marketing Section */}
      <div className="hidden lg:flex flex-col flex-1 bg-slate-900 border-r border-slate-800 relative overflow-hidden text-white pt-10 px-16 pb-20 justify-between">
        {/* Geometric Background Overlay */}
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
          <h1 className="text-5xl font-black leading-tight tracking-tight mb-6">
            Smarter Healing.<br />
            Faster Insights.<br />
            Care Anywhere.
          </h1>
          <p className="text-lg text-slate-300 font-medium leading-relaxed">
            From quick symptom notes to full AI analysis, our intelligent clinic software lets you work seamlessly across your entire practice.
          </p>
        </div>
      </div>

      {/* Right Panel - Form Section */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 relative overflow-y-auto w-full">
        <div className="w-full max-w-md mx-auto relative z-10 my-auto py-10">
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
             <div className="p-2 bg-blue-600 rounded-xl">
               <HeartPulse className="w-6 h-6 text-white" />
             </div>
             <span className="font-black text-2xl tracking-tight text-slate-900">Carewell AI</span>
          </div>

          <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">
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
            <div className="space-y-6 mb-8 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {!isInvite && (
                <>
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Clinic Name</label>
                    <input
                      type="text"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      placeholder="e.g. HealthFirst Clinic"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Clinic Address</label>
                    <input
                      type="text"
                      value={clinicAddress}
                      onChange={(e) => setClinicAddress(e.target.value)}
                      placeholder="Complete Address"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Doctor Phone</label>
                  <input
                    type="text"
                    value={doctorPhone}
                    onChange={(e) => setDoctorPhone(e.target.value)}
                    placeholder="+1 234 567 890"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Medical License #</label>
                  <input
                    type="text"
                    value={doctorLicense}
                    onChange={(e) => setDoctorLicense(e.target.value)}
                    placeholder="MD-12345"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {!isInvite && (
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Doctor Profile Picture</label>
                  <label className="flex items-center gap-4 w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-4 cursor-pointer hover:bg-slate-100 transition-colors">
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
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
            </div>
          )}

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-400 font-black text-[11px] uppercase tracking-widest">
                {isInvite ? "Sign In to Accept" : isLogin ? "Authenticate" : "Complete Registration"}
              </span>
            </div>
          </div>

          <div className="flex justify-center w-full mb-8" style={{ minHeight: '44px' }}>
             {loading ? (
                <div className="text-sm font-bold text-blue-600 bg-blue-50 py-3 px-6 rounded-2xl w-full flex justify-center items-center gap-2">
                   <Loader2 className="w-5 h-5 animate-spin" />
                   Authenticating...
                </div>
             ) : (
                <div className="w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError("Google Sign-In was unsuccessful. Try again.")}
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
                  setError(null);
                  setClinicName("");
                  setClinicAddress("");
                  setDoctorPhone("");
                  setDoctorLicense("");
                  setProfileImage(null);
                  setImagePreview(null);
                }}
                className="text-slate-900 font-black hover:text-blue-600 transition-colors underline decoration-2 underline-offset-4 pointer-events-auto"
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
