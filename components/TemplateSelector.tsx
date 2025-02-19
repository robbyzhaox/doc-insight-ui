const TEMPLATE_TYPES = [
  { value: 'invoice', label: 'Invoice Template' },
  { value: 'resume', label: 'Resume Template' },
];

export default function TemplateSelector({ selectedTemplate, onTemplateSelect }) {
  return (
    <select
      value={selectedTemplate}
      onChange={(e) => onTemplateSelect(e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 
      focus:ring-primary focus:border-transparent">
      <option value="">Select a template type</option>
      {TEMPLATE_TYPES.map((template) => (
        <option
          key={template.value}
          value={template.value}
          className="p-2"
        >
          {template.label}
        </option>
      ))}
    </select>
  )
}