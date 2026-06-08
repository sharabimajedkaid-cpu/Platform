
export function UsersPage() {
  const users = [
    { name: 'Admin Britishce44', email: 'admin@britishce44.edu', role: 'admin', status: 'active' },
    { name: 'T.Suhair Almojahid', email: 'suhair@britishce44.edu', role: 'teacher', status: 'active' },
    { name: 'T.Shihab Alomary', email: 'shihab@britishce44.edu', role: 'teacher', status: 'active' },
    { name: 'Student Ahmed', email: 'ahmed@britishce44.edu', role: 'student', status: 'active' },
    { name: 'Student Mona', email: 'mona@britishce44.edu', role: 'student', status: 'active' },
    { name: 'Student Omar', email: 'omar@britishce44.edu', role: 'student', status: 'inactive' },
    { name: 'Supervisor Ali', email: 'ali@britishce44.edu', role: 'supervisor', status: 'active' },
  ]

  const roles = ['all', 'admin', 'teacher', 'student', 'supervisor']

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-navy">👥 Users Management</h2>
      <p className="text-sm text-gray-500">Admin only — manage all platform users.</p>
      <div className="flex gap-2 flex-wrap mb-2">
        {roles.map(r => (
          <button key={r} className={`px-3 py-1 rounded-full text-xs border ${r === 'all' ? 'bg-navy text-white' : 'hover:bg-gray-100'}`}>
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
        <button className="ml-auto bg-gold text-navy px-4 py-1 rounded-full text-xs font-bold">+ Add User</button>
      </div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy text-white text-xs">
            <tr><th className="p-3 text-left">Name</th><th className="p-3 text-left">Email</th><th className="p-3 text-left">Role</th><th className="p-3 text-left">Status</th></tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3 text-gray-500">{u.email}</td>
                <td className="p-3"><span className="text-xs px-2 py-0.5 rounded-full bg-royal-blue/10 text-royal-blue">{u.role}</span></td>
                <td className="p-3"><span className={`text-xs ${u.status === 'active' ? 'text-green-600' : 'text-red-500'}`}>● {u.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
