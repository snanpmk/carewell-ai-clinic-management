"use client";

import { useFieldArray, Control, UseFormRegister, FieldValues, ArrayPath, FieldArray, Path } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "./Button";

interface Column {
  header: string;
  accessor: string; 
  placeholder?: string;
  type?: string;
}

interface DynamicTableProps<T extends FieldValues> {
  control: Control<T>;
  register: UseFormRegister<T>;
  name: ArrayPath<T>;
  columns: Column[];
  label: string;
  addLabel?: string;
  emptyRow: FieldArray<T, ArrayPath<T>>;
}

export function DynamicTable<T extends FieldValues>({
  control,
  register,
  name,
  columns,
  label,
  addLabel = "Add Row",
  emptyRow,
}: DynamicTableProps<T>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="eyebrow text-slate-900!">{label}</h3>
        <Button
          type="button"
          onClick={() => append(emptyRow)}
          variant="outline"
          size="sm"
          className="rounded-xl h-9"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          {addLabel}
        </Button>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-100 shadow-inner bg-slate-50/30">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              {columns.map((col) => (
                <th key={col.accessor} className="px-6 py-4 eyebrow !text-[9px] !tracking-[0.2em] bg-white">
                  {col.header}
                </th>
              ))}
              <th className="px-6 py-4 bg-white w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {fields.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-12 text-center text-slate-400 italic text-xs">
                  No data entries added yet.
                </td>
              </tr>
            ) : (
              fields.map((field, index) => (
                <tr key={field.id} className="hover:bg-white transition-colors group">
                  {columns.map((col) => (
                    <td key={col.accessor} className="px-4 py-3">
                      <input
                        {...register(`${name}.${index}.${col.accessor}` as Path<T>)}
                        placeholder={col.placeholder}
                        type={col.type || "text"}
                        className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-normal"
                      />
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
