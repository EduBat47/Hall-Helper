export const complaintCategories = ['Plumbing', 'Electrical', 'Heating', 'Cleanliness', 'Maintenance'] as const;
export type ComplaintCategory = (typeof complaintCategories)[number];

export const complaintStatuses = ['Reported', 'Assigned', 'In Progress', 'Resolved'] as const;
export type ComplaintStatus = (typeof complaintStatuses)[number];

export interface Complaint {
  id: string;
  roomNumber: string;
  category: ComplaintCategory;
  description: string;
  status: ComplaintStatus;
  createdAt: Date;
}
