import { useState, useEffect } from "react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../firebase";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function PhoneLogin() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => handleSendOtp(),
      });
      window.recaptchaVerifier.render();
    }
  };

  const formatPhoneNumber = (phone) =>
    phone.startsWith("+91") ? phone : `+91${phone}`;

  const handleSendOtp = async () => {
    const formattedPhone = formatPhoneNumber(phone);
    if (!formattedPhone.match(/^\+91[0-9]{10}$/)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setError("");
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(result);
    } catch (err) {
      console.error("OTP Send Error:", err);
      setError("Failed to send OTP. Try again.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult) {
      setError("Please request OTP first");
      return;
    }

    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      const res = await axios.post("/api/users/register", {
        phone: user.phoneNumber,
        uid: user.uid,
      });

      const role = res.data.role;
      if (role === "superadmin") navigate("/superadmin");
      else if (role === "gymadmin") navigate("/admin");
      else if (role === "trainer") navigate("/trainer");
      else navigate("/member");
    } catch (err) {
      console.error("OTP Verify Error:", err);
      setError("Invalid OTP or verification failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 shadow-md bg-white rounded-lg">
      <h2 className="text-xl font-bold mb-4">📱 Login with Phone</h2>

      <input
        type="tel"
        placeholder="Enter phone number"
        className="w-full border p-2 mb-4 rounded"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        disabled={!!confirmationResult}
      />

      {confirmationResult && (
        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full border p-2 mb-4 rounded"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      )}

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <button
        className="w-full bg-blue-600 text-white py-2 rounded"
        onClick={confirmationResult ? handleVerifyOtp : handleSendOtp}
      >
        {confirmationResult ? "Verify OTP" : "Send OTP"}
      </button>

      <div id="recaptcha-container"></div>
    </div>
  );
}
