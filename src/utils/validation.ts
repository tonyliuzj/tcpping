export function cleanHostname(input: string): string {
  let value = input.trim();
  value = value.replace(/^https?:\/\//i, "");
  value = value.replace(/\/.*$/, "");
  value = value.replace(/:.*$/, "");
  return value;
}

export function isIPv4(ip: string) {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip.trim());
}
export function isIPv6(ip: string) {
  return /^([a-fA-F0-9:]+:+)+[a-fA-F0-9]+$/.test(ip.trim());
}
export function isHostname(str: string) {
  return (
    /^(([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,63})$/.test(str) ||
    /^([a-zA-Z0-9-]{1,63})$/.test(str)
  );
}
