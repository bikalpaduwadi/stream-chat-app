import { FormEvent, useRef } from "react";
import Select, { SelectInstance } from "react-select";
import { useMutation, useQuery } from "@tanstack/react-query";

import Link from "../../component/Link";
import Input from "../../component/Input";
import Button from "../../component/Button";
import FullScreenCard from "../../component/FullScreenCard";
import { useLoggedInAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const NewChannel = () => {
  const navigate = useNavigate();

  const createChannel = useMutation({
    mutationFn: ({
      name,
      memberIds,
      imageUrl,
    }: {
      name: string;
      memberIds: string[];
      imageUrl?: string;
    }) => {
      if (!streamChat) {
        throw Error("Not connected");
      }

      return streamChat
        .channel("messaging", crypto.randomUUID(), {
          name,
          image: imageUrl,
          members: [user.id, ...memberIds],
        })
        .create();
    },

    onSuccess() {
      navigate("/");
    },
  });

  const { streamChat, user } = useLoggedInAuth();

  const nameRef = useRef<HTMLInputElement>(null);
  const imageURLRef = useRef<HTMLInputElement>(null);
  const memberIdsRef =
    useRef<SelectInstance<{ label: string; value: string }>>(null);

  const users = useQuery({
    queryKey: ["stream", "users"],
    queryFn: () =>
      streamChat!.queryUsers({ id: { $ne: user.id } }, { name: 1 }),
    enabled: !!streamChat,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const name = nameRef.current?.value;
    const imageUrl = imageURLRef.current?.value;
    const selectOptions = memberIdsRef.current?.getValue();

    if (!name || !selectOptions?.length) {
      return;
    }

    createChannel.mutate({
      name,
      imageUrl,
      memberIds: selectOptions.map((option) => option.value),
    });
  };

  return (
    <FullScreenCard>
      <FullScreenCard.Body>
        <h1 className="text-3xl font-bold mb-8 text-center">
          New Conversation
        </h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-5 items-center justify-items-end"
        >
          <label htmlFor="name">Name</label>
          <Input id="name" required ref={nameRef} />
          <label htmlFor="imageUrl">Image URL</label>
          <Input id="imageUrl" type="url" ref={imageURLRef} />
          <label htmlFor="members">Members</label>
          <Select
            id="members"
            ref={memberIdsRef}
            required
            isMulti
            classNames={{ container: () => "w-full" }}
            isLoading={users.isPending}
            options={users.data?.users.map((user) => {
              return { value: user.id, label: user.name || user.id };
            })}
          />
          <Button
            disabled={createChannel.isPending}
            type="submit"
            className="col-span-full"
          >
            {createChannel.isPending ? "Loading.." : "Create Channel"}
          </Button>
        </form>
      </FullScreenCard.Body>
      <FullScreenCard.BelowCard>
        <Link to="/">Back</Link>
      </FullScreenCard.BelowCard>
    </FullScreenCard>
  );
};

export default NewChannel;
