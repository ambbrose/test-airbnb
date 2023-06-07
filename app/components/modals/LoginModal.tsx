'use client';

import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from 'react-icons/fc';
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from 'react-hot-toast'

import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from "next/navigation";

import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";

import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import Button from "../Button";



const LoginModal = () => {
    const router = useRouter();
    const loginModal = useLoginModal();
    const registerModal = useRegisterModal();
    const params = useSearchParams();

    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        signIn('credentials', {
            ...data,
            redirect: false
        }).then((callback) => {
            setIsLoading(false);

            if (callback?.ok) {
                toast.success('Logged in')
                router.refresh();
                loginModal.onClose();
            };

            if (callback?.error) {
                toast.error(callback.error);
            };
        });
    };

    const handleSocialSignin = (name: string) => {
        signIn(name, { redirect: false })

        const error = params?.get('error');

        if (error && name === 'google' && error === 'OAuthCallback') {
            toast.error(`Could not log in with ${name}`);
            router.push('/');
        } else if (error && name === 'github' && error === 'OAuthAccountNotLinked') {
            toast.error(`Could not log in with ${name}`);
            router.push('/');
        };
    };

    const onToggle = useCallback(() => {
        loginModal.onClose();
        registerModal.onOpen();
    }, [loginModal, registerModal]);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading
                title="Welcome back!!!"
                subTitle="Login to your account!"
                center
            />
            <Input
                id="email"
                label="Email"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input
                id="password"
                label="Password"
                disabled={isLoading}
                register={register}
                errors={errors}
                type="password"
                required
            />
        </div>
    );

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr />
            <Button
                outline
                icon={FcGoogle}
                label="Continue with Google"
                onClick={() => handleSocialSignin('google')}
            />
            <Button
                outline
                disabled={true}
                icon={AiFillGithub}
                label="Continue with Github"
                onClick={() => handleSocialSignin('github')}
            />
            <div className="text-neutral-500 text-center mt-4 font-light">
                <p>First time using Airbnb?
                    <span
                        onClick={onToggle}
                        className="text-neutral-800 cursor-pointer hover:underline"
                    > Create an account</span>
                </p>
            </div>
        </div>
    )

    return (
        <Modal
            isOpen={loginModal.isOpen}
            disabled={isLoading}
            title="Login"
            actionLabel="Continue"
            onClose={loginModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
            secondaryActionLabel=""
        />
    );
}

export default LoginModal;
