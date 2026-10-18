import React, { useState } from 'react';
import { GraduationCap, ArrowRight, BookOpen } from 'lucide-react';

export interface StudentProfile {
  name: string;
  department: string;
  semester: number;
}

interface AcademicSetupModalProps {
  initialProfile?: StudentProfile;
  isOpen: boolean;
  onSave: (profile: StudentProfile) => void;
  onClose?: () => void;
}

export const DEPARTMENTS = [
  { code: 'CS', name: 'B.E. Computer Science & Engineering' },
  { code: 'IT', name: 'B.Tech Information Technology' },
  { code: 'EC', name: 'B.E. Electronics & Communication' },
  { code: 'EE', name: 'B.E. Electrical & Electronics' },
  { code: 'ME', name: 'B.E. Mechanical Engineering' },
  { code: 'AI', name: 'B.Tech Artificial Intelligence & Data Science' },
];

export const AcademicSetupModal: React.FC<AcademicSetupModalProps> = ({
  initialProfile,
  isOpen,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(initialProfile?.name ?? '');
  const [department, setDepartment] = useState(initialProfile?.department ?? 'CS');
  const [semester, setSemester] = useState<number>(initialProfile?.semester ?? 1);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      department,
      semester,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-2xl transition-all">
        {/* Header */}
        <div className="bg-[#172554] dark:bg-slate-950 text-white p-5 flex items-center gap-3 border-b border-blue-950 dark:border-slate-800">
          <div className="w-10 h-10 flex items-center justify-center bg-white dark:bg-blue-600 text-[#172554] dark:text-white font-mono font-black text-sm">
            CC
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-blue-200">CALCREDIT · Setup</span>
            <h2 className="text-base font-bold tracking-tight">Academic Profile</h2>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Enter your details once. We will automatically load the prescribed Anna University courses for your semester.
          </p>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Student Name:
            </label>
            <input
              type="text"
              required
              value={name}
              placeholder="e.g. Raghu Nandan"
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:border-[#172554] dark:focus:border-blue-500 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Department / Course:
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:border-[#172554] dark:focus:border-blue-500 shadow-2xs"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept.code} value={dept.code}>
                  {dept.code} - {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Current Semester:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
                const isSelected = semester === sem;
                return (
                  <button
                    key={sem}
                    type="button"
                    onClick={() => setSemester(sem)}
                    className={`py-2 text-xs font-mono font-bold border transition-colors cursor-pointer text-center ${
                      isSelected
                        ? 'bg-[#172554] dark:bg-blue-600 text-white border-[#172554] dark:border-blue-600'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    SEM {sem}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#172554] dark:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1e3a8a] dark:hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span>Load Semester {semester} Courses</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
