import { getComplaints } from "@/lib/data";
import { ComplaintsTable } from "@/components/complaints-table";
import { LogoutButton } from "@/components/logout-button";
import { ListTodo } from "lucide-react";

export default async function DashboardPage() {
    const complaints = await getComplaints();

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                       <ListTodo className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Complaints Dashboard</h1>
                        <p className="text-muted-foreground">View, manage, and resolve resident complaints.</p>
                    </div>
                </div>
                <LogoutButton />
            </div>
            <ComplaintsTable complaints={complaints} />
        </div>
    );
}
