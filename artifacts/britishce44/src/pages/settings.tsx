
export function SettingsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-navy">⚙️ Platform Settings</h2>
      <p className="text-sm text-gray-500">Manage global platform configuration.</p>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 shadow">
          <h3 className="font-semibold text-navy">🏫 Institution Info</h3>
          <div className="mt-3 space-y-3 text-sm">
            <div><label className="text-gray-400 text-xs">Name</label><p className="font-medium">The First British Center</p></div>
            <div><label className="text-gray-400 text-xs">Location</label><p className="font-medium">Taiz, Yemen</p></div>
            <div><label className="text-gray-400 text-xs">Timezone</label><p className="font-medium">AST (UTC+3)</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow">
          <h3 className="font-semibold text-navy">🔐 Security</h3>
          <div className="mt-3 space-y-2 text-sm">
            <label className="flex items-center justify-between"><span>Two-Factor Auth</span><input type="checkbox" defaultChecked className="toggle" /></label>
            <label className="flex items-center justify-between"><span>AI Anti-Cheat</span><input type="checkbox" defaultChecked className="toggle" /></label>
            <label className="flex items-center justify-between"><span>Auto-Logout (min)</span><input type="number" defaultValue={30} className="w-16 border rounded px-2 py-1 text-xs" /></label>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow">
          <h3 className="font-semibold text-navy">📧 Notifications</h3>
          <div className="mt-3 space-y-2 text-sm">
            <label className="flex items-center justify-between"><span>Email Reports</span><input type="checkbox" defaultChecked className="toggle" /></label>
            <label className="flex items-center justify-between"><span>Push Notifications</span><input type="checkbox" className="toggle" /></label>
            <label className="flex items-center justify-between"><span>SMS Alerts</span><input type="checkbox" className="toggle" /></label>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow">
          <h3 className="font-semibold text-navy">🎨 Appearance</h3>
          <div className="mt-3 space-y-2 text-sm">
            <label className="flex items-center justify-between"><span>Theme</span><select className="border rounded px-2 py-1 text-xs"><option>Light</option><option>Dark</option></select></label>
            <label className="flex items-center justify-between"><span>Language</span><select className="border rounded px-2 py-1 text-xs"><option>English</option><option>Arabic</option></select></label>
          </div>
        </div>
      </div>
      <div className="flex justify-end"><button className="bg-navy text-white px-6 py-2 rounded-full text-sm">Save Settings</button></div>
    </div>
  )
}
