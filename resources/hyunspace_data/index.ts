// hyunspace_data resource; embedded storage. Apps that wire this in see it as env.HYUNSPACE_DATA.
// Fill in: the migration SQL (if sql) and the route handler bodies.
type Env = {
  storage: {
    sql: {
      exec(stmt: string, ...params: unknown[]): Promise<{ results: unknown[] }>;
      prepare(stmt: string): {
        bind(...params: unknown[]): {
          all(): Promise<{ results: unknown[] }>;
          first(): Promise<unknown | null>;
          run(): Promise<{ results: unknown[] }>;
        };
      };
      migration(id: string, stmt: string): Promise<unknown>;
    };
  };
};


export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    await env.storage.sql.migration(
      '001-init',
      'CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, message TEXT NOT NULL, email TEXT, created_at INTEGER NOT NULL)',
    );
    const { pathname } = new URL(req.url);

    if (req.method === 'GET' && pathname === "/items") {
      const { results } = await env.storage.sql.exec(
        'SELECT * FROM messages ORDER BY id DESC',
      );
      return Response.json(results);
    }
    if (req.method === 'POST' && pathname === "/items") {
      const body = await req.json() as { message: string; email?: string };
      if (!body || !body.message) {
        return Response.json({ error: 'Message required' }, { status: 400 });
      }
      const { results } = await env.storage.sql.exec(
        'INSERT INTO messages (message, email, created_at) VALUES (?, ?, ?) RETURNING id',
        body.message,
        body.email || '',
        Date.now()
      );
      return Response.json({ id: results[0]?.id || 1, success: true });
    }

    return new Response('not found', { status: 404 });
  },
};
