import type { Complaint, ComplaintStatus } from './types';
import { complaintCategories } from './types';

// In-memory store for demonstration purposes
let complaints: Complaint[] = [
  {
    id: 'TICKET-12345',
    roomNumber: 'A-101',
    category: 'Plumbing',
    description: 'Leaky faucet in the bathroom sink. It has been dripping constantly for two days.',
    status: 'Reported',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: 'TICKET-23456',
    roomNumber: 'B-205',
    category: 'Electrical',
    description: 'The main overhead light in the bedroom is flickering.',
    status: 'In Progress',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    id: 'TICKET-34567',
    roomNumber: 'C-310',
    category: 'Resolved',
    description: 'The window latch is broken and the window does not close properly.',
    status: 'Resolved',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
  },
    {
    id: 'TICKET-45678',
    roomNumber: 'D-404',
    category: 'Heating',
    description: 'Radiator is not working, room is very cold.',
    status: 'Assigned',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
];

// Simulate database latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getComplaints(): Promise<Complaint[]> {
  await delay(200);
  return complaints.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getComplaintById(id: string): Promise<Complaint | undefined> {
  await delay(150);
  return complaints.find(c => c.id === id);
}

export async function addComplaint(data: Omit<Complaint, 'id' | 'status' | 'createdAt'>): Promise<Complaint> {
  await delay(300);
  const newComplaint: Complaint = {
    ...data,
    id: `TICKET-${Math.floor(Math.random() * 90000) + 10000}`,
    status: 'Reported',
    createdAt: new Date(),
  };
  complaints.unshift(newComplaint);
  return newComplaint;
}

export async function updateComplaintStatus(id: string, status: ComplaintStatus): Promise<Complaint | undefined> {
  await delay(250);
  const complaintIndex = complaints.findIndex(c => c.id === id);
  if (complaintIndex !== -1) {
    complaints[complaintIndex].status = status;
    return complaints[complaintIndex];
  }
  return undefined;
}
