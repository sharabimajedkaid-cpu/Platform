
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* Academic Management Room — Comprehensive center for all academic operations */

type Tab = 'overview'|'intake'|'students'|'schedule'|'templates'|'archive'|'reports'

interface Student {
  id:string; name:string; nameAr?:string; email:string; phone:string; level:string
  course:string; teacher:string; joinDate:string; status:'new'|'enrolled'|'pending-payment'|'active'|'completed'
  interviewDate?:string; paymentStatus?:'paid'|'partial'|'pending'
}

const SEED_STUDENTS: Student[] = [
  {id:'s1',name:'Ali Mohammed',nameAr:'علي محمد',email:'ali@email.com',phone:'+967770001001',level:'Beginner',course:'Oxford Phonics 1',teacher:'T. Suhair',joinDate:'2024-09-01',status:'active',paymentStatus:'paid'},
  {id:'s2',name:'Fatima Hassan',nameAr:'فاطمة حسن',email:'fatima@email.com',phone:'+967770001002',level:'Pre-Intermediate',course:'Gogo 3',teacher:'T. Waad',joinDate:'2024-09-01',status:'active',paymentStatus:'partial'},
  {id:'s3',name:'Sara Almahdi',nameAr:'سارة المهدي',email:'sara@email.com',phone:'+967770001003',level:'Intermediate',course:'Speakout Int',teacher:'T. Hassan',joinDate:'2024-09-15',status:'enrolled',paymentStatus:'pending'},
  {id:'s4',name:'Khaled Alawi',nameAr:'خالد العاوي',email:'khaled@email.com',phone:'+967770001004',level:'New',course:'TBD',teacher:'TBD',joinDate:'2024-10-01',status:'new',interviewDate:'2024-10-05 10:00'},
  {id:'s5',name:'Nour Alqaiti',nameAr:'نور القيتي',email:'nour@email.com',phone:'+967770001005',level:'Elementary',course:'Gogo 1',teacher:'T. Jamal',joinDate:'2024-09-20',status:'pending-payment',paymentStatus:'pending'},
]

const TEMPLATES = [
  {id:'t1',title:'Student Registration Form',titleAr:'نموذج التسجيل',emoji:'📋',category:'Registration',uses:245},
  {id:'t2',title:'Placement Test — Beginner',titleAr:'اختبار تحديد المستوى — مبتدئ',emoji:'🎯',category:'Assessment',uses:128},
  {id:'t3',title:'Parent Consent Form',titleAr:'نموذج موافقة ولي الأمر',emoji:'👪',category:'Registration',uses:89},
  {id:'t4',title:'Monthly Progress Report',titleAr:'تقرير التقدم الشهري',emoji:'📊',category:'Reports',uses:312},
  {id:'t5',title:'Teacher Evaluation Sheet',titleAr:'نموذج تقييم المدرس',emoji:'⭐',category:'Evaluation',uses:156},
  {id:'t6',title:'Course Completion Certificate',titleAr:'شهادة إتمام الدورة',emoji:'🎓',category:'Certificates',uses:67},
  {id:'t7',title:'Homework Assignment Sheet',titleAr:'ورقة الواجب المنزلي',emoji:'📝',category:'Academic',uses:421},
  {id:'t8',title:'Class Attendance Register',titleAr:'سجل الحضور',emoji:'✅',category:'Academic',uses:378},
]

const STATUS_CFG = {
  'new':              {color:'#818cf8',bg:'rgba(129,140,248,0.12)',label:'New',labelAr:'جديد'},
  'enrolled':         {color:'#38bdf8',bg:'rgba(56,189,248,0.12)',label:'Enrolled',labelAr:'مسجل'},
  'pending-payment':  {color:'#f0a500',bg:'rgba(240,165,0,0.12)',label:'Pending Payment',labelAr:'في انتظار الدفع'},
  'active':           {color:'#34d399',bg:'rgba(52,211,153,0.12)',label:'Active',labelAr:'نشط'},
  'completed':        {color:'#a78bfa',bg:'rgba(167,139,250,0.12)',label:'Completed',labelAr:'مكتمل'},
}
const PAY_CFG = {
  paid:    {color:'#34d399',label:'Paid',labelAr:'مدفوع'},
  partial: {color:'#f0a500',label:'Partial',labelAr:'جزئي'},
  pending: {color:'#f87171',label:'Pending',labelAr:'معلق'},
}

export function AcademicRoomPage() {
  const [tab,setTab]=useState<Tab>('overview')
  const [students,setStudents]=useState<Student[]>(SEED_STUDENTS)
  const [search,setSearch]=useState('')
  const [statusFilter,setStatusFilter]=useState<string>('all')
  const [showInterview,setShowInterview]=useState(false)
  const [selectedStudent,setSelectedStudent]=useState<Student|null>(null)
  const [meetingActive,setMeetingActive]=useState(false)
  const [meetingMinimized,setMeetingMinimized]=useState(false)

  const filtered=students.filter(s=>{
    const q=search.toLowerCase()
    return (s.name.toLowerCase().includes(q)||s.course.toLowerCase().includes(q))
      &&(statusFilter==='all'||s.status===statusFilter)
  })

  const tabs: {id:Tab;label:string;labelAr:string;emoji:string}[] = [
    {id:'overview',label:'Overview',labelAr:'نظرة عامة',emoji:'📊'},
    {id:'intake',label:'New Intake',labelAr:'القبول الجديد',emoji:'🎓'},
    {id:'students',label:'All Students',labelAr:'جميع الطلاب',emoji:'👥'},
    {id:'schedule',label:'Schedule',labelAr:'الجدول',emoji:'📅'},
    {id:'templates',label:'Templates',labelAr:'النماذج',emoji:'📋'},
    {id:'archive',label:'Archive',labelAr:'الأرشيف',emoji:'🗂'},
    {id:'reports',label:'Reports',labelAr:'التقارير',emoji:'📈'},
  ]

  const statusCounts=Object.keys(STATUS_CFG).reduce((a,s)=>({...a,[s]:students.filter(st=>st.status===s).length}),{} as Record<string,number>)

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Page header */}
      <div className="rounded-2xl p-5 relative overflow-hidden"
        style={{background:'linear-gradient(135deg,#060b18 0%,#0a1628 50%,#060e1e 100%)',border:'1px solid rgba(196,125,0,0.22)',boxShadow:'0 8px 32px rgba(0,0,0,0.35)'}}>
        <div className="absolute inset-0 opacity-[0.025]"
          style={{backgroundImage:'radial-gradient(circle, rgba(196,125,0,0.9) 1px, transparent 1px)',backgroundSize:'20px 20px'}} />
        <div className="absolute top-0 right-0 w-48 h-full pointer-events-none opacity-10"
          style={{background:'radial-gradient(ellipse at right,#c47d00,transparent)'}} />
        <div className="relative flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <img src="/center-logo.png" alt="BC" className="w-10 h-10 rounded-xl object-contain bg-white p-0.5 shadow-lg" />
              <div>
                <h2 className="text-xl font-black text-white">🏛 Academic Management Room</h2>
                <p className="text-xs text-amber-400/50" style={{fontFamily:'Tajawal,sans-serif'}}>غرفة الإدارة الأكاديمية · المركز البريطاني الأول</p>
              </div>
            </div>
            <p className="text-xs text-white/30 mt-1">Complete academic control · Student intake · Schedules · Templates · Reports</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={()=>{setMeetingActive(true);setMeetingMinimized(false)}}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold"
              style={{background:'linear-gradient(135deg,#059669,#10b981)',color:'#fff',boxShadow:'0 4px 16px rgba(16,185,129,0.25)'}}>
              🎥 Start Meeting
            </button>
            <button onClick={()=>setTab('intake')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold"
              style={{background:'linear-gradient(135deg,#c47d00,#f0a500)',color:'#060b18',boxShadow:'0 4px 16px rgba(240,165,0,0.25)'}}>
              ➕ New Intake
            </button>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
          {Object.entries(statusCounts).map(([s,n])=>{
            const sc=(STATUS_CFG as any)[s]
            return (
              <button key={s} onClick={()=>setStatusFilter(v=>v===s?'all':s)}
                className="p-3 rounded-xl text-center transition"
                style={{background:statusFilter===s?sc.bg:`${sc.color}08`,border:`1px solid ${statusFilter===s?sc.color+'35':sc.color+'15'}`}}>
                <p className="text-xl font-black" style={{color:sc.color}}>{n}</p>
                <p className="text-[9px] font-bold mt-0.5" style={{color:sc.color}}>{sc.label}</p>
                <p className="text-[8px] text-white/25" style={{fontFamily:'Tajawal,sans-serif'}}>{sc.labelAr}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition flex-shrink-0"
            style={{background:tab===t.id?'linear-gradient(135deg,#c47d00,#f0a500)':' rgba(255,255,255,0.04)',color:tab===t.id?'#060b18':'rgba(255,255,255,0.45)',boxShadow:tab===t.id?'0 4px 16px rgba(240,165,0,0.22)':undefined,border:tab!==t.id?'1px solid rgba(255,255,255,0.07)':undefined}}>
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab==='overview'&&(
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {title:'New Applications',titleAr:'الطلبات الجديدة',value:students.filter(s=>s.status==='new').length,icon:'📥',color:'#818cf8',action:'Review Now'},
            {title:'Pending Interviews',titleAr:'مقابلات معلقة',value:students.filter(s=>s.status==='new'&&s.interviewDate).length,icon:'🎥',color:'#38bdf8',action:'Schedule'},
            {title:'Active Students',titleAr:'الطلاب النشطون',value:students.filter(s=>s.status==='active').length,icon:'🎓',color:'#34d399',action:'View All'},
            {title:'Pending Payments',titleAr:'دفعات معلقة',value:students.filter(s=>s.paymentStatus==='pending').length,icon:'💳',color:'#f0a500',action:'Follow Up'},
            {title:'Templates Available',titleAr:'النماذج المتاحة',value:TEMPLATES.length,icon:'📋',color:'#a78bfa',action:'Open Library'},
            {title:'Today\'s Classes',titleAr:'فصول اليوم',value:12,icon:'🚪',color:'#f87171',action:'View Schedule'},
          ].map((stat,i)=>(
            <motion.div key={i} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
              whileHover={{y:-3}} className="rounded-2xl p-5 cursor-default"
              style={{background:'rgba(8,14,32,0.90)',border:`1px solid ${stat.color}18`,boxShadow:`0 4px 20px rgba(0,0,0,0.15)`}}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.boxShadow=`0 8px 28px ${stat.color}15`}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.boxShadow='0 4px 20px rgba(0,0,0,0.15)'}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{background:`${stat.color}12`,border:`1px solid ${stat.color}20`}}>{stat.icon}</div>
                <button className="text-[10px] font-semibold px-2.5 py-1 rounded-full transition"
                  style={{background:`${stat.color}10`,color:stat.color,border:`1px solid ${stat.color}20`}}>
                  {stat.action} →
                </button>
              </div>
              <p className="text-3xl font-black mb-0.5" style={{color:stat.color}}>{stat.value}</p>
              <p className="text-sm font-bold text-white/70">{stat.title}</p>
              <p className="text-[10px] text-white/30 mt-0.5" style={{fontFamily:'Tajawal,sans-serif'}}>{stat.titleAr}</p>
            </motion.div>
          ))}

          {/* Recent activity */}
          <div className="col-span-full rounded-2xl p-5" style={{background:'rgba(8,14,32,0.90)',border:'1px solid rgba(255,255,255,0.06)'}}>
            <p className="text-sm font-black text-white mb-4">🔔 Recent Academic Activity</p>
            <div className="space-y-2.5">
              {[
                {text:'New student application received — Khaled Alawi',time:'5 min ago',color:'#818cf8',textAr:'استلام طلب تسجيل جديد'},
                {text:'Payment confirmed — Sara Almahdi (Speakout Int)',time:'20 min ago',color:'#34d399',textAr:'تأكيد الدفع'},
                {text:'Interview scheduled — Nour Alqaiti — Oct 8 at 11:00',time:'1 hr ago',color:'#38bdf8',textAr:'جدولة المقابلة'},
                {text:'Placement test completed — Ali Mohammed — Level B1',time:'2 hr ago',color:'#f0a500',textAr:'إتمام اختبار تحديد المستوى'},
                {text:'Course assigned — Fatima Hassan → Speakout Pre-Int',time:'3 hr ago',color:'#a78bfa',textAr:'تعيين الدورة'},
              ].map((a,i)=>(
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{background:a.color}} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/70">{a.text}</p>
                    <p className="text-[9px] text-white/25 mt-0.5" style={{fontFamily:'Tajawal,sans-serif'}}>{a.textAr}</p>
                  </div>
                  <span className="text-[9px] text-white/25 flex-shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NEW INTAKE */}
      {tab==='intake'&&(
        <div className="space-y-5">
          <div className="rounded-2xl p-5" style={{background:'rgba(8,14,32,0.90)',border:'1px solid rgba(99,102,241,0.15)'}}>
            <p className="text-sm font-black text-white mb-1">🎓 New Student Intake Flow</p>
            <p className="text-xs text-white/40 mb-5">Manage the full journey from first contact to enrollment</p>

            {/* Flow steps */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                {step:1,label:'Application\nReceived',labelAr:'استلام الطلب',icon:'📥',color:'#818cf8'},
                {step:2,label:'Interview\nScheduled',labelAr:'جدولة المقابلة',icon:'📅',color:'#38bdf8'},
                {step:3,label:'Level\nAssessed',labelAr:'تحديد المستوى',icon:'🎯',color:'#f0a500'},
                {step:4,label:'Course\nAssigned',labelAr:'تعيين الدورة',icon:'📚',color:'#34d399'},
              ].map(s=>(
                <div key={s.step} className="p-4 rounded-2xl text-center"
                  style={{background:`${s.color}0a`,border:`1px solid ${s.color}20`}}>
                  <p className="text-2xl mb-2">{s.icon}</p>
                  <p className="text-xs font-black text-white whitespace-pre-line leading-snug">{s.label}</p>
                  <p className="text-[9px] text-white/30 mt-1" style={{fontFamily:'Tajawal,sans-serif'}}>{s.labelAr}</p>
                </div>
              ))}
            </div>

            {/* New applications */}
            <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">📥 Pending Applications</p>
            {students.filter(s=>s.status==='new'||s.status==='pending-payment').map(s=>{
              const sc=(STATUS_CFG as any)[s.status]
              return (
                <div key={s.id} className="flex items-center gap-4 p-4 rounded-xl mb-2 hover:bg-white/[0.03] transition"
                  style={{border:'1px solid rgba(255,255,255,0.05)'}}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                    style={{background:'rgba(99,102,241,0.15)',color:'#a5b4fc'}}>
                    {s.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white">{s.name}</p>
                    <p className="text-[10px] text-white/40">{s.phone} · {s.email}</p>
                    {s.interviewDate&&<p className="text-[9px] text-indigo-400 mt-0.5">🗓 Interview: {s.interviewDate}</p>}
                  </div>
                  <span className="text-[9px] font-bold px-2 py-1 rounded-full flex-shrink-0"
                    style={{background:sc.bg,color:sc.color}}>{sc.label}</span>
                  <div className="flex gap-2">
                    <button onClick={()=>{setSelectedStudent(s);setMeetingActive(true)}}
                      className="px-3 py-1.5 rounded-xl text-[10px] font-semibold"
                      style={{background:'rgba(16,185,129,0.15)',color:'#34d399',border:'1px solid rgba(16,185,129,0.25)'}}>
                      🎥 Meet
                    </button>
                    <button onClick={()=>setStudents(p=>p.map(x=>x.id===s.id?{...x,status:'enrolled'}:x))}
                      className="px-3 py-1.5 rounded-xl text-[10px] font-semibold"
                      style={{background:'rgba(56,189,248,0.15)',color:'#38bdf8',border:'1px solid rgba(56,189,248,0.25)'}}>
                      ✅ Enroll
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ALL STUDENTS */}
      {tab==='students'&&(
        <div className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25">🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search students…"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',color:'white'}} />
            </div>
            <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.7)'}}>
              <option value="all">All Status</option>
              {Object.entries(STATUS_CFG).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{background:'rgba(8,14,32,0.90)',border:'1px solid rgba(255,255,255,0.06)'}}>
            <div className="hidden md:grid px-4 py-3 text-[9px] font-bold uppercase tracking-widest border-b"
              style={{gridTemplateColumns:'1fr 1fr 80px 100px 80px 110px 100px',borderColor:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.25)'}}>
              <div>Student</div><div>Course</div><div>Level</div><div>Teacher</div><div>Status</div><div>Payment</div><div>Actions</div>
            </div>
            {filtered.map(s=>{
              const sc=(STATUS_CFG as any)[s.status]
              const pc=s.paymentStatus?PAY_CFG[s.paymentStatus]:null
              return (
                <div key={s.id} className="grid md:grid-cols-1 px-4 py-3 border-b hover:bg-white/[0.025] transition"
                  style={{borderColor:'rgba(255,255,255,0.04)'}}>
                  <div className="hidden md:grid items-center gap-3"
                    style={{gridTemplateColumns:'1fr 1fr 80px 100px 80px 110px 100px'}}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                        style={{background:'rgba(99,102,241,0.15)',color:'#a5b4fc'}}>{s.name.charAt(0)}</div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{s.name}</p>
                        <p className="text-[9px] text-white/30 truncate" style={{fontFamily:'Tajawal,sans-serif'}}>{s.nameAr}</p>
                      </div>
                    </div>
                    <p className="text-xs text-white/55 truncate">{s.course}</p>
                    <p className="text-[10px] text-white/40">{s.level}</p>
                    <p className="text-[10px] text-white/40 truncate">{s.teacher}</p>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full w-fit" style={{background:sc.bg,color:sc.color}}>{sc.label}</span>
                    {pc?<span className="text-[9px] font-bold px-2 py-0.5 rounded-full w-fit" style={{background:`${pc.color}12`,color:pc.color}}>{pc.label}</span>:<span className="text-[9px] text-white/20">—</span>}
                    <div className="flex gap-1">
                      <button onClick={()=>{setSelectedStudent(s);setMeetingActive(true)}}
                        className="p-1 rounded-lg text-emerald-400/60 hover:text-emerald-400 hover:bg-emerald-500/15 transition text-sm" title="Meet">🎥</button>
                      <button className="p-1 rounded-lg text-indigo-400/60 hover:text-indigo-400 hover:bg-indigo-500/15 transition text-sm" title="Edit">✏️</button>
                    </div>
                  </div>
                  {/* Mobile */}
                  <div className="md:hidden flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                      style={{background:'rgba(99,102,241,0.15)',color:'#a5b4fc'}}>{s.name.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">{s.name}</p>
                      <p className="text-xs text-white/40">{s.course} · {s.teacher}</p>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{background:sc.bg,color:sc.color}}>{sc.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* TEMPLATES */}
      {tab==='templates'&&(
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-black text-white/70">📋 Template Library — {TEMPLATES.length} templates</p>
            <button className="px-4 py-2 rounded-xl text-sm font-bold"
              style={{background:'linear-gradient(135deg,#6366f1,#7c3aed)',color:'#fff'}}>
              ➕ New Template
            </button>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {TEMPLATES.map((t,i)=>(
              <motion.div key={t.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
                whileHover={{y:-2}} className="rounded-2xl p-4 cursor-default"
                style={{background:'rgba(8,14,32,0.90)',border:'1px solid rgba(255,255,255,0.07)'}}>
                <div className="text-3xl mb-3">{t.emoji}</div>
                <p className="text-sm font-bold text-white leading-snug mb-0.5">{t.title}</p>
                <p className="text-[10px] text-white/35 mb-2" style={{fontFamily:'Tajawal,sans-serif'}}>{t.titleAr}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold" style={{background:'rgba(99,102,241,0.12)',color:'#a5b4fc'}}>{t.category}</span>
                  <span className="text-[9px] text-white/25">{t.uses} uses</span>
                </div>
                <div className="flex gap-1.5 mt-3">
                  <button className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold" style={{background:'rgba(99,102,241,0.10)',color:'#a5b4fc',border:'1px solid rgba(99,102,241,0.18)'}}>Use</button>
                  <button className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold" style={{background:'rgba(255,255,255,0.04)',color:'rgba(255,255,255,0.40)',border:'1px solid rgba(255,255,255,0.07)'}}>Edit</button>
                  <button className="py-1.5 px-2 rounded-lg text-[10px] text-white/25 hover:text-red-400 transition">🗑</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* SCHEDULE */}
      {tab==='schedule'&&(
        <div className="rounded-2xl p-6 text-center" style={{background:'rgba(8,14,32,0.90)',border:'1px solid rgba(255,255,255,0.06)'}}>
          <p className="text-5xl mb-4">📅</p>
          <p className="text-lg font-black text-white/60">Academic Calendar</p>
          <p className="text-sm text-white/30 mt-1">Full weekly/monthly class schedule with teacher assignments coming here.</p>
        </div>
      )}

      {/* ARCHIVE */}
      {tab==='archive'&&(
        <div className="rounded-2xl p-6 text-center" style={{background:'rgba(8,14,32,0.90)',border:'1px solid rgba(255,255,255,0.06)'}}>
          <p className="text-5xl mb-4">🗂</p>
          <p className="text-lg font-black text-white/60">Academic Archive</p>
          <p className="text-sm text-white/30 mt-1">Completed courses, graduated students, historical records and certificates.</p>
        </div>
      )}

      {/* REPORTS */}
      {tab==='reports'&&(
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {title:'Enrollment Report',titleAr:'تقرير التسجيل',emoji:'📊',color:'#6366f1'},
            {title:'Payment Report',titleAr:'تقرير المدفوعات',emoji:'💰',color:'#f0a500'},
            {title:'Academic Progress',titleAr:'التقدم الأكاديمي',emoji:'📈',color:'#34d399'},
            {title:'Teacher Performance',titleAr:'أداء المدرسين',emoji:'⭐',color:'#a78bfa'},
          ].map(r=>(
            <div key={r.title} className="rounded-2xl p-5 cursor-pointer hover:-translate-y-1 transition"
              style={{background:'rgba(8,14,32,0.90)',border:`1px solid ${r.color}18`}}>
              <p className="text-3xl mb-3">{r.emoji}</p>
              <p className="text-base font-black text-white">{r.title}</p>
              <p className="text-xs text-white/35 mt-0.5" style={{fontFamily:'Tajawal,sans-serif'}}>{r.titleAr}</p>
              <button className="mt-4 px-4 py-2 rounded-xl text-xs font-bold"
                style={{background:`${r.color}12`,color:r.color,border:`1px solid ${r.color}20`}}>
                Generate Report →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Floating meeting room */}
      <AnimatePresence>
        {meetingActive&&(
          <motion.div initial={{opacity:0,scale:0.85,y:40}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.85,y:40}}
            className="fixed z-50 shadow-2xl rounded-2xl overflow-hidden"
            style={{
              bottom:meetingMinimized?'20px':'50%',right:'20px',
              width:meetingMinimized?'220px':'480px',
              height:meetingMinimized?'52px':'320px',
              transform:meetingMinimized?undefined:'translateY(50%)',
              background:'#0a1228',border:'1px solid rgba(52,211,153,0.35)',
              boxShadow:'0 24px 64px rgba(0,0,0,0.60)',
            }}>
            {/* Meeting header */}
            <div className="flex items-center gap-2 px-3 py-2.5 flex-shrink-0"
              style={{background:'linear-gradient(135deg,rgba(5,150,105,0.25),rgba(16,185,129,0.15))',borderBottom:'1px solid rgba(52,211,153,0.15)'}}>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-emerald-400 truncate">🎥 Academic Meeting Room</p>
                {selectedStudent&&<p className="text-[9px] text-white/40 truncate">{selectedStudent.name}</p>}
              </div>
              <button onClick={()=>setMeetingMinimized(m=>!m)} className="text-white/40 hover:text-white transition text-xs">{meetingMinimized?'⬆':'⬇'}</button>
              <button onClick={()=>{setMeetingActive(false);setSelectedStudent(null)}} className="text-white/40 hover:text-red-400 transition text-xs">✕</button>
            </div>

            {!meetingMinimized&&(
              <div className="flex flex-col h-full">
                {/* Video area */}
                <div className="flex-1 relative" style={{background:'linear-gradient(135deg,#060e1c,#0d1a30)'}}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-4xl mb-2">🎥</p>
                      <p className="text-xs text-white/40">Camera feed · Academic interview room</p>
                      {selectedStudent&&<p className="text-xs text-emerald-400 mt-1">{selectedStudent.name}</p>}
                    </div>
                  </div>
                  {/* Local camera PiP */}
                  <div className="absolute bottom-2 right-2 w-16 h-12 rounded-lg"
                    style={{background:'rgba(0,0,0,0.5)',border:'1px solid rgba(255,255,255,0.10)'}}>
                    <div className="w-full h-full flex items-center justify-center text-xl">👤</div>
                  </div>
                </div>
                {/* Meeting controls */}
                <div className="flex items-center justify-center gap-3 px-4 py-3 flex-shrink-0" style={{borderTop:'1px solid rgba(255,255,255,0.06)'}}>
                  {[{icon:'🎙',label:'Mute'},{icon:'📷',label:'Camera'},{icon:'💬',label:'Chat'},{icon:'📋',label:'Notes'},{icon:'📞',label:'End',red:true}].map(btn=>(
                    <button key={btn.label} title={btn.label}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition hover:scale-110"
                      style={{background:btn.red?'rgba(239,68,68,0.25)':'rgba(255,255,255,0.06)',border:`1px solid ${btn.red?'rgba(239,68,68,0.40)':'rgba(255,255,255,0.10)'}`}}
                      onClick={()=>{if(btn.red){setMeetingActive(false);setSelectedStudent(null)}}}>
                      {btn.icon}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
