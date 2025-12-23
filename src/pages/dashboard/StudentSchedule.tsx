
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useMeetings, Meeting } from "@/hooks/useMeetings";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MapPin, Video, ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, parseISO, isPast } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function StudentSchedule() {
    const navigate = useNavigate();
    const { meetings, isLoading, requestMeeting } = useMeetings();
    const [isRequestOpen, setIsRequestOpen] = useState(false);

    // Group meetings by status (Upcoming vs Past)
    const upcomingMeetings = meetings?.filter(m => !isPast(parseISO(m.scheduled_at))) || [];
    const pastMeetings = meetings?.filter(m => isPast(parseISO(m.scheduled_at))) || [];

    const handleRequestSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simplified mock submit
        requestMeeting.mutate({
            title: "Requested Meeting",
            meeting_type: "mentor",
            scheduled_at: new Date(), // Mock date
            description: "Student requested sync"
        }, {
            onSuccess: () => setIsRequestOpen(false)
        });
    };

    const getMeetingIcon = (type: string) => {
        switch (type) {
            case 'review': return <Calendar className="h-5 w-5 text-warning" />;
            case 'external': return <Video className="h-5 w-5 text-destructive" />;
            default: return <Clock className="h-5 w-5 text-primary" />;
        }
    };

    return (
        <DashboardLayout role="student">
            <div className="space-y-8 max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2" onClick={() => navigate("/dashboard/student")}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <h2 className="text-3xl font-bold tracking-tight">Schedule</h2>
                        </div>
                        <p className="text-muted-foreground">
                            Upcoming meetings, reviews, and deadlines.
                        </p>
                    </div>
                    <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Request Meeting
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Request a Meeting</DialogTitle>
                                <DialogDescription>
                                    Propose a time to meet with your mentor.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleRequestSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Topic</Label>
                                    <Input placeholder="e.g. Design Blockers" required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea placeholder="What do you want to discuss?" />
                                </div>
                                {/* Date picker would go here, skipping for prototype simplicity */}
                                <div className="p-3 bg-secondary/50 rounded text-sm text-muted-foreground">
                                    * In a real app, you would select a date/time slot here.
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Submit Request</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Separator />

                <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Upcoming Events</h3>
                    {isLoading ? (
                        [1, 2].map(i => <Skeleton key={i} className="h-24 w-full" />)
                    ) : upcomingMeetings.length > 0 ? (
                        upcomingMeetings.map((meeting) => (
                            <Card key={meeting.id} className="border-l-4 border-l-primary">
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="p-3 bg-secondary rounded-lg">
                                        {getMeetingIcon(meeting.meeting_type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold text-lg">{meeting.title}</h4>
                                                <p className="text-sm text-muted-foreground">{meeting.description}</p>
                                            </div>
                                            <Badge variant="outline" className="capitalize">{meeting.meeting_type}</Badge>
                                        </div>
                                        <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                <span>{format(parseISO(meeting.scheduled_at), "EEEE, MMM d, yyyy")}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                <span>{format(parseISO(meeting.scheduled_at), "h:mm a")}</span>
                                            </div>
                                            {meeting.location && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{meeting.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="text-muted-foreground italic">No upcoming events scheduled.</p>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
