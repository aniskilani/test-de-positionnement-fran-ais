import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { username, password } = await req.json();

    if (!username || !password) {
      return Response.json({ error: 'Username et password requis' }, { status: 400 });
    }

    // Récupérer le formateur
    const trainers = await base44.asServiceRole.entities.TrainerUser.filter({ 
      username: username,
      is_active: true
    });

    if (trainers.length === 0) {
      return Response.json({ error: 'Identifiants incorrects' }, { status: 401 });
    }

    const trainer = trainers[0];

    // Vérifier si le mot de passe est hashé (commence par $2)
    const isHashed = trainer.password.startsWith('$2');

    let passwordMatch;
    if (isHashed) {
      // Comparer avec bcrypt
      passwordMatch = await bcrypt.compare(password, trainer.password);
    } else {
      // Ancien système (mot de passe en clair) - pour rétrocompatibilité temporaire
      passwordMatch = password === trainer.password;
    }

    if (!passwordMatch) {
      return Response.json({ error: 'Identifiants incorrects' }, { status: 401 });
    }

    return Response.json({ 
      success: true,
      trainer: {
        id: trainer.id,
        full_name: trainer.full_name,
        username: trainer.username
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});