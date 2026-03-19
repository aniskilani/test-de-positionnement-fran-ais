import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { password } = await req.json();

    if (!password) {
      return Response.json({ error: 'Mot de passe requis' }, { status: 400 });
    }

    // Hash le mot de passe
    const hashedPassword = await bcrypt.hash(password);

    return Response.json({ 
      success: true,
      hashed_password: hashedPassword
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});