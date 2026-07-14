import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRef, useState } from "react";
import { Camera, Save, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStudents } from "@/lib/hooks";
import { uid } from "@/lib/storage";
import { STANDARDS } from "@/lib/types";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  gender: z.enum(["Male", "Female", "Other"]),
  dob: z.string().min(1, "Date of birth is required"),
  school: z.string().trim().min(2, "School is required").max(100),
  standard: z.enum(["6th", "7th", "8th", "9th", "10th", "11th", "12th"]),
  section: z.string().trim().min(1, "Section is required").max(5),
  parentName: z.string().trim().min(2, "Parent name is required").max(100),
  fatherMobile: z.string().regex(/^\d{10}$/, "Must be 10 digits"),
  motherMobile: z.string().regex(/^\d{10}$/, "Must be 10 digits"),
  address: z.string().trim().min(5).max(300),
  joiningDate: z.string().min(1, "Joining date is required"),
  monthlyFees: z.coerce.number().min(0).max(1000000),
  admissionFees: z.coerce.number().min(0).max(1000000),
  notes: z.string().max(500).optional(),
});
type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute("/students/new")({
  head: () => ({
    meta: [
      { title: "Register Student — Bright Minds Tuition" },
      { name: "description", content: "Enroll a new student into the tuition center." },
    ],
  }),
  component: NewStudentPage,
});

const DEFAULTS: FormValues = {
  name: "",
  gender: "Male",
  dob: "",
  school: "",
  standard: "8th",
  section: "A",
  parentName: "",
  fatherMobile: "",
  motherMobile: "",
  address: "",
  joiningDate: new Date().toISOString().slice(0, 10),
  monthlyFees: 1500,
  admissionFees: 2000,
  notes: "",
};

function NewStudentPage() {
  const [photo, setPhoto] = useState<string | undefined>();
  const fileRef = useRef<HTMLInputElement>(null);
  const [students, setStudentsState] = useStudents();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULTS,
  });
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = form;

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Photo must be under 2 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = (data: FormValues) => {
    setStudentsState([
      ...students,
      { ...data, id: uid(), photo, createdAt: new Date().toISOString() },
    ]);
    toast.success(`${data.name} registered successfully!`);
    navigate({ to: "/students" });
  };

  const handleReset = () => {
    reset(DEFAULTS);
    setPhoto(undefined);
    toast.info("Form reset");
  };

  const gender = watch("gender");
  const standard = watch("standard");

  return (
    <div className="space-y-6">
      <PageHeader title="Student Registration" description="Fill out the form to enroll a new student." />

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Photo card */}
        <div className="glass rounded-2xl p-5">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="grid h-40 w-40 place-items-center overflow-hidden rounded-3xl gradient-brand shadow-glow">
                {photo ? (
                  <img src={photo} alt="preview" className="h-full w-full object-cover" />
                ) : (
                  <Camera className="h-12 w-12 text-white/80" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -right-2 rounded-full bg-primary p-2 text-primary-foreground shadow-lg transition hover:scale-110"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPhotoChange} />
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold">Student Photo</div>
              <div className="text-xs text-muted-foreground">Optional • Max 2 MB</div>
            </div>
            {photo && (
              <Button type="button" variant="outline" size="sm" onClick={() => setPhoto(undefined)}>
                Remove photo
              </Button>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="glass space-y-5 rounded-2xl p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Student Name" error={errors.name?.message}>
              <Input {...register("name")} placeholder="Full name" />
            </Field>
            <Field label="Gender" error={errors.gender?.message}>
              <Select value={gender} onValueChange={(v) => setValue("gender", v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Date of Birth" error={errors.dob?.message}>
              <Input type="date" {...register("dob")} />
            </Field>
            <Field label="School Name" error={errors.school?.message}>
              <Input {...register("school")} placeholder="School" />
            </Field>
            <Field label="Standard" error={errors.standard?.message}>
              <Select value={standard} onValueChange={(v) => setValue("standard", v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STANDARDS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Section" error={errors.section?.message}>
              <Input {...register("section")} placeholder="A / B / C" />
            </Field>
            <Field label="Parent Name" error={errors.parentName?.message}>
              <Input {...register("parentName")} placeholder="Parent full name" />
            </Field>
            <Field label="Joining Date" error={errors.joiningDate?.message}>
              <Input type="date" {...register("joiningDate")} />
            </Field>
            <Field label="Father Mobile" error={errors.fatherMobile?.message}>
              <Input {...register("fatherMobile")} inputMode="numeric" placeholder="10-digit number" />
            </Field>
            <Field label="Mother Mobile" error={errors.motherMobile?.message}>
              <Input {...register("motherMobile")} inputMode="numeric" placeholder="10-digit number" />
            </Field>
            <Field label="Monthly Fees (₹)" error={errors.monthlyFees?.message}>
              <Input type="number" {...register("monthlyFees")} />
            </Field>
            <Field label="Admission Fees (₹)" error={errors.admissionFees?.message}>
              <Input type="number" {...register("admissionFees")} />
            </Field>
          </div>

          <Field label="Address" error={errors.address?.message}>
            <Textarea rows={2} {...register("address")} placeholder="Home address" />
          </Field>
          <Field label="Notes" error={errors.notes?.message}>
            <Textarea rows={2} {...register("notes")} placeholder="Optional notes" />
          </Field>

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleReset} className="rounded-xl">
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
            <Button type="submit" className="rounded-xl gradient-brand shadow-glow">
              <Save className="mr-2 h-4 w-4" /> Save Student
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
