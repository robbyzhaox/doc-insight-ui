import { Template } from "@/types";

interface TemplateSelectorProps {
  onSelect: (template: string) => void;
  selectedTemplate: string;
}

const templates: Template[] = [
  { id: "invoice", name: "Invoice Template" },
  { id: "receipt", name: "Receipt Template" },
  { id: "contract", name: "Contract Template" },
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onSelect,
  selectedTemplate,
}) => {
  return (
    <div className="relative">
      <select
        value={selectedTemplate}
        onChange={(e) => onSelect(e.target.value)}
        className={`
          appearance-none px-4 py-2 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition-colors
          ${
            selectedTemplate
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-600 hover:bg-gray-400"
          }
        `}
      >
        <option value="">Select Template</option>
        {templates.map((template) => (
          <option
            key={template.id}
            value={template.id}
            className="bg-white text-gray-900"
          >
            {template.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

export default TemplateSelector;
