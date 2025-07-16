import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";
import UserCircleIcon from "../components/icons/UserCircleIcon";
import PencilIcon from "../components/icons/PencilIcon";

const MyProfilePage: React.FC = () => {
  const {
    currentUser,
    updateMyProfile,
    changePassword,
    loading: authLoading,
  } = useAuth();

  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [avatar, setAvatar] = useState(currentUser?.avatar || null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });
  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
  };

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate("/login");
    }
    setName(currentUser?.name || "");
    setEmail(currentUser?.email || "");
    setAvatar(currentUser?.avatar || null);
  }, [currentUser, authLoading]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProfile(true);
    setProfileMessage({ type: "", text: "" });
    const { success, message } = await updateMyProfile({
      name,
      email,
      avatar: avatar || undefined,
    });
    setProfileMessage({ type: success ? "success" : "error", text: message });
    setLoadingProfile(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPassword(true);
    setPasswordMessage({ type: "", text: "" });
    const { success, message } = await changePassword(oldPassword, newPassword);
    setPasswordMessage({ type: success ? "success" : "error", text: message });
    if (success) {
      setOldPassword("");
      setNewPassword("");
    }
    setLoadingPassword(false);
  };

  const inputClasses =
    "w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors";

  if (authLoading || !currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Profile Info Form */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Профіль</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="flex justify-center">
            <div className="relative group">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover shadow-md"
                />
              ) : (
                <UserCircleIcon className="w-32 h-32 text-slate-300" />
              )}
              <button
                type="button"
                onClick={handleAvatarClick}
                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <PencilIcon className="w-8 h-8" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Ім'я
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputClasses}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClasses}
            />
          </div>
          {profileMessage.text && (
            <p
              className={`text-sm text-center ${
                profileMessage.type === "success"
                  ? "text-emerald-600"
                  : "text-red-600"
              }`}
            >
              {profileMessage.text}
            </p>
          )}
          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loadingProfile}
            >
              {loadingProfile ? "Оновлення..." : "Оновити профіль"}
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Зміна пароля</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="oldPassword"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Старий пароль
            </label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className={inputClasses}
            />
          </div>
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Новий пароль
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className={inputClasses}
            />
          </div>
          {passwordMessage.text && (
            <p
              className={`text-sm text-center ${
                passwordMessage.type === "success"
                  ? "text-emerald-600"
                  : "text-red-600"
              }`}
            >
              {passwordMessage.text}
            </p>
          )}
          <div>
            <Button
              type="submit"
              variant="secondary"
              className="w-full"
              disabled={loadingPassword}
            >
              {loadingPassword ? "Зміна..." : "Змінити пароль"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyProfilePage;
