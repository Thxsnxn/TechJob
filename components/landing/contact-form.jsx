"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

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

import { sendContactRequest } from "@/lib/mockContactApi";
import { Upload } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

export function ContactForm() {
  const { ref, inView } = useInView({ threshold: 0.1 });

  const [contactType, setContactType] = useState("person");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    phone: "",
    address: "",
    serviceType: "",
    budget: "",
    startDate: "",
    siteLocation: "",
    description: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await sendContactRequest({
        contactType,
        ...formData,
      });

      console.log("Contact submission successful:", result);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          firstName: "",
          lastName: "",
          companyName: "",
          email: "",
          phone: "",
          address: "",
          serviceType: "",
          budget: "",
          startDate: "",
          siteLocation: "",
          description: "",
        });
      }, 2500);
    } catch (error) {
      console.error("Contact submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="py-32 px-6 bg-white text-black"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl sm:text-6xl font-light text-black mb-6 tracking-tight">
            Request a Quote
          </h2>
          <p className="text-lg sm:text-xl text-neutral-600 font-light leading-relaxed max-w-2xl mx-auto">
            Tell us about your project and we’ll respond within 24 hours.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-12"
        >
          {/* Contact type */}
          <div className="flex justify-center gap-6">
            <Button
              type="button"
              variant={contactType === "person" ? "default" : "outline"}
              className={`px-10 py-5 rounded-full text-base font-light transition-all ${
                contactType === "person"
                  ? "bg-black text-white hover:bg-neutral-800"
                  : "border-neutral-300 text-black hover:bg-neutral-100"
              }`}
              onClick={() => setContactType("person")}
            >
              Individual
            </Button>

            <Button
              type="button"
              variant={contactType === "company" ? "default" : "outline"}
              className={`px-10 py-5 rounded-full text-base font-light transition-all ${
                contactType === "company"
                  ? "bg-black text-white hover:bg-neutral-800"
                  : "border-neutral-300 text-black hover:bg-neutral-100"
              }`}
              onClick={() => setContactType("company")}
            >
              Company
            </Button>
          </div>

          {/* Basic fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <Label className="text-neutral-700 font-light text-lg">
                First Name
              </Label>
              <Input
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
                className="py-6 rounded-xl text-black border-neutral-300 bg-white font-light placeholder:text-neutral-400"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-neutral-700 font-light text-lg">
                Last Name
              </Label>
              <Input
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
                className="py-6 rounded-xl text-black border-neutral-300 bg-white font-light placeholder:text-neutral-400"
              />
            </div>
          </div>

          {/* Company name (conditional) */}
          {contactType === "company" && (
            <div className="space-y-3">
              <Label className="text-neutral-700 font-light text-lg">
                Company Name
              </Label>
              <Input
                value={formData.companyName}
                onChange={(e) =>
                  handleInputChange("companyName", e.target.value)
                }
                className="py-6 rounded-xl text-black border-neutral-300 bg-white font-light placeholder:text-neutral-400"
              />
            </div>
          )}

          {/* Email / Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <Label className="text-neutral-700 font-light text-lg">
                Email
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className="py-6 rounded-xl text-black border-neutral-300 bg-white font-light placeholder:text-neutral-400"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-neutral-700 font-light text-lg">
                Phone
              </Label>
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="py-6 rounded-xl text-black border-neutral-300 bg-white font-light placeholder:text-neutral-400"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-3">
            <Label className="text-neutral-700 font-light text-lg">
              Address
            </Label>
            <Input
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="py-6 rounded-xl text-black border-neutral-300 bg-white font-light placeholder:text-neutral-400"
            />
          </div>

          {/* Selects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <Label className="text-neutral-700 font-light text-lg">
                Service Type
              </Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) =>
                  handleInputChange("serviceType", value)
                }
              >
                <SelectTrigger className="py-6 rounded-xl text-black border-neutral-300 bg-white font-light">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent className="bg-white border-neutral-200">
                  <SelectItem value="electrical-installation">
                    Electrical Installation
                  </SelectItem>
                  <SelectItem value="power-distribution">
                    Power Distribution
                  </SelectItem>
                  <SelectItem value="control-panels">
                    Control Panels
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-neutral-700 font-light text-lg">
                Estimated Budget
              </Label>
              <Select
                value={formData.budget}
                onValueChange={(value) =>
                  handleInputChange("budget", value)
                }
              >
                <SelectTrigger className="py-6 rounded-xl text-black border-neutral-300 bg-white font-light">
                  <SelectValue placeholder="Select a range" />
                </SelectTrigger>
                <SelectContent className="bg-white border-neutral-200">
                  <SelectItem value="under-50k">Under $50k</SelectItem>
                  <SelectItem value="50k-100k">$50k–$100k</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Textarea */}
          <div className="space-y-3">
            <Label className="text-neutral-700 font-light text-lg">
              What do you want us to do? *
            </Label>
            <Textarea
              rows={6}
              value={formData.description}
              onChange={(e) =>
                handleInputChange("description", e.target.value)
              }
              required
              className="rounded-xl text-black border-neutral-300 bg-white font-light placeholder:text-neutral-400"
            />
          </div>

          {/* Submit */}
          <div className="text-center pt-8">
            <Button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="bg-black text-white px-14 py-6 rounded-full text-base font-light hover:bg-neutral-800"
            >
              {isSuccess
                ? "Sent Successfully!"
                : isSubmitting
                ? "Sending..."
                : "Submit Request"}
            </Button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
