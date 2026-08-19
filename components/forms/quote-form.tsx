"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { quoteFormSchema, QuoteFormValues } from "@/lib/validations";
import { serviceCategories, services } from "@/data/services";

export function QuoteForm() {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      hasDesignFile: false,
    },
  });

  // Preselect service from URL parameter
  useEffect(() => {
    const serviceSlug = searchParams.get("service");
    if (serviceSlug) {
      const preselectedService = services.find(s => s.slug === serviceSlug);
      if (preselectedService) {
        setValue("serviceCategory", preselectedService.category.name);
        setValue("specificService", preselectedService.title);
      }
    }
  }, [searchParams, setValue]);

  const selectedCategory = watch("serviceCategory");
  const selectedService = watch("specificService");
  const hasDesignFile = watch("hasDesignFile");

  // Filter services based on selected category
  const filteredServices = selectedCategory
    ? services.filter((s) => s.category.name === selectedCategory)
    : [];

  // Check if selected service is T-shirt related
  const isTshirtService = selectedService && (
    selectedService.includes("T-Shirt") || 
    selectedService.includes("Sublimation") || 
    selectedService.includes("Vinyl")
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValue("hasDesignFile", true);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setValue("hasDesignFile", false);
  };

  const onSubmit = async (data: QuoteFormValues) => {
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Quote form data:", data);
    console.log("Selected file:", selectedFile);
    
    setIsSubmitting(false);
    setIsSuccess(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSuccess(false);
      setSelectedFile(null);
      reset();
    }, 3000);
  };

  if (isSuccess) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4 py-8">
            <CheckCircle2 className="h-16 w-16 text-success mx-auto" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Quote Request Submitted!</h3>
              <p className="text-muted-foreground">
                Thank you for your request. Our team will review your requirements and send you a detailed quotation shortly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request a Quotation</CardTitle>
        <CardDescription>
          Provide details about your printing project and we'll send you a customized quote
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Customer Name */}
          <div className="space-y-2">
            <Label htmlFor="customerName">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="customerName"
              placeholder="Your full name"
              {...register("customerName")}
              aria-invalid={errors.customerName ? "true" : "false"}
            />
            {errors.customerName && (
              <p className="text-sm text-destructive">{errors.customerName.message}</p>
            )}
          </div>

          {/* Email and Phone Row */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                {...register("email")}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+63 XXX XXX XXXX"
                {...register("phone")}
                aria-invalid={errors.phone ? "true" : "false"}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Service Category */}
          <div className="space-y-2">
            <Label htmlFor="serviceCategory">
              Service Category <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={(value) => {
                setValue("serviceCategory", value);
                setValue("specificService", ""); // Reset specific service
              }}
              defaultValue={watch("serviceCategory")}
            >
              <SelectTrigger id="serviceCategory" aria-invalid={errors.serviceCategory ? "true" : "false"}>
                <SelectValue placeholder="Select a service category" />
              </SelectTrigger>
              <SelectContent>
                {serviceCategories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.serviceCategory && (
              <p className="text-sm text-destructive">{errors.serviceCategory.message}</p>
            )}
          </div>

          {/* Specific Service */}
          <div className="space-y-2">
            <Label htmlFor="specificService">
              Specific Service <span className="text-destructive">*</span>
            </Label>
            {selectedCategory && filteredServices.length > 0 ? (
              <Select
                onValueChange={(value) => setValue("specificService", value)}
                defaultValue={watch("specificService")}
              >
                <SelectTrigger id="specificService" aria-invalid={errors.specificService ? "true" : "false"}>
                  <SelectValue placeholder="Select a specific service" />
                </SelectTrigger>
                <SelectContent>
                  {filteredServices.map((service) => (
                    <SelectItem key={service.id} value={service.title}>
                      {service.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="specificService"
                placeholder="Please select a category first or specify your service"
                {...register("specificService")}
                aria-invalid={errors.specificService ? "true" : "false"}
              />
            )}
            {errors.specificService && (
              <p className="text-sm text-destructive">{errors.specificService.message}</p>
            )}
          </div>

          {/* Quantity and Size Row */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">
                Quantity <span className="text-destructive">*</span>
              </Label>
              <Input
                id="quantity"
                placeholder="e.g., 500 pieces"
                {...register("quantity")}
                aria-invalid={errors.quantity ? "true" : "false"}
              />
              {errors.quantity && (
                <p className="text-sm text-destructive">{errors.quantity.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Size (Optional)</Label>
              <Input
                id="size"
                placeholder="e.g., A4, 3x5 ft"
                {...register("size")}
              />
            </div>
          </div>

          {/* Material and Deadline Row */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="material">Material (Optional)</Label>
              <Input
                id="material"
                placeholder="e.g., Glossy paper, Vinyl"
                {...register("material")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Preferred Deadline (Optional)</Label>
              <Input
                id="deadline"
                type="date"
                {...register("deadline")}
              />
            </div>
          </div>

          {/* T-Shirt Specific Fields */}
          {isTshirtService && (
            <div className="space-y-4 p-4 border border-primary/20 rounded-lg bg-primary/5">
              <h3 className="font-semibold text-sm">T-Shirt Details</h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tshirtSize">T-Shirt Size(s)</Label>
                  <Input
                    id="tshirtSize"
                    placeholder="e.g., S, M, L, XL, XXL"
                    {...register("tshirtSize")}
                  />
                  <p className="text-xs text-muted-foreground">
                    Specify sizes and quantities if known
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tshirtColor">T-Shirt Color(s)</Label>
                  <Input
                    id="tshirtColor"
                    placeholder="e.g., White, Black, Navy"
                    {...register("tshirtColor")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="printLocation">Print Location</Label>
                <Select
                  onValueChange={(value) => setValue("printLocation", value)}
                  defaultValue={watch("printLocation")}
                >
                  <SelectTrigger id="printLocation">
                    <SelectValue placeholder="Select print location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="front">Front Only</SelectItem>
                    <SelectItem value="back">Back Only</SelectItem>
                    <SelectItem value="both">Front & Back</SelectItem>
                    <SelectItem value="sleeve">Sleeve</SelectItem>
                    <SelectItem value="custom">Custom Location</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Additional Requirements */}
          <div className="space-y-2">
            <Label htmlFor="additionalRequirements">
              Additional Requirements (Optional)
            </Label>
            <Textarea
              id="additionalRequirements"
              placeholder="Any special requirements or instructions..."
              rows={4}
              {...register("additionalRequirements")}
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="designFile">
              Upload Design / Reference (Optional)
            </Label>
            <div className="space-y-2">
              {!selectedFile ? (
                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <label htmlFor="designFile" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, PNG, JPG, AI (Max 10MB)
                    </p>
                    <Input
                      id="designFile"
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.ai,.psd"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-primary/10 rounded flex items-center justify-center">
                      <Upload className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={removeFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting Request...
              </>
            ) : (
              "Request Quote"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
