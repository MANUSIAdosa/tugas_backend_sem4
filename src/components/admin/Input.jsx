export default function Input({ label, type = 'text', value, onChange, required, placeholder, step }) {
  return (
    <div className="admin-field">
      <label>{label}{required && <span className="admin-required">*</span>}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required}
        placeholder={placeholder} step={step} />
    </div>
  );
}
