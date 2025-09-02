import type { Complaint, ComplaintStatus } from './types';

// In-memory store for demonstration purposes
// We use a global variable to prevent the in-memory store from being reset during development hot-reloads.
declare global {
  var complaints: Complaint[] | undefined;
  var complaintCounter: number | undefined;
}

const initialComplaints: Complaint[] = [];

if (!global.complaints) {
  global.complaints = initialComplaints;
}

if (global.complaintCounter === undefined) {
  global.complaintCounter = 10000;
}

// Simulate database latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getComplaints(): Promise<Complaint[]> {
  await delay(200);
  return global.complaints!.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getComplaintById(id: string): Promise<Complaint | undefined> {
  await delay(150);
  return global.complaints!.find(c => c.id === id);
}

export async function addComplaint(data: Omit<Complaint, 'id' | 'status' | 'createdAt'>): Promise<Complaint> {
  await delay(300);
  global.complaintCounter! += 1;
  const newComplaint: Complaint = {
    ...data,
    id: `TICKET-${global.complaintCounter!}`,
    status: 'Reported',
    createdAt: new Date(),
  };
  global.complaints!.unshift(newComplaint);
  return newComplaint;
}

export async function updateComplaintStatus(id: string, status: ComplaintStatus): Promise<Complaint | undefined> {
  await delay(250);
  const complaintIndex = global.complaints!.findIndex(c => c.id === id);
  if (complaintIndex !== -1) {
    global.complaints![complaintIndex].status = status;
    return global.complaints![complaintIndex];
  }
  return undefined;
}
