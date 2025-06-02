import { useState, memo } from 'react';
import Home from './components/Home'; // You can assign this to Dashboard or another tab as needed
import FileList from './components/FileList';

// ==================== Memoized Components ====================

// Dashboard – Overview of jobs, candidates, and activity
const DashboardTab = memo(() => 
  <Home/>
);

// Jobs – Job postings, status, and management
const JobsTab = memo(() => <div>Jobs management Create, edit, publish, and manage job postings.</div>);

// Applicants – List and filters for candidate applications
const ApplicantsTab = memo(() => <div>Applicants list View and manage candidate profiles for each job.</div>);

// Pipeline – Stage-based tracking of candidates (e.g. screening, interview)
const PipelineTab = memo(() => <div>Candidate pipeline Drag-and-drop applicants across stages like Screening, Interview, Offer, etc.</div>);

// Interviews – Schedule and track interviews
const InterviewsTab = memo(() => <div>Interview scheduling Schedule, manage, and track interviews with feedback.</div>);

// Offers – Create and manage job offers
const OffersTab = memo(() => <div>Offers dashboard Create and send offer letters, track responses.</div>);

// Emails – Communication center (auto emails, templates, logs)
const EmailsTab = memo(() => <div>Emails dashboard Send & track application status emails to candidates.</div>);

// Analytics – Hiring metrics, funnel conversion, time-to-hire
const AnalyticsTab = memo(() => <div>Analytics and insights Application funnel, source of applicants, time-to-hire, etc.</div>);

// Candidates – Global candidate database and history
const CandidatesTab = memo(() => <div>Candidates directory A master list of all applicants across jobs.</div>);

// Talent Pool – Segmented groups of potential hires
const TalentPoolTab = memo(() => <div>Talent pool Save candidates for future roles or re-engagement.</div>);

// Team – Roles, permissions, and team member overview
const TeamTab = memo(() => <div>Team settings Team – Roles, permissions, and team member overview</div>);

// Settings – App configurations and integrations
const SettingsTab = memo(() => <div>Settings panel</div>);

//Scan - scan a bulk of files and filter
const ScannerTab = memo(()=><div className='p-4'><FileList/></div>)
// ==================== Tab Definitions ====================

const tabs = [
  { label: "Dashboard", component: DashboardTab },
  { label: "Jobs", component: JobsTab },
  { label: "Applicants", component: ApplicantsTab },
  { label: "Pipeline", component: PipelineTab },
  { label: "Interviews", component: InterviewsTab },
  { label: "Offers", component: OffersTab },
  { label: "Emails", component: EmailsTab },
  { label: "Analytics", component: AnalyticsTab },
  { label: "Candidates", component: CandidatesTab },
  { label: "Talent Pool", component: TalentPoolTab },
  { label: "Team", component: TeamTab },
  { label: "Settings", component: SettingsTab },
  { label:"Scan", component: ScannerTab }
];

// ==================== Main App Component ====================

function App() {
  const [activeTab, setActiveTab] = useState(tabs[0].label);
  const ActiveComponent = tabs.find(tab => tab.label === activeTab)?.component || (() => <div>Not found</div>);

  return (
    <div className="mx-auto">
      {/* Tabs Navigation */}
      <nav className="flex flex-wrap gap-2 mb-1">
        {tabs.map(({ label }) => (
          <button
            key={label}
            onClick={() => setActiveTab(label)}
            className={`py-2 px-4 font-medium transition-all
              ${
                label === activeTab
                  ? 'bg-neutral-100 text-neutral-600'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Content Area */}
      <main className="p-2">
        <ActiveComponent />
      </main>
    </div>
  );
}

export default App;
