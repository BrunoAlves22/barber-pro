"use client";

import { CustomInput } from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Logo from "../assets/logo.svg";

// Definindo o esquema de validação com Zod
const loginSchema = z.object({
  email: z.string({ required_error: "Email inválido" }).email("Email inválido"),
  password: z
    .string({ required_error: "A senha precisa ter pelo menos 6 caracteres" })
    .min(6, "A senha precisa ter pelo menos 6 caracteres"),
});

const registerSchema = z.object({
  name: z
    .string({ required_error: "Nome precisa ter pelo menos 2 caracteres" })
    .min(2, "Nome precisa ter pelo menos 2 caracteres"),
  email: z.string({ required_error: "Email inválido" }).email("Email inválido"),
  password: z
    .string({ required_error: "A senha precisa ter pelo menos 6 caracteres" })
    .min(6, "A senha precisa ter pelo menos 6 caracteres"),
});

// Tipagem do formulário com base no Zod
type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Login() {
  const { signIn, setToggleRegister, toggleRegister, signUp, isVisible } =
    useAuth();

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<LoginFormValues | RegisterFormValues>({
    resolver: zodResolver(toggleRegister ? registerSchema : loginSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = async (data: LoginFormValues | RegisterFormValues) => {
    if (toggleRegister) {
      // Verifica se 'data' tem a propriedade 'name' para garantir que é RegisterFormValues
      if ("name" in data) {
        try {
          await signUp({
            name: data.name,
            email: data.email,
            password: data.password,
          });
          reset();
        } catch (error) {
          console.error("Erro ao tentar registrar:", error);
        }
      }
    } else {
      try {
        await signIn({
          email: data.email,
          password: data.password,
        });
        console.log("Login realizado com sucesso");
      } catch (error) {
        console.error("Erro ao tentar fazer login:", error);
      }
    }
  };

  function handleToggleRegister() {
    setToggleRegister(!toggleRegister);
    reset();
  }

  return (
    <div className="flex h-screen w-screen justify-center items-center bg-zinc-900">
      <LayoutGroup>
        <motion.section
          layout
          className="flex justify-center items-center flex-col p-3 rounded-lg md:w-[55%] w-full px-8"
        >
          <motion.div layout className="p-1">
            <Image
              src={Logo}
              alt="Logo Barber Pro"
              width={500}
              height={500}
              priority
              quality={100}
              className="w-auto h-auto object-fill max-w-full"
            />
          </motion.div>

          <motion.form
            layout
            className="w-full max-w-sm grid gap-2 text-white"
            onSubmit={handleSubmit(onSubmit)}
          >
            <AnimatePresence mode="wait">
              {toggleRegister ? (
                <motion.div
                  key="register"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col"
                >
                  <CustomInput
                    control={control}
                    name="name"
                    label="Nome"
                    placeholder="Nome da Barbearia"
                    htmlFor="name"
                    id="name"
                    type="text"
                    error={errors && "name" in errors && errors.name?.message}
                    className="outline-none border-zinc-700 focus:border-zinc-500 my-2 bg-zinc-800/40"
                  />

                  <CustomInput
                    control={control}
                    name="email"
                    label="Email"
                    placeholder="Email"
                    htmlFor="email"
                    id="email"
                    type="email"
                    error={errors.email?.message}
                    className="outline-none border-zinc-700 focus:border-zinc-500 my-2 bg-zinc-800/40"
                  />

                  <CustomInput
                    control={control}
                    name="password"
                    label="Senha"
                    placeholder="Senha"
                    htmlFor="password"
                    id="password"
                    type={isVisible ? "text" : "password"}
                    error={errors.password?.message}
                    className="outline-none border-zinc-700 focus:border-zinc-500 my-2 bg-zinc-800/40"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="login"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col"
                >
                  <CustomInput
                    control={control}
                    name="email"
                    label="Email"
                    placeholder="Email"
                    htmlFor="email"
                    id="email"
                    type="email"
                    error={errors.email?.message}
                    className="outline-none border-zinc-700 focus:border-zinc-500 my-2 bg-zinc-800/40"
                  />

                  <CustomInput
                    control={control}
                    name="password"
                    label="Senha"
                    placeholder="Senha"
                    htmlFor="password"
                    id="password"
                    type={isVisible ? "text" : "password"}
                    error={errors.password?.message}
                    className="outline-none border-zinc-700 focus:border-zinc-500 my-2 bg-zinc-800/40"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Button className="bg-[#FBB131] text-zinc-900 hover:bg-[#D28F29] font-semibold text-base py-2.5">
              {toggleRegister ? "Cadastrar" : "Entrar"}
            </Button>
          </motion.form>

          <motion.div
            layout
            className="flex justify-center items-center gap-1.5 flex-col text-center md:flex-row mt-2"
          >
            <span className="text-white text-base font-thin tracking-tight">
              {toggleRegister
                ? "Já possui uma conta?"
                : "Não possui uma conta?"}
            </span>

            <span
              onClick={handleToggleRegister}
              className="font-semibold text-base text-white hover:underline transition-all cursor-pointer"
            >
              {toggleRegister ? "Entrar" : "Cadastre-se"}
            </span>
          </motion.div>
        </motion.section>
      </LayoutGroup>
    </div>
  );
}
