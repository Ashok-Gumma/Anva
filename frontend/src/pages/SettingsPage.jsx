const SettingsPage = () => {
  return (
    <div className="p-6 min-h-screen bg-base-200">
      <div className="max-w-3xl mx-auto bg-base-100 p-6 rounded-xl shadow-xl">

        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        {/* ACCOUNT SETTINGS */}
        <div className="space-y-4">

          <div className="form-control">
            <label className="label">
              <span className="label-text">Change Password</span>
            </label>
            <input type="password" placeholder="New password" className="input input-bordered" />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Email Notifications</span>
            </label>
            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
          </div>

          <button className="btn btn-primary mt-4">
            Save Settings
          </button>

        </div>

      </div>
    </div>
  );
};

export default SettingsPage;