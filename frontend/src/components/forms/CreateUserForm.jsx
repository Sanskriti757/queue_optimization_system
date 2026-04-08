import { useState, useEffect } from "react";
import API from "../../api/axios";

const CreateUserForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "DOCTOR",
    department_id: "",
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await API.get("/department/all");
      setDepartments(res.data);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Prepare data - remove department_id if not selected or role is not DOCTOR
      const submitData = { ...formData };
      
      if (submitData.role !== "DOCTOR" || !submitData.department_id) {
        delete submitData.department_id;
      } else {
        submitData.department_id = parseInt(submitData.department_id);
      }

      await API.post("/user/create", submitData);
      
      setSuccess(`${formData.role} created successfully!`);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "DOCTOR",
        department_id: "",
      });
      
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-[10px] border border-[#2a2a2a] bg-[#f5f5f5] px-3.5 py-2.5 text-[12px] font-medium text-[#1f1f1f]">
          {error}
        </div>
      )}
      
      {success && (
        <div className="rounded-[10px] border border-[#1f1f1f] bg-[#111111] px-3.5 py-2.5 text-[12px] font-medium text-white">
          {success}
        </div>
      )}

      <div>
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7f7f7f]">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="h-11 w-full rounded-[10px] border border-[#dddddd] bg-white px-3.5 text-[13px] text-[#1a1a1a] outline-none placeholder:text-[#9a9a9a] transition-colors focus:border-[#1f1f1f]"
          placeholder="Dr. John Doe"
        />
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7f7f7f]">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="h-11 w-full rounded-[10px] border border-[#dddddd] bg-white px-3.5 text-[13px] text-[#1a1a1a] outline-none placeholder:text-[#9a9a9a] transition-colors focus:border-[#1f1f1f]"
          placeholder="john.doe@hospital.com"
        />
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7f7f7f]">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={4}
          className="h-11 w-full rounded-[10px] border border-[#dddddd] bg-white px-3.5 text-[13px] text-[#1a1a1a] outline-none placeholder:text-[#9a9a9a] transition-colors focus:border-[#1f1f1f]"
          placeholder="••••••••"
        />
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7f7f7f]">
          Role
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          className="h-11 w-full rounded-[10px] border border-[#dddddd] bg-white px-3.5 text-[13px] text-[#1a1a1a] outline-none transition-colors focus:border-[#1f1f1f]"
        >
          <option value="DOCTOR">Doctor</option>
          <option value="TRIAGE">Triage Staff</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {formData.role === "DOCTOR" && (
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7f7f7f]">
            Department
          </label>
          <select
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
            required
            className="h-11 w-full rounded-[10px] border border-[#dddddd] bg-white px-3.5 text-[13px] text-[#1a1a1a] outline-none transition-colors focus:border-[#1f1f1f]"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.department_id} value={dept.department_id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-11 w-full items-center justify-center rounded-[10px] bg-[#1d1d1d] px-4 text-[13px] font-semibold text-white shadow-[0_12px_24px_-16px_rgba(0,0,0,0.7)] transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Creating..." : "Create User"}
      </button>
    </form>
  );
};

export default CreateUserForm;