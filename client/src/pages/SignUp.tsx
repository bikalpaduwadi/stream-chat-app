import { FormEvent, useRef } from "react";
import Input from "../component/Input";
import Button from "../component/Button";
import { useAuth } from "../context/AuthContext";

const SignUp = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const imageUrlRef = useRef<HTMLInputElement>(null);

  const { signup } = useAuth();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (signup.isPending) {
      return;
    }

    const username = usernameRef.current?.value;
    const name = nameRef.current?.value;
    const imageUrl = imageUrlRef.current?.value;

    if (!username || !name) {
      return;
    }

    signup.mutate({ id: username, name, image: imageUrl });
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-8 text-center">Sign Up</h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-5 items-center justify-items-end"
      >
        <label htmlFor="username">Username</label>
        <Input id="username" pattern="\S*" required ref={usernameRef} />

        <label htmlFor="name">Name</label>
        <Input id="name" required ref={nameRef} />

        <label htmlFor="imageUrl">Image Url</label>
        <Input id="imageUrl" type="url" ref={imageUrlRef} />

        <Button
          disabled={signup.isPending}
          type="submit"
          className="col-span-full"
        >
          {signup.isPending ? "Loading..." : "Sign Up"}
        </Button>
      </form>
    </>
  );
};

export default SignUp;
