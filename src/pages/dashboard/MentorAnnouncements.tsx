
import { useMentorAnnouncements } from "@/hooks/useMentorAnnouncements";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Megaphone, Send, Users } from "lucide-react";

export default function MentorAnnouncements() {
    const { groups, sendAnnouncement } = useMentorAnnouncements();
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const handleToggleGroup = (groupId: string) => {
        setSelectedGroups(prev =>
            prev.includes(groupId)
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        );
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked && groups) {
            setSelectedGroups(groups.map(g => g.id));
        } else {
            setSelectedGroups([]);
        }
    };

    const handleSend = () => {
        if (selectedGroups.length === 0 || !title || !message) return;

        sendAnnouncement.mutate(
            { groupIds: selectedGroups, title, message },
            {
                onSuccess: () => {
                    // Reset form
                    setTitle("");
                    setMessage("");
                    setSelectedGroups([]);
                }
            }
        );
    };

    return (
        <DashboardLayout role="mentor">
            <div className="space-y-6 max-w-4xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Megaphone className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Announcements</h2>
                        <p className="text-muted-foreground">
                            Broadcast messages to your project groups.
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Compose Section */}
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Compose Message</CardTitle>
                            <CardDescription>Send a notification to all students in selected groups.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g., Upcoming Review Schedule"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Enter your announcement details..."
                                    className="min-h-[150px]"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>
                            <Button
                                className="w-full"
                                onClick={handleSend}
                                disabled={sendAnnouncement.isPending || selectedGroups.length === 0 || !title || !message}
                            >
                                {sendAnnouncement.isPending ? "Sending..." : (
                                    <>
                                        <Send className="h-4 w-4 mr-2" /> Send Announcement
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Recipient Selection */}
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Select Recipients</CardTitle>
                            <CardDescription>Choose which groups will receive this message.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 flex items-center space-x-2 pb-4 border-b">
                                <Checkbox
                                    id="select-all"
                                    checked={groups?.length !== 0 && groups?.length === selectedGroups.length}
                                    onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                                />
                                <Label htmlFor="select-all" className="font-medium">Select All Groups</Label>
                            </div>

                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                {groups?.map((group: any) => (
                                    <div key={group.id} className="flex items-start space-x-3 p-3 rounded-md border hover:bg-muted/50 transition-colors">
                                        <Checkbox
                                            id={`group-${group.id}`}
                                            checked={selectedGroups.includes(group.id)}
                                            onCheckedChange={() => handleToggleGroup(group.id)}
                                        />
                                        <div className="grid gap-1.5 leading-none">
                                            <Label
                                                htmlFor={`group-${group.id}`}
                                                className="font-medium cursor-pointer"
                                            >
                                                {group.group_id}
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                {group.project_title}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {groups?.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No assigned groups found to message.
                                    </p>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm text-muted-foreground">
                                <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-1" />
                                    {selectedGroups.length} groups selected
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
