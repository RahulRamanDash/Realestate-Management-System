import React, { useState } from "react";
import { ArrowLeft, BadgeCheck, Building2, Shield, UserCircle2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../../api/axiosInstance";
import { setSession } from "../../../utils/auth";
import { getAuthErrorMessage, getFieldErrors } from "../../../shared/utils/errorMessages";

const InputField = ({ label, type, name, value, onChange, error }) => (
  <div className="relative z-0 w-full mb-6 group">
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className={`field-base block w-full appearance-none px-4 pb-3 pt-6 text-sm ${error ? "border-red-500" : ""} peer`}
      placeholder=" "
    />
    <label
      htmlFor={name}
      className={`pointer-events-none absolute left-3 z-10 origin-[0] rounded-md px-2 text-sm text-gray-400 transition-all duration-200 ${
        value
          ? "top-0 -translate-y-1/2 scale-75 bg-[#102420]"
          : "top-1/2 -translate-y-1/2 scale-100 bg-transparent"
      } peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-75 peer-focus:bg-[#102420]`}
    >
      {label}
    </label>
    {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
  </div>
);

const UserAuth = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialTab = params.get("tab") === "register" ? false : true;

  const [isLogin, setIsLogin] = useState(initialTab);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setIsLogin(tab === "login");
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "",
    });
    setErrors({});
    setApiError("");
    setSuccessMessage("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setApiError("");
    setSuccessMessage("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!isLogin) {
      if (!formData.name) newErrors.name = "Name is required";
      if (!formData.phone) {
        newErrors.phone = "Phone number is required";
      } else if (!/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = "Phone must be exactly 10 digits";
      }
      if (!formData.role) newErrors.role = "Role is required";
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      if (isLogin) {
        const response = await api.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        setSession(response.data);
        navigate("/dashboard");
      } else {
        await api.post("/auth/register", {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
        });
        setIsLogin(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          role: "",
        });
        setErrors({});
        setApiError("");
        setSuccessMessage("Registration successful! Please login.");
      }
    } catch (error) {
      const errorMessage = getAuthErrorMessage(error);
      const fieldErrors = getFieldErrors(error);
      setApiError(errorMessage);
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-shell min-h-screen px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="glass-panel rounded-[2rem] p-8 lg:p-10">
            <span className="eyebrow">Access Portal</span>
            <h1 className="headline-font page-heading mt-6 text-4xl font-bold md:text-5xl">
              {isLogin ? "Return to your property workspace." : "Create your account and start using the platform."}
            </h1>
            <p className="page-copy mt-4 text-base leading-7">
              Agents can publish and manage listings, while buyers get a cleaner path to explore verified inventory.
            </p>

            <div className="mt-8 space-y-4">
              {[
                { icon: <Shield className="h-5 w-5" />, title: "Secure access", text: "Login and registration are grouped into a single cleaner workspace." },
                { icon: <Building2 className="h-5 w-5" />, title: "Role-aware experience", text: "The interface adjusts for agents and buyers after sign-in." },
                { icon: <BadgeCheck className="h-5 w-5" />, title: "Clearer trust cues", text: "Consistent styling helps the product feel more reliable from the first screen." },
              ].map((item) => (
                <div key={item.title} className="info-card rounded-[1.5rem] p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-200">
                    {item.icon}
                  </div>
                  <h3 className="page-heading mt-4 text-lg font-semibold">{item.title}</h3>
                  <p className="page-copy mt-2 text-sm leading-6">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel-strong w-full rounded-[2rem] p-8 shadow-lg">
            <div className="mb-6 flex rounded-full border border-white/10 bg-white/5 p-1">
              <button
                onClick={() => handleTabChange("login")}
                className={`w-1/2 rounded-full py-3 text-md font-semibold transition ${
                  isLogin ? "bg-emerald-400 text-slate-950" : "text-gray-300 hover:bg-white/5"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => handleTabChange("register")}
                className={`w-1/2 rounded-full py-3 text-md font-semibold transition ${
                  !isLogin ? "bg-emerald-400 text-slate-950" : "text-gray-300 hover:bg-white/5"
                }`}
              >
                Register
              </button>
            </div>

            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-200">
                <UserCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="page-heading text-2xl font-bold">{isLogin ? "Welcome Back" : "Create an Account"}</h2>
                <p className="page-copy text-sm">
                  {isLogin ? "Sign in to continue." : "Register to access listings and dashboards."}
                </p>
              </div>
            </div>

            {apiError && <p className="status-error mb-4 rounded-2xl px-4 py-3 text-center text-sm">{apiError}</p>}
            {successMessage && <p className="status-success mb-4 rounded-2xl px-4 py-3 text-center text-sm">{successMessage}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <InputField label="Name" type="text" name="name" value={formData.name} onChange={handleChange} error={errors.name} />
                  <InputField label="Phone number" type="tel" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} />
                  <div className="relative z-0 w-full mb-6 group">
                    <label className="page-copy mb-2 block text-sm">Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="field-base block w-full px-4 py-4 text-sm"
                    >
                      <option value="">
                        Select Role
                      </option>
                      <option value="ROLE_AGENT">
                        Agent
                      </option>
                      <option value="ROLE_BUYER">
                        Buyer
                      </option>
                    </select>
                    {errors.role && <p className="mt-1 text-xs text-red-400">{errors.role}</p>}
                  </div>
                </>
              )}

              <InputField label="Email address" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} />
              <InputField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} error={errors.password} />
              {!isLogin && (
                <InputField
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                />
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-gradient-to-r from-emerald-300 to-emerald-500 px-4 py-3 font-semibold text-slate-950 transition duration-300 hover:brightness-105"
              >
                {submitting ? "Please wait..." : isLogin ? "Sign In" : "Register"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAuth;
