"use client";

import { HTMLInputTypeAttribute } from "react";
import { Controller, Control, RegisterOptions, Path } from "react-hook-form";
import { Eye, EyeClosed } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion"; // Importa o Framer Motion

interface InputProps<TFormValues> {
  name: Path<TFormValues>;
  control: Control<TFormValues>;
  rules?: RegisterOptions<TFormValues>;
  error?: string;
  label: string;
  placeholder: string;
  type?: HTMLInputTypeAttribute;
  htmlFor: string;
  id: string;
  className?: string;
}

export function CustomInput<TFormValues>({
  control,
  name,
  label,
  placeholder,
  error,
  rules,
  type,
  htmlFor,
  id,
  className,
}: InputProps<TFormValues>) {
  const { isVisible, setIsVisible } = useAuth();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value } }) => (
        <>
          <Label htmlFor={htmlFor} className="w-fit">
            {label}
          </Label>
          <div className="relative w-full">
            <Input
              type={type}
              id={id}
              placeholder={placeholder}
              value={value as unknown as string | number | readonly string[]}
              onBlur={onBlur}
              onChange={onChange}
              className={cn(
                "outline-none border-zinc-700 focus:border-zinc-500 my-2 bg-zinc-800/40 w-full pr-10",
                className
              )}
            />
            {name === "password" && (
              <button
                type="button"
                onClick={() => setIsVisible(!isVisible)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isVisible ? (
                    <motion.div
                      key="eye"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Eye size={20} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="eyeClosed"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <EyeClosed size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            )}
          </div>

          {error && <span className="text-red-500 mb-2 text-sm">{error}</span>}
        </>
      )}
    />
  );
}
