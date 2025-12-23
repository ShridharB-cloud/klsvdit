
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useProjectDiary, NewDiaryEntry } from "@/hooks/useProjectDiary";
import { Loader2, Plus } from "lucide-react";

export function AddDiaryEntryDialog() {
    const [open, setOpen] = useState(false);
    const { addEntry } = useProjectDiary();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<NewDiaryEntry>();

    const onSubmit = (data: NewDiaryEntry) => {
        addEntry.mutate(data, {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Entry
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Add Diary Entry</DialogTitle>
                    <DialogDescription>
                        Log your daily work progress. This will be shared with your mentor.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="work_done">Work Done</Label>
                        <Textarea
                            id="work_done"
                            placeholder="Describe what you accomplished today..."
                            className="min-h-[100px]"
                            {...register("work_done", { required: "This field is required" })}
                        />
                        {errors.work_done && (
                            <span className="text-destructive text-sm">{errors.work_done.message}</span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="issues_faced">Issues Faced (Optional)</Label>
                        <Textarea
                            id="issues_faced"
                            placeholder="Any challenges or blockers?"
                            {...register("issues_faced")}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="next_plan">Plan for Tomorrow (Optional)</Label>
                        <Input
                            id="next_plan"
                            placeholder="What will you work on next?"
                            {...register("next_plan")}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={addEntry.isPending}>
                            {addEntry.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Entry
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
