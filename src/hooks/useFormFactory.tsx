import { zodResolver } from "@hookform/resolvers/zod";
import { type BaseSyntheticEvent } from "react";
import {
  useForm,
  type DeepPartial,
  type FieldValues,
  type SubmitHandler,
} from "react-hook-form";
import type { ZodSchema } from "zod";

interface ReactiveFormOptions<T extends FieldValues> {
  defaultValues?: DeepPartial<T>;
  schema: ZodSchema<T>;
  onSubmit: SubmitHandler<T>;
  resetValuesOnSubmit: boolean;
}

export function useFormFactory<T extends FieldValues>({
  onSubmit,
  schema,
  defaultValues,
  resetValuesOnSubmit = false,
}: ReactiveFormOptions<T>) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    formState,
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  // const memoizedDefaultValues = useDeepMemo(defaultValues);

  // const setDefaultValues = useCallback(() => {
  //   if (memoizedDefaultValues)
  //     Object.entries(memoizedDefaultValues).forEach(([key, value]) => {
  //       setValue(key as Path<T>, value as PathValue<T, Path<T>>);
  //     });
  // }, [memoizedDefaultValues, setValue]);

  // const resetDefaults = () => {
  //   if (resetValuesOnSubmit && memoizedDefaultValues) {
  //     setDefaultValues();
  //   }
  // };

  // useEffect(() => {
  //   setDefaultValues();
  //   if (!memoizedDefaultValues) {
  //     reset();
  //   }
  // }, [reset, memoizedDefaultValues, setDefaultValues]);

  const handleFormSubmit = async (
    e?: BaseSyntheticEvent<object> | undefined
  ) => {
    await handleSubmit(onSubmit)(e);
    if (resetValuesOnSubmit) reset(defaultValues, { keepErrors: true });
  };

  return {
    register,
    watch,
    reset,
    setValue,
    formState,
    getValues,
    handleFormSubmit,
  };
}
