import React from 'react';

const recurrenceOptions = [
    { label: 'None', value: 'none' },
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
];

export default function RecurringTaskDialog({ value, onChange }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label htmlFor="recurrence-select" style={{ fontWeight: 500, marginRight: 4 }}>
                Repeat:
            </label>
            <select
                id="recurrence-select"
                className="filter-select"
                value={value}
                onChange={e => onChange(e.target.value)}
                style={{ minWidth: 120 }}
            >
                {recurrenceOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
} 