import React, { useEffect, useState } from 'react';
import { Users, CheckCircle, XCircle, ClipboardList } from "lucide-react";
import { supabase } from './supabase';
import WebhookButton from './WebhookButton';


const WEBHOOK_URL =
  'https://n8n.srv897055.hstgr.cloud/webhook/724d471e-88a8-407e-8507-040b0fe0251e'; // replace with your webhook

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    required: 0,
  });
  const [attendance, setAttendance] = useState([]);

  
  // filters for table only
  const [filters, setFilters] = useState({
    date: new Date().toISOString().split('T')[0],
    name: '',
    department: '',
    skill: '',
  });

  const [departments, setDepartments] = useState([]);
  const [skills, setSkills] = useState([]);

  // Fetch stats for cards
  const fetchStats = async () => {
    const { count: total } = await supabase
      .from('employees')
      .select('*', { count: 'exact', head: true });

    const { data: today } = await supabase
      .from('attendance')
      .select('status')
      .eq('date', new Date().toISOString().split('T')[0]); // always today

    const present = today?.filter((a) => a.status === 'present').length || 0;
    const absent = today?.filter((a) => a.status === 'absent').length || 0;
    const late = today?.filter((a) => a.status === 'late').length || 0;

    const { data: req } = await supabase
      .from('skill_requirements')
      .select('required_count')
      .eq('date', new Date().toISOString().split('T')[0]);

    const required = req?.reduce((sum, r) => sum + r.required_count, 0) || 0;

    setStats({ total: total || 0, present, absent, late, required });
  };

  // Fetch attendance table
  const fetchAttendance = async () => {
    let query = supabase
      .from('attendance')
      .select(
        `
        date,
        status,
        employees (
          full_name,
          emp_code,
          departments(name),
          employee_skills (
            skills (name)
          )
        )
      `
      )
      .eq('date', filters.date);

    if (filters.name) {
      query = query.ilike('employees.full_name', `%${filters.name}%`);
    }
    if (filters.department) {
      query = query.eq('employees.departments.name', filters.department);
    }
    if (filters.skill) {
      query = query.eq('employees.employee_skills.skills.name', filters.skill);
    }

    const { data } = await query;
    setAttendance(data || []);
  };

  // Fetch dropdown data
  const fetchFilters = async () => {
    const { data: dept } = await supabase.from('departments').select('name');
    setDepartments(dept || []);
    const { data: skl } = await supabase.from('skills').select('name');
    setSkills(skl || []);
  };

  const triggerWebhook = async () => {
    await fetch(WEBHOOK_URL, { method: 'POST' });
    alert('Webhook triggered!');
  };

  useEffect(() => {
    fetchStats();
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [filters]);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Heading */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
    <h1 className="text-xl font-bold text-gray-800">Job Buddy Attendance</h1>
    <span className="text-sm text-gray-500">Arshaan</span>
  </div>
</header>


      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {[
    { label: "Total Employees", value: stats.total, color: "bg-blue-100 text-blue-700", icon: Users },
    { label: "Present", value: stats.present, color: "bg-green-100 text-green-700", icon: CheckCircle },
    { label: "Absent", value: stats.absent, color: "bg-red-100 text-red-700", icon: XCircle },
    { label: "Required", value: stats.required, color: "bg-purple-100 text-purple-700", icon: ClipboardList },
  ].map((c) => {
    const Icon = c.icon;
    return (
      <div
        key={c.label}
        className={`flex flex-col justify-center items-center rounded-2xl 
                    shadow-md p-8 border border-gray-200 ${c.color} 
                    transition transform hover:-translate-y-1 hover:shadow-lg`}
      >
        <Icon className="w-8 h-8 mb-3 opacity-80" />
        <p className="text-base font-medium">{c.label}</p>
        <p className="text-4xl font-bold mt-1">{c.value}</p>
      </div>
    );
  })}
</div>


      {/*WebhookButton*/}
      <WebhookButton onClick={triggerWebhook} />
      

      {/* Table Filters */}
      <div className="bg-white shadow p-4 rounded-lg flex flex-wrap gap-4">
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="border p-2 rounded w-40"
        />
        <input
          type="text"
          placeholder="Search by name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          className="border p-2 rounded flex-1"
        />
        <select
          value={filters.department}
          onChange={(e) =>
            setFilters({ ...filters, department: e.target.value })
          }
          className="border p-2 rounded"
        >
          <option value="">All Departments</option>
          {departments.map((d, i) => (
            <option key={i} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>
        <select
          value={filters.skill}
          onChange={(e) => setFilters({ ...filters, skill: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Skills</option>
          {skills.map((s, i) => (
            <option key={i} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Attendance Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Employee Code</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Department</th>
              <th className="p-3 border">Skill</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((row, i) => (
              <tr
                key={i}
                className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
              >
                <td className="p-3 border">{row.date}</td>
                <td className="p-3 border">{row.employees?.emp_code}</td>
                <td className="p-3 border">{row.employees?.full_name}</td>
                <td className="p-3 border">
                  {row.employees?.departments?.name}
                </td>
                <td className="p-3 border">
                  {row.employees?.employee_skills?.[0]?.skills?.name || '-'}
                </td>
                <td
                  className={`p-3 border capitalize font-medium ${
                    row.status === 'present'
                      ? 'text-green-600'
                      : row.status === 'absent'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {row.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
