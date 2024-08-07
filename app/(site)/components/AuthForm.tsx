"use client";

import axios from "axios";
import { 
  useCallback, 
  useState 
} from "react";
import { 
  FieldValues, 
  SubmitHandler, 
  useForm
} from "react-hook-form";
import { BsGithub, BsGoogle } from "react-icons/bs";

import Button from "@/app/components/Button";
import Input from "@/app/components/input/Input";
import AuthSocialButton from "./AuthSocialButton";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

type Variant = 'LOGIN' | 'REGISTER'
const AuthForm = () => {
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);
  
  const toggleVariant = useCallback(() => {
    if(variant === 'LOGIN') {
      setVariant('REGISTER');
    } else {
      setVariant('LOGIN');
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if(variant === 'REGISTER') {
      // axios register
      axios.post('/api/register', data)
      .catch(() => toast.error('Something went wrong'))
      .finally(() => setIsLoading(false));
    }

    if(variant === 'LOGIN') {
      // nextauth signin
      signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password
      })
      .then((res) => {
        if(res?.error) {
          toast.error('Invalid credentials');
        }
        
        if(res?.ok) {
          toast.success('Logged in successfully');
        }
      })
      .finally(() => setIsLoading(false));
    }
  }

  const socialAction = (action: string) => {
    setIsLoading(true);

    //nextauth social signin
    signIn(action, {
      redirect: false
    })
    .then((res) => {
      if(res?.error) {
        toast.error('Something went wrong');
      }

      if(res?.ok) {
        toast.success('Logged in successfully');
      }
    })
    .finally(() => setIsLoading(false));
  }

  return (
    <div
      className="
        mt-8
        sm:mx-auto
        sm:w-full
        sm:max-w-md
      "
    >
      <div
        className="
          bg-white
          px-4
          py-8
          shadow
          rounded-lg
          sm:px-10
        "
      >
        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          {variant === 'REGISTER' && (
            <Input 
              label="Name" 
              id="name" 
              required
              register={register} 
              errors={errors}
              disabled={isLoading}
            />
          )}
          <Input 
            label="Email address" 
            id="email" 
            type="email" 
            required
            register={register} 
            errors={errors}
            disabled={isLoading}
          />
          <Input 
            label="Password" 
            id="password" 
            type="password" 
            required
            register={register} 
            errors={errors}
            disabled={isLoading}
          />
          <Button
            type="submit"
            fullWidth
            disabled={isLoading}
          >
            {variant === 'LOGIN' ? 'Sign in' : 'Register'}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="
              absolute
              inset-0
              flex
              items-center
              "
            >
              <div className="
                w-full
                border-t
                border-gray-300
                "
              />
            </div>
            <div className="
              relative 
              flex 
              justify-center 
              text-sm
              "
            >
              <span className="
                bg-white 
                px-2 
                text-gray-500
                "
              >
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub} 
              onClick={() => socialAction('github')}
            />
            <AuthSocialButton 
              icon={BsGoogle}
              onClick={() => socialAction('google')}
            />
          </div>
        </div>
        <div className="
          flex 
          gap-2 
          justify-center 
          text-sm 
          mt-6 
          px-2 
          text-gray-500
        ">
          <div>
            {variant === 'LOGIN' ? 'New to Messenger?' : 'Already have an account?'}
          </div>
          <div
            onClick={toggleVariant}
            className="underline cursor-pointer"
          >
          {variant === 'LOGIN' ? 'Create an account' : 'Login'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthForm;