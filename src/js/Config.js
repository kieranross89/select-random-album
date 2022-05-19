export default async function config() {
  // TODO handle this better?
  const result = await fetch("api/getconfig");
  if (result.ok) {
    const test = await result.json();
    return test;
  }
}
