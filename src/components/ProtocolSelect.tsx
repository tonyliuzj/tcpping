// src/components/ProtocolSelect.tsx

import React from "react";
export type Protocol = "" | "v4" | "v6";

interface ProtocolSelectProps {
  protocol: Protocol;
  onChange: (protocol: Protocol) => void;
}

export const ProtocolSelect: React.FC<ProtocolSelectProps> = ({
  protocol,
  onChange,
}) => (
  <select
    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
    value={protocol}
    onChange={e => onChange(e.target.value as Protocol)}
    required
  >
    <option value="">Dual Stack</option>
    <option value="v4">IPv4</option>
    <option value="v6">IPv6</option>
  </select>
);
