import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const handleLogin = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);

    try {
      const res = await api.post("/api/users/register", {
        googleId: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        photoUrl: decoded.picture,
      });

      const role = res.data.role;

      if (role === "superadmin") navigate("/superadmin");
      else if (role === "gymadmin") navigate("/admin");
      else if (role === "trainer") navigate("/trainer");
      else navigate("/member");

    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Login to GymCRM</h1>
      <GoogleLogin onSuccess={handleLogin} onError={() => alert("Login Failed")} />
    </div>
  );
}

export default Login;
