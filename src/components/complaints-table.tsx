'use client';

import { useState, useMemo, useTransition } from 'react';
import type { Complaint, ComplaintCategory, ComplaintStatus } from '@/lib/types';
import { complaintCategories, complaintStatuses } from '@/lib/types';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Check, Circle, Loader2, MoreHorizontal, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { updateStatusAction, deleteComplaintAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { categoryIcons } from '@/lib/icons';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';


export function ComplaintsTable({ complaints }: { complaints: Complaint[] }) {
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ComplaintCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all');

  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      const searchMatch = c.roomNumber.toLowerCase().includes(filter.toLowerCase()) || 
                          c.id.toLowerCase().includes(filter.toLowerCase()) ||
                          c.description.toLowerCase().includes(filter.toLowerCase());
      const categoryMatch = categoryFilter === 'all' || c.category === categoryFilter;
      const statusMatch = statusFilter === 'all' || c.status === statusFilter;
      return searchMatch && categoryMatch && statusMatch;
    });
  }, [complaints, filter, categoryFilter, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100';
      case 'Assigned':
        return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100';
      case 'Reported':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100';
    }
  };

  return (
    <div className="bg-card p-4 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Input
          placeholder="Filter by room, ID, or description..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as ComplaintCategory | 'all')}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {complaintCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ComplaintStatus | 'all')}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {complaintStatuses.map(stat => <SelectItem key={stat} value={stat}>{stat}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[140px]'>Complaint ID</TableHead>
              <TableHead className='w-[100px]'>Room</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className='min-w-[300px]'>Description</TableHead>
              <TableHead>Reported</TableHead>
              <TableHead className='w-[150px]'>Status</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map(c => {
                const Icon = categoryIcons[c.category];
                return (
                    <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.id}</TableCell>
                        <TableCell>{c.roomNumber}</TableCell>
                        <TableCell>
                            <div className='flex items-center gap-2'>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                                {c.category}
                            </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground max-w-sm truncate">{c.description}</TableCell>
                        <TableCell>{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                            <Badge className={cn('capitalize', getStatusColor(c.status))}>
                                {c.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <ActionDropdown complaint={c} />
                        </TableCell>
                    </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No complaints found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}


function ActionDropdown({ complaint }: { complaint: Complaint }) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleStatusChange = (newStatus: ComplaintStatus) => {
        startTransition(async () => {
            const result = await updateStatusAction(complaint.id, newStatus);
            if (result?.error) {
                toast({ variant: 'destructive', title: 'Error', description: result.error });
            } else {
                toast({ title: 'Success', description: `Status for ${complaint.id} updated.` });
            }
        });
    }

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteComplaintAction(complaint.id);
            if (result?.error) {
                toast({ variant: 'destructive', title: 'Error', description: result.error });
            } else {
                toast({ title: 'Success', description: `Complaint ${complaint.id} deleted.` });
            }
            setDialogOpen(false);
        });
    }

    return (
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {complaintStatuses.map(status => (
                        <DropdownMenuItem
                            key={status}
                            onClick={() => handleStatusChange(status)}
                            disabled={isPending || complaint.status === status}
                        >
                            {complaint.status === status ? (
                                <Check className="mr-2 h-4 w-4" />
                            ) : (
                                <Circle className="mr-2 h-4 w-4 text-transparent" />
                            )}
                            <span>Set to {status}</span>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>
             <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the complaint <span className='font-semibold'>{complaint.id}</span>. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                         {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
