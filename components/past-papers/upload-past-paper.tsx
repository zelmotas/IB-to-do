"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { pastPaperService } from "@/services/past-paper-service"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, Check, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  subject_code: z.string().optional(),
  year: z.coerce.number().min(1950, { message: "Year must be at least 1950" }).max(new Date().getFullYear()),
  month: z.string().optional(),
  language: z.string().min(1, { message: "Language is required" }),
  paper_number: z.coerce.number().min(1, { message: "Paper number must be at least 1" }),
  level: z.string().min(1, { message: "Level is required" }),
  description: z.string().optional(),
  file: z.instanceof(File, { message: "File is required" }),
})

type FormValues = z.infer<typeof formSchema>

export function UploadPastPaper() {
  const { t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subject: "",
      subject_code: "",
      year: new Date().getFullYear(),
      month: "",
      language: "English",
      paper_number: 1,
      level: "SL",
      description: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsUploading(true)
    setUploadError(null)
    setUploadSuccess(false)

    try {
      const { file, ...metadata } = values

      const result = await pastPaperService.uploadPastPaper(file, metadata)

      if (result) {
        setUploadSuccess(true)
        toast({
          title: "Upload successful",
          description: "Your past paper has been uploaded successfully.",
        })
        form.reset()
      } else {
        throw new Error("Upload failed")
      }
    } catch (error) {
      console.error("Error uploading past paper:", error)
      setUploadError("Failed to upload past paper. Please try again.")
      toast({
        title: "Upload failed",
        description: "There was an error uploading your past paper.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{t("uploadPastPaper")}</CardTitle>
        <CardDescription>{t("uploadPastPaperDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        {uploadSuccess && (
          <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-600 dark:text-green-400">Upload successful</AlertTitle>
            <AlertDescription className="text-green-600/90 dark:text-green-400/90">
              Your past paper has been uploaded successfully.
            </AlertDescription>
          </Alert>
        )}

        {uploadError && (
          <Alert className="mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Upload failed</AlertTitle>
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("title")}</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Mathematics Paper 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("subject")}</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Mathematics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("subjectCode")}</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. MATH" {...field} />
                    </FormControl>
                    <FormDescription>{t("subjectCodeOptional")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("year")}</FormLabel>
                    <FormControl>
                      <Input type="number" min={1950} max={new Date().getFullYear()} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("month")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        <SelectItem value="May">May</SelectItem>
                        <SelectItem value="November">November</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>{t("monthOptional")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("language")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paper_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("paperNumber")}</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("level")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SL">Standard Level (SL)</SelectItem>
                        <SelectItem value="HL">Higher Level (HL)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("description")}</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add any additional information about this past paper" {...field} />
                  </FormControl>
                  <FormDescription>{t("descriptionOptional")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>{t("file")}</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            onChange(file)
                          }
                        }}
                        {...fieldProps}
                      />
                      {value && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>{(value as File).name}</span>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>{t("acceptedFileTypes")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isUploading} className="w-full">
              {isUploading ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  {t("uploading")}
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {t("uploadPastPaper")}
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
