export async function loader() {
  // Disable all robots for now
  const robotsTxt = `
User-agent: *
Disallow: /
`.trim();

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
