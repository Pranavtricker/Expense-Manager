import type { Expense } from '../types';

type Props = {
  expenses: Expense[];
  onEdit: (exp: Expense) => void;
  onDelete: (id: string) => void;
};

export default function ExpenseList({ expenses, onEdit, onDelete }: Props) {
  return (
    <div className="card overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th className="p-2">Title</th>
            <th className="p-2">Category</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Date</th>
            <th className="p-2">Notes</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e._id}>
              <td className="p-2">{e.title}</td>
              <td className="p-2">{e.category?.name}</td>
              <td className="p-2">₹{e.amount.toFixed(2)}</td>
              <td className="p-2">{new Date(e.date).toLocaleDateString()}</td>
              <td className="p-2">{e.notes || '-'}</td>
              <td className="p-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(e)}
                    className="btn-secondary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(e._id)}
                    className="btn-secondary"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {expenses.length === 0 && (
            <tr>
              <td colSpan={6} className="p-3 text-center text-gray-400">
                No expenses found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}