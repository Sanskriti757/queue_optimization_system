import CreateUserForm from "../../components/forms/CreateUserForm";

const CreateUser = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[27px] font-semibold tracking-[-0.03em] text-[#111111]">Create New User</h1>
          <p className="mt-1 text-[12px] text-[#6f6f6f]">Add doctors, triage staff, or admin users to the system</p>
        </div>

        {/* Form Card */}
        <div className="rounded-[14px] border border-[#e8e8e8] bg-white p-6 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset] sm:p-7">
          <CreateUserForm />
        </div>

        {/* Info Card */}
        <div className="mt-5 rounded-xl border border-[#e8e8e8] bg-white p-4">
          <div className="flex items-start gap-3">
            <svg className="mt-0.5 h-4.5 w-4.5 text-[#2c2c2c]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-[12px] text-[#4f4f4f]">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#777777]">User Roles</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Doctor:</strong> Requires department assignment</li>
                <li><strong>Triage:</strong> Patient registration & queue management</li>
                <li><strong>Admin:</strong> Full system access & user management</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;