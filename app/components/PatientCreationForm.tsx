import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mars, Venus } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { DatePicker } from "./DatePicker";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  patient_name: z.string().min(4).max(500),
  avatar: z.any().optional(),
  gender: z.enum(["Male", "Female"]),
  date_of_birth: z.date().optional(),
  phone_number: z.string().optional(),
  email: z.string().optional(),
});

const PatientCreationForm = () => {
  const [submittingForm, setSubmittingForm] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient_name: "",
      gender: "Male",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmittingForm(true);

    const formData = new FormData();

    formData.append("name", values.patient_name);
    formData.append("gender", values.gender);
    if (values.date_of_birth) {
      formData.append("date_of_birth", values.date_of_birth.toISOString());
    }
    if (values.avatar) {
      formData.append("avatar", values.avatar);
    }
    if (values.phone_number) {
      formData.append("phone_number", values.phone_number);
    }
    if (values.email) {
      formData.append("email", values.email);
    }

    const submitPromise = (async () => {
      try {
        const response = await fetch(`/api/patients/new`, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Failed to create patient.");
        }

        // Assuming the API returns { id: string }
        return data.id;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        setSubmittingForm(false);
      }
    })();

    toast.promise(submitPromise, {
      loading: "Submitting patient information...",
      success: "Patient created successfully!",
      error: "Failed to create patient.",
    });

    return submitPromise;
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={async (e) => {
            let newPatientId: string | undefined;
            await form.handleSubmit(async (values) => {
              newPatientId = await onSubmit(values);
              if (newPatientId) {
                router.push(`/patients/${newPatientId}`)
              } else {
                router.push(`/patients`)
              }
              toast.info(`Redirecting to '${newPatientId}' page...`)
            })(e);
          }}
          className="space-y-6"
        >
          {/* Patient Name & Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="patient_name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Patient Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Patient Name"
                      disabled={submittingForm}
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Select
                      disabled={submittingForm}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={field.value} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">
                          <Mars className="inline mr-2" /> Male
                        </SelectItem>
                        <SelectItem value="Female">
                          <Venus className="inline mr-2" /> Female
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Date of Birth & Avatar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Date of Birth</FormLabel> */}
                  <FormControl>
                    <DatePicker
                      name="Date of Birth"
                      value={field.value}
                      onChange={field.onChange}
                      disabled={submittingForm}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload a Profile Picture</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".jpg,.png"
                      className="file-input"
                      disabled={submittingForm}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file);
                        } else {
                          field.onChange(null);
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>Accepted formats: JPG, PNG</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
                      disabled={submittingForm}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Phone Number"
                      disabled={submittingForm}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between gap-4">
            <div className="flex gap-4">
              <Button
                type="button"
                variant="ghost"
                className="border border-red-300 text-red-600 hover:bg-red-100 transition-colors"
                disabled={submittingForm}
                onClick={() => {
                  // You can add custom cancel logic here, e.g., close modal or navigate away
                  form.reset();
                }}
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="outline"
                className="text-[#19287A] border-[#19287A] hover:bg-[#19287A40] transition-colors"
                disabled={submittingForm}
                onClick={() => {
                  form.reset();
                  toast.info("Form cleared!");
                }}
              >
                Clear
              </Button>
            </div>

            <Button
              type="submit"
              disabled={submittingForm}
              className="bg-[#0C8F8F] hover:bg-[#467f7f] text-white font-semibold transition-colors px-8 py-3 text-lg"
            >
              {submittingForm ? (
                <>
                  <span className="animate-pulse">Submitting Data</span>
                  <svg
                    className="inline ml-2 w-5 h-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                </>
              ) : (
                "Create Patient"
              )}
            </Button>
          </div>
        </form>
      </Form>
      <Toaster richColors={true} />
    </>
  );
};

export default PatientCreationForm;
