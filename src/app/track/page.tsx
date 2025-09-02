import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getComplaintById } from "@/lib/data";
import { Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { categoryIcons } from "@/lib/icons";

export default async function TrackPage({ searchParams }: { searchParams?: { id?: string } }) {
  const complaintId = searchParams?.id;
  const complaint = complaintId ? await getComplaintById(complaintId) : null;
  const notFound = complaintId && !complaint;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Assigned':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Reported':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const Icon = complaint ? categoryIcons[complaint.category] : null;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Track Complaint Status</CardTitle>
            <CardDescription>Enter your tracking ID below to see the current status of your complaint.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/track" method="GET" className="flex gap-2 mb-6">
              <Input
                name="id"
                placeholder="e.g., TICKET-12345"
                defaultValue={complaintId}
                required
                className="flex-grow"
              />
              <Button type="submit" variant="default">
                <Search className="h-4 w-4 mr-2" />
                Track
              </Button>
            </form>

            {notFound && (
              <div className="text-center py-6 bg-destructive/10 rounded-md">
                <p className="text-destructive font-medium">No complaint found with ID: {complaintId}</p>
              </div>
            )}
            
            {complaint && Icon && (
              <Card className="mt-4 border-accent">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-accent">
                                <Icon className="h-5 w-5" />
                                Complaint Details
                            </CardTitle>
                            <CardDescription>Tracking ID: {complaint.id}</CardDescription>
                        </div>
                        <Badge className={cn("text-sm", getStatusColor(complaint.status))}>
                            {complaint.status}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="font-semibold text-muted-foreground">Room Number</p>
                        <p>{complaint.roomNumber}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-muted-foreground">Category</p>
                        <p>{complaint.category}</p>
                    </div>
                     <div>
                        <p className="font-semibold text-muted-foreground">Reported On</p>
                        <p>{new Date(complaint.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                   <div>
                        <p className="font-semibold text-muted-foreground">Description</p>
                        <p className="text-foreground/80">{complaint.description}</p>
                    </div>
                </CardContent>
              </Card>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
