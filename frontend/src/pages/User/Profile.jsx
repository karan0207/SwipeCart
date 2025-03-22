import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

  useEffect(() => {
    if (userInfo) {
      setFormData((prev) => ({
        ...prev,
        username: userInfo.username || "",
        email: userInfo.email || "",
      }));
    }
  }, [userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = useCallback(
    async (e) => {
      e.preventDefault();
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }).unwrap();

        dispatch(setCredentials(res));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || "Profile update failed");
      }
    },
    [formData, updateProfile, dispatch, userInfo]
  );

  return (
    <div className="container mx-auto p-4 mt-[10rem]">
      <div className="flex justify-center">
        <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-white text-center mb-4">Update Profile</h2>
          <form onSubmit={submitHandler} className="space-y-4">
            {["username", "email", "password", "confirmPassword"].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block text-white mb-2 capitalize">
                  {field.replace("confirmPassword", "Confirm Password")}
                </label>
                <input
                  id={field}
                  type={field.includes("password") ? "password" : "text"}
                  name={field}
                  placeholder={`Enter ${field}`}
                  className="form-input p-4 rounded-md w-full bg-gray-700 text-white"
                  value={formData[field]}
                  onChange={handleChange}
                />
              </div>
            ))}

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 transition"
                disabled={loadingUpdateProfile}
              >
                {loadingUpdateProfile ? "Updating..." : "Update"}
              </button>
              <Link to="/user-orders" className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700 transition">
                My Orders
              </Link>
            </div>
          </form>
          {loadingUpdateProfile && <Loader />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
