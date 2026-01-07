
import { getInputFieldError, IInputErrorState } from "@/lib/getInputFieldError";
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
import { FieldDescription } from "../ui/field";

interface InputFieldErrorProps {
  field: string;
  state: IInputErrorState;
}

const InputFieldError = ({ field, state }: InputFieldErrorProps) => {
  if (getInputFieldError(field, state)) {
    return (
      <FieldDescription className="text-red-600">
        {getInputFieldError(field, state)}
      </FieldDescription>
    );
  }

  return null;
};

export default InputFieldError;





// import React from "react";

// export interface IInputErrorState {
//   success: boolean;
//   message: string;
//   errors?: Record<string, string[]>;
//   data?: any;
// }

// interface InputFieldErrorProps {
//   field: string;
//   state: IInputErrorState | null;
// }

// const InputFieldError: React.FC<InputFieldErrorProps> = ({ field, state }) => {
//   if (!state || !state.errors || !state.errors[field]) {
//     return null;
//   }

//   return (
//     <div className="space-y-1">
//       {state.errors[field].map((error, index) => (
//         <p key={index} className="text-sm text-red-500">
//           {error}
//         </p>
//       ))}
//     </div>
//   );
// };

// export default InputFieldError;