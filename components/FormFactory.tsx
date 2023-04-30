import { clsxm } from "@blog/utils/clsxm";
import { useFormFactory } from "@blog/utils/hooks/useFormFactory";
import type { HTMLAttributes, ReactNode } from "react";
import type {
  DeepPartial,
  FieldError,
  FieldValues,
  SubmitHandler,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { ZodSchema } from "zod";

interface FormFieldProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
}

export interface FieldProps<T extends FieldValues> extends FormFieldProps<T> {
  name: keyof T;
  label: string;
  required?: boolean;
  placeholder?: string;
  error?: FieldError;
  autoFocus?: boolean;
  callback?: () => void;
}

export type FormFactoryField<T extends FieldValues> = {
  name: keyof T;
  component: React.FC<FieldProps<T>>;
  label: string;
  placeholder?: string;
  callback?: () => void;
};

export type FormFactoryFields<
  T extends FieldValues & HTMLAttributes<HTMLInputElement>
> = Array<FormFactoryField<T>>;

interface ReactiveFormProps<T extends FieldValues> {
  fields: FormFactoryFields<T>;
  defaultValues?: DeepPartial<T>;
  schema: ZodSchema<T>;
  onSubmit: SubmitHandler<T>;
  className?: string;
  children: ReactNode;
  resetValuesOnSubmit?: boolean;
  autoFocus?: boolean;
}

export function FormFactory<T extends FieldValues>({
  defaultValues,
  schema,
  onSubmit,
  fields,
  className,
  children,
  resetValuesOnSubmit = false,
  autoFocus = false,
}: ReactiveFormProps<T>) {
  const { register, watch, setValue, formState, handleFormSubmit } =
    useFormFactory<T>({
      defaultValues,
      schema,
      onSubmit,
      resetValuesOnSubmit,
    });

  return (
    <form
      onSubmit={handleFormSubmit}
      className={clsxm("flex flex-col gap-2", className)}
    >
      {fields?.map(({ component: Component, ...props }, index) => (
        <Component
          key={props.name as string}
          register={register}
          watch={watch}
          setValue={setValue}
          error={formState.errors[props.name] as FieldError}
          autoFocus={autoFocus && index === 0}
          {...props}
        />
      ))}
      {children}
    </form>
  );
}
